import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import API from '../services/api';
import toast from 'react-hot-toast';
import countries from '../data/countries';

const moods = [
  { value: 'excited', emoji: '🤩', label: 'Excited' },
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'amazed', emoji: '🤯', label: 'Amazed' },
  { value: 'peaceful', emoji: '😌', label: 'Peaceful' },
  { value: 'adventurous', emoji: '🧗', label: 'Adventurous' },
];

const ScrapbookPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', country: '', mood: 'happy', imagesFiles: [] });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await API.get('/scrapbook');
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      if (form.country) formData.append('country', form.country);
      formData.append('mood', form.mood);
      
      if (form.imagesFiles && form.imagesFiles.length > 0) {
        for (let i = 0; i < form.imagesFiles.length; i++) {
          formData.append('images', form.imagesFiles[i]);
        }
      }

      if (editingId) {
        const { data } = await API.put(`/scrapbook/${editingId}`, formData);
        setEntries(entries.map(e => e._id === editingId ? data : e));
        toast.success('📝 Entry updated!');
      } else {
        const { data } = await API.post('/scrapbook', formData);
        setEntries([data, ...entries]);
        toast.success('📔 New memory saved!');
      }
      resetForm();
    } catch (error) {
      toast.error('Failed to save entry');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/scrapbook/${id}`);
      setEntries(entries.filter(e => e._id !== id));
      toast.success('🗑️ Entry deleted');
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const handleEdit = (entry) => {
    setForm({ title: entry.title, content: entry.content, country: entry.country || '', mood: entry.mood || 'happy', imagesFiles: [] });
    setEditingId(entry._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ title: '', content: '', country: '', mood: 'happy', imagesFiles: [] });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFileChange = (e) => {
    setForm(p => ({ ...p, imagesFiles: Array.from(e.target.files) }));
  };

  return (
    <div className="min-h-screen bg-bgPrimary relative">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sunset-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-ocean-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-textSecondary hover:text-white/80 text-sm mb-3 transition-colors">
              <FaArrowLeft /> Dashboard
            </button>
            <h1 className="font-display text-3xl font-bold text-textPrimary flex items-center gap-3">
              📔 <span className="gradient-text-sunset">My Travel Journal</span>
            </h1>
            <p className="text-textSecondary mt-1">Record your adventures and memories</p>
          </div>
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="btn-sunset flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> New Entry</>}
          </motion.button>
        </div>

        {/* New Entry Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleSubmit}
              className="glass-card p-6 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h3 className="font-display text-lg font-semibold text-textPrimary mb-4">
                {editingId ? '✏️ Edit Entry' : '✨ New Memory'}
              </h3>
              <div className="space-y-4">
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-bgSecondary border border-borderColor text-textPrimary placeholder-white/30 focus:border-sunset-500 focus:outline-none transition-all"
                  placeholder="Title your memory..." required />

                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  className="w-full px-4 py-3 bg-bgSecondary border border-borderColor text-textPrimary placeholder-white/30 rounded-xl mb-4 min-h-[150px] resize-y focus:border-sunset-500 focus:outline-none transition-all"
                  placeholder="Write about your experience..." required />

                <div className="flex gap-4">
                  <select value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                    className="flex-1 px-4 py-3 rounded-xl bg-bgSecondary border border-borderColor text-textPrimary focus:border-sunset-500 focus:outline-none transition-all">
                    <option value="">Select country (optional)</option>
                    {countries.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
                  </select>

                  <input type="file" multiple accept="image/*" onChange={handleFileChange}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-bgSecondary border border-borderColor text-textSecondary file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-sunset-500 file:text-textPrimary hover:file:bg-sunset-600 transition-all cursor-pointer" />


                  <div className="flex gap-1">
                    {moods.map(m => (
                      <button key={m.value} type="button"
                        onClick={() => setForm(p => ({ ...p, mood: m.value }))}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                          form.mood === m.value ? 'bg-sunset-500/20 border border-sunset-500/30 scale-110' : 'bg-bgSecondary hover:bg-bgSecondary'
                        }`}
                        title={m.label}>
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button type="submit" className="btn-sunset flex items-center gap-2"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <FaSave /> {editingId ? 'Update' : 'Save Memory'}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Entries */}
        {loading ? (
          <div className="text-center py-12">
            <div className="loading-spinner mx-auto mb-4" />
            <p className="text-textSecondary">Loading your memories...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">📔</p>
            <h3 className="font-display text-xl text-textSecondary mb-2">Your journal is empty</h3>
            <p className="text-textSecondary mb-6">Start exploring countries and recording your memories!</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Write your first entry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <motion.div
                key={entry._id}
                className="scrapbook-page p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{moods.find(m => m.value === entry.mood)?.emoji || '😊'}</span>
                    <div>
                      <h3 className="font-display font-semibold text-gray-800 text-lg">{entry.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {entry.country && <span>{countries.find(c => c.name === entry.country)?.flag} {entry.country}</span>}
                        <span>•</span>
                        <span>{new Date(entry.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(entry)}
                      className="p-2 rounded-lg hover:bg-black/10 text-gray-500 transition-colors">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(entry._id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">{entry.content}</div>
                {entry.images && entry.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {entry.images.map((img, idx) => {
                      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
                      return <img key={idx} src={`${baseUrl}${img}`} alt="Memory" className="w-full h-32 object-cover rounded-lg shadow-sm" />;
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrapbookPage;
