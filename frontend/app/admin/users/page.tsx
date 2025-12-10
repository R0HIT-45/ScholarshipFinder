'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/auth';
import { useToast } from '@/app/context/toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, UserCheck, Users } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin' || !token) {
      router.push('/dashboard');
      return;
    }
    fetchUsers();
  }, [user, token, router]);

  async function fetchUsers() {
    try {
      const res = await fetch('http://localhost:3001/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (error) {
      addToast('Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteUser(userId: number) {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
        addToast('User deleted', 'success');
      }
    } catch (error) {
      addToast('Failed to delete user', 'error');
    }
  }

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all users in the system</p>
        </div>
        <Link href="/admin" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Back to Admin
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow flex items-center gap-4">
          <Users className="text-blue-600" size={32} />
          <div>
            <p className="text-gray-600 dark:text-gray-400">Total Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow flex items-center gap-4">
          <UserCheck className="text-green-600" size={32} />
          <div>
            <p className="text-gray-600 dark:text-gray-400">Admin Users</p>
            <p className="text-3xl font-bold">{users.filter((u) => u.role === 'admin').length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Name</th>
                <th className="px-6 py-3 text-left font-bold">Email</th>
                <th className="px-6 py-3 text-left font-bold">Role</th>
                <th className="px-6 py-3 text-left font-bold">Joined</th>
                <th className="px-6 py-3 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-sm">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
