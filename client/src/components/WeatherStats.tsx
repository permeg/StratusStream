import React from 'react';
import { Wind, Droplets } from 'lucide-react';
import { motion } from "framer-motion" //'motion/react';

export function WeatherStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex gap-4 mb-6"
    >
      <div className="flex-1 p-5 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/50">
            <Wind className="w-5 h-5 text-gray-600" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Wind Speed</p>
            <p className="text-xl text-gray-800">12 mph</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-5 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/50">
            <Droplets className="w-5 h-5 text-gray-600" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Humidity</p>
            <p className="text-xl text-gray-800">65%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
