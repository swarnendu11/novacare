import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalDetailsTab from "../components/profile/PersonalDetailsTab";
import DocumentVerificationTab from "../components/profile/DocumentVerificationTab";
import ShiftDetailsTab from "../components/profile/ShiftDetailsTab";

export default function WardboyProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "shift", label: "Shift & Duties" },
    { id: "documents", label: "Document Verification" }
  ];

  return (
    <div className="font-sans max-w-6xl mx-auto pb-10 space-y-6 animate-fade-in">
      <ProfileHeader user={user} title="Ward Staff" idPrefix="WRD" />
      
      <div className="flex overflow-x-auto hide-scrollbar bg-white p-2 rounded-2xl shadow-sm border border-slate-200 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id ? "bg-zinc-700 text-white shadow-md shadow-zinc-500/20" : "text-slate-500 hover:bg-zinc-100 hover:text-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "personal" && <PersonalDetailsTab user={user} />}
        {activeTab === "shift" && <ShiftDetailsTab />}
        {activeTab === "documents" && <DocumentVerificationTab />}
      </div>
    </div>
  );
}