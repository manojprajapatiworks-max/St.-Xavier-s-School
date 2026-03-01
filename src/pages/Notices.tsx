import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Download } from 'lucide-react';

export default function Notices() {
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/notices').then(res => res.json()).then(setNotices);
  }, []);

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight mb-4">Notice Board</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest circulars, schedules, and official announcements.
          </p>
        </div>

        <div className="bg-slate-50 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {notices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-6 sm:p-8 hover:bg-white transition-colors duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-6 group"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {new Date(notice.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{notice.title}</h3>
                </div>

                {notice.link && (
                  <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                    <a
                      href={notice.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
            {notices.length === 0 && (
              <div className="p-12 text-center text-gray-500 text-lg">
                No notices available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
