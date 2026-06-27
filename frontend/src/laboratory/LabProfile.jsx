import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Briefcase,
  Microscope,
  Activity,
  Calendar,
  Settings,
  Bell,
  Lock,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LabProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "qualifications", label: "Qualifications", icon: Award },
    { id: "equipment", label: "Assigned Equipment", icon: Microscope },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans pb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Profile Header (Hero Section) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="h-48 bg-gradient-to-r from-teal-800 to-emerald-700 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              <div className="relative group shrink-0">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-md overflow-hidden relative">
                  <User className="w-16 h-16 text-slate-400" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
              </div>
              
              {/* Profile Details */}
              <div className="text-center md:text-left pb-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">{user?.name || "Larry Lab"}</h1>
                <p className="text-teal-600 font-bold flex items-center justify-center md:justify-start gap-1.5 mt-1">
                  <ShieldCheck className="w-4 h-4" /> Lead Clinical Pathologist
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-slate-500 font-medium text-sm">
                  <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100"><MapPin className="w-4 h-4 text-slate-400" /> Central Lab, Block C</span>
                  <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100"><Briefcase className="w-4 h-4 text-slate-400" /> 8 Years Exp.</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto pb-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold transition-all border shadow-sm ${
                  isEditing ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-700 border-slate-200 hover:border-teal-500 hover:text-teal-600 hover:shadow"
                }`}
              >
                {isEditing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto hide-scrollbar bg-white p-2 rounded-2xl shadow-sm border border-slate-100 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === tab.id 
                ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-100/50" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-teal-600" : "text-slate-400"}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Contact Details */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                        <p className="font-medium text-slate-700">{user?.email || "alex.mercer@novacare.com"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                        <p className="font-medium text-slate-700">{user?.phone || "+91 98765 43210"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</p>
                        <p className="font-medium text-slate-700">Pathology & Microbiology</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Schedule Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-emerald-100 bg-emerald-50/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-emerald-800">Current Shift</span>
                      </div>
                      <span className="font-bold text-emerald-700 bg-white px-3 py-1 rounded-full shadow-sm text-sm">Morning (08:00 - 16:00)</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-slate-500 px-2 pt-2 border-t border-slate-100">
                      <span>Next Shift:</span>
                      <span className="text-slate-800 font-bold">Tomorrow, 08:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Bio */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Professional Summary</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Dedicated Clinical Pathologist with over 8 years of experience in high-volume laboratory settings. Specialized in molecular diagnostics and hematopathology. Proven track record of improving diagnostic turnaround times by 15% through workflow optimization and automated analyzer integration. Committed to maintaining the highest standards of quality control and precision in patient care.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-6 border border-teal-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-teal-600">
                        <Activity className="w-6 h-6" />
                      </div>
                      <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">This Month</span>
                    </div>
                    <p className="text-3xl font-black text-slate-800">1,284</p>
                    <p className="text-sm font-bold text-teal-700 mt-1">Tests Supervised</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Accuracy</span>
                    </div>
                    <p className="text-3xl font-black text-slate-800">99.9%</p>
                    <p className="text-sm font-bold text-blue-700 mt-1">Quality Assurance Score</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "qualifications" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-8">Education & Certifications</h3>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {/* Item 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-teal-50 text-teal-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-teal-600 text-sm">2018 - 2021</span>
                    </div>
                    <h4 className="font-black text-slate-800 text-lg">MD in Pathology</h4>
                    <p className="text-slate-500 font-medium text-sm mt-1">All India Institute of Medical Sciences (AIIMS)</p>
                  </div>
                </div>
                
                {/* Item 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-teal-50 text-teal-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-teal-600 text-sm">2021</span>
                    </div>
                    <h4 className="font-black text-slate-800 text-lg">Board Certification</h4>
                    <p className="text-slate-500 font-medium text-sm mt-1">Medical Council of India - Clinical Pathology</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-teal-50 text-teal-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-teal-600 text-sm">2012 - 2017</span>
                    </div>
                    <h4 className="font-black text-slate-800 text-lg">MBBS</h4>
                    <p className="text-slate-500 font-medium text-sm mt-1">Armed Forces Medical College (AFMC)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "equipment" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Assigned Equipment Auth</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Hematology Analyzer X1", status: "Authorized", id: "EQ-HEM-01" },
                  { name: "Biochemistry Auto-Analyzer", status: "Authorized", id: "EQ-BIO-04" },
                  { name: "Flow Cytometer", status: "Authorized", id: "EQ-CYT-02" },
                  { name: "Mass Spectrometer", status: "Pending Training", id: "EQ-MAS-01" },
                ].map((eq, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${eq.status === "Authorized" ? "bg-teal-50 text-teal-600" : "bg-amber-50 text-amber-600"}`}>
                      <Microscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{eq.name}</h4>
                      <p className="text-xs font-medium text-slate-400 mt-1">ID: {eq.id}</p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${eq.status === "Authorized" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {eq.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 max-w-3xl">
              <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Account Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Critical Alerts Notifications</h4>
                      <p className="text-sm font-medium text-slate-500">Receive SMS when an urgent test is ordered</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Two-Factor Authentication</h4>
                      <p className="text-sm font-medium text-slate-500">Secure your account with 2FA</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
