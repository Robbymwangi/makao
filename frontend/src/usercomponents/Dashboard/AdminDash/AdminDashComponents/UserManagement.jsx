// src/usercomponents/Dashboard/AdminDash/AdminDashComponents/UserManagement.jsx
import React, { useEffect, useState } from "react";
import { Center, Spinner } from "@chakra-ui/react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/list-non-admins");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch users");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="table-container">
      <h2 className="table-heading">User Management</h2>

      {loading ? (
  <Center>
    <Spinner size="xl" />
  </Center>
) : (
  <table className="user-table">
    <thead>
      <tr>
        <th>Display Name</th>
        <th>Email</th>
        <th>Last Sign In</th>
      </tr>
    </thead>
    <tbody>
      {users.length === 0 ? (
        <tr>
          <td colSpan="3" style={{ textAlign: 'center', padding: '1rem' }}>
            No non-admin users found.
          </td>
        </tr>
      ) : (
        users.map((user) => (
          <tr key={user.id}>
            <td>{user.full_name}</td>
            <td>{user.email}</td>
            <td>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
)}
    </div>
  );
};

export default UserManagement;
