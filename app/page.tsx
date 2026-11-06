import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6 max-w-xl mx-auto py-4">
      {/* Kartu Utama Beranda dengan gaya berdimensi seperti halaman Menu */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center space-y-4">
        {/* Judul */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Selamat Datang di KantinKu!
        </h1>

        {/* Kalimat Ajakan */}
        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
          Waktunya istirahat! Temukan menu lezat hari ini dan nikmati makanan kesukaanmu dengan cara yang lebih cepat tanpa antre.
        </p>

        {/* Tombol Menuju /menu */}
        <div className="pt-2">
          <Link
            href="/menu"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-6 py-3 rounded-xl shadow-sm transition-all"
          >
            Lihat Daftar Menu &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}