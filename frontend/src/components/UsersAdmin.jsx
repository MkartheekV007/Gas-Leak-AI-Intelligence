import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Shield, UserPlus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-3">
            <Shield className="text-primary" size={32} />
            User Management
          </h1>
          <p className="text-textSecondary mt-2">Manage access controls and roles for the platform.</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus size={18} /> Add User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface/50 border-b border-border sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold text-textSecondary">User</th>
                  <th className="px-6 py-4 font-semibold text-textSecondary">Role</th>
                  <th className="px-6 py-4 font-semibold text-textSecondary">Status</th>
                  <th className="px-6 py-4 font-semibold text-textSecondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    key={u.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors even:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-textPrimary">{u.full_name}</div>
                      <div className="text-textSecondary text-xs">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        u.role === 'Admin' ? 'bg-primary/20 text-primary border-primary/30' :
                        u.role === 'Operator' ? 'bg-success/20 text-success border-success/30' :
                        'bg-black/10 dark:bg-white/10 text-textSecondary border-black/20 dark:border-white/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${u.is_active ? 'text-success' : 'text-danger'}`}>
                        <div className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-success' : 'bg-danger'}`} />
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Edit size={16} /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10" onClick={() => handleDelete(u.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
