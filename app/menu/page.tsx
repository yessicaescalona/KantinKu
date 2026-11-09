"use client";

import { useState, useMemo } from "react";
import { menu as daftarMenu, rupiah } from "@/data/menu";
import MenuCard from "@/components/MenuCard";

export default function KatalogMenu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortOption, setSortOption] = useState("default");

  // Logika Filter & Pencarian yang bekerja bersamaan
  const filteredAndSortedMenu = useMemo(() => {
    let result = [...daftarMenu];

    // 1. Filter berdasarkan Pencarian (Nama)
    if (searchQuery.trim() !== "") {
      result = result.filter((item) =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Filter berdasarkan Kategori
    if (selectedCategory !== "Semua") {
      result = result.filter((item) => item.kategori === selectedCategory);
    }

    // 3. Pengurutan (Sorting)
    if (sortOption === "termurah") {
      result.sort((a, b) => a.harga - b.harga);
    } else if (sortOption === "termahal") {
      result.sort((a, b) => b.harga - a.harga);
    } else if (sortOption === "az") {
      result.sort((a, b) => a.nama.localeCompare(b.nama));
    }

    return result;
  }, [searchQuery, selectedCategory, sortOption]);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Judul Halaman */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Katalog Menu KantinKu 
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Temukan makanan dan minuman favoritmu dengan mudah.
          </p>
        </div>

        {/* Kotak Pencari, Kategori, dan Urutan */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Kotak Cari */}
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Cari nama menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-center">
            {/* Pilihan Kategori - Tombol Aktif menggunakan bg-blue-600 */}
            <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {["Semua", "Makanan", "Minuman", "Cemilan"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Pilihan Urutan */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="default">Urutan awal</option>
              <option value="termurah">Harga termurah</option>
              <option value="termahal">Harga termahal</option>
              <option value="az">Nama A-Z</option>
            </select>
          </div>
        </div>

        {/* Hasil Menu / Pesan Jika Tidak Ada */}
        {filteredAndSortedMenu.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredAndSortedMenu.map((item) => (
              <MenuCard key={item.id} item={item} rupiah={rupiah} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-base font-medium">
              Menu tidak ditemukan.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}