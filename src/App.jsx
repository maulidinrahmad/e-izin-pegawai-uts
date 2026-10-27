import React, { useState, useEffect } from 'react';
import './App.css';
import logoUTS from './assets/logo-uts.png'; 
import bgUTS from './assets/uts.jpg'; 
import emailjs from '@emailjs/browser';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // State Input Form Login
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State Database dari Firestore
  const [daftarFakultas, setDaftarFakultas] = useState([]);
  const [daftarProdi, setDaftarProdi] = useState([]);
  const [daftarSatker, setDaftarSatker] = useState([]);
  const [daftarJenisIzin, setDaftarJenisIzin] = useState([]);
  const [daftarJenisCuti, setDaftarJenisCuti] = useState([]);
  const [daftarPegawai, setDaftarPegawai] = useState([]);
  const [riwayatIzin, setRiwayatIzin] = useState([]);

  // State Input Form Admin
  const [inputFakultas, setInputFakultas] = useState('');
  const [inputProdi, setInputProdi] = useState('');
  const [pilihFakultasProdi, setPilihFakultasProdi] = useState('Fakultas Teknik');
  const [inputSatker, setInputSatker] = useState('');
  const [inputJenisIzin, setInputJenisIzin] = useState('');
  const [inputJenisCuti, setInputJenisCuti] = useState('');

  // State Form Registrasi Mandiri Pegawai (Dengan opsi lengkap)
  const [regForm, setRegForm] = useState({
    nama: '',
    nip: '',
    fakultas: 'Fakultas Teknik',
    prodi: 'S1 Teknik Informatika',
    satker: '',
    role: 'dosen',
    username: '',
    password: ''
  });

  // State Admin Tambah/Edit Pegawai
  const [formPegawai, setFormPegawai] = useState({
    docId: '',
    id: '',
    nama: '',
    nip: '',
    jabatan: '',
    kategoriUnit: 'Fakultas',
    fakultas: 'Fakultas Teknik',
    prodi: 'S1 Teknik Informatika',
    satker: 'Biro Kepegawaian & SDM',
    role: 'dosen',
    jatahCuti: 12
  });

  // State Form Izin & Cuti
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

  // State Filter khusus Rektor
  const [filterRektorKategori, setFilterRektorKategori] = useState('Semua');
  const [filterRektorNilai, setFilterRektorNilai] = useState('');

  // ================= SYNC DATA REAL-TIME DARI FIRESTORE =================
  useEffect(() => {
    const unsubFakultas = onSnapshot(collection(db, "fakultas"), (snapshot) => {
      setDaftarFakultas(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    const unsubProdi = onSnapshot(collection(db, "prodi"), (snapshot) => {
      setDaftarProdi(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    const unsubSatker = onSnapshot(collection(db, "satker"), (snapshot) => {
      setDaftarSatker(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    const unsubJenisIzin = onSnapshot(collection(db, "jenisIzin"), (snapshot) => {
      setDaftarJenisIzin(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    const unsubJenisCuti = onSnapshot(collection(db, "jenisCuti"), (snapshot) => {
      setDaftarJenisCuti(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    const unsubPegawai = onSnapshot(collection(db, "pegawai"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
      setDaftarPegawai(data);
    });

    const unsubRiwayat = onSnapshot(collection(db, "riwayatIzin"), (snapshot) => {
      setRiwayatIzin(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    return () => {
      unsubFakultas();
      unsubProdi();
      unsubSatker();
      unsubJenisIzin();
      unsubJenisCuti();
      unsubPegawai();
      unsubRiwayat();
    };
  }, []);

  const seedInitialData = async () => {
    try {
      await addDoc(collection(db, "pegawai"), {
        id: 'ADM01', username: 'admin', password: '123', nama: 'Admin Sistem IT', nip: 'ADM001', fakultas: '', prodi: '', satker: 'Pusat Komputer & Data (Puskom)', jabatan: 'Administrator IT', role: 'admin', jatahCuti: 12, statusAkun: 'Aktif'
      });
      await addDoc(collection(db, "pegawai"), {
        id: 'REKTOR01', username: 'rektor', password: '123', nama: 'Dr. Nikolas, M.Si.', nip: '197001012000', fakultas: '', prodi: '', satker: 'Rektorat UTS', jabatan: 'Rektor UTS', role: 'rektor', jatahCuti: 12, statusAkun: 'Aktif'
      });
      await addDoc(collection(db, "fakultas"), { id: 'FK01', nama: 'Fakultas Teknik' });
      await addDoc(collection(db, "prodi"), { id: 'PR01', fakultas: 'Fakultas Teknik', nama: 'S1 Teknik Informatika' });
      await addDoc(collection(db, "satker"), { id: 'SK01', nama: 'Biro Kepegawaian & SDM' });
      await addDoc(collection(db, "jenisIzin"), { id: 'JI01', nama: 'Sakit (Dengan / Tanpa Surat Dokter)' });
      await addDoc(collection(db, "jenisCuti"), { id: 'JC01', nama: 'Cuti Tahunan' });
      alert('Inisialisasi data awal berhasil!');
    } catch (err) {
      console.error(err);
    }
  };

  const hitungDurasiHari = (tglMulai, tglSelesai) => {
    if (!tglMulai || !tglSelesai) return 0;
    const start = new Date(tglMulai);
    const end = new Date(tglSelesai);
    if (end < start) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getSisaCutiByNip = (nip) => {
    const pgw = daftarPegawai.find(p => p.nip === nip);
    return pgw ? pgw.jatahCuti : 12;
  };

  const getInitialStatusByRole = (role) => {
    switch (role) {
      case 'dosen': return 'Menunggu Persetujuan Kaprodi';
      case 'kaprodi':
      case 'tendik_fakultas': return 'Menunggu Persetujuan Dekan';
      case 'dekan': return 'Menunggu Persetujuan Rektor';
      case 'tendik_rektorat':
      case 'kepala_unit': return 'Menunggu Persetujuan Kepala Unit';
      default: return 'Menunggu Persetujuan Atasan';
    }
  };

  const isApproverRole = ['kaprodi', 'dekan', 'kepala_unit'].includes(currentUser?.role);

  const getPendingForCurrentUser = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'kaprodi') {
      return riwayatIzin.filter(i => i.status === 'Menunggu Persetujuan Kaprodi' && i.prodi === currentUser.prodi);
    }
    if (currentUser.role === 'dekan') {
      return riwayatIzin.filter(i => i.status === 'Menunggu Persetujuan Dekan' && i.fakultas === currentUser.fakultas);
    }
    if (currentUser.role === 'kepala_unit') {
      return riwayatIzin.filter(i => i.status === 'Menunggu Persetujuan Kepala Unit' && i.satker === currentUser.satker);
    }
    return [];
  };

  const getRiwayatForCurrentUser = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin' || currentUser.role === 'rektor') return riwayatIzin;
    if (currentUser.role === 'dekan') return riwayatIzin.filter(i => i.fakultas === currentUser.fakultas);
    if (currentUser.role === 'kaprodi') return riwayatIzin.filter(i => i.prodi === currentUser.prodi);
    if (currentUser.role === 'kepala_unit') return riwayatIzin.filter(i => i.satker === currentUser.satker);
    return riwayatIzin.filter(i => i.nip === currentUser.nip);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const query = loginInput.trim().toLowerCase();
    const found = daftarPegawai.find(p => 
      (p.username?.toLowerCase() === query || p.id?.toLowerCase() === query || p.nip?.toLowerCase() === query) &&
      p.password === passwordInput
    );

    if (found) {
      if (found.statusAkun === 'Pending') {
        alert('Akun Anda masih menunggu persetujuan (approval) dari Admin Sistem!');
        return;
      }
      setCurrentUser(found);
      setActiveMenu('dashboard');
      alert(`Selamat datang di Portal E-Izin & Cuti UTS, ${found.nama}!`);
    } else {
      alert('Username / NIP atau Password salah, atau akun belum terdaftar!');
    }
  };

  // Handler Registrasi Mandiri dengan Role Lengkap
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const exists = daftarPegawai.some(p => 
      p.username?.toLowerCase() === regForm.username.trim().toLowerCase() ||
      p.nip === regForm.nip.trim()
    );

    if (exists) {
      alert('Username atau NIP tersebut sudah terdaftar di sistem!');
      return;
    }

    // Jika Dekan, prodi diset kosong / tanda -
    const isDekanOrNoProdi = regForm.role === 'dekan';

    try {
      await addDoc(collection(db, "pegawai"), {
        id: `PGW${Date.now().toString().slice(-4)}`,
        username: regForm.username.trim(),
        password: regForm.password,
        nama: regForm.nama.trim(),
        nip: regForm.nip.trim(),
        fakultas: regForm.fakultas,
        prodi: isDekanOrNoProdi ? '-' : regForm.prodi,
        satker: '',
        jabatan: regForm.role === 'dekan' ? `Dekan ${regForm.fakultas}` : regForm.role === 'kaprodi' ? `Kaprodi ${regForm.prodi}` : regForm.role.toUpperCase().replace('_', ' '),
        role: regForm.role,
        jatahCuti: 12,
        statusAkun: 'Pending'
      });
      alert('Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan Admin.');
      setRegForm({ nama: '', nip: '', fakultas: 'Fakultas Teknik', prodi: 'S1 Teknik Informatika', satker: '', role: 'dosen', username: '', password: '' });
      setIsRegisterMode(false);
    } catch (err) {
      console.error(err);
      alert('Gagal mendaftarkan akun.');
    }
  };

  const handleApprovePegawai = async (docId) => {
    try {
      await updateDoc(doc(db, "pegawai", docId), { statusAkun: 'Aktif' });
      alert('Akun pegawai berhasil disetujui (diaktifkan)!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyetujui akun.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginInput('');
    setPasswordInput('');
  };

  // Handler Simpan Pegawai oleh Admin (Penanganan khusus Dekan -> Prodi = '-')
  const handleSavePegawai = async (e) => {
    e.preventDefault();
    const isFakultas = formPegawai.kategoriUnit === 'Fakultas';
    let autoJabatan = formPegawai.jabatan;

    if (formPegawai.role === 'kaprodi') autoJabatan = `Kaprodi ${formPegawai.prodi}`;
    else if (formPegawai.role === 'dekan') autoJabatan = `Dekan ${formPegawai.fakultas}`;
    else if (formPegawai.role === 'kepala_unit') autoJabatan = `Kepala Unit / Direktur`;

    // Jika Dekan atau role non-prodi fakultas, prodi diatur '-'
    const finalProdi = (formPegawai.role === 'dekan' && isFakultas) ? '-' : (isFakultas ? formPegawai.prodi : '-');

    const dataPayload = {
      id: formPegawai.id || `PGW00${daftarPegawai.length + 1}`,
      username: formPegawai.id ? formPegawai.id.toLowerCase() : `pgw00${daftarPegawai.length + 1}`,
      password: '123',
      nama: formPegawai.nama,
      nip: formPegawai.nip,
      fakultas: isFakultas ? formPegawai.fakultas : '',
      prodi: finalProdi,
      satker: !isFakultas ? formPegawai.satker : '',
      jabatan: autoJabatan,
      role: formPegawai.role,
      jatahCuti: formPegawai.jatahCuti,
      statusAkun: 'Aktif'
    };

    try {
      if (formPegawai.docId) {
        await updateDoc(doc(db, "pegawai", formPegawai.docId), dataPayload);
        alert('Data dan Jabatan Pegawai berhasil diperbarui!');
      } else {
        await addDoc(collection(db, "pegawai"), dataPayload);
        alert('Data pegawai UTS baru berhasil ditambahkan!');
      }
      setFormPegawai({
        docId: '', id: '', nama: '', nip: '', jabatan: '', kategoriUnit: 'Fakultas',
        fakultas: daftarFakultas[0]?.nama || 'Fakultas Teknik', prodi: daftarProdi[0]?.nama || 'S1 Teknik Informatika',
        satker: daftarSatker[0]?.nama || 'Biro Kepegawaian & SDM', role: 'dosen', jatahCuti: 12
      });
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan pegawai.');
    }
  };

  const handleDeletePegawai = async (docId, id) => {
    if (['ADM01', 'REKTOR01'].includes(id)) {
      alert('Akun Utama Admin / Rektor tidak dapat dihapus!');
      return;
    }
    if (window.confirm('Yakin ingin menghapus data pegawai ini?')) {
      try {
        await deleteDoc(doc(db, "pegawai", docId));
        alert('Data pegawai berhasil dihapus.');
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus pegawai.');
      }
    }
  };

  const handleAddFakultas = async (e) => {
    e.preventDefault();
    if (!inputFakultas.trim()) return;
    await addDoc(collection(db, "fakultas"), { id: `FK${Date.now()}`, nama: inputFakultas.trim() });
    setInputFakultas('');
  };
  const handleDeleteFakultas = async (docId) => { await deleteDoc(doc(db, "fakultas", docId)); };

  const handleAddProdi = async (e) => {
    e.preventDefault();
    if (!inputProdi.trim()) return;
    await addDoc(collection(db, "prodi"), { id: `PR${Date.now()}`, fakultas: pilihFakultasProdi, nama: inputProdi.trim() });
    setInputProdi('');
  };
  const handleDeleteProdi = async (docId) => { await deleteDoc(doc(db, "prodi", docId)); };

  const handleAddSatker = async (e) => {
    e.preventDefault();
    if (!inputSatker.trim()) return;
    await addDoc(collection(db, "satker"), { id: `SK${Date.now()}`, nama: inputSatker.trim() });
    setInputSatker('');
  };
  const handleDeleteSatker = async (docId) => { await deleteDoc(doc(db, "satker", docId)); };

  const handleAddJenisIzin = async (e) => {
    e.preventDefault();
    if (!inputJenisIzin.trim()) return;
    await addDoc(collection(db, "jenisIzin"), { id: `JI${Date.now()}`, nama: inputJenisIzin.trim() });
    setInputJenisIzin('');
  };
  const handleDeleteJenisIzin = async (docId) => { await deleteDoc(doc(db, "jenisIzin", docId)); };

  const handleAddJenisCuti = async (e) => {
    e.preventDefault();
    if (!inputJenisCuti.trim()) return;
    await addDoc(collection(db, "jenisCuti"), { id: `JC${Date.now()}`, nama: inputJenisCuti.trim() });
    setInputJenisCuti('');
  };
  const handleDeleteJenisCuti = async (docId) => { await deleteDoc(doc(db, "jenisCuti", docId)); };

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

  const handleExportExcel = () => {
    const listToExport = getRiwayatForCurrentUser();
    let tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"/></head>
      <body>
        <h3>REKAPITULASI PERMOHONAN IZIN DAN CUTI PEGAWAI UTS</h3>
        <table border="1">
          <thead>
            <tr style="background-color: #f2f2f2; font-weight: bold;">
              <th>No</th><th>Kategori</th><th>Nama Pemohon</th><th>NIP</th><th>Fakultas / Satker</th><th>Prodi</th><th>Jabatan</th><th>Sisa Cuti</th><th>Jenis</th><th>Tanggal Mulai</th><th>Tanggal Selesai</th><th>Durasi</th><th>Keterangan</th><th>Lampiran</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
    `;
    listToExport.forEach((item, index) => {
      tableHTML += `
        <tr>
          <td>${index + 1}</td><td>${item.kategori}</td><td>${item.nama}</td><td>${item.nip}</td><td>${item.fakultas || item.satker || '-'}</td><td>${item.prodi || '-'}</td><td>${item.jabatan || item.rolePemohon}</td><td>${getSisaCutiByNip(item.nip)} Hari</td><td>${item.jenis}</td><td>${item.tglMulai}</td><td>${item.tglSelesai}</td><td>${item.durasi}</td><td>${item.keterangan}</td><td>${item.namaFile || '-'}</td><td>${item.status}</td>
        </tr>
      `;
    });
    tableHTML += `</tbody></table></body></html>`;
    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Izin_Cuti_UTS_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmitIzin = async (e) => {
    e.preventDefault();
    const durasi = hitungDurasiHari(formIzin.tanggalMulai, formIzin.tanggalSelesai);
    const initialStatus = getInitialStatusByRole(currentUser.role);
    
    try {
      await addDoc(collection(db, "riwayatIzin"), {
        id: Date.now(),
        kategori: 'Izin',
        nama: currentUser.nama,
        nip: currentUser.nip,
        fakultas: currentUser.fakultas || '',
        prodi: currentUser.prodi || '',
        satker: currentUser.satker || '',
        jabatan: currentUser.jabatan,
        rolePemohon: currentUser.role,
        jenis: formIzin.jenisIzin || daftarJenisIzin[0]?.nama || 'Sakit',
        tglMulai: formIzin.tanggalMulai,
        tglSelesai: formIzin.tanggalSelesai,
        durasi: durasi,
        keterangan: formIzin.keterangan,
        namaFile: formIzin.namaFile || 'Tidak Ada Lampiran',
        fileDataUrl: formIzin.fileDataUrl || '',
        status: initialStatus
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
    const pgwData = daftarPegawai.find(p => p.nip === currentUser.nip || p.id === currentUser.id);
    const sisaCuti = pgwData ? pgwData.jatahCuti : 12;
    const initialStatus = getInitialStatusByRole(currentUser.role);

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
        fakultas: currentUser.fakultas || '',
        prodi: currentUser.prodi || '',
        satker: currentUser.satker || '',
        jabatan: currentUser.jabatan,
        rolePemohon: currentUser.role,
        jenis: formCuti.jenisCuti || daftarJenisCuti[0]?.nama || 'Cuti Tahunan',
        tglMulai: formCuti.tanggalMulai,
        tglSelesai: formCuti.tanggalSelesai,
        durasi: durasi,
        keterangan: formCuti.keterangan,
        namaFile: '-',
        fileDataUrl: '',
        status: initialStatus
      });
      alert(`Permohonan CUTI (${durasi} Hari) berhasil dikirim! Status: ${initialStatus}`);
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
        const foundPgw = daftarPegawai.find(p => p.nip === targetItem.nip || p.id === targetItem.nip);
        if (foundPgw) {
          const sisaBaru = Math.max(0, foundPgw.jatahCuti - targetItem.durasi);
          await updateDoc(doc(db, "pegawai", foundPgw.docId), { jatahCuti: sisaBaru });
        }
      }

      if (isApprove) {
        emailjs.send(
          'service_8idlvcd',
          'TEMPLATE_d5izz7c',
          {
            to_email: 'samsu.alfin@uts.ac.id',
            nama_pegawai: targetItem.nama || '',
            nip_pegawai: targetItem.nip || '',
            jenis_izin: `[${targetItem.kategori.toUpperCase()}] ${targetItem.jenis}`,
            tanggal_mulai: targetItem.tglMulai || '',
            tanggal_selesai: targetItem.tglSelesai || '',
            keterangan: `${targetItem.keterangan} (${targetItem.durasi} Hari) - Penyetuju: ${currentUser.nama} (${currentUser.jabatan})`,
          },
          'L9kckOLpayPBV7E-n'
        ).catch(err => console.error(err));
        alert(`${targetItem.kategori} berhasil disetujui & email terkirim!`);
      } else {
        alert('Pengajuan telah ditolak.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal memproses persetujuan.');
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setIsSidebarOpen(false);
  };

  const getRiwayatFilteredForRektor = () => {
    if (filterRektorKategori === 'Semua' || !filterRektorNilai) return riwayatIzin;
    if (filterRektorKategori === 'Fakultas') return riwayatIzin.filter(r => r.fakultas === filterRektorNilai);
    if (filterRektorKategori === 'Prodi') return riwayatIzin.filter(r => r.prodi === filterRektorNilai);
    if (filterRektorKategori === 'Satker') return riwayatIzin.filter(r => r.satker === filterRektorNilai);
    return riwayatIzin;
  };

  // ================= HALAMAN LOGIN & REGISTRASI =================
  if (!currentUser) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', width: '100%', backgroundImage: `url(${bgUTS})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1 }}></div>
        <div style={{ ...styles.loginCard, position: 'relative', zIndex: 2, backgroundColor: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(8px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={logoUTS} alt="Logo UTS" style={{ width: '75px', height: '75px', objectFit: 'contain', marginBottom: '10px' }} />
            <h2 style={{ fontSize: '20px', color: '#1e293b' }}>E-Izin & Cuti Pegawai UTS</h2>
            <p style={{ color: '#666', fontSize: '13px', marginTop: '5px' }}>Universitas Teknologi Sumbawa (UTS)</p>
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
                <i className="fa-solid fa-right-to-bracket"></i> Masuk Portal
              </button>

              {daftarPegawai.length === 0 && (
                <button type="button" onClick={seedInitialData} style={{ width: '100%', marginTop: '10px', padding: '8px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                  <i className="fa-solid fa-database"></i> Inisialisasi Data Awal
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
              <h4 style={{ textAlign: 'center', color: '#0284c7', marginBottom: '15px' }}>Formulir Registrasi Mandiri</h4>
              <div className="form-group">
                <label className="form-label">Nama Lengkap & Gelar</label>
                <input type="text" value={regForm.nama} onChange={(e) => setRegForm({...regForm, nama: e.target.value})} placeholder="Nama..." className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">NIP / NIDN</label>
                <input type="text" value={regForm.nip} onChange={(e) => setRegForm({...regForm, nip: e.target.value})} placeholder="NIP..." className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Fakultas Tempat Bertugas</label>
                <select value={regForm.fakultas} onChange={(e) => setRegForm({...regForm, fakultas: e.target.value})} className="form-input">
                  {daftarFakultas.map(f => <option key={f.docId} value={f.nama}>{f.nama}</option>)}
                </select>
              </div>

              {/* Sembunyikan pilihan prodi jika memilih Dekan */}
              {regForm.role !== 'dekan' && (
                <div className="form-group">
                  <label className="form-label">Program Studi</label>
                  <select value={regForm.prodi} onChange={(e) => setRegForm({...regForm, prodi: e.target.value})} className="form-input">
                    {daftarProdi.filter(p => p.fakultas === regForm.fakultas).map(p => <option key={p.docId} value={p.nama}>{p.nama}</option>)}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Kategori / Jabatan Pegawai</label>
                <select value={regForm.role} onChange={(e) => setRegForm({...regForm, role: e.target.value})} className="form-input">
                  <option value="dosen">Dosen (Persetujuan Kaprodi)</option>
                  <option value="kaprodi">Kaprodi (Persetujuan Dekan)</option>
                  <option value="dekan">Dekan Fakultas (Persetujuan Rektor)</option>
                  <option value="kepala_unit">Kepala Unit / Direktur</option>
                  <option value="tendik_fakultas">Tendik Fakultas (Persetujuan Dekan)</option>
                  <option value="tendik_rektorat">Tendik Rektorat (Persetujuan Kepala Unit)</option>
                </select>
              </div>
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
          <span>E-Izin & Cuti UTS</span>
        </div>
        <ul className="menu-list">
          <li className={activeMenu === 'dashboard' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('dashboard')}>
            <i className="fa-solid fa-chart-line icon-menu"></i> Dashboard
          </li>
          {currentUser.role !== 'admin' && currentUser.role !== 'rektor' && (
            <>
              <li className={activeMenu === 'ajukan-izin' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('ajukan-izin')}>
                <i className="fa-solid fa-file-pen icon-menu"></i> Form Permohonan Izin
              </li>
              <li className={activeMenu === 'ajukan-cuti' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('ajukan-cuti')}>
                <i className="fa-solid fa-umbrella-beach icon-menu"></i> Form Permohonan Cuti
              </li>
            </>
          )}
          {isApproverRole && (
            <li className={activeMenu === 'persetujuan' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('persetujuan')}>
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
              <li className={activeMenu === 'master-unit' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('master-unit')}>
                <i className="fa-solid fa-building-columns icon-menu"></i> Pengaturan Unit & Kategori
              </li>
              <li className={activeMenu === 'master-pegawai' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('master-pegawai')}>
                <i className="fa-solid fa-users-gear icon-menu"></i> Master Data Karyawan
                {daftarPegawai.filter(p => p.statusAkun === 'Pending').length > 0 && (
                  <span style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', marginLeft: 'auto' }}>
                    {daftarPegawai.filter(p => p.statusAkun === 'Pending').length} Pending
                  </span>
                )}
              </li>
            </>
          )}
          <li className={activeMenu === 'riwayat' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('riwayat')}>
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
              {activeMenu === 'dashboard' && 'Dashboard Utama'}
              {activeMenu === 'ajukan-izin' && 'Form Pengajuan Izin Pegawai'}
              {activeMenu === 'ajukan-cuti' && 'Form Pengajuan Cuti Pegawai'}
              {activeMenu === 'persetujuan' && `Persetujuan Masuk (${currentUser.jabatan})`}
              {activeMenu === 'master-unit' && 'Pengaturan Master Satker, Fakultas, Jenis Izin & Cuti'}
              {activeMenu === 'master-pegawai' && 'Manajemen Master Data Karyawan'}
              {activeMenu === 'riwayat' && 'Riwayat & Rekapan Laporan Seluruh Pegawai'}
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
                  <h3>Master Kategori</h3>
                  <p className="card-value" style={{ color: '#0284c7' }}>
                    {daftarJenisIzin.length} Izin / {daftarJenisCuti.length} Cuti
                  </p>
                </div>
                <div className="card">
                  <h3>Status Database</h3>
                  <p className="card-value" style={{ fontSize: '15px', color: '#059669', marginTop: '12px' }}>
                    <i className="fa-solid fa-cloud-arrow-up"></i> Terhubung Firebase
                  </p>
                </div>
              </div>

              {currentUser.role === 'rektor' && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginTop: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '12px', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>
                      <i className="fa-solid fa-eye" style={{ color: '#0284c7', marginRight: '8px' }}></i>
                      Pantauan Aktivitas Izin & Cuti Seluruh Dosen dan Karyawan (Khusus Rektor)
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: '#475569' }}>Kategori Filter:</label>
                      <select value={filterRektorKategori} onChange={(e) => { setFilterRektorKategori(e.target.value); setFilterRektorNilai(''); }} className="form-input" style={{ padding: '6px 12px', fontSize: '13px' }}>
                        <option value="Semua">Tampilkan Semua Unit</option>
                        <option value="Fakultas">Filter per Fakultas</option>
                        <option value="Prodi">Filter per Program Studi</option>
                        <option value="Satker">Filter per Satuan Kerja / Biro</option>
                      </select>
                    </div>
                    {filterRektorKategori === 'Fakultas' && (
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: '#475569' }}>Pilih Fakultas:</label>
                        <select value={filterRektorNilai} onChange={(e) => setFilterRektorNilai(e.target.value)} className="form-input" style={{ padding: '6px 12px', fontSize: '13px' }}>
                          <option value="">-- Semua Fakultas --</option>
                          {daftarFakultas.map(f => <option key={f.docId} value={f.nama}>{f.nama}</option>)}
                        </select>
                      </div>
                    )}
                    {filterRektorKategori === 'Prodi' && (
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: '#475569' }}>Pilih Program Studi:</label>
                        <select value={filterRektorNilai} onChange={(e) => setFilterRektorNilai(e.target.value)} className="form-input" style={{ padding: '6px 12px', fontSize: '13px' }}>
                          <option value="">-- Semua Prodi --</option>
                          {daftarProdi.map(p => <option key={p.docId} value={p.nama}>{p.nama} ({p.fakultas})</option>)}
                        </select>
                      </div>
                    )}
                    {filterRektorKategori === 'Satker' && (
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: '#475569' }}>Pilih Satuan Kerja:</label>
                        <select value={filterRektorNilai} onChange={(e) => setFilterRektorNilai(e.target.value)} className="form-input" style={{ padding: '6px 12px', fontSize: '13px' }}>
                          <option value="">-- Semua Satker --</option>
                          {daftarSatker.map(s => <option key={s.docId} value={s.nama}>{s.nama}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table-style">
                      <thead>
                        <tr className="th-tr">
                          <th className="th-cell">Kategori</th><th className="th-cell">Nama Pemohon & Jabatan</th><th className="th-cell">Unit / Fakultas / Prodi</th><th className="th-cell">Jenis & Tanggal</th><th className="th-cell">Durasi</th><th className="th-cell">Keterangan</th><th className="th-cell">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getRiwayatFilteredForRektor().length > 0 ? (
                          getRiwayatFilteredForRektor().map(item => (
                            <tr key={item.docId || item.id} className="td-tr">
                              <td className="td-cell"><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: item.kategori === 'Cuti' ? '#e0f2fe' : '#fef3c7', color: item.kategori === 'Cuti' ? '#0369a1' : '#b45309' }}>{item.kategori}</span></td>
                              <td className="td-cell"><b>{item.nama}</b><br/><small style={{ color: '#64748b' }}>NIP: {item.nip}</small></td>
                              <td className="td-cell"><b>{item.fakultas || item.satker || '-'}</b><br/><small style={{ color: '#0284c7' }}>{item.prodi || '-'}</small></td>
                              <td className="td-cell"><b>{item.jenis}</b><br/><small>{item.tglMulai} s/d {item.tglSelesai}</small></td>
                              <td className="td-cell">{item.durasi} Hari</td>
                              <td className="td-cell">{item.keterangan}</td>
                              <td className="td-cell"><span className={item.status.includes('Disetujui') ? 'badge-success' : 'badge'}>{item.status}</span></td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Tidak ada riwayat pengajuan.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {currentUser.role !== 'admin' && currentUser.role !== 'rektor' && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '5px solid #0284c7' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>
                      <i className="fa-solid fa-calendar-check" style={{ marginRight: '8px', color: '#0284c7' }}></i>
                      Sisa Kuota Cuti Tahunan Anda (Tahun 2026)
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#0284c7' }}>
                      {(() => {
                        const pgwData = daftarPegawai.find(p => p.nip === currentUser?.nip || p.id === currentUser?.id);
                        return pgwData?.jatahCuti ?? 12;
                      })()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '5px' }}>/ 12 Hari Tersisa</span>
                  </div>
                </div>
              )}

              {currentUser.role === 'admin' && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginTop: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>
                    <i className="fa-solid fa-users" style={{ marginRight: '8px', color: '#0284c7' }}></i>
                    Ringkasan Saldo Cuti Seluruh Pegawai UTS
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '10px' }}>NIP / ID</th><th style={{ padding: '10px' }}>Nama Pegawai</th><th style={{ padding: '10px' }}>Fakultas / Satker</th><th style={{ padding: '10px' }}>Prodi</th><th style={{ padding: '10px', textAlign: 'center' }}>Terpakai</th><th style={{ padding: '10px', textAlign: 'center' }}>Sisa Cuti</th>
                        </tr>
                      </thead>
                      <tbody>
                        {daftarPegawai.filter(p => p.role !== 'admin' && p.role !== 'rektor').map((pgw) => {
                          const terpakai = 12 - pgw.jatahCuti;
                          return (
                            <tr key={pgw.docId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px', fontWeight: 'bold' }}>{pgw.nip}</td>
                              <td style={{ padding: '10px' }}>{pgw.nama}<br/><small style={{color:'#64748b'}}>{pgw.jabatan}</small></td>
                              <td style={{ padding: '10px' }}>{pgw.fakultas || pgw.satker || '-'}</td>
                              <td style={{ padding: '10px' }}>{pgw.prodi || '-'}</td>
                              <td style={{ padding: '10px', textAlign: 'center', color: terpakai > 0 ? '#dc2626' : '#64748b' }}>{terpakai} Hari</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>
                                <span style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: pgw.jatahCuti > 3 ? '#dcfce7' : '#fee2e2', color: pgw.jatahCuti > 3 ? '#15803d' : '#991b1b', fontWeight: 'bold' }}>
                                  {pgw.jatahCuti} Hari Sisa
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeMenu === 'ajukan-izin' && currentUser.role !== 'rektor' && (
            <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ borderBottom: '2px solid #f59e0b', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}><i className="fa-solid fa-file-pen" style={{ color: '#f59e0b', marginRight: '8px' }}></i>Formulir Permohonan Izin</h3>
                <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>Target Persetujuan: <b>{getInitialStatusByRole(currentUser.role)}</b></p>
              </div>
              <form onSubmit={handleSubmitIzin} className="form-box">
                <div className="form-group">
                  <label className="form-label">Nama Pemohon</label>
                  <input type="text" value={currentUser.nama} className="form-input" disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis Izin</label>
                  <select value={formIzin.jenisIzin} onChange={(e) => setFormIzin({...formIzin, jenisIzin: e.target.value})} className="form-input" required>
                    <option value="">-- Pilih Jenis Izin --</option>
                    {daftarJenisIzin.map(ji => <option key={ji.docId} value={ji.nama}>{ji.nama}</option>)}
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
                  <label className="form-label">Keterangan / Alasan Izin</label>
                  <textarea value={formIzin.keterangan} onChange={(e) => setFormIzin({...formIzin, keterangan: e.target.value})} rows="3" className="form-input" required placeholder="Alasan izin..."></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <i className="fa-solid fa-paperclip" style={{ marginRight: '5px', color: '#f59e0b' }}></i>
                    Upload Dokumen Pendukung (PDF / Foto / Surat Dokter)
                  </label>
                  <input type="file" onChange={handleFileChangeIzin} className="form-input" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
                  {formIzin.namaFile && (
                    <small style={{ color: '#059669', marginTop: '5px', display: 'block', fontWeight: 'bold' }}>
                      <i className="fa-solid fa-file-check"></i> Dokumen Terpilih: {formIzin.namaFile}
                    </small>
                  )}
                </div>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#f59e0b' }}>
                  <i className="fa-solid fa-paper-plane"></i> Kirim Permohonan Izin
                </button>
              </form>
            </div>
          )}

          {activeMenu === 'ajukan-cuti' && currentUser.role !== 'rektor' && (
            <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}><i className="fa-solid fa-umbrella-beach" style={{ color: '#0284c7', marginRight: '8px' }}></i>Formulir Permohonan Cuti</h3>
                <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>Target Persetujuan: <b>{getInitialStatusByRole(currentUser.role)}</b></p>
              </div>
              <div style={{ backgroundColor: '#f0f9ff', padding: '12px 15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #bae6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#0369a1', fontWeight: '500' }}>Sisa Kuota Cuti Tahunan Anda:</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#0284c7' }}>
                  {(() => {
                    const pgwData = daftarPegawai.find(p => p.nip === currentUser?.nip || p.id === currentUser?.id);
                    return pgwData?.jatahCuti ?? 12;
                  })()} Hari
                </span>
              </div>
              <form onSubmit={handleSubmitCuti} className="form-box">
                <div className="form-group">
                  <label className="form-label">Nama Pemohon</label>
                  <input type="text" value={currentUser.nama} className="form-input" disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis Cuti</label>
                  <select value={formCuti.jenisCuti} onChange={(e) => setFormCuti({...formCuti, jenisCuti: e.target.value})} className="form-input" required>
                    <option value="">-- Pilih Jenis Cuti --</option>
                    {daftarJenisCuti.map(jc => <option key={jc.docId} value={jc.nama}>{jc.nama}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Tanggal Mulai Cuti</label>
                    <input type="date" value={formCuti.tanggalMulai} onChange={(e) => setFormCuti({...formCuti, tanggalMulai: e.target.value})} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Selesai Cuti</label>
                    <input type="date" value={formCuti.tanggalSelesai} onChange={(e) => setFormCuti({...formCuti, tanggalSelesai: e.target.value})} className="form-input" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Alasan Cuti & Catatan</label>
                  <textarea value={formCuti.keterangan} onChange={(e) => setFormCuti({...formCuti, keterangan: e.target.value})} rows="3" className="form-input" required placeholder="Alasan cuti..."></textarea>
                </div>
                <button type="submit" className="btn-green">
                  <i className="fa-solid fa-paper-plane"></i> Kirim Permohonan Cuti
                </button>
              </form>
            </div>
          )}

          {activeMenu === 'persetujuan' && isApproverRole && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
              <h3>Daftar Permohonan Masuk untuk {currentUser.jabatan}</h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                {currentUser.role === 'kaprodi' && `Menampilkan pengajuan khusus dari Dosen di ${currentUser.prodi}.`}
                {currentUser.role === 'dekan' && `Menampilkan pengajuan khusus dari Kaprodi/Tendik di ${currentUser.fakultas}.`}
                {currentUser.role === 'kepala_unit' && `Menampilkan pengajuan khusus dari Tendik di ${currentUser.satker}.`}
              </p>
              <table className="table-style">
                <thead>
                  <tr className="th-tr">
                    <th className="th-cell">Kategori</th><th className="th-cell">Nama Pemohon</th><th className="th-cell">Prodi / Fakultas</th><th className="th-cell">Jenis & Tanggal</th><th className="th-cell">Durasi</th><th className="th-cell">Keterangan & Lampiran</th><th className="th-cell">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {getPendingForCurrentUser().length > 0 ? (
                    getPendingForCurrentUser().map((item) => (
                      <tr key={item.docId} className="td-tr">
                        <td className="td-cell"><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: item.kategori === 'Cuti' ? '#e0f2fe' : '#fef3c7', color: item.kategori === 'Cuti' ? '#0369a1' : '#b45309' }}>{item.kategori}</span></td>
                        <td className="td-cell"><b>{item.nama}</b><br/><small>{item.nip}</small></td>
                        <td className="td-cell"><b>{item.prodi || '-'}</b><br/><small>{item.fakultas || item.satker}</small></td>
                        <td className="td-cell"><b>{item.jenis}</b><br/><small>{item.tglMulai} s/d {item.tglSelesai}</small></td>
                        <td className="td-cell">{item.durasi} Hari</td>
                        <td className="td-cell">
                          {item.keterangan}<br/>
                          {item.namaFile && item.namaFile !== '-' && (
                            <small style={{ color: '#0284c7', fontWeight: 'bold' }}>
                              <i className="fa-solid fa-paperclip"></i> {item.namaFile}
                            </small>
                          )}
                        </td>
                        <td className="td-cell">
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleProsesPersetujuan(item.docId, item, 'Disetujui')} style={{ ...styles.btnAction, backgroundColor: '#059669' }}>Setujui</button>
                            <button onClick={() => handleProsesPersetujuan(item.docId, item, 'Ditolak')} style={{ ...styles.btnAction, backgroundColor: '#ef4444' }}>Tolak</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Tidak ada permohonan baru.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeMenu === 'master-unit' && currentUser.role === 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', borderTop: '4px solid #f59e0b' }}>
                  <h4>Master Jenis Izin</h4>
                  <form onSubmit={handleAddJenisIzin} style={{ marginBottom: '15px', display: 'flex', gap: '8px' }}>
                    <input type="text" value={inputJenisIzin} onChange={(e) => setInputJenisIzin(e.target.value)} placeholder="Jenis Izin Baru..." className="form-input" required />
                    <button type="submit" style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tambah</button>
                  </form>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {daftarJenisIzin.map(ji => (
                      <li key={ji.docId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <span>{ji.nama}</span>
                        <button onClick={() => handleDeleteJenisIzin(ji.docId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', borderTop: '4px solid #0284c7' }}>
                  <h4>Master Jenis Cuti</h4>
                  <form onSubmit={handleAddJenisCuti} style={{ marginBottom: '15px', display: 'flex', gap: '8px' }}>
                    <input type="text" value={inputJenisCuti} onChange={(e) => setInputJenisCuti(e.target.value)} placeholder="Jenis Cuti Baru..." className="form-input" required />
                    <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tambah</button>
                  </form>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {daftarJenisCuti.map(jc => (
                      <li key={jc.docId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <span>{jc.nama}</span>
                        <button onClick={() => handleDeleteJenisCuti(jc.docId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                  <h4>Fakultas</h4>
                  <form onSubmit={handleAddFakultas} style={{ marginBottom: '15px', display: 'flex', gap: '8px' }}>
                    <input type="text" value={inputFakultas} onChange={(e) => setInputFakultas(e.target.value)} placeholder="Fakultas..." className="form-input" required />
                    <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tambah</button>
                  </form>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {daftarFakultas.map(f => (
                      <li key={f.docId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <span>{f.nama}</span>
                        <button onClick={() => handleDeleteFakultas(f.docId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                  <h4>Program Studi</h4>
                  <form onSubmit={handleAddProdi} style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <select value={pilihFakultasProdi} onChange={(e) => setPilihFakultasProdi(e.target.value)} className="form-input" style={{ fontSize: '12px' }}>
                      {daftarFakultas.map(f => <option key={f.docId} value={f.nama}>{f.nama}</option>)}
                    </select>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={inputProdi} onChange={(e) => setInputProdi(e.target.value)} placeholder="Prodi..." className="form-input" required />
                      <button type="submit" style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tambah</button>
                    </div>
                  </form>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {daftarProdi.map(p => (
                      <li key={p.docId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <div><b>{p.nama}</b><br/><small style={{color:'#64748b'}}>{p.fakultas}</small></div>
                        <button onClick={() => handleDeleteProdi(p.docId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                  <h4>Satuan Kerja / Biro</h4>
                  <form onSubmit={handleAddSatker} style={{ marginBottom: '15px', display: 'flex', gap: '8px' }}>
                    <input type="text" value={inputSatker} onChange={(e) => setInputSatker(e.target.value)} placeholder="Satker..." className="form-input" required />
                    <button type="submit" style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tambah</button>
                  </form>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {daftarSatker.map(s => (
                      <li key={s.docId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <span>{s.nama}</span>
                        <button onClick={() => handleDeleteSatker(s.docId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'master-pegawai' && currentUser.role === 'admin' && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div className="form-container" style={{ flex: 1, minWidth: '300px' }}>
                <h3>Tambah / Penetapan Jabatan Pegawai</h3>
                <form onSubmit={handleSavePegawai} className="form-box">
                  <div className="form-group">
                    <label className="form-label">ID / Username Pegawai</label>
                    <input type="text" value={formPegawai.id} onChange={(e)=>setFormPegawai({...formPegawai, id:e.target.value})} placeholder="Username..." className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap & Gelar</label>
                    <input type="text" value={formPegawai.nama} onChange={(e)=>setFormPegawai({...formPegawai, nama:e.target.value})} placeholder="Nama..." className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">NIP / NIDN</label>
                    <input type="text" value={formPegawai.nip} onChange={(e)=>setFormPegawai({...formPegawai, nip:e.target.value})} placeholder="NIP..." className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tipe Penempatan Unit</label>
                    <select value={formPegawai.kategoriUnit} onChange={(e) => setFormPegawai({...formPegawai, kategoriUnit: e.target.value})} className="form-input">
                      <option value="Fakultas">Fakultas & Program Studi</option>
                      <option value="Satker">Satuan Kerja / Biro Rektorat</option>
                    </select>
                  </div>
                  {formPegawai.kategoriUnit === 'Fakultas' ? (
                    <>
                      <div className="form-group">
                        <label className="form-label">Fakultas</label>
                        <select value={formPegawai.fakultas} onChange={(e) => setFormPegawai({...formPegawai, fakultas: e.target.value})} className="form-input">
                          {daftarFakultas.map(f => <option key={f.docId} value={f.nama}>{f.nama}</option>)}
                        </select>
                      </div>

                      {/* Sembunyikan prodi jika role di panel admin adalah Dekan */}
                      {formPegawai.role !== 'dekan' && (
                        <div className="form-group">
                          <label className="form-label">Program Studi</label>
                          <select value={formPegawai.prodi} onChange={(e) => setFormPegawai({...formPegawai, prodi: e.target.value})} className="form-input">
                            {daftarProdi.filter(p => p.fakultas === formPegawai.fakultas).map(p => <option key={p.docId} value={p.nama}>{p.nama}</option>)}
                          </select>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">Satuan Kerja / Biro</label>
                      <select value={formPegawai.satker} onChange={(e) => setFormPegawai({...formPegawai, satker: e.target.value})} className="form-input">
                        {daftarSatker.map(s => <option key={s.docId} value={s.nama}>{s.nama}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Pilih Jabatan / Role Akses</label>
                    <select value={formPegawai.role} onChange={(e)=>setFormPegawai({...formPegawai, role:e.target.value})} className="form-input">
                      <option value="dosen">Dosen</option>
                      <option value="kaprodi">Kaprodi</option>
                      <option value="dekan">Dekan</option>
                      <option value="kepala_unit">Kepala Unit (Direktur)</option>
                      <option value="tendik_fakultas">Tendik Fakultas</option>
                      <option value="tendik_rektorat">Tendik Rektorat</option>
                      <option value="rektor">Rektor UTS</option>
                      <option value="admin">Admin Sistem</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary">
                    <i className="fa-solid fa-user-check"></i> Simpan Pegawai
                  </button>
                </form>
              </div>

              <div style={{ flex: 2, minWidth: '320px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
                <h3>Daftar Pegawai & Pejabat Struktural UTS</h3>
                <table className="table-style">
                  <thead>
                    <tr className="th-tr">
                      <th className="th-cell">Nama & NIP</th><th className="th-cell">Fakultas / Satker</th><th className="th-cell">Prodi</th><th className="th-cell">Jabatan</th><th className="th-cell">Status</th><th className="th-cell">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daftarPegawai.map((p) => (
                      <tr key={p.docId} className="td-tr">
                        <td className="td-cell"><b>{p.nama}</b><br/><small>{p.nip}</small></td>
                        <td className="td-cell">{p.fakultas || p.satker || '-'}</td>
                        <td className="td-cell">{p.prodi || '-'}</td>
                        <td className="td-cell"><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#e0f2fe', color: '#0369a1' }}>{p.jabatan}</span></td>
                        <td className="td-cell"><span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: p.statusAkun === 'Pending' ? '#fef3c7' : '#dcfce7', color: p.statusAkun === 'Pending' ? '#b45309' : '#15803d' }}>{p.statusAkun}</span></td>
                        <td className="td-cell">
                          <div style={{ display: 'flex', gap: '5px' }}>
                            {p.statusAkun === 'Pending' ? (
                              <button onClick={() => handleApprovePegawai(p.docId)} style={{ ...styles.btnAction, backgroundColor: '#059669' }}>Approve</button>
                            ) : (
                              <button onClick={() => setFormPegawai({ docId: p.docId, id: p.id, nama: p.nama, nip: p.nip, jabatan: p.jabatan, kategoriUnit: p.satker ? 'Satker' : 'Fakultas', fakultas: p.fakultas || daftarFakultas[0]?.nama, prodi: p.prodi === '-' ? (daftarProdi[0]?.nama || '') : (p.prodi || daftarProdi[0]?.nama), satker: p.satker || daftarSatker[0]?.nama, role: p.role, jatahCuti: p.jatahCuti })} style={{ ...styles.btnAction, backgroundColor: '#0284c7' }}>Edit</button>
                            )}
                            {!['ADM01', 'REKTOR01'].includes(p.id) && (
                              <button onClick={() => handleDeletePegawai(p.docId, p.id)} className="btn-danger"><i className="fa-solid fa-trash"></i></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === 'riwayat' && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>
                    Rekapitulasi Permohonan Izin & Cuti
                    {currentUser.role === 'dekan' && ` (${currentUser.fakultas})`}
                    {currentUser.role === 'kaprodi' && ` (${currentUser.prodi})`}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    {currentUser.role === 'dekan' && `Menampilkan riwayat seluruh dosen dan staf di lingkungan ${currentUser.fakultas}.`}
                    {currentUser.role === 'kaprodi' && `Menampilkan riwayat dosen khusus di lingkungan ${currentUser.prodi}.`}
                    {(currentUser.role === 'admin' || currentUser.role === 'rektor') && 'Akses Pimpinan / Admin: Memantau seluruh riwayat kampus serta ekspor rekap ke format Excel.'}
                  </p>
                </div>
                {(currentUser.role === 'admin' || currentUser.role === 'rektor' || currentUser.role === 'dekan') && (
                  <button onClick={handleExportExcel} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-file-excel"></i> Ekspor Rekapan ke Excel (.xls)
                  </button>
                )}
              </div>
              <table className="table-style">
                <thead>
                  <tr className="th-tr">
                    <th className="th-cell">Kategori</th>
                    <th className="th-cell">Nama Pemohon & NIP</th>
                    <th className="th-cell">Fakultas / Satker</th>
                    <th className="th-cell">Prodi</th>
                    <th className="th-cell">Jenis & Tanggal</th>
                    <th className="th-cell">Durasi</th>
                    <th className="th-cell">Keterangan</th>
                    <th className="th-cell">Dokumen</th>
                    <th className="th-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {getRiwayatForCurrentUser().length > 0 ? (
                    getRiwayatForCurrentUser().map((item) => (
                      <tr key={item.docId || item.id} className="td-tr">
                        <td className="td-cell"><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: item.kategori === 'Cuti' ? '#e0f2fe' : '#fef3c7', color: item.kategori === 'Cuti' ? '#0369a1' : '#b45309' }}>{item.kategori}</span></td>
                        <td className="td-cell"><b>{item.nama}</b><br/><small>{item.nip}</small></td>
                        <td className="td-cell">{item.fakultas || item.satker || '-'}</td>
                        <td className="td-cell">{item.prodi || '-'}</td>
                        <td className="td-cell"><b>{item.jenis}</b><br/><small>{item.tglMulai} s/d {item.tglSelesai}</small></td>
                        <td className="td-cell">{item.durasi} Hari</td>
                        <td className="td-cell">{item.keterangan}</td>
                        <td className="td-cell">
                          {item.fileDataUrl && item.fileDataUrl !== '#' ? (
                            <a href={item.fileDataUrl} download={item.namaFile} style={{ color: '#0284c7', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                              <i className="fa-solid fa-download"></i> {item.namaFile}
                            </a>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '12px' }}>{item.namaFile || '-'}</span>
                          )}
                        </td>
                        <td className="td-cell"><span className={item.status.includes('Disetujui') ? 'badge-success' : 'badge'}>{item.status}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Tidak ada data riwayat pada unit/fakultas Anda saat ini.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  loginCard: { backgroundColor: '#fff', padding: '35px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' },
  btnLogout: { padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
  btnAction: { padding: '6px 10px', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }
};

export default App;