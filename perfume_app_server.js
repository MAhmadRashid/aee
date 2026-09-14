const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Perfume Products Database (Antigravity 3D Data)
const perfumeCollection = [
  {
    id: 'aura-oud-01',
    name: 'AURA N°1 - Celestial Oud',
    tagline: 'Defying gravity through amber resonance and smoky vanilla.',
    price: 185,
    volume: '100ml / 3.4 FL. OZ.',
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb',
    antigravityConfig: {
      floatSpeed: 1.2,
      floatAmplitude: 0.15,
      particleCount: 120,
      levitatingObjects: ['bergamot_slice', 'amber_crystal', 'jasmine_petal']
    },
    variants: [
      {
        id: 'var_amber',
        name: 'Amber Glow',
        liquidColor: '#e08b26',
        roughness: 0.1,
        transmission: 0.95,
        notes: { top: 'Italian Bergamot', heart: 'Jasmine Sambac', base: 'Golden Amber & Sandalwood' }
      },
      {
        id: 'var_iris',
        name: 'Midnight Iris',
        liquidColor: '#4b287a',
        roughness: 0.15,
        transmission: 0.9,
        notes: { top: 'Pink Pepper', heart: 'Black Iris', base: 'Dark Patchouli & Smoke' }
      },
      {
        id: 'var_rose',
        name: 'Rose Oud',
        liquidColor: '#b02a45',
        roughness: 0.08,
        transmission: 0.96,
        notes: { top: 'Damask Rose', heart: 'Smoked Leather', base: 'Aged Agarwood' }
      }
    ],
    hotspots: [
      {
        id: 'hs_cap',
        title: 'Magnetic Gold Atomizer',
        description: 'Floating magnetic alloy cap calibrated to a micro-mist dispersion pattern.',
        position: [0, 1.4, 0]
      },
      {
        id: 'hs_glass',
        title: 'High-Transmission Crystal',
        description: 'Custom molded crystal glass with refractive caustic indices of 1.52.',
        position: [0, 0, 0.4]
      },
      {
        id: 'hs_notes',
        title: 'Heart Olfactory Core',
        description: 'Hand-picked Jasmine Sambac and wild Bergamot accord suspended in oil.',
        position: [0, -0.3, 0]
      }
    ]
  }
];

// Routes
app.get('/api/perfume', (req, res) => {
  res.json({ success: true, data: perfumeCollection[0] });
});

app.listen(PORT, () => {
  console.log(`✨ Luxury Perfume 3D Showcase running at: http://localhost:${PORT}`);
});
