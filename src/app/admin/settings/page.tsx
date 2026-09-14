'use client';
import { useTheme, ThemeType } from '@/context/ThemeContext';
import { Paintbrush, Check } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themes: { id: ThemeType, name: string, description: string, preview: string }[] = [
    {
      id: 'midnight-gold',
      name: 'Midnight Gold',
      description: 'Deep obsidian black with rich champagne gold accents. Ultra-premium and mysterious.',
      preview: 'from-[#0A0A0A] to-[#141414] text-[#D4B271]'
    },
    {
      id: 'rose-quartz',
      name: 'Rose Quartz',
      description: 'Soft warm cream with dusky rose and rose gold accents. Feminine and elegant.',
      preview: 'from-[#FDFBFB] to-[#FFFFFF] text-[#C28B93]'
    },
    {
      id: 'emerald-onyx',
      name: 'Emerald Onyx',
      description: 'Deep forest green and black with bright royal gold accents. Bold Arabic Oud aesthetic.',
      preview: 'from-[#0B1210] to-[#121F1A] text-[#DFB253]'
    }
  ];

  return (
    <div className="space-y-10">
      <header className="mb-12">
        <h1 className="text-4xl font-serif italic tracking-wide text-[var(--color-primary)] mb-2">Appearance</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Customize your storefront's global theme</p>
      </header>

      <div className="bg-[var(--color-surface)]/40 backdrop-blur-xl rounded-sm border border-[var(--color-border)]/50 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-text)] mb-8 flex items-center border-b border-[var(--color-border)]/30 pb-4">
          <Paintbrush className="w-4 h-4 mr-3 text-[var(--color-primary)]" />
          Active Theme
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {themes.map((t) => {
            const isActive = theme === t.id;
            return (
              <div 
                key={t.id} 
                onClick={() => setTheme(t.id)}
                className={`relative cursor-pointer rounded-sm border p-6 transition-all duration-500 overflow-hidden group
                  ${isActive 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-[0_0_20px_rgba(194,155,87,0.15)]' 
                    : 'border-[var(--color-border)]/50 hover:border-[var(--color-primary)]/50 bg-[var(--color-background)]/30'
                  }`}
              >
                {isActive && (
                  <div className="absolute top-4 right-4 bg-[var(--color-primary)] text-[var(--color-background)] p-1 rounded-full z-10">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                )}
                
                {/* Visual Preview */}
                <div className={`w-full h-32 rounded-sm mb-6 bg-gradient-to-br ${t.preview} border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500`}>
                  <span className="font-serif italic text-2xl drop-shadow-md">Aa</span>
                  <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <h3 className="font-serif text-xl text-[var(--color-primary)] mb-2">{t.name}</h3>
                <p className="text-[10px] uppercase tracking-widest leading-relaxed text-[var(--color-text-muted)]">
                  {t.description}
                </p>
                
                <div className={`mt-6 pt-4 border-t border-[var(--color-border)]/30 flex justify-center text-[9px] uppercase tracking-[0.2em] font-bold ${isActive ? 'text-[var(--color-primary)]' : 'text-transparent group-hover:text-[var(--color-text-muted)] transition-colors'}`}>
                  {isActive ? 'Currently Active Globally' : 'Click to Activate'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
