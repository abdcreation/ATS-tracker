const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

const defaultData = {
  products: [
    {
      id: "prod-1",
      title: "Hyperion Boardroom Holograph",
      price: 12500.00,
      category: "Marketing Hardware",
      description: "A multi-user interactive holographic tabletop designed for executive pitch demonstrations. Renders high-fidelity campaign structures as floating 3D wireframe simulations.",
      features: [
        "360-degree holographic projection platter",
        "Multi-touch gesture interaction base",
        "High-lumen semiconductor light source",
        "Enterprise cloud data synchronization"
      ],
      defaultConfig: {
        material: "refractive-silica",
        color: "#2563eb",
        text: "HYPERION V1"
      }
    },
    {
      id: "prod-2",
      title: "Atlas Lobby Media Tower",
      price: 8200.00,
      category: "Marketing Hardware",
      description: "Industrial-grade physical media pillar for corporate lobbies. Broadcasts live marketing campaign statistics, interactive brand messaging, and real-time news tickers.",
      features: [
        "Brushed aluminum vertical frame",
        "Dual-sided high-density LED panels",
        "Integrated sound direction array",
        "Local campaign scheduling processor"
      ],
      defaultConfig: {
        material: "brushed-steel",
        color: "#d4af37",
        text: "ATLAS TOWER"
      }
    },
    {
      id: "prod-3",
      title: "Apex Campaign Server Node",
      price: 15400.00,
      category: "Infrastructure",
      description: "Rack-mounted dedicated hardware unit. Automatically trains local neural marketing models, runs real-time ad optimization cycles, and stores sensitive user-attribution data on-premise.",
      features: [
        "24-core local marketing model co-processor",
        "On-site user data privacy firewall",
        "Dynamic ad routing scheduler",
        "Redundant liquid-cooled chassis design"
      ],
      defaultConfig: {
        material: "anodized-titanium",
        color: "#00f0ff",
        text: "APEX NODE 0"
      }
    },
    {
      id: "prod-4",
      title: "Executive Branding Obelisk",
      price: 2500.00,
      category: "Brand Assets",
      description: "A luxury brand trophy machined from solid aerospace titanium. Designed for office lobbies or reception desks, featuring custom laser-engraved details and ambient LED highlights.",
      features: [
        "Aerospace-grade solid titanium construction",
        "Subtle base ambient lighting",
        "Precision fiber laser engraved surface",
        "Premium presentation packaging"
      ],
      defaultConfig: {
        material: "polished-gold",
        color: "#d4af37",
        text: "SPHERE CO"
      }
    },
    {
      id: "prod-5",
      title: "Omnichannel Neural Suite",
      price: 6800.00,
      category: "Digital Systems",
      description: "Our enterprise AI marketing engine. Automates ad placement across search, display, and social media platforms, providing 3D interactive dashboard reporting.",
      features: [
        "Automated ad bidding optimizer",
        "Cross-channel campaign attribution",
        "Deep learning conversion forecaster",
        "Interactive WebGL client reporting panel"
      ],
      defaultConfig: {
        material: "refractive-silica",
        color: "#2563eb",
        text: "NEURAL CORE"
      }
    }
  ],
  orders: []
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(defaultData);
      return defaultData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB file:', error);
    return defaultData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing DB file:', error);
    return false;
  }
}

module.exports = {
  readDb,
  writeDb
};
