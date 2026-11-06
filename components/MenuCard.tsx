import Link from "next/link";
import { rupiah } from "@/data/menu";

type MenuCardProps = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
};

export default function MenuCard({ id, nama, kategori, harga, stok }: MenuCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md flex justify-between items-center">
      <div>
        {/* Badge Kategori */}
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-md">
          {kategori}
        </span>

        {/* Nama Menu (Bisa diklik menuju halaman detail /menu/[id]) */}
        <h2 className="font-bold text-slate-900 text-base mt-2">
          <Link href={`/menu/${id}`} className="hover:text-blue-600 transition-colors">
            {nama}
          </Link>
        </h2>

        {/* Harga */}
        <p className="font-bold text-red-500 text-base mt-1">
          {rupiah(harga)}
        </p>

        {/* Stok */}
        <p className="text-xs text-slate-400 mt-3">
          {stok > 0 ? (
            `Stok: ${stok}`
          ) : (
            <span className="text-red-500 font-bold">Habis</span>
          )}
        </p>
      </div>

      {/* Tombol Aksi Pesan */}
      <div>
        {stok > 0 ? (
          <Link
            href={`/menu/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm inline-block"
          >
            Pesan &rarr;
          </Link>
        ) : (
          <span className="bg-slate-100 text-slate-400 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-not-allowed inline-block">
            Habis
          </span>
        )}
      </div>
    </div>
  );
}