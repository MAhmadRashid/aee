import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function OverlayUI({ 
  product, 
  activeVariant, 
  setActiveVariant, 
  activeHotspot, 
  setActiveHotspot 
}: any) {
  const { addToCart } = useCart();
  const hotspotData = product.hotspots?.find((h: any) => h.id === activeHotspot);

  return (
    <div className="w-full h-full relative">
      {/* Header */}
      <header className="absolute top-16 left-0 w-full px-8 flex justify-between items-start z-30 pointer-events-auto">
        <div className="max-w-md mt-4">
          <h1 className="font-serif text-5xl tracking-widest text-gradient-gold mb-2 uppercase">
            {product.name}
          </h1>
          <p className="font-sans text-white/80 font-light leading-relaxed">
            {product.description}
          </p>
        </div>
        <button className="glassmorphism px-6 py-3 mt-4 rounded-full text-accent tracking-widest text-sm hover:bg-white/10 transition">
          EXPLORE AR
        </button>
      </header>

      {/* Quick AR Button */}
      <button className="absolute top-8 right-8 glassmorphism px-6 py-3 rounded-full text-white font-sans text-xs tracking-widest uppercase hover:bg-white/10 transition z-40">
        View in AR
      </button>

      {/* Olfactory Sidebar Drawer */}
      <AnimatePresence>
        {activeHotspot && hotspotData && (
          <>
            {/* Overlay to dismiss */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 pointer-events-auto bg-black/20"
              onClick={() => setActiveHotspot(null)}
            />
            {/* Sidebar */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 h-full w-96 bg-[#0a0a0a]/90 backdrop-blur-2xl border-l border-white/10 p-12 z-30 pointer-events-auto flex flex-col justify-center"
            >
              <div className="w-12 h-1 bg-gradient-to-r from-accent to-accent/80 mb-8 rounded-full" />
              <button 
                onClick={() => setActiveHotspot(null)}
                className="absolute top-8 right-8 text-white/50 hover:text-white transition"
              >
                ✕
              </button>
              <p className="text-accent text-xs tracking-widest uppercase mb-2">Olfactory Profile</p>
              <h3 className="font-serif text-4xl text-white mb-6 leading-tight">{hotspotData.title}</h3>
              <p className="font-sans text-sm text-white/70 leading-relaxed mb-8">
                {hotspotData.description}
              </p>
              
              <div className="space-y-4 border-t border-white/10 pt-8">
                <div>
                  <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Extraction Method</p>
                  <p className="text-white/90 text-sm">CO2 Supercritical Fluid Extraction</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Sourced From</p>
                  <p className="text-white/90 text-sm">Grasse, France & Calabria, Italy</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Variant Selector Footer */}
      <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 glassmorphism px-8 py-4 rounded-full flex gap-8 z-30 pointer-events-auto">
        {product.variants?.map((variant: any, idx: number) => (
          <button
            key={variant.id}
            onClick={() => setActiveVariant(idx)}
            className={`flex flex-col items-center gap-2 transition-opacity ${activeVariant === idx ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
          >
            <div 
              className="w-6 h-6 rounded-full border border-white/20 shadow-inner"
              style={{ backgroundColor: variant.color }}
            />
            <span className="font-sans text-xs tracking-widest text-white/80 uppercase">
              {variant.name}
            </span>
          </button>
        ))}
      </footer>

      {/* Checkout CTA */}
      <div className="absolute bottom-8 right-8 z-30 pointer-events-auto">
        <button 
          onClick={() => {
            // Snap back animation: scrolling to top reverses the GSAP ScrollTrigger
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              variant: product.variants?.[activeVariant]?.name || '',
              image: product.image || product.image_url || ''
            });

            // Temporary button state change to show success
            const btn = document.getElementById('cart-btn');
            if (btn) {
              btn.innerText = 'Added to Cart ✓';
              btn.style.borderColor = '#2ecc71';
              btn.style.color = '#2ecc71';
              setTimeout(() => {
                btn.innerText = `Add to Cart — $${product.price}`;
                btn.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                btn.style.color = 'white';
              }, 2000);
            }
          }}
          id="cart-btn"
          className="glassmorphism px-8 py-4 rounded-full text-white font-serif italic text-lg hover:bg-white/10 transition border border-accent/30"
        >
          Add to Cart — ${product.price}
        </button>
      </div>
    </div>
  );
}
