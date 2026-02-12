import React from 'react';
import { Search, MapPin } from 'lucide-react';

export function SearchBar() {
  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Search className="w-5 h-5 text-gray-400" strokeWidth={2} />
        </div>
        <input
          type="text"
          placeholder="Search for a city..."
          className="w-full pl-12 pr-12 py-4 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-700 placeholder-gray-400 transition-all"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2">
          <MapPin className="w-5 h-5 text-gray-500" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
