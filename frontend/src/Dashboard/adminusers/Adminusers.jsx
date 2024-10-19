import React, { useState, useEffect } from 'react';
import './adminusers.css';
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiTickOutline } from "react-icons/ti";
import { BiX } from "react-icons/bi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUser, setEditUser] = useState({ name: '', email: '', role: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': `${sessionStorage.getItem('auth-token')}` // Fixed typo
          }
        });
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          console.error('Error fetching users:', data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);
//edit function
  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditUser({ name: user.name, email: user.email, role: user.role });
  };
//delete function
  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };
//delete api
  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/deleteuser/${confirmDeleteId}`, { // Fixed DELETE URL
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${sessionStorage.getItem('auth-token')}` // Fixed typo
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(user => user._id !== confirmDeleteId));
      } else {
        console.error('Error deleting user:', data.message);
      }
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };
//user info change api
  const handleSaveClick = async () => {
    try {
      const res = await fetch(`http://localhost:5000/updateuserdetails/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${sessionStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify(editUser),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(user => user._id === editingUserId ? data.user : user));
        setEditingUserId(null);
      } else {
        console.error('Error updating user:', data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancelClick = () => {
    setEditingUserId(null);
  };

  return (
    <div className="admin-users-container">
      <h2 className="admin-users-title">User Management</h2>
      <table className="admin-users-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="table-row">
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEditClick(user)} className="o-db">
                <LuPencilLine/>
                </button>
                <button onClick={() => handleDeleteClick(user._id)} className="o-db">
                <RiDeleteBin6Line/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Dialog */}
      {confirmDeleteId && (
        <div className="confirm-delete">
          <p>Are you sure you want to delete?</p>
          <button onClick={confirmDelete} className="confirm-button">Yes</button>
          <button onClick={cancelDelete} className="cancel-button">No</button>
        </div>
      )}

      {/* Edit Modal */}
      {editingUserId && (
        <div className="edit-modal">
          <h3>Edit User</h3>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={editUser.name} 
            onChange={handleInputChange} 
          />
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={editUser.email} 
            onChange={handleInputChange} 
          />
          <label>Role:</label>
          <select name="role" value={editUser.role} onChange={handleInputChange}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          <button onClick={handleSaveClick} className="save-button">
            <TiTickOutline /> Save
          </button>
          <button onClick={handleCancelClick} className="cancel-button">
            <BiX /> Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
