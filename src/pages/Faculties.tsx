import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function Faculties() {
  const [faculties, setFaculties] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/faculties').then(res => res.json()).then(setFaculties);
  }, []);

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight mb-4">Our Faculty</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated educators who inspire and guide our students towards excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {faculties.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white group-hover:border-indigo-100 transition-colors duration-300">
                <img
                  src={faculty.image_url || 'https://picsum.photos/seed/faculty/400/400'}
                  alt={faculty.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{faculty.name}</h3>
              <p className="text-indigo-600 font-medium mb-1">{faculty.designation}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">{faculty.department}</p>
            </motion.div>
          ))}
          {faculties.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-gray-500">Faculty information will be updated soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
