export const themes = {
  // Dark Themes
  default: { name: 'Netflix', primary: '#E50914', background: '#000000', text: '#FFFFFF', description: 'Classic streaming theme', category: 'dark' },
  nightcity: { name: 'Night City', primary: '#00FFFF', background: '#120458', text: '#FF00FF', description: 'Cyberpunk-inspired neon nights', category: 'dark' },
  dracula: { name: 'Dracula', primary: '#BD93F9', background: '#282A36', text: '#F8F8F2', description: 'A dark theme for the night owls', category: 'dark' },
  deepSpace: { name: 'Deep Space', primary: '#7B4DFF', background: '#0A0E21', text: '#E0E0E0', description: 'Explore the cosmos', category: 'dark' },
  neonNoir: { name: 'Neon Noir', primary: '#FF355E', background: '#1A1A2E', text: '#E1E1E1', description: 'Dark streets, bright lights', category: 'dark' },
  midnightOrchid: { name: 'Midnight Orchid', primary: '#9F4DEE', background: '#1E0B36', text: '#E0D3F5', description: 'Mysterious and enchanting', category: 'dark' },

  // AMOLED Themes
  monochrome: { name: 'Monochrome', primary: '#FFFFFF', background: '#000000', text: '#FFFFFF', description: 'Simple black and white', category: 'amoled' },
  neonPulse: { name: 'Neon Pulse', primary: '#FE2C55', background: '#000000', text: '#FFFFFF', description: 'Vibrant neon on pure black', category: 'amoled' },
  outrun: { name: 'Outrun', primary: '#FF00FF', background: '#000000', text: '#00FFFF', description: '80s retro-futurism', category: 'amoled' },
  matrixGreen: { name: 'Matrix Green', primary: '#00FF00', background: '#000000', text: '#00FF00', description: 'Enter the Matrix', category: 'amoled' },
  starryNight: { name: 'Starry Night', primary: '#F0C420', background: '#000000', text: '#FFFFFF', description: 'Twinkling stars in the dark', category: 'amoled' },
  midnightBlue: { name: 'Midnight Blue', primary: '#0000FF', background: '#000000', text: '#FFFFFF', description: 'Deep blue in the darkness', category: 'amoled' },
  emeraldAbyss: { name: 'Emerald Abyss', primary: '#00FF00', background: '#000000', text: '#FFFFFF', description: 'Glowing green in the void', category: 'amoled' },

  // Light Themes
  minimalist: { name: 'Minimalist', primary: '#2D2D2D', background: '#FFFFFF', text: '#000000', description: 'Clean and simple', category: 'light' },
  solarizedLight: { name: 'Solarized Light', primary: '#073642', background: '#FDF6E3', text: '#657B83', description: 'Easy on the eyes', category: 'light' },
  arcticFrost: { name: 'Arctic Frost', primary: '#81A4CD', background: '#F0F3F5', text: '#2E4057', description: 'Cool and refreshing', category: 'light' },
  goldenSun: { name: 'Golden Sun', primary: '#000000', background: '#FFC600', text: '#000000', description: 'Bright and energetic', category: 'light' },

  // Pastel Themes
  subtleVaporwave: { name: 'Vaporwave', primary: '#FF6B9E', background: '#F2E4F9', text: '#5B37B7', description: 'Soft aesthetic vibes', category: 'pastel' },
  cherryBlossom: { name: 'Cherry Blossom', primary: '#FFB7C5', background: '#FFF0F5', text: '#DE3163', description: 'Delicate and dreamy', category: 'pastel' },
  mintChocolate: { name: 'Mint Chocolate', primary: '#4ECCA3', background: '#2D2D2D', text: '#EEEEEE', description: 'Cool and refreshing', category: 'pastel' },
  lavenderFields: { name: 'Lavender Fields', primary: '#9F77CF', background: '#F0E6FF', text: '#4A0E4E', description: 'Calming purple hues', category: 'pastel' },

  // Other themes (you can categorize these as needed)
  Yellowjacket: { name: 'Yellowjacket', primary: '#ffd700', background: '#1a1a1a', text: '#ffffff', description: 'Bold and energetic', category: 'dark' },
  chemical: { name: 'Chemical', primary: '#1CE783', background: '#0B0C0F', text: '#FFFFFF', description: 'Toxic and glowing', category: 'dark' },
  royalBlue: { name: 'Royal Blue', primary: '#0063E5', background: '#040714', text: '#F9F9F9', description: 'Regal and sophisticated', category: 'dark' },
  azureWaters: { name: 'Azure Waters', primary: '#00A8E1', background: '#0F171E', text: '#FFFFFF', description: 'Deep ocean vibes', category: 'dark' },
  lavenderDreams: { name: 'Lavender Dreams', primary: '#9949D8', background: '#030328', text: '#FFFFFF', description: 'Soothing purple tones', category: 'dark' },
  sunsetOrange: { name: 'Sunset Orange', primary: '#F47521', background: '#23252B', text: '#FFFFFF', description: 'Warm evening glow', category: 'dark' },
  emeraldForest: { name: 'Emerald Forest', primary: '#1DB954', background: '#191414', text: '#FFFFFF', description: 'Lush and verdant', category: 'dark' },
  midnightGold: { name: 'Midnight Gold', primary: '#FBB400', background: '#000030', text: '#FFFFFF', description: 'Luxurious dark blue and gold', category: 'dark' },
  retroWave: { name: 'Retro Wave', primary: '#FF1493', background: '#1E0B39', text: '#00FFFF', description: 'Synthwave aesthetic', category: 'dark' },
  nordAurora: { name: 'Nord Aurora', primary: '#88C0D0', background: '#2E3440', text: '#D8DEE9', description: 'Arctic-inspired palette', category: 'dark' },
  monokai: { name: 'Monokai', primary: '#F92672', background: '#272822', text: '#F8F8F2', description: 'Popular code editor theme', category: 'dark' },
  gruvbox: { name: 'Gruvbox', primary: '#FE8019', background: '#282828', text: '#EBDBB2', description: 'Retro groove color scheme', category: 'dark' },
  cyberpunk: { name: 'Cyberpunk', primary: '#FFE600', background: '#372963', text: '#00FF9C', description: 'High-tech low-life', category: 'dark' },
  greenTea: { name: 'Green Tea', primary: '#A8E6CF', background: '#DCEDC1', text: '#1D3557', description: 'Refreshing and calm', category: 'light' },
  oceanBreeze: { name: 'Ocean Breeze', primary: '#48CAE4', background: '#E0FBFC', text: '#023047', description: 'Cool coastal colors', category: 'light' },
  desertSand: { name: 'Desert Sand', primary: '#C19A6B', background: '#F4E3CF', text: '#5E503F', description: 'Warm and earthy', category: 'light' },
  electricLime: { name: 'Electric Lime', primary: '#CCFF00', background: '#1F2605', text: '#A3EC00', description: 'Energizing and bold', category: 'dark' },
  nordicFjord: { name: 'Nordic Fjord', primary: '#3A7CA5', background: '#D9DCD6', text: '#16425B', description: 'Scandinavian simplicity', category: 'light' },
  cosmicLatte: { name: 'Cosmic Latte', primary: '#FFF8E7', background: '#23395B', text: '#E8E8E8', description: 'Creamy space colors', category: 'light' },
};