"use client";

import { useState } from "react";
import { menu } from "@/data/menu";
import MenuCard from "@/components/MenuCard";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("default");

  // Filter pencarian dan kategori (bekerja bersamaan)
  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Urutkan menu berdasarkan pilihan
  const sortedMenu = [...filteredMenu].sort((a, b) => {
    if (sortBy === "termurah") return a.harga - b.harga;
    if (sortBy === "termahal") return b.harga - a.harga;
    if (sortBy === "az") return a.nama.localeCompare(b.nama);
    return 0; // Urutan awal
  });

  return (
    <div className="space-y-6 max-w-xl mx-auto py-4">
      {/* Judul Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Katalog Menu KantinKu
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Temukan makanan dan minuman favoritmu dengan mudah.
        </p>
      </div>

      {/* Kotak Filter & Pencarian Berdimensi */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
        {/* Input Cari */}
        <input
          type="text"
          placeholder="Cari nama menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />

        {/* Tombol Kategori Warna Biru */}
        <div className="flex gap-2 overflow-x-auto py-1">
          {["Semua", "Makanan", "Minuman", "Camilan"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Select Urutan */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        >
          <option value="default">Urutan awal</option>
          <option value="termurah">Harga termurah</option>
          <option value="termahal">Harga termahal</option>
          <option value="az">Nama A–Z</option>
        </select>
      </div>

      {/* Daftar Kartu Menu */}
      <div className="space-y-4">
        {sortedMenu.length > 0 ? (
          sortedMenu.map((item) => (
            <MenuCard
              key={item.id}
              id={item.id}
              nama={item.nama}
              kategori={item.kategori}
              harga={item.harga}
              stok={item.stok}
            />
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 text-sm">
            Menu tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}