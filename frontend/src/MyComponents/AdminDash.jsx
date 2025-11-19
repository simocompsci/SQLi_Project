import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Edit, Trash2, Eye } from "lucide-react";

export default function AdminDash() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const API = "http://localhost:8000/api";

  // Load all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/admin/users`);
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search by name (wired to Search button & Enter key)
  const searchUser = async (e) => {
    // if event passed (button click or form submit) prevent default
    if (e && e.preventDefault) e.preventDefault();

    // empty search => fetch all users
    if (!search || search.trim() === "") {
      fetchUsers();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // encode the query param so special chars (like SQLi chars) are preserved properly
      const res = await axios.get(`${API}/admin/search`, {
        params: { name: search },
      });
      setUsers(res.data);
    } catch (err) {
      setError("Search failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm(`Delete user ${id}?`)) return;
    setLoading(true);
    try {
      await axios.post(`${API}/admin/delete/${id}`);
      // refresh
      fetchUsers();
    } catch (err) {
      setError("Delete failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const startEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
  };

  // Save edits
  const saveEdit = async () => {
    if (!editingUser) return;
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API}/admin/update/${editingUser.id}`, {
        name: editName,
        email: editEmail,
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError("Update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white bg-opacity-50 border border-gray-200 rounded-xl p-6 m-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold font-sans text-gray-900">Users Table</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUser(e)}
              className="bg-gray-200 bg-opacity-15 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => {
              setSearch("");
              fetchUsers();
            }}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow"
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 border-spacing-x-0 font-sans">
            <thead>
              <tr className="bg-gray-900">
                <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider rounded-s-lg'>ID</th>
                <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Name</th>
                <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Email</th>
                <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider rounded-e-lg'>Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans antialiased">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-900">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={index % 2 === 0 ? 'bg-gradient-to-r from-blue-50 to-emerald-50' : 'bg-white'}
                  >
                    <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-800 rounded-l-xl">
                      {user.id}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-700">
                      {user.name}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-700">
                      {user.email || 'N/A'}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 rounded-r-xl">
                      <button
                        className="p-2 rounded-full transition-colors bg-gray-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                        onClick={() => setViewingUser(user)}
                        title="View Info"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className='text-blue-500 hover:text-blue-700 p-2 rounded-full transition-colors duration-150'
                        onClick={() => startEdit(user)}
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className='text-red-400 hover:text-red-600 p-2 rounded-full transition-colors duration-150'
                        onClick={() => deleteUser(user.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View User Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">ID</p>
                <p className="text-md font-semibold">{viewingUser.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-md font-semibold">{viewingUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-md font-semibold">{viewingUser.email}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit User #{editingUser.id}</h2>

            <label className="block text-sm mb-2 font-semibold text-gray-700">Name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border border-gray-300 w-full p-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm mb-2 font-semibold text-gray-700">Email</label>
            <input
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="border border-gray-300 w-full p-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
