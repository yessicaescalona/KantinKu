"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Definisikan tipe data untuk item di keranjang agar tidak error "no-explicit-any"
interface CartItem {
  id: string | number;
  jumlah: number;
  [key: string]: unknown;
}

export default function Navbar() {
  const [totalItem, setTotalItem] = useState(0);

  const hitung = () => {
    if (typeof window === "undefined") return;
    const cart = localStorage.getItem("keranjang");
    if (cart) {
      const parsed: CartItem[] = JSON.parse(cart);
      const sum = parsed.reduce((acc: number, item: CartItem) => acc + item.jumlah, 0);
      setTotalItem(sum);
    } else {
      setTotalItem(0);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      hitung();
    }, 0);

    window.addEventListener("keranjang-berubah", hitung);
    
    return () => {
      clearTimeout(timer);
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