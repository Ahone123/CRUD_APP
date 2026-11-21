
import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = { name, email, role };

      if (editingId) {
        await api.put(`/users/${editingId}`, userData);
      } else {
        await api.post("/users", userData);
      }

      setName("");
      setEmail("");
      setRole("USER");
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert("Could not delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          User Management
        </h1>
        <p className="mb-8 text-gray-500">
          Create, view, update and delete users.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-xl font-semibold">
            {editingId ? "Edit User" : "Add New User"}
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              className="rounded-lg border p-3"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              className="rounded-lg border p-3"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <select
              className="rounded-lg border p-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              type="submit"
            >
              {editingId ? "Update User" : "Add User"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setEmail("");
                  setRole("USER");
                }}
                className="rounded-lg bg-gray-200 px-5 py-3"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold">Users ({users.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="font-medium text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="font-medium text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                      No users found. Add your first user above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;