"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Package, Heart, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('profile');
  
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (session?.user) {
      setEditName(session.user.name || '');
      setEditEmail(session.user.email || '');
    }
  }, [session]);

  if (status === "loading") {
    return <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center text-[var(--color-text)]">Loading...</div>;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMsg({ text: '', type: '' });
    
    try {
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: (session?.user as any)?.id,
          name: editName,
          email: editEmail
        })
      });
      const data = await res.json();
      
      if (data.success) {
        await update({ name: editName, email: editEmail });
        setUpdateMsg({ text: 'Profile updated successfully!', type: 'success' });
        setTimeout(() => setUpdateMsg({ text: '', type: '' }), 3000);
      } else {
        setUpdateMsg({ text: data.message || 'Update failed', type: 'error' });
      }
    } catch (err) {
      setUpdateMsg({ text: 'Something went wrong', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  // ... (keeping handleAuth the same)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (res?.error) {
        setError("Invalid credentials");
      }
    } else {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
      } else {
        await signIn('credentials', { redirect: false, email, password });
      }
    }
  };

  if (!session) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans flex items-center justify-center relative">
        <Link href="/" className="absolute top-8 left-8 flex items-center text-xs font-bold uppercase tracking-widest hover:opacity-70 transition z-10">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Store
        </Link>
        <div className="w-full max-w-md p-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded shadow-2xl relative z-10">
          <h2 className="text-3xl font-serif text-center mb-8">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm text-center">{error}</div>}
          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] mb-2">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-text)] transition" />
              </div>
            )}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-text)] transition" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-text)] transition" />
            </div>
            <button type="submit" className="w-full bg-[var(--color-primary)] text-[var(--color-background)] font-bold uppercase tracking-widest text-xs py-4 rounded hover:opacity-90 transition mt-4">
              {isLogin ? "Sign In" : "Register"}
            </button>
            <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-[var(--color-border)]"></div>
                <span className="flex-shrink-0 mx-4 text-[var(--color-text-muted)] text-[10px] uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-[var(--color-border)]"></div>
            </div>
            <button type="button" onClick={() => signIn('google')} className="w-full bg-transparent border border-[var(--color-border)] text-[var(--color-text)] font-bold uppercase tracking-widest text-xs py-4 rounded hover:bg-[var(--color-background)] transition flex items-center justify-center">
              <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-[var(--color-text)] font-bold underline underline-offset-4">
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      <div className="max-w-6xl mx-auto py-20 px-6 lg:px-12">
        <h2 className="text-3xl lg:text-4xl font-serif text-[var(--color-text)] mb-10 text-center md:text-left">Welcome, {session.user?.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`w-full flex items-center space-x-3 p-4 rounded font-bold transition ${activeTab === 'profile' ? 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]'}`}
            >
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-[var(--color-accent)]' : ''}`} />
              <span>Profile</span>
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`w-full flex items-center space-x-3 p-4 rounded font-bold transition ${activeTab === 'orders' ? 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]'}`}
            >
              <Package className={`w-5 h-5 ${activeTab === 'orders' ? 'text-[var(--color-accent)]' : ''}`} />
              <span>Orders</span>
            </button>
            <button onClick={() => signOut()} className="w-full flex items-center space-x-3 text-red-500 p-4 rounded hover:bg-red-50/10 hover:text-red-400 transition font-bold mt-8 border border-transparent hover:border-red-500/20">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded p-8 shadow-sm min-h-[400px]">
            {activeTab === 'profile' && (
              <div className="animate-fade-in-up">
                <h3 className="text-xl font-black uppercase tracking-widest mb-6">Profile Details</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {updateMsg.text && (
                    <div className={`p-3 rounded text-sm text-center ${updateMsg.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500' : 'bg-green-500/10 text-green-500 border border-green-500'}`}>
                      {updateMsg.text}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] mb-2">Full Name</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-text)] transition text-[var(--color-text)]" />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] mb-2">Email Address</label>
                    <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} required className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-text)] transition text-[var(--color-text)]" />
                  </div>
                  
                  <button type="submit" disabled={isUpdating} className={`bg-[var(--color-primary)] text-[var(--color-background)] font-bold uppercase tracking-widest text-xs px-8 py-3 rounded mt-4 transition hover:opacity-90 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div className="animate-fade-in-up">
                <h3 className="text-xl font-black uppercase tracking-widest mb-6">Order History</h3>
                <div className="flex flex-col items-center justify-center text-center py-16 opacity-60">
                  <Package className="w-16 h-16 mb-4 text-[var(--color-text-muted)]" />
                  <p className="text-[12px] uppercase tracking-widest font-bold">No orders found yet</p>
                  <Link href="/shop" className="mt-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-accent)] hover:underline underline-offset-4">Continue Shopping</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
