import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  doctorsApi,
  appointmentsApi,
  departmentsApi,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import {
  formatINR,
  DEFAULT_CONSULTATION_FEE_INR,
} from "../utils/formatIndian";
import { Star, ShieldCheck, Clock, CheckCircle } from "lucide-react";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    notes: "",
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [docRes, depRes] = await Promise.all([
          doctorsApi.getAll(),
          departmentsApi.getAll(),
        ]);
        setDoctors(docRes.data.filter((d) => d.available !== false));
        setDepartments(depRes.data);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProceed = (e) => {
    e.preventDefault();
    if (!form.doctorId || !form.date || !form.time) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep(2); // Move to review step
  };

  const selectedDoctorInfo = doctors.find(
    (d) => d.id === parseInt(form.doctorId),
  );

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const selectedDoctor = doctors.find(
        (d) => d.id === parseInt(form.doctorId),
      );
      const res = await appointmentsApi.create({
        doctorId: parseInt(form.doctorId),
        doctorName: selectedDoctor?.name || "",
        department: selectedDoctor?.department || "",
        patientId: user?.id,
        patientName: user?.name || "Patient",
        date: form.date,
        time: form.time,
        status: "scheduled",
        notes: form.notes || "",
      });
      toast.success(
        "Appointment created conditionally! Redirecting to payment...",
      );
      // Pass appointment data to payment page
      navigate("/patient/payment", {
        state: {
          appointmentId: res.data?.id || Math.floor(Math.random() * 100000),
          doctorId: form.doctorId,
          doctorName: selectedDoctor?.name,
          fee: selectedDoctor?.fee || DEFAULT_CONSULTATION_FEE_INR,
          date: form.date,
          time: form.time,
        },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to initialize booking",
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
        <p className="mt-4 text-slate-500 font-medium">
          Finding the best doctors...
        </p>
      </div>
    );
  }

  return (
    <div className="font-sans max-w-5xl mx-auto pb-10">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          Book an Appointment
        </h2>
        <p className="text-slate-500 font-medium text-lg">
          Schedule a visit with our top-rated medical professionals.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono transition-colors ${step === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-green-500 text-white shadow-lg shadow-green-500/30"}`}
              >
                {step === 1 ? "1" : <CheckCircle className="w-5 h-5" />}
              </div>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-blue-600 rounded-full transition-all duration-500 ${step === 2 ? "w-full" : "w-1/2"}`}
                />
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono transition-colors border-2 ${step === 2 ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30" : "bg-white text-slate-400 border-slate-200"}`}
              >
                2
              </div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleProceed} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-extrabold text-slate-700 uppercase tracking-widest mb-3">
                      Select Department
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDepartment}
                        onChange={(e) => {
                          setSelectedDepartment(e.target.value);
                          setForm({ ...form, doctorId: "" });
                        }}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 font-bold text-lg appearance-none cursor-pointer"
                      >
                        <option value="">All Departments</option>
                        {departments.map((dep) => (
                          <option key={dep.id} value={dep.id}>
                            {dep.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                        <svg
                          className="w-6 h-6 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-extrabold text-slate-700 uppercase tracking-widest mb-3">
                      Select Doctor
                    </label>
                    <div className="relative">
                      <select
                        value={form.doctorId}
                        onChange={(e) =>
                          setForm({ ...form, doctorId: e.target.value })
                        }
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 font-bold text-lg appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>
                          Choose a specialist...
                        </option>
                        {doctors
                          .filter((d) =>
                            selectedDepartment
                              ? d.departmentId === parseInt(selectedDepartment)
                              : true,
                          )
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} – {d.specialization}
                            </option>
                          ))}
                      </select>
                      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                        <svg
                          className="w-6 h-6 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-extrabold text-slate-700 uppercase tracking-widest mb-3">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-extrabold text-slate-700 uppercase tracking-widest mb-3">
                      Time
                    </label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) =>
                        setForm({ ...form, time: e.target.value })
                      }
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-700 uppercase tracking-widest mb-3">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    rows={3}
                    placeholder="Any symptoms, preferences, or questions?"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 font-medium resize-none placeholder-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-5 mt-6 bg-slate-900 text-white font-extrabold text-lg rounded-2xl hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  Review Booking
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                  <h3 className="font-extrabold text-slate-900 text-xl mb-6">
                    Booking Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-blue-100/50 pb-4">
                      <span className="text-slate-500 font-bold">Doctor</span>
                      <span className="text-slate-900 font-bold">
                        {selectedDoctorInfo?.name}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-blue-100/50 pb-4">
                      <span className="text-slate-500 font-bold">
                        Department
                      </span>
                      <span className="text-slate-900 font-bold">
                        {selectedDoctorInfo?.department}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-blue-100/50 pb-4">
                      <span className="text-slate-500 font-bold">
                        Date & Time
                      </span>
                      <span className="text-slate-900 font-bold">
                        {form.date} at {form.time}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-blue-100/50 pb-4">
                      <span className="text-slate-500 font-bold">
                        Consultation Fee
                      </span>
                      <span className="text-slate-900 font-extrabold text-lg">
                        {formatINR(
                          selectedDoctorInfo?.fee ||
                            DEFAULT_CONSULTATION_FEE_INR,
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-extrabold text-lg rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="flex-[2] py-4 bg-blue-600 text-white font-extrabold text-lg rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Spinner size="sm" /> : "Confirm & Pay"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Right Info Panel */}
        {form.doctorId && selectedDoctorInfo ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-80 h-fit bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl font-bold border border-slate-700 mb-6 shadow-inner">
              {selectedDoctorInfo.name.charAt(0)}
            </div>

            <h3 className="text-2xl font-extrabold mb-1">
              {selectedDoctorInfo.name}
            </h3>
            <p className="text-blue-400 font-bold tracking-wide mb-6">
              {selectedDoctorInfo.specialization}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                <span className="font-bold text-slate-200">
                  4.9 (120+ reviews)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span className="font-bold text-slate-200">
                  Verified Specialist
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-slate-200">
                  Highly Punctual
                </span>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 font-semibold mb-1">
                Consultation Fee
              </p>
              <p className="text-3xl font-extrabold text-white">
                {formatINR(
                  selectedDoctorInfo.fee || DEFAULT_CONSULTATION_FEE_INR,
                )}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="w-full lg:w-80 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <ShieldCheck className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold">
              Select a doctor to view their profile and availability details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
