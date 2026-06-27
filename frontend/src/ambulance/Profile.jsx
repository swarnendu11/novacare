import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalDetailsTab from "../components/profile/PersonalDetailsTab";
import DocumentVerificationTab from "../components/profile/DocumentVerificationTab";
import AmbulanceDetailsTab from "../components/profile/AmbulanceDetailsTab";
import AmbulanceSpecsTab from "../components/profile/AmbulanceSpecsTab";
import MaintenanceRecordsTab from "../components/profile/MaintenanceRecordsTab";
import EmergencyAvailabilityTab from "../components/profile/EmergencyAvailabilityTab";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isOnline, setIsOnline] = useState(true);

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "documents", label: "Documents" },
    { id: "ambulance", label: "Ambulance Details" },
    { id: "specs", label: "Specifications" },
    { id: "maintenance", label: "Maintenance" },
    { id: "availability", label: "Availability & Tracking" }
  ];

  return (
    <div className="font-sans max-w-6xl mx-auto pb-10 space-y-6 animate-fade-in">
      <ProfileHeader user={user} isOnline={isOnline} />
      
      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto hide-scrollbar bg-white p-2 rounded-2xl shadow-sm border border-slate-200 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id 
                ? "bg-red-600 text-white shadow-md shadow-red-500/20" 
                : "text-slate-500 hover:bg-red-50 hover:text-red-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "personal" && <PersonalDetailsTab user={user} />}
        {activeTab === "documents" && <DocumentVerificationTab />}
        {activeTab === "ambulance" && <AmbulanceDetailsTab />}
        {activeTab === "specs" && <AmbulanceSpecsTab />}
        {activeTab === "maintenance" && <MaintenanceRecordsTab />}
        {activeTab === "availability" && <EmergencyAvailabilityTab isOnline={isOnline} setIsOnline={setIsOnline} />}
      </div>
    </div>
  );
}
