'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Users, Edit, Trash2, Mail, Shield, CheckCircle, XCircle, Search, Eye } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter((u: any) => u.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => 
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-10 pt-4 pb-12 w-full max-w-[100vw] overflow-x-hidden">
      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] mb-2 drop-shadow-md">Customers</h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">Manage registered users and clients</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative w-full md:max-w-md mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-500" />
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#121212] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
        />
      </div>

      <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_8px_40px_rgb(0,0,0,0.4)] overflow-hidden w-full relative">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="overflow-x-auto custom-scrollbar relative z-10 w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/5 text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400">
                <th className="p-6 pl-8 font-sans">User Profile</th>
                <th className="p-6 font-sans">Role</th>
                <th className="p-6 font-sans">Status</th>
                <th className="p-6 font-sans">Joined Date</th>
                <th className="p-6 pr-8 text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-6 pl-8 flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-white/10"></div>
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-white/10 rounded-sm"></div>
                        <div className="w-24 h-3 bg-white/5 rounded-sm"></div>
                      </div>
                    </td>
                    <td className="p-6"><div className="w-16 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-16 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6"><div className="w-20 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-6 pr-8 flex justify-end space-x-4">
                      <div className="w-5 h-5 bg-white/5 rounded"></div>
                      <div className="w-5 h-5 bg-white/5 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-0">
                    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
                      <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/20 mb-6 shadow-inner">
                        <Users className="w-8 h-8 text-[#D4AF37] opacity-80" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-serif text-white mb-3">No registered users found.</h3>
                      <p className="text-xs text-neutral-500 max-w-sm leading-relaxed mb-8">
                        Wait for customers to create accounts or check if your authentication database is linked.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors duration-300 group">
                    <td className="p-6 pl-8 flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#C29B57] flex items-center justify-center text-black font-bold font-serif text-lg flex-shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-serif text-lg text-neutral-200 group-hover:text-white transition-colors truncate">{user.name || 'Anonymous User'}</span>
                        <span className="text-xs text-neutral-500 flex items-center mt-1 truncate"><Mail className="w-3 h-3 mr-1 flex-shrink-0" /> {user.email}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-md flex items-center w-max ${user.role === 'admin' ? 'text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20' : 'text-neutral-300 bg-white/5 border border-white/10'}`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1.5" /> : null}
                        {user.role || 'Customer'}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`text-xs font-bold flex items-center ${user.status === 'suspended' ? 'text-red-500' : 'text-emerald-500'}`}>
                        {user.status === 'suspended' ? <XCircle className="w-3 h-3 mr-1.5" /> : <CheckCircle className="w-3 h-3 mr-1.5" />}
                        {user.status === 'suspended' ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="p-6 font-sans text-sm tracking-wider text-neutral-400">
                      {user.createdAt ? new Date(user.createdAt.seconds * 1000 || user.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="p-6 pr-8">
                      <div className="flex items-center justify-end space-x-3 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button title="View Profile" className="text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button title="Edit Role" className="text-neutral-400 hover:text-[#D4AF37] transition-colors p-2 hover:bg-[#D4AF37]/10 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button title="Delete User" onClick={() => deleteUser(user.id)} className="text-neutral-400 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
