import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDash() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Search form */}
      <form onSubmit={searchUser} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          type="submit"
          onClick={searchUser}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            fetchUsers();
          }}
          className="bg-gray-500 text-white px-3 py-2 rounded"
          disabled={loading}
        >
          Reset
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* User Table */}
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="border p-2">{u.id}</td>
                  <td className="border p-2">{u.name}</td>
                  <td className="border p-2">{u.email}</td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => startEdit(u)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteUser(u.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Edit User #{editingUser.id}</h2>

            <label className="block text-sm mb-1">Name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border w-full p-2 mb-3 rounded"
            />

            <label className="block text-sm mb-1">Email</label>
            <input
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="border w-full p-2 mb-3 rounded"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingUser(null)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="px-3 py-1 bg-green-600 text-white rounded"
                disabled={loading}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
