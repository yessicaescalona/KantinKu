"use client";

import { useState } from "react";
import { menu, rupiah } from "@/data/menu";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function DetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const menuId = parseInt(resolvedParams.id, 10);

  const item = menu.find((m) => m.id === menuId);
  if (!item) {
    notFound();
  }

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  // Ambil keranjang saat ini dari localStorage
  const getCart = () => {
    if (typeof window === "undefined") return [];
    const cart = localStorage.getItem("keranjang");
    return cart ? JSON.parse(cart) : [];
  };

  const handleAddToCart = () => {
    const cart = getCart();
    // Cek apakah item sudah ada di keranjang
    const existingIndex = cart.findIndex((c: any) => c.id === item.id);
    
    let currentQtyInCart = existingIndex > -1 ? cart[existingIndex].jumlah : 0;
    
    // Validasi: jumlah total tidak boleh melebihi stok[cite: 14]
    if (currentQtyInCart + quantity > item.stok) {
      setMessage(`Gagal: Jumlah melebihi stok tersedia (${item.stok}).`);
      return;
    }

    if (existingIndex > -1) {
      cart[existingIndex].jumlah += quantity;
    } else {
      cart.push({ id: item.id, jumlah: quantity });
    }

    localStorage.setItem("keranjang", JSON.stringify(cart));
    
    // Kirim event agar Navbar memperbarui lencana secara langsung
    window.dispatchEvent(new Event("keranjang-berubah"));

    setMessage("Ditambahkan ke keranjang.");
  };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-4">
      <Link
        href="/menu"
        className="inline-block text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
      >
        &larr; Kembali ke Daftar Menu
      </Link>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <span className="text-xs font-semibold text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-md">
          {item.kategori}
        </span>

        <h1 className="text-2xl font-bold text-slate-900">{item.nama}</h1>

        <p className="text-xl font-bold text-red-500">
          {rupiah(item.harga * quantity)}
        </p>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
          <span className="text-slate-500">Harga Satuan:</span>
          <span className="font-semibold text-slate-800">{rupiah(item.harga)}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Stok Tersedia:</span>
          <span className="font-semibold text-slate-800">{item.stok}</span>
        </div>

        {/* Poin 10: Menu dengan stok 0 menampilkan "Menu ini habis." tanpa formulir */}
        {item.stok === 0 ? (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium p-3 rounded-xl text-center">
            Menu ini habis.
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Poin 8: Formulir jumlah */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 font-medium">Jumlah:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-semibold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(item.stok, quantity + 1))}
                  className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Tombol Tambah ke Keranjang */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all shadow-sm"
            >
              Tambah ke keranjang
            </button>

            {message && (
              <p className={`text-xs font-medium text-center ${message.includes("Gagal") ? "text-red-500" : "text-emerald-600"}`}>
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}