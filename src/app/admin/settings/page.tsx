'use client';
import { useState, useEffect } from 'react';
import { useTheme, ThemeType } from '@/context/ThemeContext';
import { 
  Paintbrush, 
  Check, 
  Store, 
  CheckCircle2, 
  Save, 
  RefreshCw, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Truck,
  RotateCcw
} from 'lucide-react';

interface StoreConfig {
  storeName: string;
  brandTagline: string;
  supportPhone: string;
  whatsappConcierge: string;
  supportEmail: string;
  atelierAddress: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  currency?: string;
}

const DEFAULT_CONFIG: StoreConfig = {
  storeName: 'Zero to One Haute Parfumerie',
  brandTagline: 'Haute Parfumerie & Artisanal Fragrances',
  supportPhone: '021-38483000',
  whatsappConcierge: '+92 300 0000000',
  supportEmail: 'support@zerotoone.com',
  atelierAddress: 'Shop No. G-21 Ground Floor, Millennium Mall, Karachi',
  freeShippingThreshold: 5000,
  standardShippingFee: 250,
  currency: 'PKR'
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setStoreConfig(data.settings);
          }
        }
      } catch (err) {
        console.warn('Using cached store configuration:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const themes: { id: ThemeType, name: string, description: string, preview: string }[] = [
    {
      id: 'midnight-gold',
      name: 'Midnight Gold',
      description: 'Deep void navy with metallic gold accents. Ultra-premium boutique aesthetic.',
      preview: 'from-[#02040A] to-[#070B14] text-[#D4AF37]'
    },
    {
      id: 'obsidian-silver',
      name: 'Obsidian Silver',
      description: 'True obsidian black with platinum silver highlights. Sleek, minimalist modern luxury.',
      preview: 'from-[#050505] to-[#0E0E0E] text-[#E5E4E2]'
    },
    {
      id: 'amber-oud',
      name: 'Amber Oud',
      description: 'Espresso black with rich burnished copper and warm amber accents. Bold oriental fragrance aesthetic.',
      preview: 'from-[#0A0604] to-[#120A06] text-[#C87D46]'
    }
  ];

  const handleSaveStoreConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeConfig)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setStoreConfig(data.settings);
        }
        showToast('Platform parameters & concierge settings saved successfully.');
      } else {
        showToast('Failed to save settings to server.');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      showToast('Connection error while saving platform configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setStoreConfig(DEFAULT_CONFIG);
    showToast('Form reset to boutique defaults (click Save to persist).');
  };

  return (
    <div className="space-y-10 pt-4 pb-16 w-full max-w-[100vw] overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#141414] border border-[#D4AF37]/50 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-xs font-sans tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcdca0] mb-2 drop-shadow-md">
            Platform Configuration
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">
            Real-time management for global themes, concierge communication, and eCommerce thresholds
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest flex items-center gap-2 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </header>

      {/* Theme Appearance Section */}
      <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center">
            <Paintbrush className="w-4 h-4 mr-2.5 text-[#D4AF37]" />
            Active Olfactive Aesthetic
          </h2>
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
            Current: <span className="text-[#D4AF37] font-bold">{theme}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {themes.map((t) => {
            const isActive = theme === t.id;
            return (
              <div 
                key={t.id} 
                onClick={() => {
                  setTheme(t.id);
                  showToast(`Store theme changed to ${t.name}.`);
                }}
                className={`relative cursor-pointer rounded-xl border p-5 transition-all duration-300 overflow-hidden group
                  ${isActive 
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_25px_rgba(212,175,55,0.2)]' 
                    : 'border-white/5 hover:border-white/20 bg-black/40'
                  }`}
              >
                {isActive && (
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-black p-1 rounded-full z-10">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                )}
                
                {/* Visual Preview */}
                <div className={`w-full h-24 rounded-lg mb-4 bg-gradient-to-br ${t.preview} border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300`}>
                  <span className="font-serif italic text-2xl drop-shadow-md">Aa</span>
                  <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                <h3 className="font-serif text-base text-white mb-1">{t.name}</h3>
                <p className="text-[11px] leading-relaxed text-neutral-400">
                  {t.description}
                </p>
                
                <div className={`mt-4 pt-3 border-t border-white/5 flex justify-center text-[9px] uppercase tracking-[0.2em] font-bold ${isActive ? 'text-[#D4AF37]' : 'text-neutral-500 group-hover:text-white transition-colors'}`}>
                  {isActive ? 'Active Globally' : 'Click to Apply'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Store Concierge & Policies Section */}
      <div className="bg-[#121212] backdrop-blur-xl rounded-2xl border border-white/5 p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center">
            <Store className="w-4 h-4 mr-2.5 text-[#D4AF37]" />
            Boutique Identity & Customer Care Desk
          </h2>
          {loading && (
            <span className="text-[10px] uppercase font-mono text-neutral-400 animate-pulse">Loading parameters...</span>
          )}
        </div>

        <form onSubmit={handleSaveStoreConfig} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Boutique Brand Name</span>
              </label>
              <input 
                type="text" 
                required
                value={storeConfig.storeName}
                onChange={(e) => setStoreConfig({...storeConfig, storeName: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Artisanal Tagline</span>
              </label>
              <input 
                type="text" 
                value={storeConfig.brandTagline}
                onChange={(e) => setStoreConfig({...storeConfig, brandTagline: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Boutique Telephone</span>
              </label>
              <input 
                type="text" 
                value={storeConfig.supportPhone}
                onChange={(e) => setStoreConfig({...storeConfig, supportPhone: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors font-mono" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>WhatsApp Hotline</span>
              </label>
              <input 
                type="text" 
                value={storeConfig.whatsappConcierge}
                onChange={(e) => setStoreConfig({...storeConfig, whatsappConcierge: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors font-mono" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Concierge Email</span>
              </label>
              <input 
                type="email" 
                value={storeConfig.supportEmail}
                onChange={(e) => setStoreConfig({...storeConfig, supportEmail: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Flagship Atelier Retail Location</span>
            </label>
            <input 
              type="text" 
              value={storeConfig.atelierAddress}
              onChange={(e) => setStoreConfig({...storeConfig, atelierAddress: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors" 
            />
          </div>

          {/* Delivery & Commercial Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Complimentary Delivery Threshold (PKR)</span>
              </label>
              <input 
                type="number" 
                min={0}
                value={storeConfig.freeShippingThreshold}
                onChange={(e) => setStoreConfig({...storeConfig, freeShippingThreshold: Number(e.target.value)})}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37] transition-colors" 
              />
              <p className="text-[10px] text-neutral-500">Orders above this subtotal receive free insured courier shipping.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Standard Express Courier Fee (PKR)</span>
              </label>
              <input 
                type="number" 
                min={0}
                value={storeConfig.standardShippingFee}
                onChange={(e) => setStoreConfig({...storeConfig, standardShippingFee: Number(e.target.value)})}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37] transition-colors" 
              />
              <p className="text-[10px] text-neutral-500">Charged on domestic delivery parcels below threshold.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-[#D4AF37] to-[#C29B57] text-black px-8 py-3.5 rounded-lg flex items-center justify-center hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] transition-all duration-300 text-[10px] uppercase font-bold tracking-[0.2em] transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" strokeWidth={2.5} />
              )}
              {saving ? 'Synchronizing Parameters...' : 'Save Platform Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
