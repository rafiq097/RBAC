import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users/getusers");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to fetch users. Please try again.");
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.put(`/users/updateRole/${userId}`, { role: newRole });
      toast.success("User role updated successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/users/delete-user/${userId}`);
        toast.success("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user. Please try again.");
      }
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please provide both Name and Email.");
      return;
    }

    try {
      const res = await axios.post("/users/add-user", newUser);

      if (res.data.message === "User already exists") {
        toast.error("User already exists.");
        return;
      }

      toast.success("New user added successfully!");
      setNewUser({ name: "", email: "", role: "user" });
      fetchUsers();
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error("Failed to add new user. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Admin Panel - Manage Users
      </h2>

      {/* Add New User Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New User</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-md w-full"
            placeholder="Enter name"
            value={newUser.name}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            type="email"
            className="p-2 border border-gray-300 rounded-md w-full"
            placeholder="Enter email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <select
            className="p-2 border border-gray-300 rounded-md w-full"
            value={newUser.role}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, role: e.target.value }))
            }
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleAddUser}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Current Role</th>
              <th className="px-4 py-2 border">Update Role</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-sm sm:text-base">
                <td className="px-4 py-2 border break-words">{user.name}</td>
                <td className="px-4 py-2 border break-words">{user.email}</td>
                <td className="px-4 py-2 border break-words">{user.role}</td>
                <td className="px-4 py-2 border break-words">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleUpdateRole(user._id, e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
