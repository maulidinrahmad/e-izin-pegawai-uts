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
  
  const [daftarJenisIzin, setDaftarJenisIzin] = useState([
    { id: 'ji-1', nama: 'Sakit (Dengan / Tanpa Surat Dokter)' },
    { id: 'ji-2', nama: 'Keperluan Penting / Keluarga' },
    { id: 'ji-3', nama: 'Tugas Kedinasan / Seminar' }
  ]);
  const [daftarJenisCuti, setDaftarJenisCuti] = useState([
    { id: 'jc-1', nama: 'Cuti Tahunan' },
    { id: 'jc-2', nama: 'Cuti Besar' },
    { id: 'jc-3', nama: 'Cuti Sakit' },
    { id: 'jc-4', nama: 'Cuti Melahirkan' }
  ]);

  const [inputBaruIzin, setInputBaruIzin] = useState('');
  const [inputBaruCuti, setInputBaruCuti] = useState('');

  const [strukturKampusUTS, setStrukturKampusUTS] = useState([
    { id: 'sk-w1', unitKerja: 'Wakil Rektor 1', jabatan: 'Wakil Rektor 1', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { id: 'sk-w2', unitKerja: 'Wakil Rektor 2', jabatan: 'Wakil Rektor 2', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { id: 'sk-w3', unitKerja: 'Wakil Rektor 3', jabatan: 'Wakil Rektor 3', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { id: 'sk-w4', unitKerja: 'Wakil Rektor 4', jabatan: 'Wakil Rektor 4', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },

    { id: 'sk-feb1', unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { id: 'sk-feb2', unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { id: 'sk-feb3', unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { id: 'sk-feb4', unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { id: 'sk-feb5', unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi' },
    { id: 'sk-feb6', unitKerja: 'Fakultas Ekonomi dan Bisnis', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { id: 'sk-psi1', unitKerja: 'Fakultas Psikologi', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { id: 'sk-psi2', unitKerja: 'Fakultas Psikologi', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { id: 'sk-psi3', unitKerja: 'Fakultas Psikologi', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { id: 'sk-psi4', unitKerja: 'Fakultas Psikologi', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { id: 'sk-psi5', unitKerja: 'Fakultas Psikologi', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi' },
    { id: 'sk-psi6', unitKerja: 'Fakultas Psikologi', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { id: 'sk-fisip1', unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { id: 'sk-fisip2', unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Wakil Dekan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { id: 'sk-fisip3', unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Kaprodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { id: 'sk-fisip4', unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Sekretaris Prodi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' },
    { id: 'sk-fisip5', unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Dosen', status: 'Dosen Biasa (DS)', approver: 'Kaprodi' },
    { id: 'sk-fisip6', unitKerja: 'Fakultas Ilmu Sosial dan Ilmu Politik', jabatan: 'Tenaga Kependidikan', status: 'Staf', approver: 'Dekan' },

    { id: 'sk-dir1', unitKerja: 'Direktorat Akademik (WR 1)', jabatan: 'Direktur Akademik', status: 'Dosen Tugas Tambahan (DT)', approver: 'Wakil Rektor 1' },
    { id: 'sk-dir2', unitKerja: 'Direktorat Akademik (WR 1)', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Direktur Akademik' },
    { id: 'sk-dir3', unitKerja: 'Direktorat Sumber Daya Manusia (WR 1)', jabatan: 'Direktur SDM', status: 'Dosen Tugas Tambahan (DT)', approver: 'Wakil Rektor 1' },
    { id: 'sk-dir4', unitKerja: 'Direktorat Sumber Daya Manusia (WR 1)', jabatan: 'Koordinator Pengembangan Karir', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Direktur SDM' },
    { id: 'sk-dir5', unitKerja: 'Direktorat Sumber Daya Manusia (WR 1)', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Direktur SDM' },

    { id: 'sk-dir6', unitKerja: 'Direktorat Keuangan (WR 2)', jabatan: 'Direktur Keuangan', status: 'Tenaga Kependidikan dengan Jabatan', approver: 'Wakil Rektor 2' },
    { id: 'sk-dir7', unitKerja: 'Direktorat Keuangan (WR 2)', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Direktur Keuangan' },

    { id: 'sk-b1', unitKerja: 'Badan Penjaminan Mutu Universitas', jabatan: 'Kepala Badan', status: 'Dosen Tugas Tambahan (DT)', approver: 'Rektor' },
    { id: 'sk-b2', unitKerja: 'Badan Penjaminan Mutu Universitas', jabatan: 'Kepala Deputi Bidang Audit Mutu Internal dan Akreditasi', status: 'Dosen Tugas Tambahan (DT)', approver: 'Kepala Badan' },
    { id: 'sk-b3', unitKerja: 'Badan Penjaminan Mutu Universitas', jabatan: 'Staf', status: 'Tenaga Kependidikan', approver: 'Kepala Badan' }
  ]);

  const [formUnitBaru, setFormUnitBaru] = useState({ unitKerja: '', jabatan: '', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' });

  const [editingPegawai, setEditingPegawai] = useState(null);
  const [editForm, setEditForm] = useState({ nama: '', nip: '', unitKerja: '', jabatanObj: null, prodi: '-' });

  const [filterPeriode, setFilterPeriode] = useState('semua');
  const [nilaiFilter, setNilaiFilter] = useState('');

  // ==========================================
  // 3. FIREBASE LISTENERS & RESET CUTI 1 JANUARI
  // ==========================================
  useEffect(() => {
    const unsubPegawai = onSnapshot(collection(db, "pegawai"), async (snapshot) => {
      const pegawaiData = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
      setDaftarPegawai(pegawaiData);
      
      const tahunIni = new Date().getFullYear().toString();
      const tanggalHariIni = new Date().toISOString().slice(0, 10);
      
      if (tanggalHariIni.endsWith('-01-01')) {
        pegawaiData.forEach(async (p) => {
          if (p.tahunResetCuti !== tahunIni && p.role !== 'admin') {
            await updateDoc(doc(db, "pegawai", p.docId), { jatahCuti: 12, tahunResetCuti: tahunIni });
          }
        });
      }

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
  // 4. AUTENTIKASI & REGISTRASI
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
      alert('Inisialisasi data awal berhasil!');
    } catch (err) {
      console.error(err);
      alert('Gagal inisialisasi.');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const query = loginInput.trim().toLowerCase();
    const found = daftarPegawai.find(p => 
      (p.username?.toLowerCase() === query || p.nip?.toLowerCase() === query) &&
      p.password === passwordInput
    );

    if (found) {
      if (found.statusAkun === 'Pending') {
        alert('Akun Anda masih menunggu persetujuan Admin Sistem!');
        return;
      }
      setCurrentUser(found);
      setActiveMenu('dashboard');
      alert(`Selamat datang, ${found.nama}!`);
    } else {
      alert('Username / NIP atau Password salah!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginInput('');
    setPasswordInput('');
    setIsRegisterMode(false);
  };

  const daftarUnitKerjaUnik = [...new Set(strukturKampusUTS.map(item => item.unitKerja))];

  const [regFormNama, setRegFormNama] = useState('');
  const [regFormNip, setRegFormNip] = useState('');
  const [regFormUnit, setRegFormUnit] = useState(daftarUnitKerjaUnik[0] || '');
  const [regFormJabatanObj, setRegFormJabatanObj] = useState(strukturKampusUTS[0] || {});
  const [regFormProdi, setRegFormProdi] = useState('-');
  const [regFormUsername, setRegFormUsername] = useState('');
  const [regFormPassword, setRegFormPassword] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const uname = regFormUsername.trim().toLowerCase();
    const exists = daftarPegawai.some(p => p.username?.toLowerCase() === uname || p.nip === regFormNip.trim());

    if (exists) {
      alert('Username atau NIP sudah terdaftar!');
      return;
    }

    const selectedStruktur = regFormJabatanObj;
    const needsProdi = ['Dosen', 'Kaprodi', 'Sekretaris Prodi'].includes(selectedStruktur.jabatan);

    try {
      await addDoc(collection(db, "pegawai"), {
        username: uname,
        password: regFormPassword,
        nama: regFormNama.trim(),
        nip: regFormNip.trim(),
        unitKerja: selectedStruktur.unitKerja,
        jabatan: selectedStruktur.jabatan,
        statusJabatan: selectedStruktur.status,
        approver: selectedStruktur.approver,
        prodi: needsProdi ? regFormProdi.trim() : '-',
        role: 'pegawai',
        jatahCuti: 12,
        statusAkun: 'Pending',
        tahunResetCuti: new Date().getFullYear().toString()
      });
      alert('Pendaftaran berhasil! Menunggu persetujuan Admin.');
      setIsRegisterMode(false);
    } catch (err) {
      console.error(err);
      alert('Gagal mendaftar.');
    }
  };

  // ==========================================
  // 5. MANAJEMEN KARYAWAN (EDIT & HAPUS)
  // ==========================================
  const handleDeletePegawai = async (docId, username) => {
    if (['admin', 'rektor'].includes(username)) {
      alert('Akun Utama Admin / Rektor tidak dapat dihapus!');
      return;
    }
    if (window.confirm('Yakin ingin menghapus pegawai ini?')) {
      await deleteDoc(doc(db, "pegawai", docId));
      alert('Pegawai berhasil dihapus.');
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
      alert('Gagal memperbarui pegawai.');
    }
  };

  // ==========================================
  // 6. LOGIKA PENYETUJU SPESIFIK
  // ==========================================
  const hitungDurasiHari = (tglMulai, tglSelesai) => {
    if (!tglMulai || !tglSelesai) return 0;
    const start = new Date(tglMulai);
    const end = new Date(tglSelesai);
    if (end < start) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getTargetApprover = (userObj) => {
    if (!userObj) return 'Atasan Langsung';
    
    if (userObj.jabatan === 'Dosen') {
      const namaProdi = userObj.prodi && userObj.prodi !== '-' ? userObj.prodi : userObj.unitKerja;
      return `Kaprodi ${namaProdi}`;
    }
    
    if (['Kaprodi', 'Sekretaris Prodi', 'Wakil Dekan'].includes(userObj.jabatan)) {
      return `Dekan ${userObj.unitKerja}`;
    }

    if (userObj.unitKerja?.includes('(WR 1)')) return 'Wakil Rektor 1';
    if (userObj.unitKerja?.includes('(WR 2)')) return 'Wakil Rektor 2';
    if (userObj.unitKerja?.includes('(WR 3)')) return 'Wakil Rektor 3';
    if (userObj.unitKerja?.includes('(WR 4)')) return 'Wakil Rektor 4';

    return userObj.approver || 'Rektor';
  };

  const [formIzin, setFormIzin] = useState({ jenisIzin: '', tanggalMulai: '', tanggalSelesai: '', keterangan: '', namaFile: '', fileDataUrl: '' });
  const [formCuti, setFormCuti] = useState({ jenisCuti: '', tanggalMulai: '', tanggalSelesai: '', keterangan: '' });

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
        jenis: formIzin.jenisIzin || daftarJenisIzin[0]?.nama || 'Izin',
        tglMulai: formIzin.tanggalMulai,
        tglSelesai: formIzin.tanggalSelesai,
        durasi: durasi,
        keterangan: formIzin.keterangan,
        namaFile: formIzin.namaFile || 'Tidak Ada Lampiran',
        fileDataUrl: formIzin.fileDataUrl || '',
        status: initialStatus,
        targetApprover: targetApprover,
        timestamp: new Date().toISOString()
      });
      alert(`Permohonan IZIN berhasil dikirim! Status: ${initialStatus}`);
      setFormIzin({ jenisIzin: '', tanggalMulai: '', tanggalSelesai: '', keterangan: '', namaFile: '', fileDataUrl: '' });
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim izin.');
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
      alert('Tanggal selesai tidak valid!');
      return;
    }
    if (durasi > sisaCuti) {
      alert(`Durasi cuti (${durasi} Hari) melebihi sisa kuota (${sisaCuti} Hari).`);
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
        jenis: formCuti.jenisCuti || daftarJenisCuti[0]?.nama || 'Cuti',
        tglMulai: formCuti.tanggalMulai,
        tglSelesai: formCuti.tanggalSelesai,
        durasi: durasi,
        keterangan: formCuti.keterangan,
        namaFile: '-',
        fileDataUrl: '',
        status: initialStatus,
        targetApprover: targetApprover,
        timestamp: new Date().toISOString()
      });
      alert(`Permohonan CUTI berhasil dikirim! Status: ${initialStatus}`);
      setFormCuti({ jenisCuti: '', tanggalMulai: '', tanggalSelesai: '', keterangan: '' });
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim cuti.');
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
      alert('Gagal memproses.');
    }
  };

  // ==========================================
  // 7. FILTER PENGAMBILAN DATA (DIPERKETAT AGAR DATA YANG SUDAH DISETUJUI HILANG DARI LIST)
  // ==========================================
  const isUserRektor = currentUser?.jabatan === 'Rektor' || currentUser?.role === 'rektor';
  const isApproverUser = currentUser?.role === 'admin' || isUserRektor || strukturKampusUTS.some(s => s.approver.toLowerCase().includes(currentUser?.jabatan?.toLowerCase() || ''));

  const getPendingForCurrentUser = () => {
    if (!currentUser) return [];
    
    // Admin dan Rektor melihat semua data yang masih berstatus "Menunggu Persetujuan"
    if (currentUser.role === 'admin' || isUserRektor) {
      return riwayatIzin.filter(i => i.status && i.status.includes('Menunggu Persetujuan'));
    }
    
    // Wakil Rektor 1 (Rusmin Nurjadin) menangkap unit (WR 1) yang masih berstatus "Menunggu Persetujuan"
    if (currentUser.jabatan === 'Wakil Rektor 1') {
      return riwayatIzin.filter(i => {
        if (!i.status || !i.status.includes('Menunggu Persetujuan')) return false;
        return i.unitKerja?.includes('(WR 1)');
      });
    }

    if (currentUser.jabatan === 'Kaprodi') {
      const myProdi = currentUser.prodi ? currentUser.prodi.trim().toLowerCase() : '';
      return riwayatIzin.filter(i => {
        if (!i.status || !i.status.includes('Menunggu Persetujuan')) return false;
        const isDosen = i.jabatan === 'Dosen';
        const pemohonProdi = i.prodi ? i.prodi.trim().toLowerCase() : '';
        return isDosen && pemohonProdi === myProdi && myProdi !== '-' && myProdi !== '';
      });
    }

    if (currentUser.jabatan === 'Dekan') {
      const myUnit = currentUser.unitKerja ? currentUser.unitKerja.trim().toLowerCase() : '';
      return riwayatIzin.filter(i => {
        if (!i.status || !i.status.includes('Menunggu Persetujuan')) return false;
        const pemohonUnit = i.unitKerja ? i.unitKerja.trim().toLowerCase() : '';
        const isBawahanDekan = ['kaprodi', 'sekretaris prodi', 'wakil dekan', 'tenaga kependidikan'].includes(i.jabatan?.toLowerCase());
        return isBawahanDekan && pemohonUnit === myUnit;
      });
    }

    // Untuk Direktur / Jabatan Approver Lainnya (misal: Direktur SDM)
    const userJabatan = currentUser.jabatan || '';
    return riwayatIzin.filter(i => {
      if (!i.status || !i.status.includes('Menunggu Persetujuan')) return false;
      return i.status.toLowerCase().includes(userJabatan.toLowerCase());
    });
  };

  const getRiwayatForCurrentUser = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return riwayatIzin;
    return riwayatIzin.filter(i => i.nip === currentUser.nip);
  };

  const handleExportExcel = () => {
    let dataToExport = getRiwayatForCurrentUser();
    if (filterPeriode === 'bulan' && nilaiFilter) {
      dataToExport = dataToExport.filter(item => item.tglMulai && item.tglMulai.startsWith(nilaiFilter));
    } else if (filterPeriode === 'tahun' && nilaiFilter) {
      dataToExport = dataToExport.filter(item => item.tglMulai && item.tglMulai.startsWith(nilaiFilter));
    }

    if (dataToExport.length === 0) {
      alert('Tidak ada data riwayat untuk diexport.');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No,Kategori,Nama Pemohon,NIP,Unit Kerja,Jabatan,Prodi,Jenis,Tanggal Mulai,Tanggal Selesai,Durasi (Hari),Keterangan,Status\r\n";

    dataToExport.forEach((item, index) => {
      let row = [
        index + 1, item.kategori, `"${item.nama}"`, item.nip, `"${item.unitKerja}"`, `"${item.jabatan}"`, `"${item.prodi || '-'}"`, `"${item.jenis}"`, item.tglMulai, item.tglSelesai, item.durasi, `"${item.keterangan}"`, `"${item.status}"`
      ];
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_PASTI_${filterPeriode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  // 8. RENDER UI
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
                <input type="text" value={regFormNama} onChange={(e) => setRegFormNama(e.target.value)} placeholder="Nama..." className="form-input" required />
              </div>

              <div className="form-group">
                <label className="form-label">NIP / NIDN</label>
                <input type="text" value={regFormNip} onChange={(e) => setRegFormNip(e.target.value)} placeholder="NIP..." className="form-input" required />
              </div>

              <div className="form-group">
                <label className="form-label">Pilih Unit Kerja / Fakultas / Direktorat</label>
                <select 
                  value={regFormUnit} 
                  onChange={(e) => {
                    const selUnit = e.target.value;
                    setRegFormUnit(selUnit);
                    const firstJab = strukturKampusUTS.find(s => s.unitKerja === selUnit);
                    if (firstJab) setRegFormJabatanObj(firstJab);
                  }} 
                  className="form-input"
                >
                  {daftarUnitKerjaUnik.map((unit, idx) => <option key={idx} value={unit}>{unit}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pilih Jabatan / Status Kepegawaian</label>
                <select 
                  value={JSON.stringify(regFormJabatanObj)} 
                  onChange={(e) => setRegFormJabatanObj(JSON.parse(e.target.value))} 
                  className="form-input"
                >
                  {strukturKampusUTS.filter(s => s.unitKerja === regFormUnit).map((s, idx) => (
                    <option key={idx} value={JSON.stringify(s)}>
                      {s.jabatan} ({s.status}) - Penyetuju: {s.approver}
                    </option>
                  ))}
                </select>
              </div>

              {['Dosen', 'Kaprodi', 'Sekretaris Prodi'].includes(regFormJabatanObj.jabatan) && (
                <div className="form-group">
                  <label className="form-label">Nama Program Studi</label>
                  <input type="text" value={regFormProdi} onChange={(e) => setRegFormProdi(e.target.value)} placeholder="Contoh: Ilmu Pemerintahan" className="form-input" required />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Username Pilihan</label>
                <input type="text" value={regFormUsername} onChange={(e) => setRegFormUsername(e.target.value)} placeholder="Username..." className="form-input" required />
              </div>

              <div className="form-group">
                <label className="form-label">Password Pilihan</label>
                <input type="password" value={regFormPassword} onChange={(e) => setRegFormPassword(e.target.value)} placeholder="Password..." className="form-input" required />
              </div>

              <button type="submit" className="btn-green" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                <i className="fa-solid fa-user-plus"></i> Daftar Akun Pegawai
              </button>

              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <span onClick={() => setIsRegisterMode(false)} style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer' }}>
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
            <>
              <li className={activeMenu === 'master-pegawai' ? 'menu-item menu-active' : 'menu-item'} onClick={() => setActiveMenu('master-pegawai')}>
                <i className="fa-solid fa-users-gear icon-menu"></i> Manajemen Karyawan
              </li>
              <li className={activeMenu === 'master-izin-cuti' ? 'menu-item menu-active' : 'menu-item'} onClick={() => setActiveMenu('master-izin-cuti')}>
                <i className="fa-solid fa-folder-plus icon-menu"></i> Master Jenis Izin & Cuti
              </li>
              <li className={activeMenu === 'master-struktur' ? 'menu-item menu-active' : 'menu-item'} onClick={() => setActiveMenu('master-struktur')}>
                <i className="fa-solid fa-sitemap icon-menu"></i> Master Struktur Kampus
              </li>
              <li className={activeMenu === 'riwayat' ? 'menu-item menu-active' : 'menu-item'} onClick={() => setActiveMenu('riwayat')}>
                <i className="fa-solid fa-clock-rotate-left icon-menu"></i> Riwayat & Rekapan Global
              </li>
            </>
          )}

          {currentUser.role !== 'admin' && (
            <li className={activeMenu === 'riwayat' ? 'menu-item menu-active' : 'menu-item'} onClick={() => setActiveMenu('riwayat')}>
              <i className="fa-solid fa-clock-rotate-left icon-menu"></i> Riwayat Saya
            </li>
          )}
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
              {activeMenu === 'persetujuan' && `Persetujuan Masuk (${currentUser.jabatan})`}
              {activeMenu === 'master-pegawai' && 'Manajemen Master Data Karyawan'}
              {activeMenu === 'master-izin-cuti' && 'Pengaturan Master Jenis Izin & Cuti'}
              {activeMenu === 'master-struktur' && 'Pengaturan Master Struktur & Unit Kerja'}
              {activeMenu === 'riwayat' && (currentUser.role === 'admin' ? 'Rekapitulasi Global & Export Riwayat' : 'Riwayat Pengajuan Saya')}
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
                    <option value="">-- Pilih Jenis Izin --</option>
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
                    <option value="">-- Pilih Jenis Cuti --</option>
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
              <h3>Daftar Permohonan Masuk untuk {currentUser.jabatan}</h3>
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
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Tidak ada permohonan baru untuk Anda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeMenu === 'master-pegawai' && currentUser.role === 'admin' && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
              <h3>Manajemen Master Data Karyawan (Approval & Aksi)</h3>
              <table className="table-style" style={{ marginTop: '15px' }}>
                <thead>
                  <tr className="th-tr">
                    <th className="th-cell">Nama & Username</th>
                    <th className="th-cell">Unit Kerja</th>
                    <th className="th-cell">Jabatan / Prodi</th>
                    <th className="th-cell">Status Akun</th>
                    <th className="th-cell">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarPegawai.map((p) => (
                    <tr key={p.docId} className="td-tr">
                      <td className="td-cell"><b>{p.nama}</b><br/><small>User: {p.username}</small></td>
                      <td className="td-cell">{p.unitKerja}</td>
                      <td className="td-cell">{p.jabatan} {p.prodi && p.prodi !== '-' ? `(${p.prodi})` : ''}</td>
                      <td className="td-cell"><span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: p.statusAkun === 'Pending' ? '#fef3c7' : '#dcfce7', color: p.statusAkun === 'Pending' ? '#b45309' : '#15803d' }}>{p.statusAkun}</span></td>
                      <td className="td-cell">
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {p.statusAkun === 'Pending' && (
                            <button onClick={async () => await updateDoc(doc(db, "pegawai", p.docId), { statusAkun: 'Aktif' })} style={{ ...styles.btnAction, backgroundColor: '#059669' }}>Approve</button>
                          )}
                          <button onClick={() => handleOpenEditModal(p)} style={{ ...styles.btnAction, backgroundColor: '#0284c7' }} title="Edit Pegawai">
                            <i className="fa-solid fa-pen-to-square"></i> Edit
                          </button>
                          {!['admin', 'rektor'].includes(p.username) && (
                            <button onClick={() => handleDeletePegawai(p.docId, p.username)} style={{ ...styles.btnAction, backgroundColor: '#ef4444' }} title="Hapus Pegawai">
                              <i className="fa-solid fa-trash"></i> Hapus
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeMenu === 'master-izin-cuti' && currentUser.role === 'admin' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                <h3>Master Jenis Izin</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!inputBaruIzin.trim()) return;
                  setDaftarJenisIzin([...daftarJenisIzin, { id: 'ji-' + Date.now(), nama: inputBaruIzin.trim() }]);
                  setInputBaruIzin('');
                }} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <input type="text" value={inputBaruIzin} onChange={(e) => setInputBaruIzin(e.target.value)} placeholder="Tambah jenis izin..." className="form-input" required />
                  <button type="submit" className="btn-green">Tambah</button>
                </form>
                <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
                  {daftarJenisIzin.map(ji => (
                    <li key={ji.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                      <span>{ji.nama}</span>
                      <button onClick={() => setDaftarJenisIzin(daftarJenisIzin.filter(i => i.id !== ji.id))} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Hapus</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                <h3>Master Jenis Cuti</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!inputBaruCuti.trim()) return;
                  setDaftarJenisCuti([...daftarJenisCuti, { id: 'jc-' + Date.now(), nama: inputBaruCuti.trim() }]);
                  setInputBaruCuti('');
                }} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <input type="text" value={inputBaruCuti} onChange={(e) => setInputBaruCuti(e.target.value)} placeholder="Tambah jenis cuti..." className="form-input" required />
                  <button type="submit" className="btn-green">Tambah</button>
                </form>
                <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
                  {daftarJenisCuti.map(jc => (
                    <li key={jc.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                      <span>{jc.nama}</span>
                      <button onClick={() => setDaftarJenisCuti(daftarJenisCuti.filter(i => i.id !== jc.id))} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Hapus</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeMenu === 'master-struktur' && currentUser.role === 'admin' && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>Master Struktur Kampus</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                setStrukturKampusUTS([...strukturKampusUTS, { id: 'sk-' + Date.now(), ...formUnitBaru }]);
                setFormUnitBaru({ unitKerja: '', jabatan: '', status: 'Dosen Tugas Tambahan (DT)', approver: 'Dekan' });
              }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', marginTop: '15px', alignItems: 'end' }}>
                <input type="text" value={formUnitBaru.unitKerja} onChange={(e) => setFormUnitBaru({...formUnitBaru, unitKerja: e.target.value})} className="form-input" placeholder="Unit Kerja..." required />
                <input type="text" value={formUnitBaru.jabatan} onChange={(e) => setFormUnitBaru({...formUnitBaru, jabatan: e.target.value})} className="form-input" placeholder="Jabatan..." required />
                <input type="text" value={formUnitBaru.status} onChange={(e) => setFormUnitBaru({...formUnitBaru, status: e.target.value})} className="form-input" required />
                <input type="text" value={formUnitBaru.approver} onChange={(e) => setFormUnitBaru({...formUnitBaru, approver: e.target.value})} className="form-input" required />
                <button type="submit" className="btn-green" style={{ height: '38px' }}>Tambah</button>
              </form>

              <table className="table-style" style={{ marginTop: '20px' }}>
                <thead>
                  <tr className="th-tr">
                    <th className="th-cell">Unit Kerja</th>
                    <th className="th-cell">Jabatan</th>
                    <th className="th-cell">Status</th>
                    <th className="th-cell">Penyetuju</th>
                    <th className="th-cell">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {strukturKampusUTS.map(s => (
                    <tr key={s.id} className="td-tr">
                      <td className="td-cell"><b>{s.unitKerja}</b></td>
                      <td className="td-cell">{s.jabatan}</td>
                      <td className="td-cell">{s.status}</td>
                      <td className="td-cell">{s.approver}</td>
                      <td className="td-cell">
                        <button onClick={() => setStrukturKampusUTS(strukturKampusUTS.filter(item => item.id !== s.id))} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeMenu === 'riwayat' && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                <h3>{currentUser.role === 'admin' ? 'Rekapitulasi Global Permohonan Izin & Cuti' : 'Riwayat Pengajuan Saya'}</h3>
                
                {currentUser.role === 'admin' && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <select value={filterPeriode} onChange={(e) => setFilterPeriode(e.target.value)} className="form-input" style={{ width: '130px', padding: '6px' }}>
                      <option value="semua">Semua Waktu</option>
                      <option value="bulan">Per Bulan</option>
                      <option value="tahun">Per Tahun</option>
                    </select>

                    {filterPeriode === 'bulan' && (
                      <input type="month" value={nilaiFilter} onChange={(e) => setNilaiFilter(e.target.value)} className="form-input" style={{ padding: '6px' }} />
                    )}

                    {filterPeriode === 'tahun' && (
                      <input type="number" placeholder="YYYY" value={nilaiFilter} onChange={(e) => setNilaiFilter(e.target.value)} className="form-input" style={{ width: '100px', padding: '6px' }} />
                    )}

                    <button onClick={handleExportExcel} style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-file-excel"></i> Export Excel
                    </button>
                  </div>
                )}
              </div>

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