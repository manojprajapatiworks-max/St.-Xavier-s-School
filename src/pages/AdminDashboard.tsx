import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Bell, FileText, Building, Users, Award, Plus, Trash2, Edit, Home } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('settings');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      if (!res.ok) navigate('/admin');
    } catch {
      navigate('/admin');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = ['settings', 'announcements', 'notices', 'facilities', 'faculties', 'results'];
      const responses = await Promise.all(endpoints.map(ep => fetch(`/api/${ep}`)));
      const json = await Promise.all(responses.map(res => res.json()));
      
      const newData: any = {};
      endpoints.forEach((ep, i) => { newData[ep] = json[i]; });
      setData(newData);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    navigate('/admin');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage('');
    const formData = new FormData(e.target as HTMLFormElement);
    const settings = Object.fromEntries(formData.entries());
    
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('Failed to save settings.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleDelete = async (table: string, id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/${table}/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleAdd = async (table: string, e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const item = Object.fromEntries(formData.entries());
    
    if (table === 'announcements' && !item.is_important) {
      item.is_important = '0';
    }
    
    await fetch(`/api/${table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    (e.target as HTMLFormElement).reset();
    fetchData();
  };

  const tabs = [
    { id: 'settings', name: 'Site Settings', icon: Settings },
    { id: 'announcements', name: 'Announcements', icon: Bell },
    { id: 'notices', name: 'Notices', icon: FileText },
    { id: 'facilities', name: 'Facilities', icon: Building },
    { id: 'faculties', name: 'Faculties', icon: Users },
    { id: 'results', name: 'Results', icon: Award },
  ];

  if (loading && !Object.keys(data).length) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-indigo-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-indigo-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-indigo-300 text-sm mt-1">St. Xavier's School</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-x-auto md:overflow-x-visible flex md:flex-col gap-2 md:gap-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 md:w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === tab.id ? 'bg-indigo-800 text-white shadow-inner' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium whitespace-nowrap">{tab.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-indigo-800 hidden md:block space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-indigo-200 hover:bg-indigo-800/50 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Website</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">{activeTab.replace('_', ' ')}</h2>
            <button
              onClick={handleLogout}
              className="md:hidden flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              {saveMessage && (
                <div className={`p-4 rounded-xl text-sm font-medium ${saveMessage.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {saveMessage}
                </div>
              )}
              {Object.entries(data.settings || {}).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key.replace('_', ' ')}</label>
                  {key.includes('text') || key.includes('description') ? (
                    <textarea
                      name={key}
                      defaultValue={value as string}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      defaultValue={value as string}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    />
                  )}
                </div>
              ))}
              <button type="submit" className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md">
                Save Settings
              </button>
            </form>
          )}

          {activeTab !== 'settings' && (
            <div className="space-y-8">
              {/* Add Form */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-indigo-600" />
                  Add New {activeTab.slice(0, -1)}
                </h3>
                <form onSubmit={(e) => handleAdd(activeTab, e)} className="space-y-4">
                  {activeTab === 'announcements' && (
                    <>
                      <input name="title" placeholder="Title" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <textarea name="content" placeholder="Content" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <input name="date" type="date" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <label className="flex items-center space-x-2 text-gray-700 font-medium">
                        <input type="checkbox" name="is_important" value="1" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5" />
                        <span>Important</span>
                      </label>
                    </>
                  )}
                  {activeTab === 'notices' && (
                    <>
                      <input name="title" placeholder="Title" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <input name="date" type="date" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <input name="link" placeholder="Link (Optional)" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                    </>
                  )}
                  {activeTab === 'facilities' && (
                    <>
                      <input name="name" placeholder="Name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <textarea name="description" placeholder="Description" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <input name="image_url" placeholder="Image URL" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                    </>
                  )}
                  {activeTab === 'faculties' && (
                    <>
                      <input name="name" placeholder="Name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <input name="designation" placeholder="Designation" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <input name="department" placeholder="Department" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <input name="image_url" placeholder="Image URL" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                    </>
                  )}
                  {activeTab === 'results' && (
                    <>
                      <input name="student_name" placeholder="Student Name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <input name="class" placeholder="Class" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <input name="percentage" placeholder="Percentage" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <input name="year" placeholder="Year" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                      <input name="image_url" placeholder="Image URL" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                    </>
                  )}
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md">
                    Add Item
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {data[activeTab]?.map((item: any) => (
                    <div key={item.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{item.title || item.name || item.student_name}</h4>
                        <p className="text-gray-500 text-sm mt-1">
                          {item.date || item.designation || item.percentage + '%'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(activeTab, item.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {data[activeTab]?.length === 0 && (
                    <div className="p-12 text-center text-gray-500">No items found.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
