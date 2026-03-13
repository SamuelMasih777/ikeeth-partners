import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

const categories = ['Market Analysis', 'Technology Trends', 'Founder Interviews', 'Portfolio Updates', 'Industry News'];

export default function AdminInsights() {
  const { getAuthHeader } = useAuth();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInsight, setEditingInsight] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image_url: '',
    read_time: '5 min',
    is_published: true,
    is_featured: false
  });

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${API}/insights`, getAuthHeader());
      setInsights(response.data);
    } catch (error) {
      toast.error('Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInsight) {
        await axios.put(`${API}/insights/${editingInsight.id}`, formData, getAuthHeader());
        toast.success('Insight updated');
      } else {
        await axios.post(`${API}/insights`, formData, getAuthHeader());
        toast.success('Insight created');
      }
      setShowModal(false);
      setEditingInsight(null);
      resetForm();
      fetchInsights();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save');
    }
  };

  const handleEdit = (insight) => {
    setEditingInsight(insight);
    setFormData({
      title: insight.title,
      excerpt: insight.excerpt,
      content: insight.content,
      category: insight.category,
      image_url: insight.image_url || '',
      read_time: insight.read_time || '5 min',
      is_published: insight.is_published,
      is_featured: insight.is_featured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API}/insights/${id}`, getAuthHeader());
      toast.success('Insight deleted');
      fetchInsights();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const togglePublish = async (insight) => {
    try {
      await axios.put(`${API}/insights/${insight.id}`, { is_published: !insight.is_published }, getAuthHeader());
      toast.success(insight.is_published ? 'Unpublished' : 'Published');
      fetchInsights();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', excerpt: '', content: '', category: '', image_url: '', read_time: '5 min', is_published: true, is_featured: false });
  };

  const openAddModal = () => {
    setEditingInsight(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div data-testid="admin-insights">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Manrope'] text-3xl font-bold text-white mb-2">Insights</h1>
          <p className="text-zinc-500">Manage blog posts and articles</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
          data-testid="add-insight-btn"
        >
          <Plus size={20} />
          New Article
        </button>
      </div>

      {/* Insights Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Title</th>
              <th className="text-left p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Category</th>
              <th className="text-left p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Status</th>
              <th className="text-left p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Date</th>
              <th className="text-right p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {insights.map((insight) => (
              <tr key={insight.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                <td className="p-4">
                  <div>
                    <p className="text-white font-medium">{insight.title}</p>
                    <p className="text-zinc-500 text-sm truncate max-w-md">{insight.excerpt}</p>
                  </div>
                </td>
                <td className="p-4 text-zinc-400">{insight.category}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.is_published ? 'bg-green-500/10 text-green-400' : 'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {insight.is_published ? 'Published' : 'Draft'}
                    </span>
                    {insight.is_featured && (
                      <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-full">Featured</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-zinc-500 text-sm">
                  {insight.created_at ? new Date(insight.created_at).toLocaleDateString() : '-'}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => togglePublish(insight)}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      title={insight.is_published ? 'Unpublish' : 'Publish'}
                    >
                      {insight.is_published ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button onClick={() => handleEdit(insight)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(insight.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {insights.length === 0 && (
          <div className="text-center py-12 text-zinc-500">No articles yet. Create your first one.</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="font-['Manrope'] text-xl font-semibold text-white">
                {editingInsight ? 'Edit Article' : 'New Article'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Read Time</label>
                  <input
                    type="text"
                    name="read_time"
                    value={formData.read_time}
                    onChange={handleChange}
                    placeholder="5 min"
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Excerpt *</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 resize-none"
                  placeholder="Short description for previews..."
                />
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 resize-none font-mono text-sm"
                  placeholder="Full article content..."
                />
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="is_published" id="is_published" checked={formData.is_published} onChange={handleChange} className="w-4 h-4" />
                  <label htmlFor="is_published" className="text-white">Publish immediately</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="is_featured" id="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-4 h-4" />
                  <label htmlFor="is_featured" className="text-white">Featured</label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200" data-testid="save-insight-btn">
                  {editingInsight ? 'Update Article' : 'Create Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
