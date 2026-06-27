import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CreditCard,
  IndianRupee,
  Printer,
  Percent,
  FileText,
  CheckCircle2,
  FileCheck2,
  History,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";

export default function ReceptionDeskBilling() {
  const [patientId, setPatientId] = useState("");
  const [serviceType, setServiceType] = useState("Consultation");
  const [amount, setAmount] = useState(800);
  const [discount, setDiscount] = useState(0);
  const [method, setMethod] = useState("card");
  const [status, setStatus] = useState("pending"); // pending | processing | success
  const [view, setView] = useState("pos"); // pos | history

  const finalAmount = amount - amount * (discount / 100);
  const invoiceId = `INV-${Math.floor(10000 + Math.random() * 90000)}`;

  const [history] = useState([
    {
      id: "INV-1092",
      patient: "PAT-1049",
      type: "Consultation",
      amount: 800,
      method: "Card",
      date: "Today, 10:30 AM",
      status: "Paid",
    },
    {
      id: "INV-1091",
      patient: "PAT-1050",
      type: "Lab Test",
      amount: 1200,
      method: "UPI",
      date: "Today, 09:15 AM",
      status: "Paid",
    },
  ]);

  const handleProcess = () => {
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
      toast.success(
        `Payment of ₹${finalAmount} processed. Invoice ${invoiceId} generated.`,
      );
    }, 1500);
  };

  const reset = () => {
    setPatientId("");
    setAmount(800);
    setDiscount(0);
    setServiceType("Consultation");
    setMethod("card");
    setStatus("pending");
  };

  if (view === "history") {
    return (
      <div className="font-sans max-w-6xl mx-auto pb-10 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <History className="w-8 h-8 text-blue-600" /> Payment History
            </h2>
            <p className="text-slate-500 mt-1 font-medium">
              View previously generated invoices and collected payments.
            </p>
          </div>
          <button
            onClick={() => setView("pos")}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-extrabold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            Back to POS
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Invoice ID / Date
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Patient Details
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Service & Amount
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Method
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((h) => (
                <tr
                  key={h.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-extrabold text-slate-900">{h.id}</p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                      {h.date}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {h.patient}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{h.type}</p>
                    <p className="text-xs font-extrabold text-green-600 mt-0.5 flex items-center gap-0.5">
                      <IndianRupee className="w-3 h-3" /> {h.amount}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {h.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg font-bold text-sm flex items-center gap-2 ml-auto">
                      <Printer className="w-4 h-4" /> Print Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans max-w-6xl mx-auto pb-10 space-y-8 flex flex-col md:flex-row gap-8">
      {/* POS Console */}
      <div className="md:w-1/2 space-y-6">
        <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl shadow-lg border border-slate-800">
          <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-blue-400" /> POS Terminal
          </h2>
          <button
            onClick={() => setView("history")}
            className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors border border-white/20 flex items-center gap-2"
          >
            <History className="w-3 h-3" /> View History
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8 relative overflow-hidden"
        >
          {status === "success" ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-500 text-white rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-green-800 mb-2">
                Payment Successful
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left space-y-2">
                <p className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase tracking-widest">
                    Invoice ID
                  </span>
                  <span className="text-slate-900 font-mono">{invoiceId}</span>
                </p>
                <p className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase tracking-widest">
                    Txn ID
                  </span>
                  <span className="text-slate-900 font-mono">
                    TXN-{Math.floor(Math.random() * 900000)}
                  </span>
                </p>
                <p className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase tracking-widest">
                    Amount Paid
                  </span>
                  <span className="text-slate-900">₹{finalAmount}</span>
                </p>
                <p className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase tracking-widest">
                    Method
                  </span>
                  <span className="text-slate-900 uppercase">{method}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                  <Printer className="w-4 h-4" /> Print Receipt
                </button>
                <button
                  onClick={reset}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-colors"
                >
                  New Payment
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded border border-slate-200">
                  Invoice: {invoiceId}
                </span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                  Patient ID or Phone
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    type="text"
                    placeholder="PID-10492 or 987654..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 font-bold text-slate-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                  Service Type
                </label>
                <div className="relative">
                  <FileText className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 font-bold text-slate-900 transition-all appearance-none"
                  >
                    <option>Consultation</option>
                    <option>Lab Test</option>
                    <option>Room Charges (IPD)</option>
                    <option>Pharmacy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Base Amount
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 font-black text-slate-900 text-xl transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <Percent className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      max="100"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 font-black text-slate-900 text-xl transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() => setMethod("card")}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${method === "card" ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    Card (POS)
                  </button>
                  <button
                    onClick={() => setMethod("upi")}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${method === "upi" ? "bg-orange-50 border-orange-500 text-orange-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    UPI QrCode
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMethod("cash")}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${method === "cash" ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setMethod("insurance")}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${method === "insurance" ? "bg-purple-50 border-purple-500 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    Insurance Claim
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Total Payable
                </p>
                <p className="text-3xl font-black text-slate-900 border-b-4 border-green-500 tracking-tight">
                  ₹{finalAmount}
                </p>
              </div>

              <button
                onClick={handleProcess}
                disabled={status === "processing"}
                className="w-full bg-slate-900 text-white py-5 rounded-xl font-extrabold text-lg flex justify-center items-center gap-2 hover:bg-slate-800 disabled:opacity-70 transition-all shadow-xl active:scale-[0.98]"
              >
                {status === "processing" ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <FileCheck2 className="w-6 h-6" /> Generate Bill & Collect
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Dynamic Action Screen (Right Side) */}
      <div className="md:w-1/2 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {method === "upi" && status !== "success" && (
            <motion.div
              key="upi"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-200 text-center w-full max-w-sm absolute"
            >
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Scan to Pay
              </h3>
              <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">
                NovaCare Medical Desk
              </p>

              <div className="bg-white p-4 border rounded-3xl shadow-sm inline-block mb-8">
                <QRCodeSVG
                  value={`upi://pay?pa=novacare@banking&pn=NovaCare&am=${finalAmount}&cu=INR`}
                  size={200}
                  bgColor={"#ffffff"}
                  fgColor={"#0f172a"}
                  level={"H"}
                />
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl py-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 mt-1">
                  Total Due
                </p>
                <p className="text-3xl font-black text-slate-900">
                  ₹{finalAmount}
                </p>
              </div>
            </motion.div>
          )}

          {method === "card" && status !== "success" && (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-800 text-center w-full max-w-sm text-white absolute"
            >
              <div className="w-20 h-20 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center mb-6 border border-blue-500/30">
                <CreditCard className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-black mb-2">Awaiting Card</h3>
              <p className="text-slate-400 font-medium mb-8">
                Please ask patient to tap or insert card into the POS terminal.
              </p>
              <div className="animate-pulse bg-blue-500/20 text-blue-400 font-extrabold uppercase tracking-widest text-xs py-3 rounded-xl border border-blue-500/30">
                Terminal Ready • ₹{finalAmount}
              </div>
            </motion.div>
          )}

          {method === "insurance" && status !== "success" && (
            <motion.div
              key="insurance"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-purple-900 p-10 rounded-3xl shadow-2xl border border-purple-800 text-center w-full max-w-sm text-white absolute"
            >
              <div className="w-20 h-20 bg-purple-500/30 rounded-full mx-auto flex items-center justify-center mb-6 border border-purple-500/50">
                <FileText className="w-10 h-10 text-purple-300" />
              </div>
              <h3 className="text-2xl font-black mb-2">Insurance Claim</h3>
              <p className="text-purple-300 font-medium mb-8">
                Verify patient policy details in the secondary portal before
                submitting claim.
              </p>
              <p className="font-extrabold uppercase tracking-widest text-xs text-purple-200">
                Processing ₹{finalAmount} via TPA
              </p>
            </motion.div>
          )}

          {method === "cash" && status !== "success" && (
            <motion.div
              key="cash"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-emerald-900 p-10 rounded-3xl shadow-2xl border border-emerald-800 text-center w-full max-w-sm text-white absolute"
            >
              <div className="w-20 h-20 bg-emerald-500/30 rounded-full mx-auto flex items-center justify-center mb-6 border border-emerald-500/50">
                <IndianRupee className="w-10 h-10 text-emerald-300" />
              </div>
              <h3 className="text-2xl font-black mb-2">Cash Collection</h3>
              <p className="text-emerald-300 font-medium mb-8">
                Please collect cash amount from patient before generating bill.
              </p>
              <p className="font-extrabold uppercase tracking-widest text-xl text-emerald-100 bg-emerald-800 py-3 rounded-xl border border-emerald-600 shadow-inner">
                Collect: ₹{finalAmount}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
