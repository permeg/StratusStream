# SkySummary: AI-Powered Weather Insights

**SkySummary** is a smart weather service built with Python Flask. It doesn't just give you raw numbers; it interprets them. By combining real-time data from **OpenWeatherMap** with **Google Gemini AI**, the app generates human-like summaries and personalized daily tips based on the current conditions.

## Features
* **Real-time Data:** Fetches precise temperature, humidity, and wind speed.
* **AI Analysis:** Uses Google Gemini to explain the weather in plain English.
* **Smart Tips:** Tells you whether to grab a jacket, wear sunscreen, or stay indoors.
* **RESTful API:** Clean Flask backend ready for integration with any frontend.

## Tech Stack
* **Language:** Python 3.x
* **Framework:** Flask
* **APIs:** * [OpenWeatherMap API](https://openweathermap.org/api) (Weather Data)
    * [Google Gemini API](https://ai.google.dev/) (Natural Language Processing)
* **Environment Management:** `python-dotenv`

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/SkySummary.git](https://github.com/YOUR_USERNAME/SkySummary.git)
   cd SkySummary