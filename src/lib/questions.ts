export type Question = {
  id: number
  dimension: string
  text: string
  options: { key: string; text: string }[]
  answer: string
}

export const PRE_TEST_QUESTIONS: Question[] = [
  {
    id: 1,
    dimension: "Deteksi Bias Informasi",
    text: `Perhatikan pernyataan berikut:\n"Sebagian besar guru yang menggunakan AI dalam pembelajaran menjadi malas mengajar secara langsung."\n\nIndikasi bias utama pada pernyataan tersebut adalah:`,
    options: [
      { key: "A", text: "Menggunakan data penelitian terbaru" },
      { key: "B", text: "Mengandung generalisasi tanpa bukti jelas" },
      { key: "C", text: "Mengutip pendapat ahli pendidikan" },
      { key: "D", text: "Menjelaskan hasil observasi lapangan" },
    ],
    answer: "B",
  },
  {
    id: 2,
    dimension: "Deteksi Bias Informasi",
    text: `Perhatikan kutipan berikut:\n"Platform belajar online terbukti menghancurkan kualitas pendidikan tradisional yang selama ini berhasil."\n\nApa ciri bias yang paling terlihat?`,
    options: [
      { key: "A", text: "Menggunakan bahasa netral" },
      { key: "B", text: "Menyajikan dua sudut pandang" },
      { key: "C", text: "Mengandung bahasa emosional dan mutlak" },
      { key: "D", text: "Berdasarkan jurnal ilmiah" },
    ],
    answer: "C",
  },
  {
    id: 3,
    dimension: "Deteksi Bias Informasi",
    text: `Sebuah artikel menulis:\n"Hanya guru yang tidak kompeten yang menolak penggunaan teknologi digital di kelas."\n\nMasalah utama pada pernyataan tersebut adalah:`,
    options: [
      { key: "A", text: "Mengandung opini yang menyerang kelompok tertentu" },
      { key: "B", text: "Menggunakan terlalu banyak data statistik" },
      { key: "C", text: "Menjelaskan hasil penelitian pendidikan" },
      { key: "D", text: "Menggunakan bahasa formal" },
    ],
    answer: "A",
  },
  {
    id: 4,
    dimension: "Evaluasi Kredibilitas Sumber",
    text: `Seorang guru menerima informasi kesehatan siswa dari akun media sosial yang tidak memiliki identitas jelas.\n\nLangkah paling tepat adalah:`,
    options: [
      { key: "A", text: "Langsung membagikan kepada orang tua siswa" },
      { key: "B", text: "Mempercayai karena banyak yang menyukai posting tersebut" },
      { key: "C", text: "Memverifikasi informasi melalui sumber resmi" },
      { key: "D", text: "Menghapus semua media sosial" },
    ],
    answer: "C",
  },
  {
    id: 5,
    dimension: "Evaluasi Kredibilitas Sumber",
    text: `Sebuah artikel pendidikan mencantumkan nama penulis, referensi jurnal, dan institusi pendidikan resmi.\n\nHal tersebut menunjukkan bahwa artikel:`,
    options: [
      { key: "A", text: "Lebih mudah dipercaya" },
      { key: "B", text: "Pasti benar tanpa perlu dibaca" },
      { key: "C", text: "Tidak memerlukan verifikasi lanjutan" },
      { key: "D", text: "Hanya cocok untuk peneliti" },
    ],
    answer: "A",
  },
  {
    id: 6,
    dimension: "Evaluasi Kredibilitas Sumber",
    text: `Sebuah berita viral menggunakan judul:\n"Fakta Mengejutkan Tentang Dunia Pendidikan yang Disembunyikan Pemerintah!"\nNamun isi artikel tidak mencantumkan sumber data yang jelas.\n\nSikap paling kritis adalah:`,
    options: [
      { key: "A", text: "Mempercayai karena judulnya meyakinkan" },
      { key: "B", text: "Membagikan agar orang lain tahu" },
      { key: "C", text: "Memeriksa validitas sumber informasi" },
      { key: "D", text: "Menghindari membaca berita digital" },
    ],
    answer: "C",
  },
  {
    id: 7,
    dimension: "Analisis Argumen",
    text: `Perhatikan pernyataan berikut:\n"Semua siswa yang aktif bermain game online pasti mengalami penurunan prestasi akademik."\n\nKelemahan utama argumen tersebut adalah:`,
    options: [
      { key: "A", text: "Menggunakan istilah ilmiah" },
      { key: "B", text: "Menyimpulkan secara berlebihan" },
      { key: "C", text: "Menggunakan bahasa baku" },
      { key: "D", text: "Mengandung data penelitian" },
    ],
    answer: "B",
  },
  {
    id: 8,
    dimension: "Analisis Argumen",
    text: `Sebuah opini menyatakan:\n"Karena satu sekolah berhasil menggunakan tablet digital, maka semua sekolah pasti akan berhasil menggunakan metode yang sama."\n\nKesalahan logika pada pernyataan tersebut adalah:`,
    options: [
      { key: "A", text: "Menggunakan contoh nyata" },
      { key: "B", text: "Generalisasi dari kasus terbatas" },
      { key: "C", text: "Menggunakan bahasa sederhana" },
      { key: "D", text: "Mengutip pengalaman lapangan" },
    ],
    answer: "B",
  },
  {
    id: 9,
    dimension: "Analisis Argumen",
    text: `Perhatikan pernyataan berikut:\n"Guru senior tidak memahami teknologi digital karena usia mereka sudah terlalu tua."\n\nMasalah utama pada argumen tersebut adalah:`,
    options: [
      { key: "A", text: "Berdasarkan data penelitian" },
      { key: "B", text: "Mengandung stereotip terhadap kelompok tertentu" },
      { key: "C", text: "Menggunakan bahasa ilmiah" },
      { key: "D", text: "Menjelaskan fakta objektif" },
    ],
    answer: "B",
  },
  {
    id: 10,
    dimension: "Identifikasi Misinformasi",
    text: `Sebuah pesan berantai WhatsApp menyebutkan:\n"Belajar menggunakan laptop lebih dari 1 jam dapat menyebabkan kerusakan otak permanen."\nPesan tersebut tidak mencantumkan sumber ilmiah.\n\nTindakan paling tepat adalah:`,
    options: [
      { key: "A", text: "Langsung mempercayai demi keamanan" },
      { key: "B", text: "Membagikan ke grup sekolah" },
      { key: "C", text: "Memeriksa fakta melalui sumber terpercaya" },
      { key: "D", text: "Menghapus aplikasi WhatsApp" },
    ],
    answer: "C",
  },
  {
    id: 11,
    dimension: "Identifikasi Misinformasi",
    text: `Sebuah video media sosial menyatakan bahwa:\n"AI akan menggantikan seluruh peran guru dalam 5 tahun ke depan."\n\nApa sikap paling kritis terhadap informasi tersebut?`,
    options: [
      { key: "A", text: "Mempercayainya karena dibuat dengan video profesional" },
      { key: "B", text: "Menganggap pasti benar karena viral" },
      { key: "C", text: "Membandingkan dengan sumber terpercaya lain" },
      { key: "D", text: "Menghindari teknologi AI sepenuhnya" },
    ],
    answer: "C",
  },
  {
    id: 12,
    dimension: "Identifikasi Misinformasi",
    text: `Sebuah artikel menyebutkan hasil penelitian tetapi tidak menjelaskan:\n• nama peneliti\n• tahun penelitian\n• sumber publikasi\n\nHal tersebut menunjukkan bahwa informasi:`,
    options: [
      { key: "A", text: "Perlu diverifikasi lebih lanjut" },
      { key: "B", text: "Pasti berasal dari jurnal ilmiah" },
      { key: "C", text: "Sudah dapat dipercaya sepenuhnya" },
      { key: "D", text: "Tidak perlu diperiksa lagi" },
    ],
    answer: "A",
  },
  {
    id: 13,
    dimension: "Refleksi Digital",
    text: `Sebelum membagikan informasi pendidikan ke grup sekolah, tindakan terbaik adalah:`,
    options: [
      { key: "A", text: "Membaca judul saja" },
      { key: "B", text: "Membagikan secepat mungkin" },
      { key: "C", text: "Memastikan sumber dan isi informasi valid" },
      { key: "D", text: "Menunggu informasi menjadi viral" },
    ],
    answer: "C",
  },
  {
    id: 14,
    dimension: "Refleksi Digital",
    text: `Ketika menemukan informasi yang sesuai dengan pendapat pribadi, sikap kritis yang tepat adalah:`,
    options: [
      { key: "A", text: "Langsung mempercayainya" },
      { key: "B", text: "Tetap memeriksa bukti dan sumber informasi" },
      { key: "C", text: "Segera membagikannya ke media sosial" },
      { key: "D", text: "Menganggap informasi lain pasti salah" },
    ],
    answer: "B",
  },
  {
    id: 15,
    dimension: "Refleksi Digital",
    text: `Seorang guru membaca artikel viral tentang metode belajar baru.\n\nLangkah reflektif yang paling tepat sebelum menerapkannya adalah:`,
    options: [
      { key: "A", text: "Langsung menggunakan metode tersebut di kelas" },
      { key: "B", text: "Memeriksa keakuratan dan relevansi informasi" },
      { key: "C", text: "Mengikuti karena sedang populer" },
      { key: "D", text: "Membagikan artikel tanpa membaca isi lengkap" },
    ],
    answer: "B",
  },
]

