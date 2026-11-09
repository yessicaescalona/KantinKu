"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { rupiah } from "@/data/menu";

type Menu = {
  id: number;
  nama: string;
  harga: number;
  kategori: string;
  stok: number;
  deskripsi: string;
};

export default function FavoritPage() {
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [favIds, setFavIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = JSON.parse(localStorage.getItem("favorit") || "[]");
    setFavIds(saved);

    fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data menu");
        return res.json();
      })
      .then((data) => {
        setMenuList(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (!isMounted) return null;

  const favoritItems = menuList.filter((item) => favIds.includes(item.id));

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Menu Favorit</h1>

      {loading && <p className="text-xs text-slate-500 text-center py-6">Memuat...</p>}

      {error && <p className="text-xs text-red-500 text-center py-6">{error}</p>}

      {!loading && !error && favoritItems.length === 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500 text-sm">Belum ada menu favorit.</p>
        </div>
      )}

      {!loading && !error && favoritItems.length > 0 && (
        <div className="space-y-3">
          {favoritItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                  {item.kategori}
                </span>
                <h2 className="font-semibold text-slate-900 text-sm">{item.nama}</h2>
                <p className="text-xs text-red-500 font-bold">{rupiah(item.harga)}</p>
              </div>

              <Link
                href={`/menu/${item.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all"
              >
                Detail &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}