/**
 * NovaCare Ambulance — Live GPS Fleet Tracking
 * Production-ready real-time fleet coordination system using Google Maps API
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Ambulance,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Radio,
  Search,
  Signal,
  Siren,
  Users,
  Zap,
  Play,
  Square,
  Volume2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { ambulanceApi, emergencyApi } from "../services/mockData";
import Spinner from "../components/Spinner";

// Premium dark-slate theme styles for Google Maps
const MAP_THEME_DARK = [
  { "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0f172a" }, { "weight": 2 }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#475569" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
  { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#020617" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#334155" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#0f172a" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#475569" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#0f172a" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#475569" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#020617" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#334155" }] }
];

// Helper to determine status color
const getStatusColor = (status) => {
  switch (status) {
    case "available":
      return "#10B981"; // Emerald green
    case "on-call":
      return "#EF4444"; // Urgent red
    case "en-route":
    case "on-scene":
      return "#3B82F6"; // Electric blue
    case "maintenance":
    case "offline":
    default:
      return "#64748B"; // Neutral slate
  }
};

// Custom SVG Pin Generator representing an ambulance pin with status colored medical cross
const getCustomPinSvg = (status) => {
  const color = getStatusColor(status);
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>
    <circle cx="12" cy="9" r="5" fill="#FFFFFF"/>
    <path d="M14 8.5h-1.5V7a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.5H9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.5V12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.5H14a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5z" fill="${color}"/>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgString);
};

// Emergency site SVG Pin Generator (Pulsing critical alert marker)
const getEmergencyPinSvg = (priority) => {
  const color = priority === "critical" ? "#EF4444" : "#F59E0B";
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>
    <circle cx="12" cy="9" r="4.5" fill="#FFFFFF"/>
    <path d="M12 6.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 .75-.75zm0 5a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z" fill="${color}"/>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgString);
};

// Sidebar Fleet Card Component
function AmbulanceCard({ ambulance, isSelected, onClick }) {
  const statusColors = {
    available: "bg-emerald-500",
    "on-call": "bg-red-500",
    "en-route": "bg-blue-500",
    "on-scene": "bg-blue-600",
    maintenance: "bg-amber-500",
    offline: "bg-slate-400",
  };

  return (
    <button
      onClick={() => onClick(ambulance)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? "border-blue-500 bg-blue-50/70 shadow-sm"
          : "border-slate-200 hover:border-blue-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-3.5 h-3.5 rounded-full ${statusColors[ambulance.status] || "bg-slate-400"} ${
          ambulance.status === "on-call" ? "animate-ping" : ""
        }`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-extrabold text-slate-900">{ambulance.id}</p>
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black text-slate-600 uppercase">
              {ambulance.type}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5">{ambulance.location}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[90px] font-medium">{ambulance.driver || "Unassigned"}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-bold text-slate-700">Fuel: </span>
          <span className={`font-black ${ambulance.fuel < 25 ? "text-red-500" : "text-emerald-600"}`}>
            {ambulance.fuel}%
          </span>
        </div>
      </div>
    </button>
  );
}

// Google Maps GPS tracking component
// Google Maps GPS tracking component replaced with premium, zero-key Leaflet.js maps
function FleetGoogleMap({
  ambulances,
  emergencies,
  selectedAmbulance,
  onAmbulanceClick,
}) {
  const mapContainerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Map feature controls
  const [mapType, setMapType] = useState("default"); // "default" | "satellite"
  const [showLabels, setShowLabels] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [measureDistance, setMeasureDistance] = useState(null);

  // References to keep track of active map objects across renders
  const mapRef = useRef(null);
  const markersRef = useRef({}); // Registry: { [ambulanceId]: L.Marker }
  const emergencyMarkersRef = useRef({}); // Registry: { [emergencyId]: L.Marker }
  const polylineRef = useRef(null); // Active path route Polyline
  const tileLayerRef = useRef(null); // Base tile layer reference
  const trafficOverlayRef = useRef(null);
  const transitOverlayRef = useRef(null);
  const measureLayerRef = useRef(null); // Measure polyline
  const measureMarkersRef = useRef([]); // Measure click markers
  const panelRef = useRef(null);

  // Center coordinate - Urban hub (Kolkata, West Bengal coordinates)
  const defaultCenter = { lat: 22.5726, lng: 88.3639 };

  // 1. Asynchronously Load Leaflet JS & CSS
  useEffect(() => {
    if (window.L) {
      setMapLoaded(true);
      return;
    }

    const cssId = "leaflet-map-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const scriptId = "leaflet-map-script";
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        setMapLoaded(true);
      };
      script.onerror = () => {
        setMapError(true);
      };
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.L) {
          setMapLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // 2. Initialize the Leaflet Map Instance
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || mapRef.current || !window.L) return;

    try {
      const L = window.L;
      
      const mapInstance = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([defaultCenter.lat, defaultCenter.lng], 13.5);

      // Bright, colorful daytime tiles using CartoDB Voyager
      const baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors ' +
          '&copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
      }).addTo(mapInstance);

      tileLayerRef.current = baseLayer;
      mapRef.current = mapInstance;

      // Close panel on outside click
      mapInstance.on('click', () => {
        setShowPanel(false);
      });
    } catch (err) {
      console.error("Failed to initialize Leaflet Map object:", err);
      setMapError(true);
    }
  }, [mapLoaded]);

  // Tile Layer Swap Effect — triggered when mapType or showLabels changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current || !window.L) return;
    const L = window.L;
    const map = mapRef.current;

    // Remove current base tile layer
    tileLayerRef.current.remove();

    let newUrl;
    if (mapType === "satellite") {
      // Esri World Imagery (satellite)
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      tileLayerRef.current = L.tileLayer(newUrl, {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      }).addTo(map);

      // Add label overlay on top of satellite if showLabels enabled
      if (showLabels) {
        if (transitOverlayRef.current) transitOverlayRef.current.remove();
        transitOverlayRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
          maxZoom: 19, subdomains: 'abcd', pane: 'overlayPane',
        }).addTo(map);
      } else {
        if (transitOverlayRef.current) { transitOverlayRef.current.remove(); transitOverlayRef.current = null; }
      }
    } else {
      // Default — CartoDB Voyager (with or without labels)
      if (showLabels) {
        newUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      } else {
        newUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png';
      }
      tileLayerRef.current = L.tileLayer(newUrl, {
        maxZoom: 19, subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      }).addTo(map);
      if (transitOverlayRef.current) { transitOverlayRef.current.remove(); transitOverlayRef.current = null; }
    }
  }, [mapType, showLabels]);

  // Traffic overlay (OpenStreetMap-based heatmap simulation via tile overlay)
  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;
    const map = mapRef.current;
    if (showTraffic) {
      if (!trafficOverlayRef.current) {
        // Stamen Toner Roads as a semi-transparent traffic-style overlay
        trafficOverlayRef.current = L.tileLayer(
          'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}{r}.png',
          { maxZoom: 19, opacity: 0.35, subdomains: 'abcd',
            attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data OpenStreetMap' }
        ).addTo(map);
      }
    } else {
      if (trafficOverlayRef.current) { trafficOverlayRef.current.remove(); trafficOverlayRef.current = null; }
    }
  }, [showTraffic]);

  // Transit overlay (bike/transit route layer)
  useEffect(() => {
    if (!mapRef.current || !window.L || mapType === 'satellite') return;
    const L = window.L;
    const map = mapRef.current;
    if (showTransit) {
      if (!transitOverlayRef.current) {
        // OpenCycleMap tile layer for transit/bike routes
        transitOverlayRef.current = L.tileLayer(
          'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
          { maxZoom: 19, opacity: 0.6, subdomains: 'abc',
            attribution: 'CyclOSM map tiles — OpenStreetMap contributors' }
        ).addTo(map);
      }
    } else {
      if (transitOverlayRef.current) { transitOverlayRef.current.remove(); transitOverlayRef.current = null; }
    }
  }, [showTransit]);

  // Measure distance tool
  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const map = mapRef.current;
    const L = window.L;

    if (!isMeasuring) {
      // Clean up any existing measure layer
      measureMarkersRef.current.forEach(m => m.remove());
      measureMarkersRef.current = [];
      if (measureLayerRef.current) { measureLayerRef.current.remove(); measureLayerRef.current = null; }
      setMeasurePoints([]);
      setMeasureDistance(null);
      map.getContainer().style.cursor = '';
      return;
    }

    map.getContainer().style.cursor = 'crosshair';

    const handleMeasureClick = (e) => {
      if (!isMeasuring) return;
      const pt = [e.latlng.lat, e.latlng.lng];
      setMeasurePoints(prev => {
        const next = [...prev, pt];

        // Draw dot marker
        const dot = L.circleMarker(pt, {
          radius: 5, color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 1, weight: 2,
        }).addTo(map);
        measureMarkersRef.current.push(dot);

        // Draw/update line
        if (next.length >= 2) {
          if (measureLayerRef.current) measureLayerRef.current.remove();
          measureLayerRef.current = L.polyline(next, {
            color: '#3B82F6', weight: 2.5, dashArray: '6 4',
          }).addTo(map);

          // Calculate total distance in km
          let total = 0;
          for (let i = 1; i < next.length; i++) {
            total += map.distance(next[i - 1], next[i]);
          }
          setMeasureDistance((total / 1000).toFixed(2));
        }
        return next;
      });
    };

    map.on('click', handleMeasureClick);
    return () => { map.off('click', handleMeasureClick); };
  }, [isMeasuring]);

  // Helper: Compile premium custom styled HTML for InfoWindow popup card
  const generateInfoWindowContent = (vehicle) => {
    const statusLabel = vehicle.status.replace("-", " ").toUpperCase();
    const fuelColor = vehicle.fuel < 25 ? "#EF4444" : "#10B981";
    const statusColor = getStatusColor(vehicle.status);
    const statusBg = `${statusColor}18`;

    return `
      <div style="font-family: 'Outfit', sans-serif; padding: 4px; min-width: 210px; color: #f8fafc;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; gap: 8px;">
          <span style="font-size: 15px; font-weight: 900; color: #ffffff;">${vehicle.id}</span>
          <span style="font-size: 9px; font-weight: 900; background: #334155; color: #cbd5e1; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
            ${vehicle.type}
          </span>
        </div>
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
          <span style="font-weight: 700; color: #cbd5e1;">Driver:</span> ${vehicle.driver || "Unassigned"}
        </div>
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
          <span style="font-weight: 700; color: #cbd5e1;">Odometer:</span> ${vehicle.odometer ? vehicle.odometer.toLocaleString() + " km" : "N/A"}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 11px; font-weight: 700; color: #94a3b8;">Fleet Status:</span>
          <span style="font-size: 10px; font-weight: 900; color: ${statusColor}; background: ${statusBg}; border: 1.5px solid ${statusColor}; padding: 1px 7px; border-radius: 99px;">
            ${statusLabel}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 4px;">
          <span>Fuel Reserve</span>
          <span style="font-weight: 900; color: ${fuelColor}">${vehicle.fuel}%</span>
        </div>
        <div style="width: 100%; height: 5px; background: #334155; border-radius: 99px; overflow: hidden;">
          <div style="width: ${vehicle.fuel}%; height: 100%; background: ${fuelColor}; border-radius: 99px;"></div>
        </div>
      </div>
    `;
  };

  const createCustomPinIcon = (status) => {
    const color = getStatusColor(status);
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="12" cy="9" r="5" fill="#FFFFFF"/>
      <path d="M14 8.5h-1.5V7a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.5H9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.5V12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.5H14a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5z" fill="${color}"/>
    </svg>`;
    
    return window.L.divIcon({
      html: svgString,
      className: 'custom-leaflet-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -36]
    });
  };

  const createEmergencyPinIcon = (priority) => {
    const color = priority === "critical" ? "#EF4444" : "#F59E0B";
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="12" cy="9" r="4.5" fill="#FFFFFF"/>
      <path d="M12 6.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 .75-.75zm0 5a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z" fill="${color}"/>
    </svg>`;
    
    return window.L.divIcon({
      html: svgString,
      className: 'custom-leaflet-emergency-marker',
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -30]
    });
  };

  // 3. Smooth Interpolation Animation to Slide Markers without flickering
  const animateMarkerSmoothly = (marker, startLat, startLng, endLat, endLng) => {
    const duration = 900; // 900 milliseconds interpolation path slide
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth cubic ease-in-out curve
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentLat = startLat + (endLat - startLat) * ease;
      const currentLng = startLng + (endLng - startLng) * ease;

      if (window.L && marker) {
        marker.setLatLng([currentLat, currentLng]);

        // Dynamic polyline route re-draw if this marker belongs to the currently selected ambulance
        if (selectedAmbulance && marker.ncId === selectedAmbulance.id) {
          redrawRoutePolyline(currentLat, currentLng);
        }
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  // Redraws the Polyline Route between the active selected ambulance and its current emergency
  const redrawRoutePolyline = (ambLat, ambLng) => {
    if (!mapRef.current || !window.L) return;

    const L = window.L;
    // Find active emergency assigned to selected vehicle
    const activeEmergency = emergencies.find(
      (e) => e.assignedAmbulance === selectedAmbulance.id && e.status !== "completed"
    );

    if (activeEmergency) {
      const latlngs = [
        [ambLat, ambLng],
        [activeEmergency.pickupLat, activeEmergency.pickupLng]
      ];

      if (!polylineRef.current) {
        polylineRef.current = L.polyline(latlngs, {
          color: "#3B82F6",
          weight: 4,
          opacity: 0.8,
          dashArray: "8, 6",
        }).addTo(mapRef.current);
      } else {
        polylineRef.current.setLatLngs(latlngs);
        polylineRef.current.addTo(mapRef.current);
      }
    } else {
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }
    }
  };

  // 4. Expose Global Event Handler to receive WebSocket updates
  useEffect(() => {
    // Globally register WebSocket or stream listener hook
    window.updateAmbulancePosition = (ambulanceId, nextLat, nextLng, status, fuel) => {
      if (!mapLoaded || !window.L || !mapRef.current) return;

      const marker = markersRef.current[ambulanceId];
      if (marker) {
        const startPosition = marker.getLatLng();
        const startLat = startPosition.lat;
        const startLng = startPosition.lng;

        // Trigger ease-in-out translation animation
        animateMarkerSmoothly(marker, startLat, startLng, nextLat, nextLng);

        // Update status icon coloring if status changes
        if (status) {
          marker.setIcon(createCustomPinIcon(status));
          marker.ncStatus = status;
        }

        // Dynamically update InfoWindow content if currently open
        if (marker.isPopupOpen()) {
          // Fetch existing matching ambulance fields
          const updatedVehicle = {
            id: ambulanceId,
            type: marker.ncType,
            driver: marker.ncDriver,
            fuel: fuel ?? marker.ncFuel,
            status: status || marker.ncStatus,
            odometer: marker.ncOdometer
          };
          marker.setPopupContent(generateInfoWindowContent(updatedVehicle));
        }

        // Update stored metadata properties
        if (fuel !== undefined) marker.ncFuel = fuel;
      }
    };

    return () => {
      delete window.updateAmbulancePosition;
    };
  }, [mapLoaded, selectedAmbulance, emergencies]);

  // 5. Update Markers when Ambulance or Emergency state changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.L) return;

    const currentMap = mapRef.current;
    const L = window.L;

    // A. SYNC AMBULANCE VEHICLE MARKERS
    ambulances.forEach((amb) => {
      let marker = markersRef.current[amb.id];

      if (!marker) {
        // Create new Marker
        marker = L.marker([amb.lat, amb.lng], {
          icon: createCustomPinIcon(amb.status),
        }).addTo(currentMap);

        // Bind customized pop-up window
        marker.bindPopup(generateInfoWindowContent(amb), {
          className: 'custom-leaflet-popup',
        });

        // Click event to sync selection
        marker.on('click', () => {
          onAmbulanceClick(amb);
        });

        // Store custom properties on marker for InfoWindow binding
        marker.ncId = amb.id;
        marker.ncType = amb.type;
        marker.ncDriver = amb.driver;
        marker.ncFuel = amb.fuel;
        marker.ncStatus = amb.status;
        marker.ncOdometer = amb.odometer;

        markersRef.current[amb.id] = marker;
      } else {
        // Check if coordinates have updated (jump prevention)
        const currentPos = marker.getLatLng();
        const coordsChanged = 
          Math.abs(currentPos.lat - amb.lat) > 0.0001 || 
          Math.abs(currentPos.lng - amb.lng) > 0.0001;

        if (coordsChanged) {
          animateMarkerSmoothly(marker, currentPos.lat, currentPos.lng, amb.lat, amb.lng);
        } else {
          marker.setLatLng([amb.lat, amb.lng]);
        }

        // Update details
        marker.setIcon(createCustomPinIcon(amb.status));
        marker.setPopupContent(generateInfoWindowContent(amb));
        marker.ncStatus = amb.status;
        marker.ncFuel = amb.fuel;
        marker.ncDriver = amb.driver;
      }
    });

    // Cleanup decommissioned ambulances
    Object.keys(markersRef.current).forEach((key) => {
      if (!ambulances.find((a) => a.id === key)) {
        markersRef.current[key].remove();
        delete markersRef.current[key];
      }
    });

    // B. SYNC EMERGENCY COORDINATES
    emergencies
      .filter((e) => e.status !== "completed")
      .forEach((emergency) => {
        let emMarker = emergencyMarkersRef.current[emergency.id];

        if (!emMarker) {
          emMarker = L.marker([emergency.pickupLat, emergency.pickupLng], {
            icon: createEmergencyPinIcon(emergency.priority),
          }).addTo(currentMap);

          emMarker.bindPopup(`
            <div style="font-family: 'Outfit', sans-serif; padding: 4px; min-width: 180px; color: #f8fafc; line-height: 1.4;">
              <div style="font-weight: 900; color: #EF4444; font-size: 14px; margin-bottom: 4px;">🚨 ${emergency.type}</div>
              <div style="font-size: 11px; font-weight: 800; background: #FEE2E218; color: #EF4444; width: fit-content; padding: 1px 6px; border: 1px solid #EF4444; border-radius: 4px; text-transform: uppercase; margin-bottom: 8px;">
                ${emergency.priority} Priority
              </div>
              <div style="font-size: 12px; margin-bottom: 4px; color: #94a3b8;"><strong style="color: #cbd5e1;">Patient:</strong> ${emergency.patient}</div>
              <div style="font-size: 12px; margin-bottom: 4px; color: #94a3b8;"><strong style="color: #cbd5e1;">Address:</strong> ${emergency.pickup}</div>
              <div style="font-size: 11px; margin-top: 6px; padding-top: 6px; border-top: 1px solid #334155; color: #3b82f6; font-weight: 700;">
                Assigned Unit: ${emergency.assignedAmbulance || "Pending Dispatch"}
              </div>
            </div>
          `, {
            className: 'custom-leaflet-popup',
          });

          emergencyMarkersRef.current[emergency.id] = emMarker;
        } else {
          emMarker.setLatLng([emergency.pickupLat, emergency.pickupLng]);
        }
      });

    // Cleanup completed emergencies
    Object.keys(emergencyMarkersRef.current).forEach((key) => {
      if (!emergencies.find((e) => e.id === key && e.status !== "completed")) {
        emergencyMarkersRef.current[key].remove();
        delete emergencyMarkersRef.current[key];
      }
    });

    // C. SYNC ACTIVE ROUTE PATH POLYLINE
    if (selectedAmbulance) {
      const activeMarker = markersRef.current[selectedAmbulance.id];
      if (activeMarker) {
        const pos = activeMarker.getLatLng();
        redrawRoutePolyline(pos.lat, pos.lng);
      }
    } else {
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }
    }
  }, [ambulances, emergencies, selectedAmbulance, mapLoaded]);

  // 6. Handle focus transitions when active selected ambulance changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !selectedAmbulance || !window.L) return;

    const targetMarker = markersRef.current[selectedAmbulance.id];
    if (targetMarker) {
      const pos = targetMarker.getLatLng();
      
      // Pan camera smoothly to center around the active ambulance
      mapRef.current.panTo(pos, { animate: true, duration: 1 });
      
      // Open InfoWindow automatically for selected ambulance
      targetMarker.openPopup();
    }
  }, [selectedAmbulance]);

  // Graceful Error State Fallback UI (Simulating high-fidelity map dashboard)
  if (mapError) {
    return (
      <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-red-950/50 border border-red-500/30 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-white font-black text-xl mb-1">Fleet Maps Loading Sandbox</h3>
        <p className="text-slate-400 font-bold max-w-sm text-sm mb-4">
          Tile service interrupted. GPS simulation coordinates are live!
        </p>
        <div className="w-full max-w-md p-4 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-2xl text-left space-y-3 text-xs text-slate-300 font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-400">Sandbox Dispatch Core:</span>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md font-black">ACTIVE</span>
          </div>
          <div className="space-y-1">
            {ambulances.map((amb) => (
              <div key={amb.id} className="flex justify-between">
                <span className="font-black text-white">{amb.id} ({amb.type})</span>
                <span className="text-slate-500">Lat: {amb.lat.toFixed(5)}, Lng: {amb.lng.toFixed(5)}</span>
                <span className="font-bold uppercase" style={{ color: getStatusColor(amb.status) }}>{amb.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-slate-950">
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          color: #f8fafc !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5) !important;
          border: 1px solid #334155 !important;
          font-family: 'Outfit', sans-serif !important;
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
          border: 1px solid #334155 !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #94a3b8 !important;
          padding: 8px 8px 0 0 !important;
        }
        .leaflet-container a.leaflet-popup-close-button:hover {
          color: #f8fafc !important;
        }
        .custom-leaflet-marker, .custom-leaflet-emergency-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>
      
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

      {/* Floating Status Compass HUD Overlay */}
      <AnimatePresence>
        {selectedAmbulance && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-slate-700/60 min-w-[250px] font-sans pointer-events-auto"
            style={{ zIndex: 10 }}
          >
            <div className="flex items-center gap-3 mb-3 pb-2 border-b border-slate-800">
              <div className="w-9 h-9 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                <Ambulance className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-black text-sm text-white tracking-tight">{selectedAmbulance.id}</p>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase">{selectedAmbulance.type} UNIT</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Hub</span>
                <span className="font-bold text-white truncate max-w-[120px]">{selectedAmbulance.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Driver</span>
                <span className="font-bold text-white">{selectedAmbulance.driver || "Unassigned"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Latitude</span>
                <span className="font-mono text-slate-300 font-semibold">{selectedAmbulance.lat.toFixed(5)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Longitude</span>
                <span className="font-mono text-slate-300 font-semibold">{selectedAmbulance.lng.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Condition</span>
                <span className="font-bold capitalize text-emerald-400">{selectedAmbulance.condition}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dynamic Map Legend HUD */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 rounded-xl p-3 shadow-xl border border-slate-200 font-sans" style={{ zIndex: 10 }}>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Live Telemetry
        </p>
        <div className="flex flex-col gap-1.5 text-xs font-bold">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span>En Route / On Scene</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span>Emergency (On Call)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-2.5 h-2.5 bg-slate-400 rounded-full" />
            <span>Offline</span>
          </div>
        </div>
      </div>

      {/* Measure Distance HUD */}

      {isMeasuring && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-md text-white rounded-xl px-4 py-2 shadow-xl border border-blue-400/40 font-sans flex items-center gap-3" style={{ zIndex: 20 }}>
          <span className="text-xs font-black tracking-tight">📏 Measure Mode — click points on map</span>
          {measureDistance && (
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-black">{measureDistance} km</span>
          )}
          <button
            onClick={() => { setIsMeasuring(false); }}
            className="ml-1 text-white/70 hover:text-white text-base leading-none font-black transition-colors"
          >✕</button>
        </div>
      )}

      {/* Map Controls Button */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2" style={{ zIndex: 20 }} ref={panelRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setShowPanel(p => !p); }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border transition-all font-black text-base ${
            showPanel
              ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/40'
              : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
          }`}
          title="Map features"
        >⋮</button>

        {/* Slide-in Feature Panel */}
        {showPanel && (
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-56 overflow-hidden animate-slide-up"
          >
            {/* Map Type */}
            <div className="px-4 pt-4 pb-2 border-b border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Map Type</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setMapType('default')}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-[11px] font-black transition-all ${
                    mapType === 'default' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">🗺️</span> Default
                </button>
                <button
                  onClick={() => setMapType('satellite')}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-[11px] font-black transition-all ${
                    mapType === 'satellite' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">🛰️</span> Satellite
                </button>
              </div>
            </div>

            {/* Map Details */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Map Details</p>
              <div className="space-y-1">
                {[
                  { label: 'Traffic', icon: '🚦', active: showTraffic, toggle: () => setShowTraffic(p => !p) },
                  { label: 'Transit', icon: '🚌', active: showTransit, toggle: () => setShowTransit(p => !p) },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.toggle}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm font-bold transition-all ${
                      item.active ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span> {item.label}
                    </span>
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center text-[9px] transition-all ${
                      item.active ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300'
                    }`}>
                      {item.active && '✓'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Map Tools */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Map Tools</p>
              <button
                onClick={() => { setIsMeasuring(p => !p); setShowPanel(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold transition-all ${
                  isMeasuring ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>📏</span> Measure Distance
              </button>
            </div>

            {/* Options */}
            <div className="px-4 py-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Options</p>
              <button
                onClick={() => setShowLabels(p => !p)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm font-bold transition-all ${
                  showLabels ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-600 hover:border-slate-200'
                }`}
              >
                <span className="flex items-center gap-2"><span>🏷️</span> Labels</span>
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center text-[9px] ${
                  showLabels ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300'
                }`}>
                  {showLabels && '✓'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Active fleet tracking core view
export default function Tracking() {
  const [loading, setLoading] = useState(true);
  const [ambulances, setAmbulances] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Real-time Event Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationIntervalRef = useRef(null);

  // Load initial telemetry database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [ambs, ems] = await Promise.all([
          ambulanceApi.getAll(),
          emergencyApi.getActive(),
        ]);
        setAmbulances(ambs);
        setEmergencies(ems);
        if (ambs.length > 0) setSelectedAmbulance(ambs[0]);
      } catch {
        toast.error("Failed to connect to regional telemetry feed");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter fleet list
  const filteredAmbulances = ambulances.filter((amb) => {
    const matchesSearch =
      amb.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (amb.driver && amb.driver.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filter === "all" || amb.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Select ambulance card action
  const handleAmbulanceSelect = (amb) => {
    setSelectedAmbulance(amb);
  };

  // 6. Real-time Live GPS Stream Simulator Panel
  const startTelemetrySimulation = () => {
    if (isSimulating) return;

    setIsSimulating(true);
    toast.success("Live real-time telemetry feed connected", {
      icon: "🔌",
      style: { background: "#0f172a", color: "#fff" }
    });

    // Start movement loop (Simulates a telemetry packet dispatching every 1.5 seconds)
    simulationIntervalRef.current = setInterval(() => {
      setAmbulances((prevAmbulances) => {
        // Choose one active deployed or transit vehicle to drive towards emergency
        const activeUnits = prevAmbulances.filter(a => ["on-call", "en-route", "on-scene"].includes(a.status));
        const vehicleToMove = activeUnits.length > 0 
          ? activeUnits[Math.floor(Math.random() * activeUnits.length)]
          : prevAmbulances.find(a => a.status === "available"); // fallback to moving available unit

        if (!vehicleToMove) return prevAmbulances;

        // Slightly nudge coordinates towards an active emergency pickup spot or make a random walk
        const matchingEmergency = emergencies.find(
          (e) => e.assignedAmbulance === vehicleToMove.id && e.status !== "completed"
        );

        let deltaLat = (Math.random() - 0.5) * 0.003;
        let deltaLng = (Math.random() - 0.5) * 0.003;

        // If there is an active route, move towards it directly!
        if (matchingEmergency) {
          const latDiff = matchingEmergency.pickupLat - vehicleToMove.lat;
          const lngDiff = matchingEmergency.pickupLng - vehicleToMove.lng;
          
          // Nudge coordinate by 8% of total distance remaining for high-fidelity convergence
          deltaLat = latDiff * 0.12;
          deltaLng = lngDiff * 0.12;

          // If extremely close, simulate target arrival!
          if (Math.abs(latDiff) < 0.0005 && Math.abs(lngDiff) < 0.0005) {
            vehicleToMove.status = "on-scene";
            toast(`Unit ${vehicleToMove.id} arrived on-scene`, {
              icon: "🚑",
              duration: 3000,
            });
          }
        }

        const nextLat = vehicleToMove.lat + deltaLat;
        const nextLng = vehicleToMove.lng + deltaLng;
        
        // Dynamic status transition
        let nextStatus = vehicleToMove.status;
        if (vehicleToMove.status === "available" && Math.random() > 0.8) {
          nextStatus = "en-route";
          toast(`Emergency Dispatch: Unit ${vehicleToMove.id} dispatched en-route`, {
            icon: "🚨"
          });
        }

        // Simulate fuel burn
        const nextFuel = Math.max(1, vehicleToMove.fuel - (Math.random() > 0.7 ? 1 : 0));

        // PUSH telemetric update packet to the global window handler representing WebSocket listener!
        if (window.updateAmbulancePosition) {
          window.updateAmbulancePosition(vehicleToMove.id, nextLat, nextLng, nextStatus, nextFuel);
        }

        // Update local state to sync sidebar UI values
        const updatedList = prevAmbulances.map((a) => {
          if (a.id === vehicleToMove.id) {
            return {
              ...a,
              lat: nextLat,
              lng: nextLng,
              status: nextStatus,
              fuel: nextFuel,
              location: `Transit - GPS Lat: ${nextLat.toFixed(4)}`
            };
          }
          return a;
        });

        // Keep active selected details panel synced
        const matchSelected = updatedList.find(a => selectedAmbulance && a.id === selectedAmbulance.id);
        if (matchSelected) {
          setSelectedAmbulance(matchSelected);
        }

        return updatedList;
      });
    }, 1600);
  };

  const stopTelemetrySimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsSimulating(false);
    toast.error("Telemetry feed connection disconnected", {
      icon: "🔌"
    });
  };

  // Cleanup simulation loop on unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px]">
        <Spinner size="xl" />
        <p className="mt-8 text-slate-500 font-extrabold uppercase tracking-widest animate-pulse">
          Connecting Regional GPS Radar...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-6 animate-fade-in font-['Outfit',sans-serif] h-[calc(100vh-140px)]">
      
      {/* Command Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Navigation className="w-8 h-8 text-blue-500 animate-pulse" />
            Live Tracking
          </h1>
          <p className="text-slate-400 font-bold mt-1 text-sm">
            Emergency Command Center Fleet Telemetry
          </p>
        </div>

        {/* Real-time Telemetry Simulator Switcher */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
            <Signal className={`w-3.5 h-3.5 ${isSimulating ? "text-emerald-500 animate-pulse" : "text-slate-600"}`} />
            Status: {isSimulating ? "Simulated Stream Active" : "Static Sandbox"}
          </span>
          {isSimulating ? (
            <button
              onClick={stopTelemetrySimulation}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Square className="w-4 h-4" /> Stop Stream
            </button>
          ) : (
            <button
              onClick={startTelemetrySimulation}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" /> Start Stream
            </button>
          )}
        </div>
      </div>

      {/* Main Command Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        
        {/* Left Side: Fleet List Controls */}
        <div className="lg:col-span-1 flex flex-col min-h-0 bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          
          {/* Search, Filter Controls */}
          <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ambulance ID / driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-extrabold text-slate-700 tracking-wide uppercase"
              >
                <option value="all">📁 All Vehicle Status</option>
                <option value="available">🟢 Available units</option>
                <option value="on-call">🔴 On-Call emergencies</option>
                <option value="en-route">🔵 En-Route transit</option>
                <option value="on-scene">🔵 On-Scene units</option>
                <option value="maintenance">🟡 Maintenance holds</option>
              </select>
            </div>
          </div>

          {/* Scrolling Fleet List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/20">
            {filteredAmbulances.length > 0 ? (
              filteredAmbulances.map((amb) => (
                <AmbulanceCard
                  key={amb.id}
                  ambulance={amb}
                  isSelected={selectedAmbulance?.id === amb.id}
                  onClick={handleAmbulanceSelect}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-black text-slate-900">No Vehicles Found</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Verify your query or status filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: High Fidelity Google Map Canvas */}
        <div className="lg:col-span-3 min-h-0 flex flex-col">
          <div className="flex-1 rounded-3xl overflow-hidden shadow-lg border border-slate-200 relative bg-slate-950">
            <FleetGoogleMap
              ambulances={ambulances}
              emergencies={emergencies}
              selectedAmbulance={selectedAmbulance}
              onAmbulanceClick={handleAmbulanceSelect}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}
