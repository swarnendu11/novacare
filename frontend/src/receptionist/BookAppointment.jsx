/**
 * Book Appointment - Receptionist (assign patient + doctor)
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { doctorsApi, usersApi, appointmentsApi } from "../services/api";
import Spinner from "../components/Spinner";
import {
  formatINR,
  DEFAULT_CONSULTATION_FEE_INR,
} from "../utils/formatIndian";

export default function ReceptionistBookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [docRes, usersRes] = await Promise.all([
          doctorsApi.getAll(),
          usersApi.getAll({ role: "patient" }),
        ]);
        setDoctors(docRes.data);
        setPatients(usersRes.data);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedDoctor = doctors.find(
        (d) => d.id === parseInt(form.doctorId),
      );
      const selectedPatient = patients.find(
        (p) => p.id === parseInt(form.patientId),
      );
      await appointmentsApi.create({
        patientId: parseInt(form.patientId),
        patientName: selectedPatient?.name || "Unknown",
        doctorId: parseInt(form.doctorId),
        doctorName: selectedDoctor?.name || "",
        department: selectedDoctor?.department || "",
        date: form.date,
        time: form.time,
        status: "scheduled",
        notes: form.notes || "",
      });
      toast.success("Appointment booked!");
      setForm({ patientId: "", doctorId: "", date: "", time: "", notes: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Book Appointment
      </h2>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="max-w-lg bg-white rounded-xl shadow-soft p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Patient
          </label>
          <select
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            required
          >
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Doctor
          </label>
          <select
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            required
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} – {d.specialization}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Time
          </label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
          />
        </div>
        <p className="text-sm text-slate-600">
          Consultation fee:{" "}
          <span className="font-semibold text-slate-900">
            {formatINR(DEFAULT_CONSULTATION_FEE_INR)}
          </span>{" "}
          (payable at hospital)
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting ? <Spinner size="sm" /> : "Book Appointment"}
        </button>
      </motion.form>
    </div>
  );
}
