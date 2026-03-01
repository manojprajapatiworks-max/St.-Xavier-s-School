import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';

export default function Results() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/results').then(res => res.json()).then(setResults);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight mb-4">Academic Excellence</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrating the outstanding achievements of our students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Award className="w-24 h-24 text-indigo-600" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-indigo-50 shadow-inner">
                  <img
                    src={result.image_url || 'https://picsum.photos/seed/student/400/400'}
                    alt={result.student_name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{result.student_name}</h3>
                <p className="text-lg text-indigo-600 font-semibold mb-4">Class {result.class}</p>
                
                <div className="bg-indigo-50 rounded-2xl p-4 w-full">
                  <div className="text-4xl font-extrabold text-indigo-700 mb-1">{result.percentage}%</div>
                  <div className="text-sm font-medium text-indigo-600 uppercase tracking-wider">Year {result.year}</div>
                </div>
              </div>
            </motion.div>
          ))}
          {results.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-gray-500">Results will be updated soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
