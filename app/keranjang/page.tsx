"use client";

import { useState, useEffect } from "react";
import { menu, rupiah } from "@/data/menu";
import Link from "next/link";

type CartItem = {
  id: number;
  jumlah: number;
};

export default function KeranjangPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [deliveryType, setDeliveryType] = useState<"sendiri" | "diantar">("sendiri");
  const [namaPemesanan, setNamaPemesanan] = useState("");
  const [kelas, setKelas] = useState("");
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("keranjang");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  if (!isMounted) {
    return null; // Mencegah mismatch render server & client
  }

  const updateCartStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("keranjang", JSON.stringify(newCart));
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  const handleQuantityChange = (id: number, delta: number) => {
    const menuItem = menu.find((m) => m.id === id);
    if (!menuItem) return;

    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = item.jumlah + delta;
        if (newQty < 1) return item;
        if (newQty > menuItem.stok) return item;
        return { ...item, jumlah: newQty };
      }
      return item;
    });

    updateCartStorage(updated);
  };

  const handleRemove = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCartStorage(updated);
  };

  const subtotal = cart.reduce((acc, cartItem) => {
    const menuItem = menu.find((m) => m.id === cartItem.id);
    return acc + (menuItem ? menuItem.harga * cartItem.jumlah : 0);
  }, 0);

  const handleApplyPromo = () => {
    const codeClean = promoCode.trim().toUpperCase();
    if (codeClean === "") return;

    if (codeClean !== "HEMAT10") {
      setPromoMessage("Kode promo tidak dikenal.");
      setDiscountPercent(0);
      return;
    }

    if (subtotal < 20000) {
      setPromoMessage("Promo HEMAT10 butuh belanja minimal Rp 20.000.");
      setDiscountPercent(0);
      return;
    }

    setDiscountPercent(10);
    setPromoMessage("Promo HEMAT10 dipakai: diskon 10%.");
  };

  const diskonNilai = Math.round((subtotal * discountPercent) / 100);
  const ongkir = deliveryType === "diantar" ? 2000 : 0;
  const totalBayar = subtotal - diskonNilai + ongkir;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (namaPemesanan.trim().length < 3) {
      alert("Nama pemesanan minimal 3 huruf!");
      return;
    }

    if (deliveryType === "diantar" && kelas.trim().length < 3) {
      alert("Kelas wajib diisi minimal 3 karakter jika diantar!");
      return;
    }

    const itemsDetail = cart.map((c) => {
      const m = menu.find((item) => item.id === c.id);
      return {
        nama: m ? m.nama : "Menu",
        jumlah: c.jumlah,
        subtotalItem: m ? m.harga * c.jumlah : 0,
      };
    });

    const orderData = {
      id: Date.now(),
      tanggal: new Date().toLocaleString(),
      nama: namaPemesanan,
      deliveryType,
      kelas: deliveryType === "diantar" ? kelas : "",
      items: itemsDetail,
      subtotal,
      diskon: diskonNilai,
      ongkir,
      total: totalBayar,
    };

    const existingHistory = localStorage.getItem("riwayat");
    const historyList = existingHistory ? JSON.parse(existingHistory) : [];
    localStorage.setItem("riwayat", JSON.stringify([orderData, ...historyList]));

    setReceipt(orderData);
    updateCartStorage([]);
    setPromoCode("");
    setDiscountPercent(0);
    setPromoMessage("");
    setNamaPemesanan("");
    setKelas("");
  };

  if (receipt) {
    return (
      <div className="max-w-xl mx-auto py-6 space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h1 className="text-xl font-bold text-slate-900 text-center">Struk Pembelian KantinKu</h1>
          <p className="text-sm font-semibold text-emerald-600 text-center">Terima kasih, {receipt.nama}!</p>

          <div className="border-t border-b border-slate-100 py-3 space-y-2 text-sm">
            {receipt.items.map((it: any, idx: number) => (
              <div key={idx} className="flex justify-between text-slate-600">
                <span>{it.nama} x{it.jumlah}</span>
                <span className="font-medium">{rupiah(it.subtotalItem)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-sm text-slate-600 pt-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">{rupiah(receipt.subtotal)}</span>
            </div>
            {receipt.diskon > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Diskon:</span>
                <span>-{rupiah(receipt.diskon)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pengiriman:</span>
              <span className="font-medium">
                {receipt.deliveryType === "diantar" ? `Diantar ke ${receipt.kelas} (Rp 2.000)` : "Diambil sendiri di kantin"}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t">
              <span>Total Bayar:</span>
              <span className="text-red-500">{rupiah(receipt.total)}</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setReceipt(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all shadow-sm"
            >
              Kembali Belanja
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Keranjang Belanja</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center space-y-3">
          <p className="text-slate-500 text-sm">Keranjang masih kosong.</p>
          <Link
            href="/menu"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Lihat Menu &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            {cart.map((cartItem) => {
              const menuItem = menu.find((m) => m.id === cartItem.id);
              if (!menuItem) return null;

              return (
                <div key={cartItem.id} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <h2 className="font-semibold text-slate-900 text-sm">{menuItem.nama}</h2>
                    <p className="text-xs text-red-500 font-bold">{rupiah(menuItem.harga * cartItem.jumlah)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(cartItem.id, -1)}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold text-slate-800">{cartItem.jumlah}</span>
                      <button
                        onClick={() => handleQuantityChange(cartItem.id, 1)}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(cartItem.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3">
            <label className="block text-xs font-semibold text-slate-700">Kode Promo</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: HEMAT10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all"
              >
                Pakai
              </button>
            </div>
            {promoMessage && (
              <p className={`text-xs font-medium ${discountPercent > 0 ? "text-emerald-600" : "text-red-500"}`}>
                {promoMessage}
              </p>
            )}
          </div>

          <form onSubmit={handleCheckout} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Cara Ambil</label>
              <div className="flex gap-4 text-xs text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryType === "sendiri"}
                    onChange={() => setDeliveryType("sendiri")}
                  />
                  Ambil sendiri (Bawaan)
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryType === "diantar"}
                    onChange={() => setDeliveryType("diantar")}
                  />
                  Diantar (+Rp 2.000)
                </label>
              </div>
            </div>

            {deliveryType === "diantar" && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Kelas</label>
                <input
                  type="text"
                  placeholder="Masukkan kelas Anda (min. 3 karakter)"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Nama Pemesan</label>
              <input
                type="text"
                placeholder="Nama Anda (min. 3 huruf)"
                value={namaPemesanan}
                onChange={(e) => setNamaPemesanan(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">{rupiah(subtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon ({discountPercent}%)</span>
                  <span>-{rupiah(diskonNilai)}</span>
                </div>
              )}
              {deliveryType === "diantar" && (
                <div className="flex justify-between">
                  <span>Ongkir</span>
                  <span className="font-semibold text-slate-800">{rupiah(ongkir)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-red-500">{rupiah(totalBayar)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all shadow-sm mt-2"
            >
              Pesan Sekarang
            </button>
          </form>
        </div>
      )}
    </div>
  );
}