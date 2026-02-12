import React from 'react';
import { motion } from "framer-motion" //'motion/react';
import { Cloud } from 'lucide-react';

interface AIGreetingCardProps {
  weatherCondition: 'sunny' | 'rainy' | 'cloudy';
}

export function AIGreetingCard({ weatherCondition }: AIGreetingCardProps) {
  const greetings = {
    sunny: "Good morning! It's a beautiful sunny day ahead.",
    rainy: "Good morning! It's a bit rainy, grab an umbrella.",
    cloudy: "Good morning! It's a bit chilly, grab a scarf."
  };

  const weatherColors = {
    sunny: 'from-[#FFF4E6] to-[#FFE8D6]',
    rainy: 'from-[#E3F2FD] to-[#D1E7F7]',
    cloudy: 'from-[#F3F4F6] to-[#E5E7EB]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative mb-6 p-8 rounded-[32px] bg-gradient-to-br ${weatherColors[weatherCondition]} backdrop-blur-lg border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]`}
    >
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-gray-500 mb-2">AI Weather Assistant</p>
            <h2 className="text-2xl text-gray-800 leading-relaxed mb-4">
              {greetings[weatherCondition]}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-5xl font-light text-gray-800">72°</span>
              <div className="text-sm text-gray-600">
                <p>San Francisco</p>
                <p>Feels like 68°</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* 3D Weather Icon */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="relative">
            {/* Cloud layers for 3D effect */}
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-white/60 rounded-full blur-sm"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/80 rounded-full blur-[2px]"></div>
            <Cloud 
              className="w-20 h-20 text-white drop-shadow-lg relative z-10" 
              strokeWidth={1.5}
              fill="currentColor"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
