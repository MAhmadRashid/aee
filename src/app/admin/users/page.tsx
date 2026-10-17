'use client';
import { useState, useEffect, useMemo } from 'react';
import { Users, Trash2, Mail, Shield, CheckCircle, XCircle, Search, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleCandidate, setRoleCandidate] = useState<any | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
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

  const confirmToggleRole = async () => {
    if (!roleCandidate) return;
    const newRole = roleCandidate.role === 'admin' ? 'customer' : 'admin';

    try {
      const res = await fetch(`/api/admin/users/${roleCandidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers((prev: any[]) => prev.map((u: any) => u.id === roleCandidate.id ? { ...u, role: newRole } : u));
        showToast(`Role of ${roleCandidate.name || roleCandidate.email} updated to ${newRole.toUpperCase()}.`);
      } else {
        showToast('Failed to update privilege.');
      }
    } catch (error) {
      console.error('Role update error:', error);
      showToast('Error updating role.');
    } finally {
      setRoleCandidate(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!deleteCandidate) return;
    try {
      const res = await fetch(`/api/admin/users/${deleteCandidate.id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev: any[]) => prev.filter((u: any) => u.id !== deleteCandidate.id));
        showToast(`User account ${deleteCandidate.name || deleteCandidate.email} de-registered.`);
      } else {
        showToast('Failed to delete account.');
      }
    } catch (error) {
      console.error('Failed to delete user', error);
      showToast('Error deleting account.');
    } finally {
      setDeleteCandidate(null);
    }
  };

  const formatJoinedDate = (createdAt: any) => {
    if (!createdAt) return 'Recent';
    if (typeof createdAt === 'string') {
      const d = new Date(createdAt);
      return isNaN(d.getTime()) ? 'Recent' : d.toLocaleDateString();
    }
    const seconds = createdAt._seconds ?? createdAt.seconds;
    if (seconds) {
      return new Date(seconds * 1000).toLocaleDateString();
    }
    const d = new Date(createdAt);
    return isNaN(d.getTime()) ? 'Recent' : d.toLocaleDateString();
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => 
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-8 pt-4 pb-12 w-full max-w-[100vw] overflow-x-hidden">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#141414] border border-[#D4AF37]/40 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-xs font-sans tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Role Toggle Modal */}
      {roleCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-[#D4AF37]">
              <div className="p-3 bg-[#D4AF37]/10 rounded-full">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-white">Modify User Privilege</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you want to change the security clearance for{' '}
              <span className="text-white font-semibold">{roleCandidate.name || roleCandidate.email}</span> to{' '}
              <span className="text-[#D4AF37] font-bold uppercase">{roleCandidate.role === 'admin' ? 'Customer' : 'Admin'}</span>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setRoleCandidate(null)}
                className="px-4 py-2.5 rounded-lg border border-white/10 text-xs text-neutral-300 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmToggleRole}
                className="px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-white text-xs font-bold text-black uppercase tracking-wider transition"
              >
                Confirm Role Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-white">De-register Patron Account?</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              This will permanently revoke login credentials for <span className="text-white font-semibold">{deleteCandidate.name || deleteCandidate.email}</span>.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2.5 rounded-lg border border-white/10 text-xs text-neutral-300 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteUser}
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white uppercase tracking-wider transition"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] mb-2 drop-shadow-md">
            Patrons & Administrative Access
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">
            Total {users.length} registered profiles & privilege assignments
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative w-full md:max-w-md mb-2">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-500" />
        </div>
        <input
          type="text"
          placeholder="Search by patron name or email address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#121212] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
        />
      </div>

      <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_8px_40px_rgb(0,0,0,0.4)] overflow-hidden w-full relative">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="overflow-x-auto custom-scrollbar relative z-10 w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/5 text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400">
                <th className="p-5 pl-6 font-sans">Patron Profile</th>
                <th className="p-5 font-sans">Access Level</th>
                <th className="p-5 font-sans">Security Status</th>
                <th className="p-5 font-sans">Registered Date</th>
                <th className="p-5 pr-6 text-right font-sans">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-5 pl-6 flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-white/10"></div>
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-white/10 rounded-sm"></div>
                        <div className="w-24 h-3 bg-white/5 rounded-sm"></div>
                      </div>
                    </td>
                    <td className="p-5"><div className="w-16 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-5"><div className="w-16 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-5"><div className="w-20 h-4 bg-white/5 rounded-sm"></div></td>
                    <td className="p-5 pr-6 flex justify-end space-x-3">
                      <div className="w-6 h-6 bg-white/5 rounded"></div>
                      <div className="w-6 h-6 bg-white/5 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-0">
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                      <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/20 mb-4 shadow-inner">
                        <Users className="w-7 h-7 text-[#D4AF37] opacity-80" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-serif text-white mb-2">No patrons match inquiry.</h3>
                      <p className="text-xs text-neutral-400 max-w-sm">
                        No registered patron records correspond to your search.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => {
                  const isAdmin = user.role === 'admin';
                  return (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors duration-200 group">
                      <td className="p-5 pl-6 flex items-center space-x-3.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#C29B57] flex items-center justify-center text-black font-bold font-serif text-sm flex-shrink-0">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-serif text-sm font-medium text-neutral-200 group-hover:text-white transition-colors truncate">
                            {user.name || 'Private Connoisseur'}
                          </span>
                          <span className="text-[11px] text-neutral-400 flex items-center mt-0.5 truncate">
                            <Mail className="w-3 h-3 mr-1 flex-shrink-0" /> {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <button
                          onClick={() => setRoleCandidate(user)}
                          className={`text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-sm flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 ${
                            isAdmin 
                              ? 'text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/30 font-bold' 
                              : 'text-neutral-300 bg-white/5 border border-white/10'
                          }`}
                          title="Click to toggle access clearance"
                        >
                          <Shield className="w-3 h-3" />
                          <span>{isAdmin ? 'Administrator' : 'Client Patron'}</span>
                        </button>
                      </td>
                      <td className="p-5">
                        <span className={`text-[11px] font-medium flex items-center gap-1.5 ${user.status === 'suspended' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {user.status === 'suspended' ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          <span>{user.status === 'suspended' ? 'Suspended' : 'Verified'}</span>
                        </span>
                      </td>
                      <td className="p-5 font-sans text-xs text-neutral-400">
                        {formatJoinedDate(user.createdAt)}
                      </td>
                      <td className="p-5 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => setRoleCandidate(user)}
                            className="text-neutral-400 hover:text-[#D4AF37] p-2 hover:bg-[#D4AF37]/10 rounded-md transition-colors cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                            title="Toggle Privilege"
                          >
                            Switch Role
                          </button>
                          <button 
                            onClick={() => setDeleteCandidate(user)} 
                            className="text-neutral-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                            title="De-register User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
