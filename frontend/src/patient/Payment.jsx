import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CreditCard,
  Wallet,
  Building2,
  ShieldPlus,
  Landmark,
  QrCode,
  Banknote,
  History,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { formatINR } from "../utils/formatIndian";
import Spinner from "../components/Spinner";
import { QRCodeSVG } from "qrcode.react";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [appointmentData, setAppointmentData] = useState(null);

  // Partial Payment States
  const [paymentType, setPaymentType] = useState("full"); // 'full', 'partial', 'emi'
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    // If we have state passed from booking
    if (location.state) {
      setAppointmentData(location.state);
      setCustomAmount(location.state.fee.toString());
    } else {
      // Dummy data for testing if no state is passed
      setAppointmentData({
        appointmentId: "APT-849201",
        doctorName: "Sarah Jenkins",
        fee: 500,
        date: new Date().toISOString().split("T")[0],
        time: "10:00",
      });
      setCustomAmount("500");
    }
    setTimeout(() => setLoading(false), 600);
  }, [location.state]);

  const paymentMethods = [
    {
      id: "card",
      name: "Credit / Debit Card",
      icon: CreditCard,
      color: "text-blue-500",
    },
    {
      id: "upi",
      name: "UPI (Google Pay, PhonePe)",
      icon: QrCode,
      color: "text-purple-500",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: Landmark,
      color: "text-emerald-500",
    },
    {
      id: "wallets",
      name: "Digital Wallets",
      icon: Wallet,
      color: "text-orange-500",
    },
    {
      id: "insurance",
      name: "Insurance / Mediclaim",
      icon: ShieldPlus,
      color: "text-teal-500",
    },
    {
      id: "government",
      name: "Govt. Schemes (CGHS)",
      icon: Building2,
      color: "text-indigo-500",
    },
    {
      id: "cash",
      name: "Pay at Hospital",
      icon: Banknote,
      color: "text-green-500",
    },
  ];

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate real-time payment gateway delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcessing(false);
    toast.success(
      "Payment successful! Transaction ID: TXN" +
        Math.floor(Math.random() * 1000000),
    );

    // Redirect to bill view or appointments
    navigate("/patient/billing");
  };

  const currentAmountToPay =
    paymentType === "full"
      ? appointmentData?.fee
      : paymentType === "partial"
        ? parseFloat(customAmount || 0)
        : (appointmentData?.fee / 3).toFixed(2); // EMI Example (3 months)

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
        <p className="mt-4 text-slate-500 font-medium">
          Loading secure payment gateway...
        </p>
      </div>
    );

  return (
    <div className="font-sans max-w-6xl mx-auto pb-20">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Secure Payment
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Complete your booking for {appointmentData?.doctorName}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Payment Methods Panel */}
        <div className="flex-[2] bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8">
          <h3 className="text-xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">
            Select Payment Method
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ${selectedMethod === method.id ? "border-blue-600 bg-blue-50/30" : "border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <method.icon className={`w-8 h-8 ${method.color}`} />
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedMethod === method.id ? "border-blue-600" : "border-slate-300"}`}
                  >
                    {selectedMethod === method.id && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                    )}
                  </div>
                </div>
                <h4 className="font-bold text-slate-800">{method.name}</h4>
              </div>
            ))}
          </div>

          {/* Payment Type Options */}
          {selectedMethod !== "cash" &&
            selectedMethod !== "insurance" &&
            selectedMethod !== "government" && (
              <div className="mb-8">
                <h3 className="text-lg font-extrabold text-slate-900 mb-4">
                  Payment Options
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div
                    onClick={() => setPaymentType("full")}
                    className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentType === "full" ? "border-blue-600 bg-blue-50" : "border-slate-100"}`}
                  >
                    <p className="font-extrabold text-slate-900">
                      Full Payment
                    </p>
                    <p className="text-slate-500 text-sm">
                      {formatINR(appointmentData?.fee)}
                    </p>
                  </div>
                  <div
                    onClick={() => setPaymentType("partial")}
                    className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentType === "partial" ? "border-blue-600 bg-blue-50" : "border-slate-100"}`}
                  >
                    <p className="font-extrabold text-slate-900">
                      Partial Payment
                    </p>
                    <p className="text-slate-500 text-sm">Pay advance now</p>
                  </div>
                  <div
                    onClick={() => setPaymentType("emi")}
                    className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentType === "emi" ? "border-blue-600 bg-blue-50" : "border-slate-100"}`}
                  >
                    <p className="font-extrabold text-slate-900">EMI / Later</p>
                    <p className="text-slate-500 text-sm">3 or 6 months</p>
                  </div>
                </div>

                {paymentType === "partial" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4"
                  >
                    <label className="text-sm font-bold text-slate-700">
                      Enter advance amount
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full mt-2 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-lg font-bold"
                    />
                  </motion.div>
                )}
              </div>
            )}

          {/* Dynamic Render based on Method */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            {selectedMethod === "card" && (
              <div className="space-y-4 max-w-sm">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-medium"
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-medium"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-medium"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-medium"
                />
              </div>
            )}

            {selectedMethod === "upi" && (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 relative overflow-hidden">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 mb-2">
                  <QRCodeSVG
                    value={`upi://pay?pa=hospital@upi&pn=NovaCare&am=${currentAmountToPay}&cu=INR`}
                    size={160}
                    level="H"
                  />
                </div>
                <p className="font-bold text-slate-600 mt-4">
                  Scan QR code using any UPI app
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  or enter UPI ID below
                </p>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full max-w-xs mt-4 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-medium text-center"
                />
              </div>
            )}

            {selectedMethod === "insurance" && (
              <div className="space-y-4">
                <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-teal-900">
                      BlueCross Health (Linked)
                    </p>
                    <p className="text-teal-700 text-sm">
                      Policy: BCH-8472910-X
                    </p>
                  </div>
                  <button className="text-teal-700 font-bold hover:bg-teal-100 px-4 py-2 rounded-lg transition-colors border border-teal-200">
                    Change
                  </button>
                </div>
                <div className="flex items-start gap-4 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100">
                  <ShieldPlus className="w-6 h-6 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-700">
                      Upload new insurance document
                    </p>
                    <p className="text-sm text-slate-500">
                      Supported formats: PDF, JPG
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Summary Panel */}
        <div className="flex-[1] space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-xl font-extrabold mb-6">Invoice Summary</h3>

            <div className="space-y-4 mb-6 text-sm font-medium">
              <div className="flex justify-between border-b border-slate-700/50 pb-4">
                <span className="text-slate-400">Consultation</span>
                <span className="text-slate-100 font-bold">
                  {formatINR(appointmentData?.fee)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-4">
                <span className="text-slate-400">Platform Fee</span>
                <span className="text-slate-100 font-bold">
                  {formatINR(20)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-4">
                <span className="text-slate-400">Taxes (GST 18%)</span>
                <span className="text-slate-100 font-bold">
                  {formatINR(appointmentData?.fee * 0.18)}
                </span>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-8">
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-1">
                To Pay Now
              </p>
              <p className="text-4xl font-extrabold tracking-tight">
                {selectedMethod === "insurance" ||
                selectedMethod === "government"
                  ? formatINR(0)
                  : formatINR(currentAmountToPay)}
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full py-4 bg-blue-600 text-white font-extrabold text-lg rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Spinner size="sm" /> Processing
                </>
              ) : (
                <>
                  Pay{" "}
                  {selectedMethod === "insurance" ||
                  selectedMethod === "government"
                    ? formatINR(0)
                    : formatINR(currentAmountToPay)}{" "}
                  securely <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-xs text-slate-500 font-bold text-center mt-4">
              Safe & Encrypted Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
