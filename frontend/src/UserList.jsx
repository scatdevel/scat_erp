import React, { useEffect, useState } from 'react';
import { getAllUsers } from './api';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => { 
    
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
