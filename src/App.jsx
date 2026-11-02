import React, { useState, useEffect } from 'react';
import './App.css';
import logoUTS from './assets/logo-uts.png'; 
import bgUTS from './assets/uts.jpg'; 
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot 
} from 'firebase/firestore';

function App() {
  // ==========================================
  // 1. STATE UTAMA & AUTENTIKASI
  // ==========================================
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ==========================================
  // 2. STATE MASTER DATA & FIREBASE
  // ==========================================
  const [daftarPegawai, setDaftarPegawai] = useState([]);
  const [riwayatIzin, setRiwayatIzin] = useState([]);
  const [daftarJenisIzin] = useState([
    { id: 'ji-1', nama: 'Sakit (Dengan / Tanpa Surat Dokter)' },
    { id: 'ji-2', nama: 'Keperluan Penting / Keluarga' },
    { id: 'ji-3', nama: 'Tugas Kedinasan / Seminar' }
  ]);
  const [daftarJenisCuti] = useState([
    { id: 'jc-1', nama: 'Cuti Tahunan' },
    { id: 'jc-2', nama: 'Cuti Besar' },
    { id: 'jc-3', nama: 'Cuti Sakit' },
    { id: 'jc-4', nama: 'Cuti Melahirkan' }
  ]);

  // ==========================================
  // 3. MASTER STRUKTUR KAMPUS & ATURAN PENYETUJU (SESUAI EXCEL UTS + TAMBAHAN)
  // ==========================================
  const strukturKampusUTS = [
    // --- KLASTER FAKULTAS & PASCASARJANA ---
    { unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi masing-masing' },
    { unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { unitKerja: 'Fakultas Psikologi', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Fakultas Psikologi', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Psikologi', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Psikologi', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Psikologi', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi masing-masing' },
    { unitKerja: 'Fakultas Psikologi', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { unitKerja: 'Fakultas Agroindustri dan Sumberdaya Hayati', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Fakultas Agroindustri dan Sumberdaya Hayati', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Agroindustri dan Sumberdaya Hayati', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Agroindustri dan Sumberdaya Hayati', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Agroindustri dan Sumberdaya Hayati', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi masing-masing' },
    { unitKerja: 'Fakultas Agroindustri dan Sumberdaya Hayati', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { unitKerja: 'Fakultas Bioteknologi', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Fakultas Bioteknologi', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Bioteknologi', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Bioteknologi', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Bioteknologi', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi masing-masing' },
    { unitKerja: 'Fakultas Bioteknologi', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { unitKerja: 'Fakultas Rekayasa Sistem', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Fakultas Rekayasa Sistem', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Rekayasa Sistem', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Rekayasa Sistem', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Rekayasa Sistem', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi masing-masing' },
    { unitKerja: 'Fakultas Rekayasa Sistem', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { unitKerja: 'Fakultas Lingkungan dan Mineral', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Fakultas Lingkungan dan Mineral', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Lingkungan dan Mineral', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Lingkungan dan Mineral', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Lingkungan dan Mineral', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi masing-masing' },
    { unitKerja: 'Fakultas Lingkungan dan Mineral', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { unitKerja: 'Fakultas Ilmu Budaya', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Fakultas Ilmu Budaya', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Ilmu Budaya', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Ilmu Budaya', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Ilmu Budaya', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi masing-masing' },
    { unitKerja: 'Fakultas Ilmu Budaya', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi masing-masing' },
    { unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { unitKerja: 'Fakultas Hukum', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Fakultas Hukum', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Hukum', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Hukum', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { unitKerja: 'Fakultas Hukum', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi masing-masing' },
    { unitKerja: 'Fakultas Hukum', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { unitKerja: 'Sekolah Pascasarjana', jabatan: 'Direktur', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Sekolah Pascasarjana', jabatan: 'Wakil Direktur', status: 'Dosen Tugas Tambahan (DT)', approver: 'Direktur' },
    { unitKerja: 'Sekolah Pascasarjana', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Direktur' },
    { unitKerja: 'Sekolah Pascasarjana', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Direktur' },
    { unitKerja: 'Sekolah Pascasarjana', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi masing-masing' },
    { unitKerja: 'Sekolah Pascasarjana', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Direktur' },

    // --- KLASTER SEKRETARIAT & UNIT PENUNJANG ---
    { unitKerja: 'Sekretariat Universitas', jabatan: 'Sekretaris Universitas', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Sekretariat Universitas', jabatan: 'Kepala Unit Layanan Kesekretariatan', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Sekretaris Universitas' },
    { unitKerja: 'Sekretariat Universitas', jabatan: 'Kepala UPT Hubungan Masyarakat Dan Protokoler', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Sekretaris Universitas' },
    { unitKerja: 'Sekretariat Universitas', jabatan: 'Kepala UPT. Perpustakaan', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Sekretaris Universitas' },
    { unitKerja: 'Sekretariat Universitas', jabatan: 'Kepala UPT. Asrama', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Sekretaris Universitas' },
    { unitKerja: 'Sekretariat Universitas', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Kepala Unit masing-masing' },

    // --- KLASTER BADAN UNIVERSITAS ---
    { unitKerja: 'Badan Penjaminan Mutu Universitas', jabatan: 'Kepala Badan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Badan Penjaminan Mutu Universitas', jabatan: 'Kepala Deputi Bidang Audit Mutu Internal dan Akreditasi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Kepala Badan' },
    { unitKerja: 'Badan Penjaminan Mutu Universitas', jabatan: 'Gugus I / II / III - BPMA', status: 'Dosen Tugas Tambahan (DT)', approver: 'Kepala Badan' },
    { unitKerja: 'Badan Penjaminan Mutu Universitas', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Kepala Badan' },

    { unitKerja: 'Badan Pembinaan Karakter dan Hubungan Orang Tua', jabatan: 'Kepala BPKO', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { unitKerja: 'Badan Pembinaan Karakter dan Hubungan Orang Tua', jabatan: 'Koordinator BPKO', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Kepala BPKO' },
    { unitKerja: 'Badan Pembinaan Karakter dan Hubungan Orang Tua', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Kepala BPKO' },

    // --- KLASTER WAKIL REKTOR 1 ---
    { unitKerja: 'Direktorat Akademik (WR 1)', jabatan: 'Direktur Akademik', status: 'Dosen Tugas Tambahan (DT)', approver: 'Wakil Rektor 1' },
    { unitKerja: 'Direktorat Akademik (WR 1)', jabatan: 'Kepala Subdir Administrasi Akademik', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Direktur Akademik' },
    { unitKerja: 'Direktorat Akademik (WR 1)', jabatan: 'Kepala Subdir Pengembangan dan Inovasi Pembelajaran', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Direktur Akademik' },
    { unitKerja: 'Direktorat Akademik (WR 1)', jabatan: 'Koordinator MBKM', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Direktur Akademik' },
    { unitKerja: 'Direktorat Akademik (WR 1)', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Direktur Akademik' },

    { unitKerja: 'Direktorat Kemahasiswaan dan Alumni (WR 1)', jabatan: 'Direktur Kemahasiswaan dan Alumni', status: 'Dosen Tugas Tambahan (DT)', approver: 'Wakil Rektor 1' },
    { unitKerja: 'Direktorat Kemahasiswaan dan Alumni (WR 1)', jabatan: 'Koordinator CDC', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Direktur Kemahasiswaan dan Alumni' },
    { unitKerja: 'Direktorat Kemahasiswaan dan Alumni (WR 1)', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Direktur Kemahasiswaan dan Alumni' },

    { unitKerja: 'Direktorat Sumber Daya Manusia (WR 1)', jabatan: 'Direktur SDM', status: 'Dosen Tugas Tambahan (DT)', approver: 'Wakil Rektor 1' },
    { unitKerja: 'Direktorat Sumber Daya Manusia (WR 1)', jabatan: 'Koordinator Pengembangan Karir', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Direktur SDM' },
    { unitKerja: 'Direktorat Sumber Daya Manusia (WR 1)', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Direktur SDM' },

    // --- KLASTER WAKIL REKTOR 2 ---
    { unitKerja: 'Direktorat Keuangan (WR 2)', jabatan: 'Direktur Keuangan', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Wakil Rektor 2' },
    { unitKerja: 'Direktorat Keuangan (WR 2)', jabatan: 'Kepala Sub Kebendaharaan', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Wakil Rektor 2' },
    { unitKerja: 'Direktorat Keuangan (WR 2)', jabatan: 'Kepala Subdir Akuntansi Sistem Informasi Keuangan', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Direktur Keuangan' },
    { unitKerja: 'Direktorat Keuangan (WR 2)', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Direktur Keuangan' },

    { unitKerja: 'Direktorat Pengelolaan dan Pemeliharaan Fasilitas (WR 2)', jabatan: 'Direktur Fasilitas', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Wakil Rektor 2' },
    { unitKerja: 'Direktorat Pengelolaan dan Pemeliharaan Fasilitas (WR 2)', jabatan: 'Kasubdir Fasilitas', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Wakil Rektor 2' },
    { unitKerja: 'Direktorat Pengelolaan dan Pemeliharaan Fasilitas (WR 2)', jabatan: 'Koordinator Aset, Inventaris & Kebersihan', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Direktur Fasilitas' },
    { unitKerja: 'Direktorat Pengelolaan dan Pemeliharaan Fasilitas (WR 2)', jabatan: 'Koordinator IT Office', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Direktur Fasilitas' },
    { unitKerja: 'Direktorat Pengelolaan dan Pemeliharaan Fasilitas (WR 2)', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Direktur Fasilitas' },
    { unitKerja: 'Direktorat Pengelolaan dan Pemeliharaan Fasilitas (WR 2)', jabatan: 'Tenaga Penunjang', status: 'Tenaga Kependidikan', approver: 'Direktur Fasilitas' },

    // --- KLASTER WAKIL REKTOR 3 ---
    { unitKerja: 'Direktorat PKM dan Penerapan Riset (WR 3)', jabatan: 'Direktur PKM dan Riset', status: 'Dosen Tugas Tambahan (DT)', approver: 'Wakil Rektor 3' },
    { unitKerja: 'Direktorat PKM dan Penerapan Riset (WR 3)', jabatan: 'Kepala Subdir PKM dan Penerapan Riset', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Direktur PKM dan Riset' },
    { unitKerja: 'Direktorat PKM dan Penerapan Riset (WR 3)', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Direktur PKM dan Riset' },

    // --- KLASTER WAKIL REKTOR 4 ---
    { unitKerja: 'Direktorat Kerjasama (WR 4)', jabatan: 'Direktur Kerjasama', status: 'Dosen Tugas Tambahan (DT)', approver: 'Wakil Rektor 4' },
    { unitKerja: 'Direktorat Kerjasama (WR 4)', jabatan: 'Kepala Sub Dir Kerjasama & Beasiswa', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Wakil Rektor 4' },
    { unitKerja: 'Direktorat Kerjasama (WR 4)', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Direktur Kerjasama' },

    { unitKerja: 'Direktorat Pengembangan Bisnis UTS (WR 4)', jabatan: 'Direktur Pengembangan Bisnis', status: 'Dosen Tugas Tambahan (DT)', approver: 'Wakil Rektor 4' },
    { unitKerja: 'Direktorat Pengembangan Bisnis UTS (WR 4)', jabatan: 'Kepala Sub Dir Pengembangan Bisnis', status: 'Dosen Tugas Tambahan (DT)', approver: 'Wakil Rektor 4' },
    { unitKerja: 'Direktorat Pengembangan Bisnis UTS (WR 4)', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Direktur Kerjasama' }
  ];

  const daftarUnitKerjaUnik = [...new Set(strukturKampusUTS.map(item => item.unitKerja))];

  // ==========================================
  // 4. FORM STATE UNTUK PENDAFTARAN & INPUT
  // ==========================================
  const initialRegState = {
    nama: '',
    nip: '',
    username: '',
    password: '',
    unitKerja: daftarUnitKerjaUnik[0],
    jabatanObj: strukturKampusUTS[0],
    prodi: '-'
  };

  const [regForm, setRegForm] = useState(initialRegState);
  const [editingPegawai, setEditingPegawai] = useState(null);
  const [editForm, setEditForm] = useState({
    nama: '',
    nip: '',
    unitKerja: '',
    jabatanObj: null,
    prodi: '-'
  });

  const [formIzin, setFormIzin] = useState({
    jenisIzin: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    keterangan: '',
    namaFile: '',
    fileDataUrl: ''
  });

  const [formCuti, setFormCuti] = useState({
    jenisCuti: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    keterangan: ''
  });

  // ==========================================
  // 5. FIREBASE REALTIME LISTENERS (EFFECTS)
  // ==========================================
  useEffect(() => {
    const unsubPegawai = onSnapshot(collection(db, "pegawai"), (snapshot) => {
      const pegawaiData = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
      setDaftarPegawai(pegawaiData);
      
      setCurrentUser(prevUser => {
        if (!prevUser) return null;
        const updatedSelf = pegawaiData.find(p => p.nip === prevUser.nip || p.username === prevUser.username || p.docId === prevUser.docId);
        return updatedSelf ? updatedSelf : prevUser;
      });
    });

    const unsubRiwayat = onSnapshot(collection(db, "riwayatIzin"), (snapshot) => {
      setRiwayatIzin(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    return () => {
      unsubPegawai();
      unsubRiwayat();
    };
  }, []);

  // ==========================================
  // 6. FUNGSI INISIALISASI DATA AWAL (SEEDING)
  // ==========================================
  const seedInitialData = async () => {
    try {
      await addDoc(collection(db, "pegawai"), {
        username: 'admin', password: '123', nama: 'Administrator IT', nip: 'ADM001',
        unitKerja: 'Pusat Komputer & Data', jabatan: 'Admin Sistem', statusJabatan: 'Admin', approver: '-', role: 'admin', jatahCuti: 12, statusAkun: 'Aktif'
      });

      await addDoc(collection(db, "pegawai"), {
        username: 'rektor', password: '123', nama: 'Dr. Rektor UTS, M.Si.', nip: '197001012000',
        unitKerja: 'Rektorat UTS', jabatan: 'Rektor', statusJabatan: 'Rektor', approver: '-', role: 'rektor', jatahCuti: 12, statusAkun: 'Aktif'
      });

      await addDoc(collection(db, "pegawai"), {
        username: 'srirahayu', password: '123', nama: 'Sri Rahayu, S.E.', nip: '198505052010',
        unitKerja: 'Direktorat Sumber Daya Manusia (WR 1)', jabatan: 'Direktur SDM', statusJabatan: 'Dosen Tugas Tambahan (DT)', approver: 'Wakil Rektor 1', role: 'approver', jatahCuti: 12, statusAkun: 'Aktif'
      });

      alert('Inisialisasi data awal PASTI UTS berhasil!');
    } catch (err) {
      console.error(err);
      alert('Gagal melakukan inisialisasi data.');
    }
  };

  // ==========================================
  // 7. LOGIKA AUTENTIKASI & MANAJEMEN PEGAWAI
  // ==========================================
  const handleLogin = (e) => {
    e.preventDefault();
    const query = loginInput.trim().toLowerCase();
    const found = daftarPegawai.find(p => 
      (p.username?.toLowerCase() === query || p.nip?.toLowerCase() === query) &&
      p.password === passwordInput
    );

    if (found) {
      if (found.statusAkun === 'Pending') {
        alert('Akun Anda masih menunggu persetujuan (approval) dari Admin Sistem!');
        return;
      }
      setCurrentUser(found);
      setActiveMenu('dashboard');
      alert(`Selamat datang di PASTI UTS, ${found.nama}!`);
    } else {
      alert('Username / NIP atau Password salah, atau akun belum terdaftar!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginInput('');
    setPasswordInput('');
    setIsRegisterMode(false);
    setRegForm({
      nama: '',
      nip: '',
      username: '',
      password: '',
      unitKerja: daftarUnitKerjaUnik[0],
      jabatanObj: strukturKampusUTS[0],
      prodi: '-'
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const uname = regForm.username.trim().toLowerCase();
    const exists = daftarPegawai.some(p => p.username?.toLowerCase() === uname || p.nip === regForm.nip.trim());

    if (exists) {
      alert('Username atau NIP tersebut sudah terdaftar di sistem!');
      return;
    }

    const selectedStruktur = regForm.jabatanObj;
    const needsProdi = ['Dosen', 'Kaprodi', 'Sekretaris Prodi'].includes(selectedStruktur.jabatan);

    try {
      await addDoc(collection(db, "pegawai"), {
        username: uname,
        password: regForm.password,
        nama: regForm.nama.trim(),
        nip: regForm.nip.trim(),
        unitKerja: selectedStruktur.unitKerja,
        jabatan: selectedStruktur.jabatan,
        statusJabatan: selectedStruktur.status,
        approver: selectedStruktur.approver,
        prodi: needsProdi ? regForm.prodi.trim() : '-',
        role: 'pegawai',
        jatahCuti: 12,
        statusAkun: 'Pending'
      });
      alert('Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan Admin.');
      setIsRegisterMode(false);
      setRegForm({
        nama: '',
        nip: '',
        username: '',
        password: '',
        unitKerja: daftarUnitKerjaUnik[0],
        jabatanObj: strukturKampusUTS[0],
        prodi: '-'
      });
    } catch (err) {
      console.error(err);
      alert('Gagal mendaftarkan akun.');
    }
  };

  const handleApprovePegawai = async (docId) => {
    try {
      await updateDoc(doc(db, "pegawai", docId), { statusAkun: 'Aktif' });
      alert('Akun pegawai berhasil diaktifkan!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyetujui akun.');
    }
  };

  const handleDeletePegawai = async (docId, username) => {
    if (['admin', 'rektor'].includes(username)) {
      alert('Akun Utama Admin / Rektor tidak dapat dihapus!');
      return;
    }
    if (window.confirm('Yakin ingin menghapus data pegawai ini?')) {
      await deleteDoc(doc(db, "pegawai", docId));
      alert('Data pegawai berhasil dihapus.');
    }
  };

  const handleOpenEditModal = (p) => {
    setEditingPegawai(p);
    const matchedStruktur = strukturKampusUTS.find(s => s.unitKerja === p.unitKerja && s.jabatan === p.jabatan) || strukturKampusUTS[0];
    setEditForm({
      nama: p.nama || '',
      nip: p.nip || '',
      unitKerja: p.unitKerja || daftarUnitKerjaUnik[0],
      jabatanObj: matchedStruktur,
      prodi: p.prodi || '-'
    });
  };

  const handleSaveEditPegawai = async (e) => {
    e.preventDefault();
    if (!editingPegawai) return;

    const selStruktur = editForm.jabatanObj;
    const needsProdi = ['Dosen', 'Kaprodi', 'Sekretaris Prodi'].includes(selStruktur.jabatan);

    try {
      await updateDoc(doc(db, "pegawai", editingPegawai.docId), {
        nama: editForm.nama.trim(),
        nip: editForm.nip.trim(),
        unitKerja: selStruktur.unitKerja,
        jabatan: selStruktur.jabatan,
        statusJabatan: selStruktur.status,
        approver: selStruktur.approver,
        prodi: needsProdi ? editForm.prodi.trim() : '-'
      });
      alert('Data pegawai berhasil diperbarui!');
      setEditingPegawai(null);
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui data pegawai.');
    }
  };

  // ==========================================
  // 8. LOGIKA PENGAJUAN & PENYETUJUAN SPESIFIK PRODI
  // ==========================================
  const hitungDurasiHari = (tglMulai, tglSelesai) => {
    if (!tglMulai || !tglSelesai) return 0;
    const start = new Date(tglMulai);
    const end = new Date(tglSelesai);
    if (end < start) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Menentukan target penyetuju secara spesifik (termasuk Prodi jika Kaprodi)
  const getTargetApprover = (userObj) => {
    if (!userObj) return 'Atasan Langsung';
    if (userObj.jabatan === 'Dosen' || userObj.jabatan === 'Sekretaris Prodi') {
      return `Kaprodi ${userObj.prodi && userObj.prodi !== '-' ? userObj.prodi : userObj.unitKerja}`;
    }
    return userObj.approver || 'Rektor';
  };

  const handleSubmitIzin = async (e) => {
    e.preventDefault();
    const durasi = hitungDurasiHari(formIzin.tanggalMulai, formIzin.tanggalSelesai);
    const targetApprover = getTargetApprover(currentUser);
    const initialStatus = `Menunggu Persetujuan ${targetApprover}`;

    try {
      await addDoc(collection(db, "riwayatIzin"), {
        id: Date.now(),
        kategori: 'Izin',
        nama: currentUser.nama,
        nip: currentUser.nip,
        unitKerja: currentUser.unitKerja,
        jabatan: currentUser.jabatan,
        prodi: currentUser.prodi || '-',
        jenis: formIzin.jenisIzin || daftarJenisIzin[0].nama,
        tglMulai: formIzin.tanggalMulai,
        tglSelesai: formIzin.tanggalSelesai,
        durasi: durasi,
        keterangan: formIzin.keterangan,
        namaFile: formIzin.namaFile || 'Tidak Ada Lampiran',
        fileDataUrl: formIzin.fileDataUrl || '',
        status: initialStatus,
        targetApprover: targetApprover
      });
      alert(`Permohonan IZIN berhasil dikirim! Status: ${initialStatus}`);
      setFormIzin({ jenisIzin: '', tanggalMulai: '', tanggalSelesai: '', keterangan: '', namaFile: '', fileDataUrl: '' });
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim pengajuan izin.');
    }
  };

  const handleSubmitCuti = async (e) => {
    e.preventDefault();
    const durasi = hitungDurasiHari(formCuti.tanggalMulai, formCuti.tanggalSelesai);
    const pgwData = daftarPegawai.find(p => p.nip === currentUser.nip);
    const sisaCuti = pgwData ? pgwData.jatahCuti : 12;
    const targetApprover = getTargetApprover(currentUser);
    const initialStatus = `Menunggu Persetujuan ${targetApprover}`;

    if (durasi <= 0) {
      alert('Tanggal selesai harus sama atau setelah tanggal mulai!');
      return;
    }
    if (durasi > sisaCuti) {
      alert(`Pengajuan gagal! Durasi cuti (${durasi} Hari) melebihi sisa kuota (${sisaCuti} Hari).`);
      return;
    }

    try {
      await addDoc(collection(db, "riwayatIzin"), {
        id: Date.now(),
        kategori: 'Cuti',
        nama: currentUser.nama,
        nip: currentUser.nip,
        unitKerja: currentUser.unitKerja,
        jabatan: currentUser.jabatan,
        prodi: currentUser.prodi || '-',
        jenis: formCuti.jenisCuti || daftarJenisCuti[0].nama,
        tglMulai: formCuti.tanggalMulai,
        tglSelesai: formCuti.tanggalSelesai,
        durasi: durasi,
        keterangan: formCuti.keterangan,
        namaFile: '-',
        fileDataUrl: '',
        status: initialStatus,
        targetApprover: targetApprover
      });
      alert(`Permohonan CUTI berhasil dikirim! Status: ${initialStatus}`);
      setFormCuti({ jenisCuti: '', tanggalMulai: '', tanggalSelesai: '', keterangan: '' });
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim pengajuan cuti.');
    }
  };

  const handleProsesPersetujuan = async (docId, targetItem, statusKeputusan) => {
    const isApprove = statusKeputusan === 'Disetujui';
    const finalStatusText = isApprove ? `Disetujui oleh ${currentUser.jabatan}` : `Ditolak oleh ${currentUser.jabatan}`;

    try {
      await updateDoc(doc(db, "riwayatIzin", docId), { status: finalStatusText });

      if (isApprove && targetItem.kategori === 'Cuti') {
        const foundPgw = daftarPegawai.find(p => p.nip === targetItem.nip);
        if (foundPgw) {
          const sisaBaru = Math.max(0, foundPgw.jatahCuti - targetItem.durasi);
          await updateDoc(doc(db, "pegawai", foundPgw.docId), { jatahCuti: sisaBaru });
        }
      }
      alert(`Permohonan berhasil ${isApprove ? 'disetujui' : 'ditolak'}!`);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses persetujuan.');
    }
  };

  // ==========================================
  // 9. FILTER PENGAMBILAN DATA SPESIFIK PRODI UNTUK APPROVER
  // ==========================================
  const isUserRektor = currentUser?.jabatan === 'Rektor' || currentUser?.role === 'rektor';
  const isApproverUser = currentUser?.role === 'admin' || isUserRektor || strukturKampusUTS.some(s => s.approver.toLowerCase().includes(currentUser?.jabatan?.toLowerCase() || ''));

  const getPendingForCurrentUser = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin' || isUserRektor) return riwayatIzin.filter(i => i.status.includes('Menunggu Persetujuan'));
    
    // PERBAIKAN UTAMA: Jika user adalah Kaprodi, saring persetujuan HANYA untuk pemohon yang prodinya sama persis!
    if (currentUser.jabatan === 'Kaprodi') {
      const myProdi = currentUser.prodi ? currentUser.prodi.trim().toLowerCase() : '';
      return riwayatIzin.filter(i => {
        if (!i.status.includes('Menunggu Persetujuan')) return false;
        const pemohonProdi = i.prodi ? i.prodi.trim().toLowerCase() : '';
        // Cocokkan jika targetApprover mengandung nama prodi atau unit kerjanya
        return i.targetApprover?.toLowerCase().includes(myProdi) || pemohonProdi === myProdi;
      });
    }

    const userJabatan = currentUser.jabatan || '';
    return riwayatIzin.filter(i => i.status.toLowerCase().includes(userJabatan.toLowerCase()));
  };

  const getRiwayatForCurrentUser = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin' || isUserRektor) return riwayatIzin;
    if (isApproverUser) return riwayatIzin;
    return riwayatIzin.filter(i => i.nip === currentUser.nip);
  };

  const handleFileChangeIzin = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormIzin({ ...formIzin, namaFile: file.name, fileDataUrl: uploadEvent.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ==========================================
  // 10. TAMPILAN ANTARMUKA (RENDER UI)
  // ==========================================
  if (!currentUser) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', width: '100%', backgroundImage: `url(${bgUTS})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1 }}></div>
        <div style={{ ...styles.loginCard, position: 'relative', zIndex: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={logoUTS} alt="Logo UTS" style={{ width: '75px', height: '75px', objectFit: 'contain', marginBottom: '10px' }} />
            <h2 style={{ fontSize: '20px', color: '#1e293b' }}>PASTI UTS</h2>
            <p style={{ color: '#666', fontSize: '13px', marginTop: '5px' }}>Pelayanan Ajuan Sistem Izin & Cuti<br/>Universitas Teknologi Sumbawa</p>
          </div>

          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="form-box">
              <div className="form-group">
                <label className="form-label">Username / NIP Pegawai</label>
                <input type="text" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} placeholder="Username / NIP..." className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Password..." className="form-input" required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', backgroundColor: '#f59e0b' }}>
                <i className="fa-solid fa-right-to-bracket"></i> Masuk PASTI
              </button>

              {daftarPegawai.length === 0 && (
                <button type="button" onClick={seedInitialData} style={{ width: '100%', marginTop: '10px', padding: '8px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                  <i className="fa-solid fa-database"></i> Inisialisasi Akun Awal (Admin & Rektor)
                </button>
              )}

              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <span onClick={() => setIsRegisterMode(true)} style={{ fontSize: '13px', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold' }}>
                  Belum punya akun? Registrasi Pegawai Baru
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="form-box">
              <h4 style={{ textAlign: 'center', color: '#0284c7', marginBottom: '15px' }}>Formulir Registrasi Mandiri PASTI</h4>
              
              <div className="form-group">
                <label className="form-label">Nama Lengkap & Gelar</label>
                <input type="text" value={regForm.nama} onChange={(e) => setRegForm({...regForm, nama: e.target.value})} placeholder="Nama..." className="form-input" required />
              </div>

              <div className="form-group">
                <label className="form-label">NIP / NIDN</label>
                <input type="text" value={regForm.nip} onChange={(e) => setRegForm({...regForm, nip: e.target.value})} placeholder="NIP..." className="form-input" required />
              </div>

              <div className="form-group">
                <label className="form-label">Pilih Unit Kerja / Fakultas</label>
                <select 
                  value={regForm.unitKerja} 
                  onChange={(e) => {
                    const selectedUnit = e.target.value;
                    const firstJabatanInUnit = strukturKampusUTS.find(s => s.unitKerja === selectedUnit);
                    setRegForm({...regForm, unitKerja: selectedUnit, jabatanObj: firstJabatanInUnit});
                  }} 
                  className="form-input"
                >
                  {daftarUnitKerjaUnik.map((unit, idx) => <option key={idx} value={unit}>{unit}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pilih Jabatan / Status Kepegawaian</label>
                <select 
                  value={JSON.stringify(regForm.jabatanObj)} 
                  onChange={(e) => setRegForm({...regForm, jabatanObj: JSON.parse(e.target.value)})} 
                  className="form-input"
                >
                  {strukturKampusUTS.filter(s => s.unitKerja === regForm.unitKerja).map((s, idx) => (
                    <option key={idx} value={JSON.stringify(s)}>
                      {s.jabatan} ({s.status}) - Penyetuju: {s.approver}
                    </option>
                  ))}
                </select>
              </div>

              {['Dosen', 'Kaprodi', 'Sekretaris Prodi'].includes(regForm.jabatanObj.jabatan) && (
                <div className="form-group">
                  <label className="form-label">Nama Program Studi</label>
                  <input type="text" value={regForm.prodi} onChange={(e) => setRegForm({...regForm, prodi: e.target.value})} placeholder="Contoh: Ekonomi Pembangunan" className="form-input" required />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Username Pilihan</label>
                <input type="text" value={regForm.username} onChange={(e) => setRegForm({...regForm, username: e.target.value})} placeholder="Username..." className="form-input" required />
              </div>

              <div className="form-group">
                <label className="form-label">Password Pilihan</label>
                <input type="password" value={regForm.password} onChange={(e) => setRegForm({...regForm, password: e.target.value})} placeholder="Password..." className="form-input" required />
              </div>

              <button type="submit" className="btn-green" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                <i className="fa-solid fa-user-plus"></i> Daftar Akun Pegawai
              </button>

              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <span onClick={() => {
                  setIsRegisterMode(false);
                  setRegForm({
                    nama: '',
                    nip: '',
                    username: '',
                    password: '',
                    unitKerja: daftarUnitKerjaUnik[0],
                    jabatanObj: strukturKampusUTS[0],
                    prodi: '-'
                  });
                }} style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer' }}>
                  <i className="fa-solid fa-arrow-left"></i> Kembali ke Login
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  const pendingApprovalsCount = getPendingForCurrentUser().length;

  return (
    <div className="app-container">
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <img src={logoUTS} alt="Logo UTS" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span>PASTI UTS</span>
        </div>
        <ul className="menu-list">
          <li className={activeMenu === 'dashboard' ? 'menu-item menu-active' : 'menu-item'} onClick={() => setActiveMenu('dashboard')}>
            <i className="fa-solid fa-chart-line icon-menu"></i> Dashboard
          </li>
          
          {currentUser.role !== 'admin' && (
            <>
              <li className={activeMenu === 'ajukan-izin' ? 'menu-item menu-active' : 'menu-item'} onClick={() => setActiveMenu('ajukan-izin')}>
                <i className="fa-solid fa-file-pen icon-menu"></i> Form Permohonan Izin
              </li>
              <li className={activeMenu === 'ajukan-cuti' ? 'menu-item menu-active' : 'menu-item'} onClick={() => setActiveMenu('ajukan-cuti')}>
                <i className="fa-solid fa-umbrella-beach icon-menu"></i> Form Permohonan Cuti
              </li>
            </>
          )}

          {isApproverUser && currentUser.role !== 'admin' && (
            <li className={activeMenu === 'persetujuan' ? 'menu-item menu-active' : 'menu-item'} onClick={() => setActiveMenu('persetujuan')}>
              <i className="fa-solid fa-list-check icon-menu"></i> Persetujuan Masuk
              {pendingApprovalsCount > 0 && (
                <span style={{ backgroundColor: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', marginLeft: 'auto' }}>
                  {pendingApprovalsCount}
                </span>
              )}
            </li>
          )}

          {currentUser.role === 'admin' && (
            <li className={activeMenu === 'master-pegawai' ? 'menu-item menu-active' : 'menu-item'} onClick={() => setActiveMenu('master-pegawai')}>
              <i className="fa-solid fa-users-gear icon-menu"></i> Manajemen Karyawan
              {daftarPegawai.filter(p => p.statusAkun === 'Pending').length > 0 && (
                <span style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', marginLeft: 'auto' }}>
                  {daftarPegawai.filter(p => p.statusAkun === 'Pending').length}
                </span>
              )}
            </li>
          )}

          <li className={activeMenu === 'riwayat' ? 'menu-item menu-active' : 'menu-item'} onClick={() => setActiveMenu('riwayat')}>
            <i className="fa-solid fa-clock-rotate-left icon-menu"></i> Riwayat & Rekapan
          </li>
        </ul>
      </aside>

      {isSidebarOpen && <div className="backdrop" onClick={() => setIsSidebarOpen(false)} />}

      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <i className="fa-solid fa-bars"></i>
            </button>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {activeMenu === 'dashboard' && 'Dashboard Utama - PASTI UTS'}
              {activeMenu === 'ajukan-izin' && 'Form Pengajuan Izin Pegawai'}
              {activeMenu === 'ajukan-cuti' && 'Form Pengajuan Cuti Pegawai'}
              {activeMenu === 'persetujuan' && `Persetujuan Masuk (${currentUser.jabatan} ${currentUser.prodi && currentUser.prodi !== '-' ? `- ${currentUser.prodi}` : ''})`}
              {activeMenu === 'master-pegawai' && 'Manajemen Master Data Karyawan'}
              {activeMenu === 'riwayat' && 'Riwayat & Rekapan Laporan PASTI'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="user-profile">
              <i className="fa-solid fa-circle-user" style={{ fontSize: '24px', color: '#f59e0b' }}></i>
              <span>{currentUser.nama} ({currentUser.jabatan})</span>
            </div>
            <button onClick={handleLogout} style={styles.btnLogout}>
              <i className="fa-solid fa-power-off"></i> Keluar
            </button>
          </div>
        </header>

        <div className="content-body">
          {activeMenu === 'dashboard' && (
            <div>
              <div className="card-grid">
                <div className="card">
                  <h3>Total Pegawai Terdaftar</h3>
                  <p className="card-value">{daftarPegawai.length}</p>
                </div>
                <div className="card">
                  <h3>Sisa Kuota Cuti Anda</h3>
                  <p className="card-value" style={{ color: '#0284c7' }}>
                    {(() => {
                      const pgwData = daftarPegawai.find(p => p.nip === currentUser?.nip);
                      return pgwData?.jatahCuti ?? 12;
                    })()} Hari
                  </p>
                </div>
                <div className="card">
                  <h3>Status Sistem</h3>
                  <p className="card-value" style={{ fontSize: '14px', color: '#059669', marginTop: '12px' }}>
                    <i className="fa-solid fa-cloud-arrow-up"></i> Online di pasti-uts.com
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginTop: '20px', borderLeft: '5px solid #0284c7' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Informasi Alur Persetujuan Anda</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                  Unit Kerja: <b>{currentUser.unitKerja}</b><br/>
                  Jabatan: <b>{currentUser.jabatan}</b> {currentUser.prodi && currentUser.prodi !== '-' ? `(Prodi: ${currentUser.prodi})` : ''}<br/>
                  Atasan Penyetuju Izin/Cuti Anda: <b style={{ color: '#0284c7' }}>{getTargetApprover(currentUser)}</b>
                </p>
              </div>
            </div>
          )}

          {activeMenu === 'ajukan-izin' && currentUser.role !== 'admin' && (
            <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ borderBottom: '2px solid #f59e0b', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Formulir Permohonan Izin</h3>
                <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>Target Persetujuan Otomatis: <b>{getTargetApprover(currentUser)}</b></p>
              </div>
              <form onSubmit={handleSubmitIzin} className="form-box">
                <div className="form-group">
                  <label className="form-label">Jenis Izin</label>
                  <select value={formIzin.jenisIzin} onChange={(e) => setFormIzin({...formIzin, jenisIzin: e.target.value})} className="form-input" required>
                    {daftarJenisIzin.map(ji => <option key={ji.id} value={ji.nama}>{ji.nama}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Tanggal Mulai</label>
                    <input type="date" value={formIzin.tanggalMulai} onChange={(e) => setFormIzin({...formIzin, tanggalMulai: e.target.value})} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Selesai</label>
                    <input type="date" value={formIzin.tanggalSelesai} onChange={(e) => setFormIzin({...formIzin, tanggalSelesai: e.target.value})} className="form-input" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Keterangan / Alasan</label>
                  <textarea value={formIzin.keterangan} onChange={(e) => setFormIzin({...formIzin, keterangan: e.target.value})} rows="3" className="form-input" required></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Upload Dokumen Pendukung (Opsional)</label>
                  <input type="file" onChange={handleFileChangeIzin} className="form-input" accept=".pdf,.png,.jpg,.jpeg" />
                </div>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#f59e0b' }}>Kirim Permohonan Izin</button>
              </form>
            </div>
          )}

          {activeMenu === 'ajukan-cuti' && currentUser.role !== 'admin' && (
            <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Formulir Permohonan Cuti</h3>
                <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>Target Persetujuan Otomatis: <b>{getTargetApprover(currentUser)}</b></p>
              </div>
              <form onSubmit={handleSubmitCuti} className="form-box">
                <div className="form-group">
                  <label className="form-label">Jenis Cuti</label>
                  <select value={formCuti.jenisCuti} onChange={(e) => setFormCuti({...formCuti, jenisCuti: e.target.value})} className="form-input" required>
                    {daftarJenisCuti.map(jc => <option key={jc.id} value={jc.nama}>{jc.nama}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Tanggal Mulai</label>
                    <input type="date" value={formCuti.tanggalMulai} onChange={(e) => setFormCuti({...formCuti, tanggalMulai: e.target.value})} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Selesai</label>
                    <input type="date" value={formCuti.tanggalSelesai} onChange={(e) => setFormCuti({...formCuti, tanggalSelesai: e.target.value})} className="form-input" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Alasan Cuti</label>
                  <textarea value={formCuti.keterangan} onChange={(e) => setFormCuti({...formCuti, keterangan: e.target.value})} rows="3" className="form-input" required></textarea>
                </div>
                <button type="submit" className="btn-green">Kirim Permohonan Cuti</button>
              </form>
            </div>
          )}

          {activeMenu === 'persetujuan' && isApproverUser && currentUser.role !== 'admin' && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
              <h3>Daftar Permohonan Masuk untuk {currentUser.jabatan} {currentUser.prodi && currentUser.prodi !== '-' ? `(${currentUser.prodi})` : ''}</h3>
              <table className="table-style" style={{ marginTop: '15px' }}>
                <thead>
                  <tr className="th-tr">
                    <th className="th-cell">Kategori</th>
                    <th className="th-cell">Nama Pemohon</th>
                    <th className="th-cell">Unit Kerja & Jabatan</th>
                    <th className="th-cell">Jenis & Tanggal</th>
                    <th className="th-cell">Durasi</th>
                    <th className="th-cell">Keterangan</th>
                    <th className="th-cell">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {getPendingForCurrentUser().length > 0 ? (
                    getPendingForCurrentUser().map((item) => (
                      <tr key={item.docId} className="td-tr">
                        <td className="td-cell"><b>{item.kategori}</b></td>
                        <td className="td-cell"><b>{item.nama}</b><br/><small>{item.nip}</small></td>
                        <td className="td-cell"><b>{item.unitKerja}</b><br/><small>{item.jabatan} {item.prodi && item.prodi !== '-' ? `(${item.prodi})` : ''}</small></td>
                        <td className="td-cell"><b>{item.jenis}</b><br/><small>{item.tglMulai} s/d {item.tglSelesai}</small></td>
                        <td className="td-cell">{item.durasi} Hari</td>
                        <td className="td-cell">{item.keterangan}</td>
                        <td className="td-cell">
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleProsesPersetujuan(item.docId, item, 'Disetujui')} style={{ ...styles.btnAction, backgroundColor: '#059669' }}>Setujui</button>
                            <button onClick={() => handleProsesPersetujuan(item.docId, item, 'Ditolak')} style={{ ...styles.btnAction, backgroundColor: '#ef4444' }}>Tolak</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Tidak ada permohonan baru untuk prodi Anda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeMenu === 'master-pegawai' && currentUser.role === 'admin' && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
              <h3>Manajemen Master Data Karyawan (Approval Akun)</h3>
              <table className="table-style" style={{ marginTop: '15px' }}>
                <thead>
                  <tr className="th-tr">
                    <th className="th-cell">Nama & Username</th>
                    <th className="th-cell">Unit Kerja</th>
                    <th className="th-cell">Jabatan / Prodi</th>
                    <th className="th-cell">Atasan Penyetuju</th>
                    <th className="th-cell">Status Akun</th>
                    <th className="th-cell">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarPegawai.map((p) => (
                    <tr key={p.docId} className="td-tr">
                      <td className="td-cell"><b>{p.nama}</b><br/><small>User: {p.username}</small></td>
                      <td className="td-cell">{p.unitKerja}</td>
                      <td className="td-cell">
                        {p.jabatan} 
                        {p.prodi && p.prodi !== '-' && (
                          <><br/><small style={{ color: '#0284c7' }}>Prodi: {p.prodi}</small></>
                        )}
                      </td>
                      <td className="td-cell" style={{ color: '#0284c7', fontWeight: 'bold' }}>{getTargetApprover(p)}</td>
                      <td className="td-cell"><span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: p.statusAkun === 'Pending' ? '#fef3c7' : '#dcfce7', color: p.statusAkun === 'Pending' ? '#b45309' : '#15803d' }}>{p.statusAkun}</span></td>
                      <td className="td-cell">
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {p.statusAkun === 'Pending' && (
                            <button onClick={() => handleApprovePegawai(p.docId)} style={{ ...styles.btnAction, backgroundColor: '#059669' }}>Approve</button>
                          )}
                          <button onClick={() => handleOpenEditModal(p)} style={{ ...styles.btnAction, backgroundColor: '#0284c7' }} title="Edit Pegawai">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          {!['admin', 'rektor'].includes(p.username) && (
                            <button onClick={() => handleDeletePegawai(p.docId, p.username)} className="btn-danger" title="Hapus Pegawai"><i className="fa-solid fa-trash"></i></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeMenu === 'riwayat' && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
              <h3>Rekapitulasi Permohonan Izin & Cuti</h3>
              <table className="table-style" style={{ marginTop: '15px' }}>
                <thead>
                  <tr className="th-tr">
                    <th className="th-cell">Kategori</th>
                    <th className="th-cell">Nama Pemohon</th>
                    <th className="th-cell">Unit Kerja</th>
                    <th className="th-cell">Jenis & Tanggal</th>
                    <th className="th-cell">Durasi</th>
                    <th className="th-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {getRiwayatForCurrentUser().length > 0 ? (
                    getRiwayatForCurrentUser().map((item) => (
                      <tr key={item.docId || item.id} className="td-tr">
                        <td className="td-cell"><b>{item.kategori}</b></td>
                        <td className="td-cell"><b>{item.nama}</b><br/><small>{item.nip}</small></td>
                        <td className="td-cell">{item.unitKerja} ({item.jabatan})</td>
                        <td className="td-cell"><b>{item.jenis}</b><br/><small>{item.tglMulai} s/d {item.tglSelesai}</small></td>
                        <td className="td-cell">{item.durasi} Hari</td>
                        <td className="td-cell"><span className={item.status.includes('Disetujui') ? 'badge-success' : 'badge'}>{item.status}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Tidak ada data riwayat.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODAL EDIT PEGAWAI */}
      {editingPegawai && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Edit Data Pegawai</h3>
            <form onSubmit={handleSaveEditPegawai}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Nama Lengkap & Gelar</label>
                <input type="text" value={editForm.nama} onChange={(e) => setEditForm({...editForm, nama: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">NIP / NIDN</label>
                <input type="text" value={editForm.nip} onChange={(e) => setEditForm({...editForm, nip: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Unit Kerja</label>
                <select 
                  value={editForm.unitKerja} 
                  onChange={(e) => {
                    const selUnit = e.target.value;
                    const firstJab = strukturKampusUTS.find(s => s.unitKerja === selUnit);
                    setEditForm({...editForm, unitKerja: selUnit, jabatanObj: firstJab });
                  }} 
                  className="form-input"
                >
                  {daftarUnitKerjaUnik.map((u, idx) => <option key={idx} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Jabatan & Penyetuju</label>
                <select 
                  value={JSON.stringify(editForm.jabatanObj)} 
                  onChange={(e) => setEditForm({...editForm, jabatanObj: JSON.parse(e.target.value)})} 
                  className="form-input"
                >
                  {strukturKampusUTS.filter(s => s.unitKerja === editForm.unitKerja).map((s, idx) => (
                    <option key={idx} value={JSON.stringify(s)}>
                      {s.jabatan} ({s.status}) - Penyetuju: {s.approver}
                    </option>
                  ))}
                </select>
              </div>

              {['Dosen', 'Kaprodi', 'Sekretaris Prodi'].includes(editForm.jabatanObj?.jabatan) && (
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Nama Program Studi</label>
                  <input type="text" value={editForm.prodi} onChange={(e) => setEditForm({...editForm, prodi: e.target.value})} className="form-input" required />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditingPegawai(null)} style={{ padding: '8px 14px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
                <button type="submit" style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  loginCard: { backgroundColor: '#fff', padding: '35px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' },
  btnLogout: { padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
  btnAction: { padding: '6px 10px', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }
};

export default App;