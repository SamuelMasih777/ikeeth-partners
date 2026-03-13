import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

export default function AdminTeam() {
  const { getAuthHeader } = useAuth();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    linkedin: '',
    image_url: '',
    is_advisor: false,
    order: 0
  });

  const fetchTeam = async () => {
    try {
      const response = await axios.get(`${API}/team`, getAuthHeader());
      setTeam(response.data);
    } catch (error) {
      toast.error('Failed to fetch team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
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
      if (editingMember) {
        await axios.put(`${API}/team/${editingMember.id}`, formData, getAuthHeader());
        toast.success('Team member updated');
      } else {
        await axios.post(`${API}/team`, formData, getAuthHeader());
        toast.success('Team member added');
      }
      setShowModal(false);
      setEditingMember(null);
      resetForm();
      fetchTeam();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      title: member.title,
      bio: member.bio,
      linkedin: member.linkedin || '',
      image_url: member.image_url || '',
      is_advisor: member.is_advisor || false,
      order: member.order || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API}/team/${id}`, getAuthHeader());
      toast.success('Team member deleted');
      fetchTeam();
    } catch (error) {
      toast.error('Failed to delete');
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
        headers: { ...getAuthHeader().headers, 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, image_url: `${BACKEND_URL}${response.data.url}` }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', title: '', bio: '', linkedin: '', image_url: '', is_advisor: false, order: 0 });
  };

  const openAddModal = () => {
    setEditingMember(null);
    resetForm();
    setShowModal(true);
  };

  const teamMembers = team.filter(m => !m.is_advisor);
  const advisors = team.filter(m => m.is_advisor);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div data-testid="admin-team">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Manrope'] text-3xl font-bold text-white mb-2">Team</h1>
          <p className="text-zinc-500">Manage team members and advisors</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
          data-testid="add-member-btn"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Team Members */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Investment Team ({teamMembers.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 group">
              <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-zinc-800">
                {member.image_url ? (
                  <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-zinc-600">{member.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <h3 className="text-white font-semibold">{member.name}</h3>
              <p className="text-zinc-500 text-sm mb-2">{member.title}</p>
              <p className="text-zinc-600 text-xs line-clamp-2">{member.bio}</p>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 p-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 bg-zinc-800 text-red-400 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advisors */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Advisors ({advisors.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {advisors.map((advisor) => (
            <div key={advisor.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 group">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                {advisor.image_url ? (
                  <img src={advisor.image_url} alt={advisor.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-2xl font-bold text-zinc-600">{advisor.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="text-white font-semibold">{advisor.name}</h3>
              <p className="text-zinc-500 text-sm mb-2">{advisor.title}</p>
              <p className="text-zinc-600 text-xs line-clamp-2">{advisor.bio}</p>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(advisor)} className="flex-1 p-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 text-sm">Edit</button>
                <button onClick={() => handleDelete(advisor.id)} className="p-2 bg-zinc-800 text-red-400 rounded-lg hover:bg-zinc-700">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {advisors.length === 0 && (
            <div className="col-span-full text-center py-8 text-zinc-500">
              No advisors yet. Add one by checking "Is Advisor" when adding a member.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="font-['Manrope'] text-xl font-semibold text-white">
                {editingMember ? 'Edit Member' : 'Add Member'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Photo</label>
                <div className="flex items-center gap-4">
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="w-20 h-20 rounded-xl object-cover" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg cursor-pointer hover:bg-zinc-700">
                    <Upload size={18} />
                    Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

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

              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Bio *</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="is_advisor" id="is_advisor" checked={formData.is_advisor} onChange={handleChange} className="w-4 h-4" />
                  <label htmlFor="is_advisor" className="text-white">Is Advisor</label>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Order</label>
                  <input type="number" name="order" value={formData.order} onChange={handleChange} min="0" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-zinc-500" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200" data-testid="save-member-btn">
                  {editingMember ? 'Update' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
