import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalDetailsTab from "../components/profile/PersonalDetailsTab";
import PharmacyDetailsTab from "../components/profile/PharmacyDetailsTab";
import DocumentVerificationTab from "../components/profile/DocumentVerificationTab";

export default function PharmacyProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "pharmacy", label: "Pharmacy Details" },
    { id: "documents", label: "Document Verification" }
  ];

  return (
    <div className="font-sans max-w-6xl mx-auto pb-10 space-y-6">
      <ProfileHeader user={user} />

      <div className="flex overflow-x-auto bg-white p-2 rounded-2xl shadow-sm border border-slate-200 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "personal" && <PersonalDetailsTab user={user} />}
        {activeTab === "pharmacy" && <PharmacyDetailsTab />}
        {activeTab === "documents" && <DocumentVerificationTab />}
      </div>
    </div>
  );
}
