"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [totalItem, setTotalItem] = useState(0);

  const hitung = () => {
    if (typeof window === "undefined") return;
    const cart = localStorage.getItem("keranjang");
    if (cart) {
      const parsed = JSON.parse(cart);
      const sum = parsed.reduce((acc: number, item: any) => acc + item.jumlah, 0);
      setTotalItem(sum);
    } else {
      setTotalItem(0);
    }
  };

  useEffect(() => {
    hitung();
    window.addEventListener("keranjang-berubah", hitung);
    return () => {
      window.removeEventListener("keranjang-berubah", hitung);
    };
  }, []);

  return (
    <nav className="border-b border-slate-200 bg-white py-4 px-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-bold text-blue-600 text-lg">
          KantinKu
        </Link>

        {/* Menu Navigasi Lengkap & Rapat */}
        <div className="flex items-center gap-6 text-sm text-slate-700 font-normal">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <Link href="/menu" className="hover:text-blue-600 transition-colors">
            Menu
          </Link>
          <Link href="/favorit" className="hover:text-blue-600 transition-colors">
            Favorit
          </Link>
          <Link href="/keranjang" className="hover:text-blue-600 transition-colors relative">
            Keranjang {totalItem > 0 && <span className="text-blue-600 font-bold">({totalItem})</span>}
          </Link>
          <Link href="/riwayat" className="hover:text-blue-600 transition-colors">
            Riwayat
          </Link>
        </div>
      </div>
    </nav>
  );
}