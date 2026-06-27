/**
 * Code Blue / Emergency — NovaCare Nurse
 * Quick access to emergency protocols and triggering alerts.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  PhoneCall,
  Activity,
  HeartPulse,
  Syringe,
  Radio,
  Clock,
  FileText,
  CheckCircle2
} from "lucide-react";

export default function CodeBlue() {
  const [activeAlert, setActiveAlert] = useState(null);
  const [room, setRoom] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const triggerAlert = (type) => {
    if (!room) {
      toast.error("Please specify a Room/Bed first!");
      return;
    }
    
    setActiveAlert(type);
    toast.error(`🚨 ${type.toUpperCase()} TRIGGERED IN ${room}! 🚨`, {
      style: {
        background: '#7f1d1d',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '16px',
        padding: '16px'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#7f1d1d',
      },
      duration: 5000,
    });

    // Start CPR/Code timer
    setTimer(0);
    if (intervalId) clearInterval(intervalId);
    const id = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setIntervalId(id);
  };

  const cancelAlert = () => {
    setActiveAlert(null);
    setRoom("");
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setTimer(0);
    toast.success("Emergency Alert stood down.", { icon: "🛑" });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto pb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className={`rounded-3xl p-7 text-white shadow-xl relative overflow-hidden transition-all duration-500 ${activeAlert ? 'bg-red-700 animate-pulse' : 'bg-gradient-to-r from-red-900 to-rose-900'}`}>
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-red-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl text-white font-black tracking-tight flex items-center gap-3 mb-2">
              <AlertTriangle className="w-8 h-8 text-red-300" /> Emergency Protocols
            </h2>
            <p className="text-red-200 font-medium">
              Trigger Code Blue or Rapid Response Team (RRT) immediately.
            </p>
          </div>
          
          {activeAlert && (
            <div className="bg-black/40 border border-white/20 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-md">
              <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-xl">
                <Clock className="w-6 h-6 text-red-300 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-red-200">Code Timer</p>
                <p className="text-3xl font-black tabular-nums">{formatTime(timer)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Trigger Section */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`bg-white rounded-3xl p-8 border shadow-lg ${activeAlert ? 'border-red-500 shadow-red-500/20' : 'border-slate-200'}`}>
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Radio className="w-6 h-6 text-red-500" /> Broadcast Alert
          </h3>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-600 mb-2">Location / Room Number</label>
            <input 
              type="text" 
              value={room}
              onChange={e => setRoom(e.target.value)}
              disabled={activeAlert !== null}
              placeholder="e.g. ICU-04, Ward A Bed 12" 
              className={`w-full px-5 py-4 rounded-xl border outline-none font-bold text-lg transition-all ${activeAlert ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-50 border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-slate-800'}`}
            />
          </div>

          {!activeAlert ? (
            <div className="space-y-4">
              <button 
                onClick={() => triggerAlert('Code Blue')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-600/30 hover:-translate-y-1"
              >
                <HeartPulse className="w-7 h-7" /> TRIGGER CODE BLUE
              </button>
              
              <button 
                onClick={() => triggerAlert('Rapid Response')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/30 hover:-translate-y-1"
              >
                <Activity className="w-7 h-7" /> TRIGGER RAPID RESPONSE
              </button>
            </div>
          ) : (
            <button 
              onClick={cancelAlert}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-800/30"
            >
              <CheckCircle2 className="w-7 h-7" /> STAND DOWN / CODE OVER
            </button>
          )}
        </motion.div>

        {/* Protocol Checklist */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-slate-500" /> Immediate Protocols
          </h3>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-start shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black flex-shrink-0">1</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Call for Help & Hit Code Button</h4>
                <p className="text-xs text-slate-500 mt-1">Ensure the emergency response team is notified immediately.</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-start shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black flex-shrink-0">2</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Initiate High-Quality CPR</h4>
                <p className="text-xs text-slate-500 mt-1">Start compressions hard and fast at 100-120 per minute. Allow full chest recoil.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-start shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black flex-shrink-0">3</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Attach Defibrillator / AED</h4>
                <p className="text-xs text-slate-500 mt-1">Apply pads as soon as the crash cart arrives. Follow voice prompts or doctor's orders.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-start shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black flex-shrink-0">4</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Prepare Emergency Meds</h4>
                <p className="text-xs text-slate-500 mt-1">Epinephrine 1mg every 3-5 mins. Amiodarone if indicated.</p>
              </div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
