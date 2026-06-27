import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalDetailsTab from "../components/profile/PersonalDetailsTab";
import DocumentVerificationTab from "../components/profile/DocumentVerificationTab";

export default function NurseProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "documents", label: "Document Verification" }
  ];

  return (
    <div className="font-sans max-w-6xl mx-auto pb-10 space-y-6 animate-fade-in">
      <ProfileHeader user={user} title="Registered Nurse" idPrefix="NUR" />
      
      <div className="flex overflow-x-auto hide-scrollbar bg-white p-2 rounded-2xl shadow-sm border border-slate-200 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id ? "bg-teal-600 text-white shadow-md shadow-teal-500/20" : "text-slate-500 hover:bg-teal-50 hover:text-teal-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "personal" && <PersonalDetailsTab user={user} />}
        {activeTab === "documents" && <DocumentVerificationTab />}
      </div>
    </div>
  );
}