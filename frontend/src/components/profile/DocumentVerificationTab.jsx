import React, { useState } from "react";
import { FileText, Upload } from "lucide-react";
import toast from "react-hot-toast";

export default function DocumentVerificationTab() {
  const [documents] = useState([
    { id: "id1", name: "Government ID (Aadhaar/PAN)", number: "XXX-1234", status: "Verified" },
    { id: "id2", name: "Professional Registration/License", number: "REG-9999", status: "Pending" }
  ]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <h3 className="text-xl font-black flex items-center gap-2 mb-6"><FileText className="w-5 h-5 text-blue-500" /> Document Verification</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
            <h4 className="font-black text-slate-900">{doc.name}</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-bold w-max ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{doc.status}</span>
            <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2" onClick={() => toast.success("Upload triggered")}><Upload className="w-4 h-4"/> Upload</button>
          </div>
        ))}
      </div>
    </div>
  );
}