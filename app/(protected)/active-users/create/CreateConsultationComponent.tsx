"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateConsultationComponent({ users }: { users: any[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    user_id: "",
    status: "waiting",
    started_at: "",
    ended_at: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function onSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const payload: any = {
      user_id: form.user_id,
      status: form.status,
    };

    if (form.status === "active") {
      payload.started_at = new Date().toISOString();
    }

    if (form.status === "completed") {
      payload.started_at = form.started_at || new Date().toISOString();
      payload.ended_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("consultation_sessions")
      .insert([payload]);

    setLoading(false);

    if (error) {
      alert("Gagal membuat sesi: " + error.message);
      return;
    }

    alert("Sesi konsultasi berhasil dibuat!");
    router.push("/active-users");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Buat Sesi Konsultasi
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">

          {/* USERS */}
          <div>
            <label className="block font-semibold mb-1">Pilih Pengguna</label>
            <select
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">-- Pilih User --</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.anon_name || u.id}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="block font-semibold mb-1">Status Sesi</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="waiting">🟡 Menunggu</option>
              <option value="active">🟢 Aktif</option>
              <option value="completed">🔵 Selesai</option>
            </select>
          </div>

          {/* Optional manual started_at */}
          {form.status !== "waiting" && (
            <div>
              <label className="block font-semibold mb-1">
                Waktu Mulai (opsional)
              </label>
              <Input
                name="started_at"
                type="datetime-local"
                value={form.started_at}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/active-users")}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
