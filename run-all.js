const { spawn, exec } = require("child_process");
const http = require("http");
const net = require("net");
const fs = require("fs");
const path = require("path");

// Novacare Portals definition
const ROLES = [
  {
    id: "admin",
    name: "Admin Portal",
    fePort: 3001,
    bePort: 5000, // Centralized port
    emoji: "👑",
    desc: "System administration, audits, user controls, and system-wide configurations.",
    color: "from-blue-600 to-indigo-700",
    glow: "rgba(59, 130, 246, 0.4)"
  },
  {
    id: "doctor",
    name: "Doctor Portal",
    fePort: 3002,
    bePort: 5000, // Centralized port
    emoji: "🩺",
    desc: "E-prescriptions, clinical notes, patient scheduling, and virtual consultations.",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.4)"
  },
  {
    id: "patient",
    name: "Patient Portal",
    fePort: 3003,
    bePort: 5000, // Centralized port
    emoji: "👤",
    desc: "Personal health records, direct bookings, invoices, and messaging history.",
    color: "from-violet-500 to-purple-600",
    glow: "rgba(139, 92, 246, 0.4)"
  },
  {
    id: "reception",
    name: "Reception Portal",
    fePort: 3004,
    bePort: 5000, // Centralized port
    emoji: "🛎️",
    desc: "Admissions, front desk appointments, waitlists, and patient check-ins.",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245, 158, 11, 0.4)"
  },
  {
    id: "nurse",
    name: "Nurse Portal",
    fePort: 3005,
    bePort: 5000, // Centralized port
    emoji: "🏥",
    desc: "Inpatient vitals, medication charts, ward round notes, and alert responses.",
    color: "from-pink-500 to-rose-600",
    glow: "rgba(236, 72, 153, 0.4)"
  },
  {
    id: "wardboy",
    name: "Wardboy Portal",
    fePort: 3006,
    bePort: 5000, // Centralized port
    emoji: "🛏️",
    desc: "Housekeeping tasks, bed availability trackers, and patient transit requests.",
    color: "from-cyan-500 to-blue-500",
    glow: "rgba(6, 182, 212, 0.4)"
  },
  {
    id: "pharmacy",
    name: "Pharmacy Portal",
    fePort: 3007,
    bePort: 5000, // Centralized port
    emoji: "💊",
    desc: "Medicine inventory control, prescription dispensing, and vendor orders.",
    color: "from-green-500 to-emerald-600",
    glow: "rgba(34, 197, 94, 0.4)"
  },
  {
    id: "ambulance",
    name: "Ambulance Portal",
    fePort: 3008,
    bePort: 5000, // Centralized port
    emoji: "🚑",
    desc: "Emergency dispatch dashboard, GPS route navigation, and trauma triage logs.",
    color: "from-red-500 to-rose-700",
    glow: "rgba(239, 68, 68, 0.4)"
  }
];

const processes = [];

// Helper function to check if a TCP port is open (IPv4 & IPv6 dual-stack fallback)
function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(300);

    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.on("error", () => {
      socket.destroy();
      
      // Fallback to checking IPv6 loopback (::1) as Vite/Node on Windows often bind there first
      const ipv6Socket = new net.Socket();
      ipv6Socket.setTimeout(300);
      
      ipv6Socket.on("connect", () => {
        ipv6Socket.destroy();
        resolve(true);
      });
      
      ipv6Socket.on("timeout", () => {
        ipv6Socket.destroy();
        resolve(false);
      });
      
      ipv6Socket.on("error", () => {
        ipv6Socket.destroy();
        resolve(false);
      });
      
      ipv6Socket.connect(port, "::1");
    });

    socket.connect(port, "127.0.0.1");
  });
}

// Spawns a background process
function runCommand(name, cmd, args, dir, extraEnv = {}) {
  console.log(`[System] Starting ${name} in ${dir}...`);
  const isWin = process.platform === "win32";
  
  // Use shell: true on Windows for npm commands to resolve correctly
  const child = spawn(isWin ? "npm.cmd" : "npm", args, {
    cwd: dir,
    shell: true,
    env: { 
      ...process.env, 
      FORCE_COLOR: "true",
      VITE_API_URL: "http://localhost:5000/api", // Direct all frontends to centralized backend!
      ...extraEnv
    }
  });

  child.stdout.on("data", (data) => {
    const cleanData = data.toString().trim();
    if (cleanData) {
      console.log(`[${name}] ${cleanData}`);
    }
  });

  child.stderr.on("data", (data) => {
    const cleanData = data.toString().trim();
    if (cleanData) {
      console.error(`[${name} ERROR] ${cleanData}`);
    }
  });

  child.on("close", (code) => {
    console.log(`[System] ${name} exited with code ${code}`);
  });

  processes.push({ name, process: child });
}

