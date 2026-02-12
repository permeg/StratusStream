from flask import Flask, request, jsonify
from flask_cors import CORS
import httpx # For making HTTP requests
import google.generativeai as genai # For Gemini AI
import os # For accessing environment variables
import datetime # For date processing in forecast
from dotenv import load_dotenv # For loading .env file

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"]) # Enable CORS for React frontend
    # Ensures React frontend running on localhost:3000 can communicate with this Flask backend without 
    # CORS issues.

# Retrieve API Keys from environment variables
OWM_API_KEY = os.environ.get("OPENWEATHERMAP_API_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Basic check for Gemini API Key (optional, but good for early feedback)
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found. AI summaries will be disabled.")
if not OWM_API_KEY:
    print("CRITICAL: OPENWEATHERMAP_API_KEY not found. Weather data cannot be fetched.")


def get_owm_weather(city):
    current_url = "http://api.openweathermap.org/data/2.5/weather"
    # Parameters for the API request
    params = {'q': city, 'appid': OWM_API_KEY, 'units': 'metric'}
    try:
        # Using httpx.Client as a context manager for efficient connection handling
        with httpx.Client() as client:
            response = client.get(current_url, params=params)
            response.raise_for_status() # Raises an HTTPStatusError for 4XX/5XX client/server errors
        return response.json() # Return the JSON response
    except httpx.HTTPStatusError as e:
        app.logger.error(f"HTTPStatusError fetching current weather for {city}: {e}")
        raise # Re-raise the exception to be handled by the main endpoint
    except httpx.RequestError as e:
        # For network errors, DNS failures, etc.
        app.logger.error(f"RequestError fetching current weather for {city}: {e}")
        raise Exception(f"Network error connecting to OpenWeatherMap: {e}")


def get_owm_forecast(lat, lon):
    forecast_url = "http://api.openweathermap.org/data/2.5/forecast" # 5 day / 3 hour forecast
    params = {'lat': lat, 'lon': lon, 'appid': OWM_API_KEY, 'units': 'metric'}
    try:
        with httpx.Client() as client:
            response = client.get(forecast_url, params=params)
            response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        app.logger.error(f"HTTPStatusError fetching forecast for {lat},{lon}: {e}")
        raise
    except httpx.RequestError as e:
        app.logger.error(f"RequestError fetching forecast for {lat},{lon}: {e}")
        raise Exception(f"Network error connecting to OpenWeatherMap for forecast: {e}")
    
def get_gemini_summary(weather_data_str):
    if not GEMINI_API_KEY:
        app.logger.warning("GEMINI_API_KEY not set. Skipping summary.")
        return "AI summary feature disabled: Gemini API key not set."
    
    try:
        genai.configure(api_key=GEMINI_API_KEY)

        model = genai.GenerativeModel(model_name='gemini-2.5-flash')
            # chose Flash because it is optimized for speed and lower latency, 
            # which is ideal for a responsive weather summary feature.
        
        # Craft a good prompt!
        prompt = (
            f"You are a friendly weather assistant. Based on this weather data string: "
            f"'{weather_data_str}', provide a short, engaging weather summary "
            f"(1-2 sentences) for the general public. Include one small, actionable "
            f"tip for the day (e.g., 'Don't forget your umbrella!' or 'Perfect day for a walk!')."
        )
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        app.logger.error(f"Error with Gemini API: {e}")
        # Check for specific Gemini API errors if the SDK provides them
        # For example, if e has a 'message' attribute:
        # return f"AI summary currently unavailable. Error: {getattr(e, 'message', str(e))}"
        return "AI summary currently unavailable due to an error."


@app.route('/api/weather', methods=['GET'])
def weather_endpoint():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City parameter is required'}), 400
    
    # Ensure OWM API key is available before proceeding
    if not OWM_API_KEY:
        app.logger.error("OPENWEATHERMAP_API_KEY not configured on server.")
        return jsonify({'error': 'Critical: OpenWeatherMap API key not configured on server'}), 500

    try:
        # 1. Get Current Weather
        current_weather = get_owm_weather(city)
        lat = current_weather['coord']['lat']
        lon = current_weather['coord']['lon']

        # 2. Get Forecast Data
        forecast_data = get_owm_forecast(lat, lon)

        # 3. Process Hourly Forecast (next ~24 hours)
        processed_hourly = []
        if forecast_data and 'list' in forecast_data:
            for item in forecast_data['list'][:8]: # Approx 24 hours (8 entries * 3 hours)
                processed_hourly.append({
                    'time': datetime.datetime.fromtimestamp(item['dt']).strftime('%H:%M'),
                    'temp': round(item['main']['temp']),
                    'icon': item['weather'][0]['icon'],
                    'description': item['weather'][0]['description']
                })

        # 4. Process Daily Forecast (next 5 days)
        processed_daily = []
        daily_entries = {} # Helper dictionary to aggregate data per day
        if forecast_data and 'list' in forecast_data:
            for item in forecast_data['list']:
                # Group by day
                day_key = datetime.datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
                if day_key not in daily_entries:
                    daily_entries[day_key] = {
                        'temps': [],
                        'icons_count': {}, # To find the most representative icon
                        'dt': item['dt'] # Store timestamp for day name
                    }
                daily_entries[day_key]['temps'].append(item['main']['temp'])
                # Normalize icon (use day version 'd' instead of night 'n' for daily summary)
                icon = item['weather'][0]['icon'][:2] + 'd' 
                daily_entries[day_key]['icons_count'][icon] = daily_entries[day_key]['icons_count'].get(icon, 0) + 1
            
            # Create the daily summary list
            for day_data in list(daily_entries.values())[:5]: # Limit to 5 days
                if not day_data['temps']: continue
                most_common_icon = '01d' # Default icon
                if day_data['icons_count']:
                    most_common_icon = max(day_data['icons_count'], key=day_data['icons_count'].get)
                
                processed_daily.append({
                    'day_name':  datetime.datetime.fromtimestamp(day_data['dt']).strftime('%A'),
                    'temp_max': round(max(day_data['temps'])),
                    'temp_min': round(min(day_data['temps'])),
                    'icon': most_common_icon,
                })

        # 5. Get AI Summary
        # Create a concise string for Gemini based on current weather
        gemini_input_str = (
            f"Current conditions in {current_weather.get('name', 'the specified city')}: "
            f"{current_weather.get('weather', [{}])[0].get('description', 'N/A')}, "
            f"Temperature: {current_weather.get('main', {}).get('temp', 'N/A')}°C."
        )
        gemini_summary = get_gemini_summary(gemini_input_str)

        # 6. Construct the final JSON response
        response_data = {
            'current': {
                'temp': round(current_weather.get('main', {}).get('temp', 0)),
                'condition_text': current_weather.get('weather', [{}])[0].get('description', 'N/A').capitalize(),
                'icon': current_weather.get('weather', [{}])[0].get('icon', '01d'),
                'wind_speed': current_weather.get('wind', {}).get('speed', 0),
                'humidity': current_weather.get('main', {}).get('humidity', 0),
                'location_name': current_weather.get('name', 'Unknown City'),
                'country': current_weather.get('sys', {}).get('country', 'N/A'),
                'dt': current_weather.get('dt', 0) # Timestamp
            },
            'hourly': processed_hourly,
            'daily': processed_daily,
            'gemini_summary': gemini_summary
        }
        return jsonify(response_data)

    except httpx.HTTPStatusError as e:
        # Handle specific HTTP errors from OpenWeatherMap
        if e.response.status_code == 404:
            return jsonify({'error': f'City "{city}" not found by OpenWeatherMap.'}), 404
        elif e.response.status_code == 401:
            # This indicates an issue with the OWM API key
            app.logger.error(f"OpenWeatherMap API Key Error: {e.response.text}")
            return jsonify({'error': 'Invalid or unauthorized OpenWeatherMap API key.'}), 401
        else:
            app.logger.error(f"OpenWeatherMap API HTTPStatusError: {e.response.status_code} - {e.response.text}")
            return jsonify({'error': f'OpenWeatherMap API error: Status {e.response.status_code}'}), e.response.status_code
    except Exception as e:
        # Catch-all for other unexpected errors
        app.logger.error(f"General error in /api/weather for city {city}: {e}", exc_info=True)
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500
    
if __name__ == '__main__':
    # The default port is 5000
    # debug=True enables auto-reloading on code changes and provides a debugger
    # For production, use a proper WSGI server like Gunicorn or uWSGI and set debug=False
    app.run(debug=True, port=5000)