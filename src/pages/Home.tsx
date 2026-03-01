import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Calendar, Trophy, Users } from 'lucide-react';

export default function Home() {
  const [settings, setSettings] = useState<any>({});
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings);
    fetch('/api/announcements').then(res => res.json()).then(setAnnouncements);
    fetch('/api/notices').then(res => res.json()).then(setNotices);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={settings.hero_image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}
            alt="School Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
          >
            {settings.hero_title || "Welcome to St. Xavier's School"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl text-gray-200 font-medium mb-10 max-w-3xl mx-auto"
          >
            {settings.hero_subtitle || "Empowering Minds, Shaping Futures in Newadhiya Jaunpur"}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/notices"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-indigo-700 bg-white hover:bg-gray-50 transition-colors shadow-lg"
            >
              Latest Notices
            </Link>
            <Link
              to="/facilities"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-full text-white hover:bg-white/10 transition-colors"
            >
              Explore Facilities
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats / Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Expert Faculty', desc: 'Highly qualified and experienced teachers.' },
              { icon: Trophy, title: 'Excellence', desc: 'Consistently top-ranking academic results.' },
              { icon: Calendar, title: 'Events', desc: 'Rich calendar of co-curricular activities.' },
              { icon: Bell, title: 'Updates', desc: 'Stay informed with real-time notices.' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements & Notices Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Announcements */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Announcements</h2>
                <Link to="/notices" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-6">
                {announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        {new Date(announcement.date).toLocaleDateString()}
                      </span>
                      {Number(announcement.is_important) === 1 && (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-wide">
                          Important
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{announcement.content}</p>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <p className="text-gray-500">No recent announcements.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notice Board */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Notice Board</h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {notices.slice(0, 5).map((notice) => (
                    <div key={notice.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-xl flex flex-col items-center justify-center text-indigo-600">
                        <span className="text-lg font-bold leading-none">{new Date(notice.date).getDate()}</span>
                        <span className="text-xs font-medium uppercase">{new Date(notice.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{notice.title}</h4>
                        {notice.link && (
                          <a href={notice.link} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline font-medium">
                            Download / View Details
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  {notices.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="text-gray-500">No current notices.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