// Start all services
function startAllServices() {
  console.log("\n==========================================================");
  console.log("    NOVACARE CENTRALIZED ENTERPRISE DEVELOPMENT SERVER    ");
  console.log("==========================================================\n");

  // 1. Start single centralized MERN backend on Port 5000
  const centralBeDir = path.join(__dirname, "backend");
  if (fs.existsSync(centralBeDir)) {
    runCommand("MERN Central Backend (BE)", "npm", ["run", "dev"], centralBeDir);
  } else {
    console.error("[System Error] Central backend directory not found!");
  }

  // 2. Start all frontend portals, pointing to Central Backend
  ROLES.forEach((role) => {
    const feDir = path.join(__dirname, role.id, "frontend");

    // Start frontend if dir exists
    if (fs.existsSync(feDir)) {
      runCommand(`${role.name} (FE)`, "npm", ["run", "dev"], feDir);
    } else {
      console.warn(`[System Warning] Frontend directory not found for ${role.id}`);
    }
  });
}

// Generate the beautiful Glassmorphic Admin Dashboard HTML
function getDashboardHtml() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novacare Launchpad Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-base: #090a0f;
      --bg-glass: rgba(17, 19, 31, 0.7);
      --border-glass: rgba(255, 255, 255, 0.08);
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --text-dim: #6b7280;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --success: #10b981;
      --error: #ef4444;
      --card-bg: rgba(20, 22, 37, 0.4);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
    }

    body {
      background-color: var(--bg-base);
      background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.1) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(16, 185, 129, 0.08) 0px, transparent 50%);
      background-attachment: fixed;
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Core container */
    .container {
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
      flex-grow: 1;
    }

    /* Header */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      position: relative;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo-glow {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1, #d946ef);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 800;
      color: white;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
    }

    .title-section h1 {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      background: linear-gradient(to right, #ffffff, #9ca3af);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title-section p {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .global-actions {
      display: flex;
      gap: 1rem;
    }

    /* Button styles */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      border: 1px solid transparent;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), #4f46e5);
      color: white;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-main);
      border-color: var(--border-glass);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    /* Portal Grid */
    .portal-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.75rem;
      margin-bottom: 3rem;
    }

    /* Cards */
    .portal-card {
      background: var(--card-bg);
      border: 1px solid var(--border-glass);
      border-radius: 18px;
      padding: 1.75rem;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.5rem;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .portal-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
    }

    .portal-card:hover {
      transform: translateY(-5px);
      border-color: rgba(255, 255, 255, 0.18);
      box-shadow: 0 12px 40px var(--glow-color);
    }

    /* Card Details */
    .portal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .portal-emoji {
      font-size: 2.25rem;
      filter: drop-shadow(0 0 10px rgba(255,255,255,0.1));
    }

    .status-badges {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-end;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.25rem 0.6rem;
      border-radius: 100px;
      letter-spacing: 0.05em;
    }

    .status-badge .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .status-online {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .status-online .dot {
      background-color: var(--success);
      box-shadow: 0 0 8px var(--success);
      animation: pulse 1.5s infinite;
    }

    .status-offline {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .status-offline .dot {
      background-color: var(--error);
    }

    .portal-info {
      margin-top: 0.5rem;
    }

    .portal-info h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
    }

    .portal-info p {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
      line-height: 1.45;
      min-height: 2.9rem;
    }

    .portal-ports {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 0.75rem;
    }

    .port-tag {
      flex: 1;
      background: rgba(255, 255, 255, 0.03);
      padding: 0.4rem 0.5rem;
      border-radius: 8px;
      font-size: 0.75rem;
      color: var(--text-dim);
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid rgba(255,255,255,0.02);
    }

    .port-tag span {
      font-weight: 700;
      color: var(--text-muted);
      margin-top: 0.1rem;
    }

    /* Actions */
    .portal-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-card {
      flex: 1;
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      text-align: center;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 0.4rem;
    }

    .btn-card-primary {
      background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
      color: white;
      box-shadow: 0 4px 10px var(--glow-color);
    }

    .btn-card-primary:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    .btn-card-disabled {
      background: rgba(255,255,255,0.05) !important;
      color: var(--text-dim) !important;
      box-shadow: none !important;
      cursor: not-allowed;
      pointer-events: none;
    }

    .btn-card-secondary {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-muted);
      border: 1px solid var(--border-glass);
    }

    .btn-card-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    /* Quick status bar */
    .status-bar {
      background: rgba(17, 19, 31, 0.8);
      border: 1px solid var(--border-glass);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      backdrop-filter: blur(10px);
    }

    .status-summary {
      display: flex;
      gap: 2rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .stat-val {
      font-weight: 800;
      font-size: 1.1rem;
      color: white;
    }

    .stat-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-central {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(99, 102, 241, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 10px;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    footer {
      text-align: center;
      padding: 2rem;
      border-top: 1px solid var(--border-glass);
      color: var(--text-dim);
      font-size: 0.8rem;
      background: rgba(9, 10, 15, 0.6);
      backdrop-filter: blur(8px);
    }

    /* Keyframes */
    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .portal-card {
      animation: fadeIn 0.5s ease forwards;
    }
  </style>
</head>
<body>

  <div class="container">
    <header>
      <div class="brand-section">
        <div class="logo-glow">N</div>
        <div class="title-section">
          <h1>Novacare Launchpad Hub</h1>
          <p>Centralized Enterprise Clinical Orchestration Dashboard</p>
        </div>
      </div>
      <div class="global-actions">
        <div class="status-central">
          <span style="font-size: 0.8rem; font-weight: 700; color: #a5b4fc;">CENTRAL MERN BACKEND (Port 5000):</span>
          <span id="central-be-badge" class="status-badge status-offline"><span class="dot"></span>OFFLINE</span>
        </div>
        <button onclick="launchAllPortals()" class="btn btn-primary" style="margin-left: 1rem;">
          <svg style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
          </svg>
          Launch All Active Portals
        </button>
      </div>
    </header>

    <!-- Global Status Info -->
    <div class="status-bar">
      <div class="status-summary">
        <div class="stat-item">
          <div class="stat-dot" style="background-color: var(--primary)"></div>
          <span>Total Portals:</span>
          <span class="stat-val" id="total-count">8</span>
        </div>
        <div class="stat-item">
          <div class="stat-dot" style="background-color: var(--success)"></div>
          <span>Active Frontends:</span>
          <span class="stat-val" id="fe-active-count">0</span>
        </div>
        <div class="stat-item">
          <div class="stat-dot" style="background-color: #3b82f6"></div>
          <span>Active Central BE Connections:</span>
          <span class="stat-val" id="be-active-count">0</span>
        </div>
      </div>
      <div class="stat-item" style="color: var(--text-dim); font-size: 0.8rem">
        Auto-refreshes every 2s
      </div>
    </div>

    <!-- Main Grid -->
    <div class="portal-grid" id="portal-grid">
      <!-- Portal Cards will render dynamically here -->
    </div>
  </div>

  <footer>
    Novacare Orchestration Hub &copy; 2026. Centralized Enterprise ERP Portal.
  </footer>

  <script>
    const ROLES = ${JSON.stringify(ROLES)};

    // Fetch and update status
    async function updateStatus() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        
        let activeFe = 0;
        let centralBeOnline = data.centralBackend;

        // Update central BE badge in header
        const centralBeBadge = document.getElementById('central-be-badge');
        if (centralBeBadge) {
          centralBeBadge.className = centralBeOnline ? 'status-badge status-online' : 'status-badge status-offline';
          centralBeBadge.innerHTML = \`<span class="dot"></span>\${centralBeOnline ? 'ONLINE' : 'OFFLINE'}\`;
        }
        
        ROLES.forEach(role => {
          const status = data.portals[role.id] || { fe: false };
          
          if (status.fe) activeFe++;

          // Update FE badge
          const feBadge = document.getElementById(\`fe-badge-\${role.id}\`);
          if (feBadge) {
            feBadge.className = status.fe ? 'status-badge status-online' : 'status-badge status-offline';
            feBadge.innerHTML = \`<span class="dot"></span>FE: \${status.fe ? 'Online' : 'Offline'}\`;
          }

          // Update BE badge (which mirrors the single Central MERN backend)
          const beBadge = document.getElementById(\`be-badge-\${role.id}\`);
          if (beBadge) {
            beBadge.className = centralBeOnline ? 'status-badge status-online' : 'status-badge status-offline';
            beBadge.innerHTML = \`<span class="dot"></span>BE: \${centralBeOnline ? 'Online' : 'Offline'}\`;
          }

          // Enable/Disable Action buttons
          const feBtn = document.getElementById(\`btn-fe-\${role.id}\`);
          if (feBtn) {
            if (status.fe) {
              feBtn.className = 'btn-card btn-card-primary';
              feBtn.innerHTML = 'Launch Portal';
            } else {
              feBtn.className = 'btn-card btn-card-disabled';
              feBtn.innerHTML = 'Starting...';
            }
          }
        });

        document.getElementById('fe-active-count').textContent = activeFe;
        document.getElementById('be-active-count').textContent = centralBeOnline ? ROLES.length : 0;

      } catch (err) {
        console.error("Failed to fetch port status", err);
      }
    }

    // Initial grid render
    function renderGrid() {
      const grid = document.getElementById('portal-grid');
      grid.innerHTML = ROLES.map(role => {
        return \`
          <div class="portal-card" style="--gradient-start: \${role.color.split(' ')[0].replace('from-', '#')}; --gradient-end: \${role.color.split(' ')[1].replace('to-', '#')}; --glow-color: \${role.glow}">
            <div class="portal-header">
              <div class="portal-emoji">\${role.emoji}</div>
              <div class="status-badges">
                <span id="fe-badge-\${role.id}" class="status-badge status-offline"><span class="dot"></span>FE: Offline</span>
                <span id="be-badge-\${role.id}" class="status-badge status-offline"><span class="dot"></span>BE: Offline</span>
              </div>
            </div>
            
            <div class="portal-info">
              <h3>\${role.name}</h3>
              <p>\${role.desc}</p>
              
              <div class="portal-ports">
                <div class="port-tag">Frontend Port <span>\${role.fePort}</span></div>
                <div class="port-tag">Central Backend <span>Port 5000</span></div>
              </div>
            </div>
            
            <div class="portal-actions">
              <a href="http://localhost:\${role.fePort}" target="_blank" id="btn-fe-\${role.id}" class="btn-card btn-card-disabled">Starting...</a>
              <a href="http://localhost:5000/api/health" target="_blank" class="btn-card btn-card-secondary">API Health</a>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Launch all active portals in separate tabs
    async function launchAllPortals() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        let openedCount = 0;
        
        ROLES.forEach(role => {
          if (data.portals[role.id] && data.portals[role.id].fe) {
            window.open(\`http://localhost:\${role.fePort}\`, '_blank');
            openedCount++;
          }
        });

        if (openedCount === 0) {
          alert("No portals are currently active yet. Please wait a few seconds and try again!");
        }
      } catch (err) {
        alert("Failed to read active portal status.");
      }
    }

    renderGrid();
    updateStatus();
    setInterval(updateStatus, 2000);
  </script>
</body>
</html>
  `;
}

// Create HTTP Hub server on Port 3000
function startHubServer() {
  const server = http.createServer(async (req, res) => {
    if (req.url === "/" || req.url === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(getDashboardHtml());
    } else if (req.url === "/api/status") {
      const statusMap = {
        centralBackend: false,
        portals: {}
      };
      
      // Check Centralized Backend Port 5000 first
      const centralBeOnline = await checkPort(5000);
      statusMap.centralBackend = centralBeOnline;

      // Perform concurrent frontend port checks
      await Promise.all(
        ROLES.map(async (role) => {
          const feOnline = await checkPort(role.fePort);
          statusMap.portals[role.id] = { fe: feOnline };
        })
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(statusMap));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    }
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log("\n==========================================================");
    console.log(`🚀 Novacare Launchpad Hub is running at: http://localhost:${PORT}`);
    console.log("==========================================================\n");
    
    // Automatically open dashboard in browser
    setTimeout(() => {
      const openCmd = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";
      exec(`${openCmd} http://localhost:${PORT}`, (err) => {
        if (err) {
          console.warn("[System] Failed to automatically open browser. Please open http://localhost:3000 manually.");
        }
      });
    }, 2000);
  });
}

// Cleanup all spawned processes properly, preventing orphans
function cleanupAndExit() {
  console.log("\n[System] Gracefully shutting down all services...");
  
  let killCount = 0;
  processes.forEach(({ name, process: proc }) => {
    if (proc && !proc.killed) {
      killCount++;
      const pid = proc.pid;
      if (process.platform === "win32") {
        // Use taskkill on Windows to ensure child node/vite processes are terminated
        exec(`taskkill /pid ${pid} /T /F`, () => {});
      } else {
        proc.kill("SIGTERM");
      }
    }
  });
  
  console.log(`[System] Terminated ${killCount} child process trees.`);
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

// Automatically open each active frontend in a separate browser tab as soon as it goes online
function autoOpenActivePorts() {
  const openedPorts = new Set();
  const openCmd = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";

  console.log("[System] Waiting for frontends to go online to automatically open them in browser tabs...");

  const interval = setInterval(async () => {
    let allOpened = true;
    for (const role of ROLES) {
      if (!openedPorts.has(role.fePort)) {
        allOpened = false;
        const online = await checkPort(role.fePort);
        if (online) {
          openedPorts.add(role.fePort);
          console.log(`[System] ${role.name} frontend is online on port ${role.fePort}. Opening in browser tab...`);
          exec(`${openCmd} http://localhost:${role.fePort}`, (err) => {
            if (err) {
              console.error(`[System Error] Failed to open http://localhost:${role.fePort}`);
            }
          });
        }
      }
    }

    if (allOpened) {
      clearInterval(interval);
      console.log("[System] All frontends have been successfully opened in separate browser tabs!");
    }
  }, 1000);
}

// Handle termination signals
process.on("SIGINT", cleanupAndExit);
process.on("SIGTERM", cleanupAndExit);

// Execute Orchestrator
startAllServices();
startHubServer(); // Enabled launchpad hub server!
autoOpenActivePorts();
