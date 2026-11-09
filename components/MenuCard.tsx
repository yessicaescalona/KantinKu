"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type MenuCardProps = {
  item: {
    id: number;
    nama: string;
    harga: number;
    kategori: string;
    stok: number;
  };
  rupiah: (val: number) => string;
};

export default function MenuCard({ item, rupiah }: MenuCardProps) {
  const isHabis = item.stok === 0;
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  // Cek status favorit dari localStorage saat komponen dimuat
  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem("favorit") || "[]");
    setIsFavorited(savedFavs.includes(item.id));
  }, [item.id]);

  // Fungsi toggle favorit
  const toggleFavorit = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah pindah halaman saat tombol favorit diklik
    const savedFavs = JSON.parse(localStorage.getItem("favorit") || "[]");
    let updatedFavs;
    if (isFavorited) {
      updatedFavs = savedFavs.filter((id: number) => id !== item.id);
      setIsFavorited(false);
    } else {
      updatedFavs = [...savedFavs, item.id];
      setIsFavorited(true);
    }
    localStorage.setItem("favorit", JSON.stringify(updatedFavs));
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md relative">
      <div>
        {/* Baris Atas: Kategori di Kiri & Tombol Favorit di Pojok Kanan */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 text-blue-600">
            {item.kategori}
          </span>

          <button
            onClick={toggleFavorit}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center justify-center ${
              isFavorited
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600"
            }`}
            title={isFavorited ? "Hapus dari Favorit" : "Tandai Favorit"}
          >
            {isFavorited ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Nama Menu */}
        <h3 className="text-base font-bold text-gray-800 mb-4">{item.nama}</h3>
      </div>

      <div>
        {/* Baris Bawah: Harga di Kiri, Tombol Detail di Kanan */}
        <div className="flex justify-between items-end mb-3">
          <div>
            <span className="block text-[10px] text-gray-400 font-medium">Harga</span>
            <span className="text-red-500 font-bold text-base">
              {rupiah(item.harga)}
            </span>
          </div>

          <Link
            href={`/menu/${item.id}`}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              isHabis
                ? "bg-gray-200 text-gray-400 pointer-events-none"
                : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
            }`}
          >
            {isHabis ? "Habis" : "Detail →"}
          </Link>
        </div>

        {/* Garis batas tipis & Stok */}
        <div className="pt-3 border-t border-gray-100 text-xs text-gray-400">
          Stok: <span className="font-semibold text-gray-600">{item.stok}</span>
        </div>
      </div>
    </div>
  );
}