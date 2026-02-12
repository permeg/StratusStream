import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Wind } from 'lucide-react';
import { motion } from "framer-motion" //'motion/react';

const dailyData = [
  { day: 'Today', high: 78, low: 65, condition: 'Sunny', icon: Sun },
  { day: 'Tuesday', high: 76, low: 64, condition: 'Partly Cloudy', icon: Cloud },
  { day: 'Wednesday', high: 72, low: 62, condition: 'Rainy', icon: CloudRain },
  { day: 'Thursday', high: 70, low: 60, condition: 'Cloudy', icon: Cloud },
  { day: 'Friday', high: 74, low: 63, condition: 'Sunny', icon: Sun },
];

export function DailyForecast() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h3 className="text-lg text-gray-700 mb-4 px-1">5-Day Forecast</h3>
      <div className="space-y-3">
        {dailyData.map((day, index) => {
          const Icon = day.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="p-5 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-gray-800">{day.day}</p>
                    <p className="text-sm text-gray-500">{day.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-800">{day.high}°</span>
                  <span className="text-gray-400">{day.low}°</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
