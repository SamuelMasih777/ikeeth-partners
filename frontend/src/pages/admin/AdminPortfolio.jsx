import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Upload, GripVertical } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

const sectors = [
  'Artificial Intelligence',
  'Fintech',
  'Climate Tech',
  'Healthcare',
  'Enterprise Software',
  'Biotech',
  'Infrastructure',
  'Other'
];

const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth'];

export default function AdminPortfolio() {
  const { getAuthHeader } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    description: '',
    stage: '',
    year: new Date().getFullYear(),
    website: '',
    logo_url: '',
    is_featured: false,
    order: 0
  });

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API}/portfolio`, getAuthHeader());
      setPortfolio(response.data);
    } catch (error) {
      toast.error('Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
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
      if (editingCompany) {
        await axios.put(`${API}/portfolio/${editingCompany.id}`, formData, getAuthHeader());
        toast.success('Company updated successfully');
      } else {
        await axios.post(`${API}/portfolio`, formData, getAuthHeader());
        toast.success('Company added successfully');
      }
      setShowModal(false);
      setEditingCompany(null);
      resetForm();
      fetchPortfolio();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save company');
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      sector: company.sector,
      description: company.description,
      stage: company.stage,
      year: company.year,
      website: company.website || '',
      logo_url: company.logo_url || '',
      is_featured: company.is_featured || false,
      order: company.order || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      await axios.delete(`${API}/portfolio/${id}`, getAuthHeader());
      toast.success('Company deleted successfully');
      fetchPortfolio();
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await axios.post(`${API}/upload`, formDataUpload, {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData(prev => ({ ...prev, logo_url: `${BACKEND_URL}${response.data.url}` }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sector: '',
      description: '',
      stage: '',
      year: new Date().getFullYear(),
      website: '',
      logo_url: '',
      is_featured: false,
      order: 0
    });
  };

  const openAddModal = () => {
    setEditingCompany(null);
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
    <div data-testid="admin-portfolio">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Manrope'] text-3xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-zinc-500">Manage your portfolio companies</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
          data-testid="add-company-btn"
        >
          <Plus size={20} />
          Add Company
        </button>
      </div>

      {/* Portfolio Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Company</th>
              <th className="text-left p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Sector</th>
              <th className="text-left p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Stage</th>
              <th className="text-left p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Year</th>
              <th className="text-left p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Featured</th>
              <th className="text-right p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((company) => (
              <tr key={company.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {company.logo_url ? (
                      <img src={company.logo_url} alt={company.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <span className="text-lg font-semibold text-zinc-500">{company.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{company.name}</p>
                      <p className="text-zinc-500 text-sm truncate max-w-xs">{company.description}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-zinc-400">{company.sector}</td>
                <td className="p-4 text-zinc-400">{company.stage}</td>
                <td className="p-4 text-zinc-400">{company.year}</td>
                <td className="p-4">
                  {company.is_featured && (
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">Featured</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(company)}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      data-testid={`edit-company-${company.id}`}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                      data-testid={`delete-company-${company.id}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {portfolio.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            No portfolio companies yet. Add your first company.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="font-['Manrope'] text-xl font-semibold text-white">
                {editingCompany ? 'Edit Company' : 'Add Company'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                    data-testid="company-name-input"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Sector *</label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                  >
                    <option value="">Select sector</option>
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Stage *</label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                  >
                    <option value="">Select stage</option>
                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Year *</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    min="2000"
                    max="2030"
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://"
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Logo</label>
                <div className="flex items-center gap-4">
                  {formData.logo_url && (
                    <img src={formData.logo_url} alt="Logo" className="w-16 h-16 rounded-lg object-cover" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors">
                    <Upload size={18} />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-zinc-500 text-sm">or</span>
                  <input
                    type="url"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleChange}
                    placeholder="Paste image URL"
                    className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_featured"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="is_featured" className="text-white">Featured on homepage</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
                  data-testid="save-company-btn"
                >
                  {editingCompany ? 'Update Company' : 'Add Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