export const POST_TEST_QUESTIONS: Question[] = [
  {
    id: 1,
    dimension: "Deteksi Bias Informasi",
    text: `Perhatikan kutipan artikel berikut:\n"Sekolah yang masih menggunakan metode pembelajaran tradisional terbukti gagal mempersiapkan siswa menghadapi masa depan digital."\n\nApa indikasi bias paling kuat pada pernyataan tersebut?`,
    options: [
      { key: "A", text: "Menggunakan istilah pendidikan modern" },
      { key: "B", text: "Menyimpulkan semua sekolah tradisional gagal tanpa data memadai" },
      { key: "C", text: "Menampilkan perkembangan teknologi pendidikan" },
      { key: "D", text: "Menggunakan bahasa formal akademik" },
    ],
    answer: "B",
  },
  {
    id: 2,
    dimension: "Deteksi Bias Informasi",
    text: `Sebuah posting media sosial menyatakan:\n"Guru yang melarang penggunaan smartphone di kelas hanyalah guru yang takut perkembangan zaman."\n\nApa masalah utama dari pernyataan tersebut?`,
    options: [
      { key: "A", text: "Mengandung penilaian subjektif terhadap kelompok tertentu" },
      { key: "B", text: "Menggunakan referensi penelitian pendidikan" },
      { key: "C", text: "Menjelaskan kebijakan sekolah digital" },
      { key: "D", text: "Mengandung data statistik nasional" },
    ],
    answer: "A",
  },
  {
    id: 3,
    dimension: "Deteksi Bias Informasi",
    text: `Perhatikan headline berikut:\n"Generasi Digital Membuat Pendidikan Indonesia Semakin Bodoh."\n\nApa bentuk bias yang paling terlihat?`,
    options: [
      { key: "A", text: "Menggunakan bahasa netral dan informatif" },
      { key: "B", text: "Mengandung framing emosional dan provokatif" },
      { key: "C", text: "Menampilkan data hasil penelitian" },
      { key: "D", text: "Menggunakan pendekatan ilmiah" },
    ],
    answer: "B",
  },
  {
    id: 4,
    dimension: "Evaluasi Kredibilitas Sumber",
    text: `Seorang guru menemukan artikel pendidikan yang:\n• mencantumkan nama penulis\n• memiliki referensi jurnal\n• diterbitkan lembaga pendidikan resmi\n\nNamun isi artikel bertentangan dengan beberapa sumber lain.\n\nLangkah paling kritis adalah:`,
    options: [
      { key: "A", text: "Langsung mempercayai karena berasal dari lembaga resmi" },
      { key: "B", text: "Menolak artikel tanpa membaca lebih lanjut" },
      { key: "C", text: "Membandingkan dengan sumber terpercaya lainnya" },
      { key: "D", text: "Membagikannya ke grup guru" },
    ],
    answer: "C",
  },
  {
    id: 5,
    dimension: "Evaluasi Kredibilitas Sumber",
    text: `Sebuah video viral tentang pendidikan menggunakan banyak grafik dan angka statistik, tetapi tidak menjelaskan asal data.\n\nApa sikap paling tepat?`,
    options: [
      { key: "A", text: "Mempercayai karena terlihat profesional" },
      { key: "B", text: "Memeriksa sumber data yang digunakan" },
      { key: "C", text: "Menganggap semua statistik pasti benar" },
      { key: "D", text: "Membagikan video karena menarik" },
    ],
    answer: "B",
  },
  {
    id: 6,
    dimension: "Evaluasi Kredibilitas Sumber",
    text: `Seorang guru menerima artikel AI pendidikan dari blog pribadi tanpa identitas penulis, tetapi artikel tersebut banyak dibagikan di media sosial.\n\nApa tindakan paling tepat?`,
    options: [
      { key: "A", text: "Menganggap benar karena viral" },
      { key: "B", text: "Langsung menerapkannya di sekolah" },
      { key: "C", text: "Memverifikasi isi melalui sumber yang lebih kredibel" },
      { key: "D", text: "Mengabaikan semua informasi tentang AI" },
    ],
    answer: "C",
  },
  {
    id: 7,
    dimension: "Analisis Argumen",
    text: `Perhatikan pernyataan berikut:\n"Siswa yang menggunakan AI untuk belajar pasti menjadi malas berpikir."\n\nKesalahan logika utama pada pernyataan tersebut adalah:`,
    options: [
      { key: "A", text: "Menggunakan contoh nyata" },
      { key: "B", text: "Membuat kesimpulan mutlak tanpa mempertimbangkan faktor lain" },
      { key: "C", text: "Menggunakan bahasa formal" },
      { key: "D", text: "Menjelaskan kondisi pendidikan digital" },
    ],
    answer: "B",
  },
  {
    id: 8,
    dimension: "Analisis Argumen",
    text: `Sebuah opini menyatakan:\n"Karena beberapa siswa menyalahgunakan internet, maka akses internet sekolah sebaiknya ditutup sepenuhnya."\n\nApa kelemahan argumen tersebut?`,
    options: [
      { key: "A", text: "Solusi yang terlalu ekstrem dari kasus terbatas" },
      { key: "B", text: "Menggunakan pendekatan ilmiah" },
      { key: "C", text: "Mengandung data penelitian" },
      { key: "D", text: "Menjelaskan kebijakan sekolah" },
    ],
    answer: "A",
  },
  {
    id: 9,
    dimension: "Analisis Argumen",
    text: `Perhatikan pernyataan berikut:\n"Guru muda pasti lebih mampu mengajar digital dibanding guru senior."\n\nApa masalah utama dari argumen tersebut?`,
    options: [
      { key: "A", text: "Menggunakan observasi lapangan" },
      { key: "B", text: "Mengandung stereotip dan generalisasi" },
      { key: "C", text: "Berdasarkan penelitian resmi" },
      { key: "D", text: "Menggunakan data kuantitatif" },
    ],
    answer: "B",
  },
  {
    id: 10,
    dimension: "Identifikasi Misinformasi",
    text: `Sebuah unggahan media sosial menyebutkan:\n"Penelitian terbaru membuktikan penggunaan AI di sekolah menyebabkan penurunan IQ siswa."\nNamun tidak ada tautan penelitian yang disertakan.\n\nSikap paling kritis adalah:`,
    options: [
      { key: "A", text: "Langsung mempercayai demi keamanan siswa" },
      { key: "B", text: "Membagikan informasi agar guru lain waspada" },
      { key: "C", text: "Memeriksa apakah penelitian tersebut benar-benar ada" },
      { key: "D", text: "Menghindari semua penggunaan AI" },
    ],
    answer: "C",
  },
  {
    id: 11,
    dimension: "Identifikasi Misinformasi",
    text: `Sebuah akun anonim menyebarkan informasi bahwa:\n"Kurikulum baru akan menghapus seluruh mata pelajaran seni tahun depan."\n\nApa tindakan terbaik sebelum mempercayai informasi tersebut?`,
    options: [
      { key: "A", text: "Memeriksa pengumuman resmi pemerintah atau sekolah" },
      { key: "B", text: "Membagikannya ke grup guru" },
      { key: "C", text: "Menganggap benar karena ramai dibahas" },
      { key: "D", text: "Menolak semua perubahan kurikulum" },
    ],
    answer: "A",
  },
  {
    id: 12,
    dimension: "Identifikasi Misinformasi",
    text: `Sebuah artikel menggunakan istilah:\n"Menurut para ahli…"\nTetapi tidak menjelaskan siapa ahli yang dimaksud.\n\nHal tersebut menunjukkan bahwa informasi:`,
    options: [
      { key: "A", text: "Sudah pasti valid" },
      { key: "B", text: "Perlu diuji dan diverifikasi lebih lanjut" },
      { key: "C", text: "Dapat langsung digunakan sebagai referensi" },
      { key: "D", text: "Tidak memerlukan sumber tambahan" },
    ],
    answer: "B",
  },
  {
    id: 13,
    dimension: "Refleksi Digital",
    text: `Ketika menemukan informasi yang mendukung opini pribadi, seorang guru sebaiknya:`,
    options: [
      { key: "A", text: "Langsung mempercayainya" },
      { key: "B", text: "Tetap memeriksa kemungkinan bias dan sumber informasi" },
      { key: "C", text: "Segera membagikannya ke media sosial" },
      { key: "D", text: "Menganggap pendapat lain salah" },
    ],
    answer: "B",
  },
  {
    id: 14,
    dimension: "Refleksi Digital",
    text: `Setelah membaca artikel viral tentang metode belajar baru, langkah reflektif terbaik adalah:`,
    options: [
      { key: "A", text: "Langsung menerapkannya di kelas" },
      { key: "B", text: "Mengevaluasi bukti dan relevansi metode tersebut" },
      { key: "C", text: "Mengikuti karena banyak digunakan sekolah lain" },
      { key: "D", text: "Membagikan artikel tanpa membaca lengkap" },
    ],
    answer: "B",
  },
  {
    id: 15,
    dimension: "Refleksi Digital",
    text: `Saat menerima informasi digital yang belum pasti kebenarannya, tindakan paling bertanggung jawab adalah:`,
    options: [
      { key: "A", text: "Menyebarkannya agar orang lain ikut menilai" },
      { key: "B", text: "Menunggu informasi tambahan dari sumber terpercaya" },
      { key: "C", text: "Mempercayai karena berasal dari internet" },
      { key: "D", text: "Menggunakan informasi tersebut tanpa verifikasi" },
    ],
    answer: "B",
  },
]

// Fungsi shuffle sebelumnya digunakan untuk mengacak urutan opsi jawaban per user.
// Sesuai permintaan, fitur acak dimatikan agar urutan selalu A, B, C, D.
export function shuffleOptions(questions: Question[], seed: string): Question[] {
  return questions;
}

export function calculateScore(answers: { questionId: number; selectedAnswer: string }[], questions: Question[]): number {
  return answers.reduce((score, ans) => {
    const q = questions.find((q) => q.id === ans.questionId)
    return q?.answer === ans.selectedAnswer ? score + 1 : score
  }, 0)
}

export function getLevel(score: number): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' {
  if (score <= 5) return 'BEGINNER'
  if (score <= 10) return 'INTERMEDIATE'
  return 'ADVANCED'
}
