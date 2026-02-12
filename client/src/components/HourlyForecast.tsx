import React from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';
import { motion } from "framer-motion" //'motion/react';

const hourlyData = [
  { time: 'Now', temp: 72, icon: Sun },
  { time: '11 AM', temp: 74, icon: Sun },
  { time: '12 PM', temp: 76, icon: Sun },
  { time: '1 PM', temp: 78, icon: Cloud },
  { time: '2 PM', temp: 77, icon: Cloud },
  { time: '3 PM', temp: 75, icon: CloudRain },
  { time: '4 PM', temp: 73, icon: CloudRain },
  { time: '5 PM', temp: 71, icon: Cloud },
];

export function HourlyForecast() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-6"
    >
      <h3 className="text-lg text-gray-700 mb-4 px-1">Hourly Forecast</h3>
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {hourlyData.map((hour, index) => {
            const Icon = hour.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="flex-shrink-0 w-20 p-4 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] text-center"
              >
                <p className="text-sm text-gray-600 mb-3">{hour.time}</p>
                <Icon className="w-8 h-8 text-gray-700 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-lg text-gray-800">{hour.temp}°</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
