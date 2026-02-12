import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { AIGreetingCard } from './components/AIGreetingCard';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherStats } from './components/WeatherStats';

export default function App() {
  const [weatherCondition] = useState<'sunny' | 'rainy' | 'cloudy'>('sunny');
  
  // Background gradient based on weather
  const weatherBackgrounds = {
    sunny: 'from-[#FFE5D9] via-[#FFDAB9] to-[#FFE4E1]',
    rainy: 'from-[#D4E7F7] via-[#C8E0F5] to-[#E0F0FF]',
    cloudy: 'from-[#E8E8F0] via-[#D9D9E8] to-[#F0F0F5]'
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${weatherBackgrounds[weatherCondition]} relative overflow-hidden`}>
      {/* Decorative blurred circles for glassmorphism effect */}
      <div className="absolute top-20 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-md mx-auto px-6 py-8 relative z-10">
        <SearchBar />
        <AIGreetingCard weatherCondition={weatherCondition} />
        <WeatherStats />
        <HourlyForecast />
        <DailyForecast />
      </div>
    </div>
  );
}
