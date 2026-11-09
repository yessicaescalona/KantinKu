"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function RiwayatPage() {
  const [riwayat, setRiwayat] = useState<any[]>([]);

  useEffect(() => {
    const savedRiwayat = JSON.parse(localStorage.getItem("riwayat_pesanan") || "[]");
    setRiwayat(savedRiwayat);
  }, []);

  const handleHapusRiwayat = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat pesanan?")) {
      localStorage.removeItem("riwayat_pesanan");
      setRiwayat([]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Pesanan</h1>
          {riwayat.length > 0 && (
            <button
              onClick={handleHapusRiwayat}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors"
            >
              Hapus Riwayat
            </button>
          )}
        </div>

        {riwayat.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm mb-4">Belum ada riwayat pesanan.</p>
            <Link
              href="/menu"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Render daftar riwayat pesanan Anda di sini */}
          </div>
        )}
      </div>
    </main>
  );
}