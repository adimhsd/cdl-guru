import Link from "next/link";

export const metadata = {
  title: "Panduan & Dokumentasi - CDL Guru",
  description: "Product Requirement Document untuk Sistem AI-Based Adaptive Learning",
};

export default function PanduanPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dokumentasi Sistem</h1>
              <p className="text-slate-500 mt-2">Sistem AI-Based Adaptive Learning untuk Critical Digital Literacy (CDL)</p>
            </div>
            <Link 
              href="/login" 
              className="inline-flex justify-center items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-200 whitespace-nowrap"
            >
              Kembali ke Login
            </Link>
          </div>

          {/* Content */}
          <div className="space-y-8 text-slate-700 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-3">1. Latar Belakang</h2>
              <p>Perkembangan informasi digital yang sangat cepat menyebabkan meningkatnya risiko bias informasi, misinformasi, dan disinformasi dalam dunia pendidikan. Guru sebagai fasilitator pembelajaran dituntut memiliki kemampuan Critical Digital Literacy (CDL), yaitu kemampuan untuk memahami, mengevaluasi, dan mengkritisi informasi secara mandiri.</p>
              <p className="mt-3">Saat ini belum tersedia sistem yang secara adaptif membantu guru dalam:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>mendeteksi bias informasi</li>
                <li>mengevaluasi kredibilitas sumber</li>
                <li>melatih cara berpikir kritis secara berkelanjutan</li>
              </ul>
              <p className="mt-3">Oleh karena itu, dikembangkan sistem berbasis AI yang berfungsi sebagai "tutor digital" untuk meningkatkan kemampuan CDL guru.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-3">2. Tujuan Aplikasi</h2>
              <p>Membangun platform berbasis web yang dapat:</p>
              <ol className="list-decimal pl-6 mt-2 space-y-1">
                <li>Mengukur kemampuan awal CDL guru (pre-test)</li>
                <li>Memberikan intervensi pembelajaran melalui AI</li>
                <li>Menganalisis interaksi pengguna secara real-time</li>
                <li>Mengukur peningkatan kemampuan (post-test)</li>
                <li>Menyediakan data untuk analisis penelitian</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-3">3. Ruang Lingkup Aplikasi</h2>
              <p>Aplikasi ini berupa aplikasi web yang terdiri dari:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Sistem autentikasi pengguna (guru)</li>
                <li>Modul pre-test CDL</li>
                <li>Modul analisis AI berbasis teks</li>
                <li>Modul post-test CDL</li>
                <li>Dashboard hasil dan progres pengguna</li>
              </ul>
              <p className="mt-3 font-medium text-slate-900 bg-yellow-50 p-3 rounded-lg border border-yellow-100">Aplikasi ini digunakan dalam konteks penelitian dengan ±150 guru dari berbagai kota.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-3">4. Target Pengguna</h2>
              <h3 className="font-bold text-slate-900 mt-3">Pengguna utama:</h3>
              <ul className="list-disc pl-6 mt-1">
                <li>Guru (SD/SMP/SMA)</li>
              </ul>
              <h3 className="font-bold text-slate-900 mt-3">Karakteristik:</h3>
              <ul className="list-disc pl-6 mt-1 space-y-1">
                <li>Memiliki kemampuan digital dasar</li>
                <li>Terbiasa menggunakan internet</li>
                <li>Belum tentu memahami konsep bias informasi secara mendalam</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-3">5. Masalah yang Ingin Diselesaikan</h2>
              <ol className="list-decimal pl-6 mt-2 space-y-1">
                <li>Guru kesulitan membedakan informasi bias dan tidak bias</li>
                <li>Kurangnya kemampuan evaluasi sumber informasi</li>
                <li>Tidak adanya sistem pembelajaran yang personal dan adaptif</li>
                <li>Minimnya alat ukur kemampuan CDL yang terintegrasi dengan pembelajaran</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-3">6. Solusi yang Ditawarkan</h2>
              <p>Sistem AI yang:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Menganalisis teks yang diberikan pengguna</li>
                <li>Mengidentifikasi bias, kredibilitas, dan struktur argumen</li>
                <li>Memberikan feedback edukatif dan reflektif</li>
                <li>Menyesuaikan respon berdasarkan level pengguna</li>
                <li>Mengukur peningkatan kemampuan melalui pre-test dan post-test</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">7. Fitur Utama</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl">
                  <h3 className="text-lg font-bold text-slate-900">7.1 Autentikasi</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>Login menggunakan email dan password</li>
                    <li>Session management</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl">
                  <h3 className="text-lg font-bold text-slate-900">7.2 Pre-Test & Confident Tes CDL</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>15 soal berbasis kasus (Multiple choice)</li>
                    <li>Penilaian otomatis & Penentuan level pengguna (Beginner, Intermediate, Advanced)</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 p-5 rounded-2xl sm:col-span-2 border border-indigo-100">
                  <h3 className="text-lg font-bold text-indigo-900">7.3 Modul AI (Core Feature)</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-indigo-800">
                    <li><strong>Input:</strong> Teks dari pengguna (artikel/opini, max ±500 kata)</li>
                    <li><strong>Proses:</strong> Analisis menggunakan LLM (Gemma 4 via Ollama)</li>
                    <li><strong>Output:</strong> Deteksi bias, Analisis kredibilitas, Evaluasi argumen, Pertanyaan reflektif</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl">
                  <h3 className="text-lg font-bold text-slate-900">7.4 Personalisasi</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>Berdasarkan skor pre-test dan histori interaksi</li>
                    <li>Menyesuaikan kompleksitas penjelasan AI</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl">
                  <h3 className="text-lg font-bold text-slate-900">7.5 Evaluasi</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>Menyimpan log interaksi untuk penelitian</li>
                    <li>Post-test & Confident Tes (Soal berbeda) minimal setelah 10 kali interaksi AI</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-3">8. User Flow</h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Login', 'Pre-Test', 'Sistem AI', 'Min. 10 Interaksi', 'Post-Test', 'Dashboard Hasil'].map((step, i) => (
                  <div key={i} className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                      {i + 1}. {step}
                    </span>
                    {i < 5 && <span className="mx-2 text-slate-400">→</span>}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-3">9. Data & Metrik</h2>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Data Dikumpulkan:</strong> User level, skor, hasil test, interaksi AI, timestamp.</li>
                <li><strong>Metrik Keberhasilan:</strong> Peningkatan skor CDL, jumlah interaksi, kualitas respon, stabilitas sistem.</li>
              </ul>
            </section>

            <section className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
              <h2 className="text-xl font-black text-emerald-900 mb-2">Penutup</h2>
              <p className="text-emerald-800">Sistem ini dirancang sebagai platform pembelajaran sekaligus alat eksperimen penelitian untuk menguji efektivitas AI dalam meningkatkan kemampuan Critical Digital Literacy guru secara adaptif dan terukur.</p>
            </section>

          </div>

          {/* Footer Action */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 mb-6 font-medium">Setelah memahami panduan ini, silakan masuk ke dalam platform.</p>
            <Link 
              href="/login" 
              className="inline-flex justify-center items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-200"
            >
              Menuju Halaman Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
