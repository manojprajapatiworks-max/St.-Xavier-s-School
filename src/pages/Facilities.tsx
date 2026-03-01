import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function Facilities() {
  const [facilities, setFacilities] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/facilities').then(res => res.json()).then(setFacilities);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight mb-4">Our Facilities</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Providing a conducive environment for holistic development with state-of-the-art infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="aspect-w-16 aspect-h-9 w-full relative overflow-hidden">
                <img
                  src={facility.image_url || 'https://picsum.photos/seed/facility/800/600'}
                  alt={facility.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{facility.name}</h3>
                <p className="text-gray-600 leading-relaxed">{facility.description}</p>
              </div>
            </motion.div>
          ))}
          {facilities.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-gray-500">Facilities information will be updated soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
