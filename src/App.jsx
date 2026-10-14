import React, { useState } from 'react';
import './App.css';
import logoUTS from './assets/logo-uts.png'; 
import bgUTS from './assets/uts.jpg'; 
import emailjs from '@emailjs/browser';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // State Input Form Login
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Database Master Unit, Fakultas & Prodi
  const [daftarFakultas, setDaftarFakultas] = useState([
    { id: 'FK01', nama: 'Fakultas Teknik' },
    { id: 'FK02', nama: 'Fakultas Ekonomi & Bisnis' },
    { id: 'FK03', nama: 'Fakultas Ilmu Teknologi Hayati' }
  ]);

  const [daftarProdi, setDaftarProdi] = useState([
    { id: 'PR01', fakultas: 'Fakultas Teknik', nama: 'S1 Teknik Informatika' },
    { id: 'PR02', fakultas: 'Fakultas Teknik', nama: 'S1 Teknik Sipil' },
    { id: 'PR03', fakultas: 'Fakultas Ekonomi & Bisnis', nama: 'S1 Manajemen' }
  ]);

  const [daftarSatker, setDaftarSatker] = useState([
    { id: 'SK01', nama: 'Biro Kepegawaian & SDM' },
    { id: 'SK02', nama: 'Pusat Komputer & Data (Puskom)' },
    { id: 'SK03', nama: 'Biro Administrasi Akademik & Kemahasiswaan' },
    { id: 'SK04', nama: 'Rektorat UTS' }
  ]);

  // Database Dinamis Master Jenis Izin & Cuti (Dapat dikelola Admin)
  const [daftarJenisIzin, setDaftarJenisIzin] = useState([
    { id: 'JI01', nama: 'Sakit (Dengan / Tanpa Surat Dokter)' },
    { id: 'JI02', nama: 'Izin Keperluan Pribadi Mendesak' },
    { id: 'JI03', nama: 'Izin Meninggalkan Tugas Dinas' }
  ]);

  const [daftarJenisCuti, setDaftarJenisCuti] = useState([
    { id: 'JC01', nama: 'Cuti Tahunan' },
    { id: 'JC02', nama: 'Cuti Melahirkan' },
    { id: 'JC03', nama: 'Cuti Pernikahan' },
    { id: 'JC04', nama: 'Cuti Alasan Penting' },
    { id: 'JC05', nama: 'Cuti Besar' }
  ]);

  // State Input Form Manajemen Admin (Fakultas, Prodi, Satker, Jenis Izin/Cuti)
  const [inputFakultas, setInputFakultas] = useState('');
  const [inputProdi, setInputProdi] = useState('');
  const [pilihFakultasProdi, setPilihFakultasProdi] = useState('Fakultas Teknik');
  const [inputSatker, setInputSatker] = useState('');
  const [inputJenisIzin, setInputJenisIzin] = useState('');
  const [inputJenisCuti, setInputJenisCuti] = useState('');

  // Database Pegawai, Pejabat & Admin UTS
  const [daftarPegawai, setDaftarPegawai] = useState([
    { id: 'ADM01', username: 'admin', password: '123', nama: 'Admin Sistem IT', nip: 'ADM001', departemen: 'Puskom UTS', jabatan: 'Administrator IT', role: 'admin', jatahCuti: 12, statusAkun: 'Aktif' },
    { id: 'KAPRODI01', username: 'kaprodi', password: '123', nama: 'Andi Wijaya, M.T.', nip: '198001012015', departemen: 'Fakultas Teknik', jabatan: 'Kaprodi Informatika', role: 'kaprodi', jatahCuti: 12, statusAkun: 'Aktif' },
    { id: 'DEKAN01', username: 'dekan', password: '123', nama: 'Prof. Dr. Ir. Herman, M.Sc.', nip: '197505052008', departemen: 'Fakultas Teknik', jabatan: 'Dekan Fakultas Teknik', role: 'dekan', jatahCuti: 12, statusAkun: 'Aktif' },
    { id: 'DIR01', username: 'kepalaunit', password: '123', nama: 'Hendra, S.E., M.M.', nip: '198203032011', departemen: 'Biro Kepegawaian', jabatan: 'Kepala Biro SDM / Direktur', role: 'kepala_unit', jatahCuti: 12, statusAkun: 'Aktif' },
    { id: 'REKTOR01', username: 'rektor', password: '123', nama: 'Dr. Nikolas, M.Si.', nip: '197001012000', departemen: 'Rektorat UTS', jabatan: 'Rektor UTS', role: 'rektor', jatahCuti: 12, statusAkun: 'Aktif' },
    { id: 'PGW001', username: 'dosen1', password: '123', nama: 'Dr. Ahmad Dahlan, M.T.', nip: '198501012010', departemen: 'Fakultas Teknik', jabatan: 'Dosen Informatika', role: 'dosen', jatahCuti: 10, statusAkun: 'Aktif' },
    { id: 'PGW002', username: 'tendik1', password: '123', nama: 'Siti Rahma, S.Kom.', nip: '198802022012', departemen: 'Fakultas Teknik', jabatan: 'Staf TU Fakultas Teknik', role: 'tendik_fakultas', jatahCuti: 9, statusAkun: 'Aktif' }
  ]);

  // State Form Registrasi Mandiri Pegawai
  const [regForm, setRegForm] = useState({
    nama: '',
    nip: '',
    role: 'dosen',
    username: '',
    password: ''
  });

  // State Admin Tambah/Edit Pegawai
  const [formPegawai, setFormPegawai] = useState({
    id: '',
    nama: '',
    nip: '',
    jabatan: '',
    departemen: 'Fakultas Teknik',
    role: 'dosen',
    jatahCuti: 12
  });

  // State Form Izin
  const [formIzin, setFormIzin] = useState({
    jenisIzin: 'Sakit (Dengan / Tanpa Surat Dokter)',
    tanggalMulai: '',
    tanggalSelesai: '',
    keterangan: '',
    namaFile: '',
    fileDataUrl: ''
  });

  // State Form Cuti
  const [formCuti, setFormCuti] = useState({
    jenisCuti: 'Cuti Tahunan',
    tanggalMulai: '',
    tanggalSelesai: '',
    keterangan: '',
    namaFile: '',
    fileDataUrl: ''
  });

  // Master List Seluruh Pengajuan
  const [riwayatIzin, setRiwayatIzin] = useState([
    { id: 1, kategori: 'Cuti', nama: 'Dr. Ahmad Dahlan, M.T.', nip: '198501012010', jabatan: 'Dosen Informatika', rolePemohon: 'dosen', jenis: 'Cuti Tahunan', tglMulai: '2026-10-14', tglSelesai: '2026-10-15', durasi: 2, keterangan: 'Cuti ke Mataram', namaFile: 'form-cuti-uts-2026.docx', fileDataUrl: '#', status: 'Disetujui oleh Kaprodi Informatika' },
    { id: 2, kategori: 'Izin', nama: 'Dr. Ahmad Dahlan, M.T.', nip: '198501012010', jabatan: 'Dosen Informatika', rolePemohon: 'dosen', jenis: 'Sakit', tglMulai: '2026-10-15', tglSelesai: '2026-10-16', durasi: 2, keterangan: 'Demam dan istirahat dokter', namaFile: 'Surat_Keterangan_Dokter.pdf', fileDataUrl: '#', status: 'Menunggu Persetujuan Kaprodi' },
    { id: 3, kategori: 'Cuti', nama: 'Siti Rahma, S.Kom.', nip: '198802022012', jabatan: 'Staf TU Fakultas Teknik', rolePemohon: 'tendik_fakultas', jenis: 'Cuti Tahunan', tglMulai: '2026-10-20', tglSelesai: '2026-10-22', durasi: 3, keterangan: 'Acara keluarga di Mataram', namaFile: 'Form_Cuti_Siti_Signed.docx', fileDataUrl: '#', status: 'Disetujui oleh Dekan Fakultas Teknik' }
  ]);

  // Utility Hitung Durasi Hari
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
      case 'dosen':
        return 'Menunggu Persetujuan Kaprodi';
      case 'kaprodi':
      case 'tendik_fakultas':
        return 'Menunggu Persetujuan Dekan';
      case 'dekan':
        return 'Menunggu Persetujuan Rektor';
      case 'tendik_rektorat':
        return 'Menunggu Persetujuan Kepala Unit';
      default:
        return 'Menunggu Persetujuan Atasan';
    }
  };

  const isApproverRole = ['kaprodi', 'dekan', 'kepala_unit', 'rektor'].includes(currentUser?.role);

  const getPendingForCurrentUser = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'kaprodi') {
      return riwayatIzin.filter(i => i.status === 'Menunggu Persetujuan Kaprodi');
    }
    if (currentUser.role === 'dekan') {
      return riwayatIzin.filter(i => i.status === 'Menunggu Persetujuan Dekan');
    }
    if (currentUser.role === 'kepala_unit') {
      return riwayatIzin.filter(i => i.status === 'Menunggu Persetujuan Kepala Unit');
    }
    if (currentUser.role === 'rektor') {
      return riwayatIzin.filter(i => i.status === 'Menunggu Persetujuan Rektor');
    }
    return [];
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const query = loginInput.trim().toLowerCase();
    
    const found = daftarPegawai.find(p => 
      (p.username?.toLowerCase() === query || p.id.toLowerCase() === query || p.nip.toLowerCase() === query) &&
      p.password === passwordInput
    );

    if (found) {
      if (found.statusAkun === 'Pending') {
        alert('Akun Anda masih menunggu persetujuan (approval) dari Admin Sistem! Silakan hubungi bagian IT/SDM.');
        return;
      }
      setCurrentUser(found);
      setActiveMenu('dashboard');
      alert(`Selamat datang di Portal E-Izin & Cuti UTS, ${found.nama}!`);
    } else {
      alert('Username / NIP atau Password salah, atau akun belum terdaftar!');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const exists = daftarPegawai.some(p => 
      p.username?.toLowerCase() === regForm.username.trim().toLowerCase() ||
      p.nip.toLowerCase() === regForm.nip.trim().toLowerCase()
    );

    if (exists) {
      alert('Username atau NIP tersebut sudah terdaftar di sistem!');
      return;
    }

    const pegawaiBaru = {
      id: `PGW${Date.now().toString().slice(-4)}`,
      username: regForm.username.trim(),
      password: regForm.password,
      nama: regForm.nama.trim(),
      nip: regForm.nip.trim(),
      departemen: 'Belum Diatur',
      jabatan: regForm.role.toUpperCase().replace('_', ' '),
      role: regForm.role,
      jatahCuti: 12,
      statusAkun: 'Pending'
    };

    setDaftarPegawai([...daftarPegawai, pegawaiBaru]);
    alert('Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan (approval) dari Admin Sistem.');
    setRegForm({ nama: '', nip: '', role: 'dosen', username: '', password: '' });
    setIsRegisterMode(false);
  };

  const handleApprovePegawai = (id) => {
    setDaftarPegawai(daftarPegawai.map(p => {
      if (p.id === id) {
        return { ...p, statusAkun: 'Aktif' };
      }
      return p;
    }));
    alert('Akun pegawai berhasil disetujui (diaktifkan)!');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginInput('');
    setPasswordInput('');
  };

  const handleSavePegawai = (e) => {
    e.preventDefault();
    const pegawaiBaru = {
      ...formPegawai,
      id: formPegawai.id || `PGW00${daftarPegawai.length + 1}`,
      username: formPegawai.id ? formPegawai.id.toLowerCase() : `pgw00${daftarPegawai.length + 1}`,
      password: '123',
      jatahCuti: 12,
      statusAkun: 'Aktif'
    };
    setDaftarPegawai([...daftarPegawai, pegawaiBaru]);
    alert('Data pegawai UTS berhasil ditambahkan!');
    setFormPegawai({ id: '', nama: '', nip: '', jabatan: '', departemen: daftarFakultas[0]?.nama || 'Fakultas Teknik', role: 'dosen', jatahCuti: 12 });
  };

  const handleDeletePegawai = (id) => {
    if (['ADM01', 'REKTOR01', 'DEKAN01'].includes(id)) {
      alert('Akun Utama Admin / Pejabat tidak dapat dihapus!');
      return;
    }
    if (window.confirm('Yakin ingin menghapus data pegawai ini?')) {
      setDaftarPegawai(daftarPegawai.filter(p => p.id !== id));
    }
  };

  // Handler Tambah/Hapus Fakultas, Prodi, Satker
  const handleAddFakultas = (e) => {
    e.preventDefault();
    if (!inputFakultas.trim()) return;
    setDaftarFakultas([...daftarFakultas, { id: `FK${Date.now()}`, nama: inputFakultas.trim() }]);
    setInputFakultas('');
    alert('Fakultas baru berhasil ditambahkan!');
  };

  const handleDeleteFakultas = (id) => {
    setDaftarFakultas(daftarFakultas.filter(f => f.id !== id));
  };

  const handleAddProdi = (e) => {
    e.preventDefault();
    if (!inputProdi.trim()) return;
    setDaftarProdi([...daftarProdi, { id: `PR${Date.now()}`, fakultas: pilihFakultasProdi, nama: inputProdi.trim() }]);
    setInputProdi('');
    alert('Program Studi baru berhasil ditambahkan!');
  };

  const handleDeleteProdi = (id) => {
    setDaftarProdi(daftarProdi.filter(p => p.id !== id));
  };

  const handleAddSatker = (e) => {
    e.preventDefault();
    if (!inputSatker.trim()) return;
    setDaftarSatker([...daftarSatker, { id: `SK${Date.now()}`, nama: inputSatker.trim() }]);
    setInputSatker('');
    alert('Satuan Kerja / Biro baru berhasil ditambahkan!');
  };

  const handleDeleteSatker = (id) => {
    setDaftarSatker(daftarSatker.filter(s => s.id !== id));
  };

  // Handler Tambah/Hapus Master Jenis Izin & Cuti oleh Admin
  const handleAddJenisIzin = (e) => {
    e.preventDefault();
    if (!inputJenisIzin.trim()) return;
    setDaftarJenisIzin([...daftarJenisIzin, { id: `JI${Date.now()}`, nama: inputJenisIzin.trim() }]);
    setInputJenisIzin('');
    alert('Jenis Izin baru berhasil ditambahkan!');
  };

  const handleDeleteJenisIzin = (id) => {
    setDaftarJenisIzin(daftarJenisIzin.filter(j => j.id !== id));
  };

  const handleAddJenisCuti = (e) => {
    e.preventDefault();
    if (!inputJenisCuti.trim()) return;
    setDaftarJenisCuti([...daftarJenisCuti, { id: `JC${Date.now()}`, nama: inputJenisCuti.trim() }]);
    setInputJenisCuti('');
    alert('Jenis Cuti baru berhasil ditambahkan!');
  };

  const handleDeleteJenisCuti = (id) => {
    setDaftarJenisCuti(daftarJenisCuti.filter(c => c.id !== id));
  };

  const handleFileChangeIzin = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormIzin({ 
          ...formIzin, 
          namaFile: file.name, 
          fileDataUrl: uploadEvent.target.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChangeCuti = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormCuti({ 
          ...formCuti, 
          namaFile: file.name, 
          fileDataUrl: uploadEvent.target.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadTemplateCuti = () => {
    const element = document.createElement("a");
    element.href = "/form-cuti-uts-2026.docx"; 
    element.download = "Formulir_Cuti_Pegawai_UTS_2026.docx";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportExcel = () => {
    let tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"/></head>
      <body>
        <h3>REKAPITULASI PERMOHONAN IZIN DAN CUTI PEGAWAI UTS</h3>
        <table border="1">
          <thead>
            <tr style="background-color: #f2f2f2; font-weight: bold;">
              <th>No</th>
              <th>Kategori</th>
              <th>Nama Pemohon</th>
              <th>NIP</th>
              <th>Jabatan / Unit</th>
              <th>Sisa Cuti Pegawai saat ini</th>
              <th>Jenis</th>
              <th>Tanggal Mulai</th>
              <th>Tanggal Selesai</th>
              <th>Durasi (Hari)</th>
              <th>Keterangan</th>
              <th>Nama Lampiran</th>
              <th>Status Persetujuan</th>
            </tr>
          </thead>
          <tbody>
    `;

    riwayatIzin.forEach((item, index) => {
      const sisaCuti = getSisaCutiByNip(item.nip);
      tableHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.kategori}</td>
          <td>${item.nama}</td>
          <td>${item.nip}</td>
          <td>${item.jabatan || item.rolePemohon}</td>
          <td>${sisaCuti} Hari Tersisa (dari 12)</td>
          <td>${item.jenis}</td>
          <td>${item.tglMulai}</td>
          <td>${item.tglSelesai}</td>
          <td>${item.durasi}</td>
          <td>${item.keterangan}</td>
          <td>${item.namaFile}</td>
          <td>${item.status}</td>
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
    URL.revokeObjectURL(url);
  };

  const handleSubmitIzin = (e) => {
    e.preventDefault();
    const durasi = hitungDurasiHari(formIzin.tanggalMulai, formIzin.tanggalSelesai);
    const initialStatus = getInitialStatusByRole(currentUser.role);
    
    const izinBaru = {
      id: Date.now(),
      kategori: 'Izin',
      nama: currentUser.nama,
      nip: currentUser.nip,
      jabatan: currentUser.jabatan,
      rolePemohon: currentUser.role,
      jenis: formIzin.jenisIzin,
      tglMulai: formIzin.tanggalMulai,
      tglSelesai: formIzin.tanggalSelesai,
      durasi: durasi,
      keterangan: formIzin.keterangan,
      namaFile: formIzin.namaFile || 'Tidak Ada Lampiran',
      fileDataUrl: formIzin.fileDataUrl || '',
      status: initialStatus
    };

    setRiwayatIzin([izinBaru, ...riwayatIzin]);
    alert(`Permohonan IZIN berhasil dikirim! Status: ${initialStatus}`);
    setFormIzin({ jenisIzin: daftarJenisIzin[0]?.nama || 'Sakit', tanggalMulai: '', tanggalSelesai: '', keterangan: '', namaFile: '', fileDataUrl: '' });
  };

  const handleSubmitCuti = (e) => {
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
      alert(`Pengajuan gagal! Durasi cuti yang diajukan (${durasi} Hari) melebihi sisa kuota cuti Anda (${sisaCuti} Hari).`);
      return;
    }

    const cutiBaru = {
      id: Date.now(),
      kategori: 'Cuti',
      nama: currentUser.nama,
      nip: currentUser.nip,
      jabatan: currentUser.jabatan,
      rolePemohon: currentUser.role,
      jenis: formCuti.jenisCuti,
      tglMulai: formCuti.tanggalMulai,
      tglSelesai: formCuti.tanggalSelesai,
      durasi: durasi,
      keterangan: formCuti.keterangan,
      namaFile: formCuti.namaFile || 'Tidak Ada Lampiran Form Cuti',
      fileDataUrl: formCuti.fileDataUrl || '',
      status: initialStatus
    };

    setRiwayatIzin([cutiBaru, ...riwayatIzin]);
    alert(`Permohonan CUTI (${durasi} Hari) berhasil dikirim! Status: ${initialStatus}`);
    setFormCuti({ jenisCuti: daftarJenisCuti[0]?.nama || 'Cuti Tahunan', tanggalMulai: '', tanggalSelesai: '', keterangan: '', namaFile: '', fileDataUrl: '' });
  };

  const handleProsesPersetujuan = (id, statusKeputusan) => {
    const target = riwayatIzin.find(item => item.id === id);
    if (!target) {
      alert('Data tidak ditemukan!');
      return;
    }

    const isApprove = statusKeputusan === 'Disetujui';
    const finalStatusText = isApprove 
      ? `Disetujui oleh ${currentUser.jabatan}` 
      : `Ditolak oleh ${currentUser.jabatan}`;

    if (isApprove && target.kategori === 'Cuti') {
      setDaftarPegawai(prev => prev.map(pgw => {
        if (pgw.nip === target.nip || pgw.id === target.nip) {
          const sisaBaru = Math.max(0, pgw.jatahCuti - target.durasi);
          return { ...pgw, jatahCuti: sisaBaru };
        }
        return pgw;
      }));
    }

    setRiwayatIzin(riwayatIzin.map(item => {
      if (item.id === id) {
        return { ...item, status: finalStatusText };
      }
      return item;
    }));

    if (isApprove) {
      const templateParams = {
        to_email: 'samsu.alfin@uts.ac.id',
        nama_pegawai: target.nama || '',
        nip_pegawai: target.nip || '',
        jenis_izin: `[${target.kategori.toUpperCase()}] ${target.jenis}`,
        tanggal_mulai: target.tglMulai || '',
        tanggal_selesai: target.tglSelesai || '',
        keterangan: `${target.keterangan} (${target.durasi} Hari) - Penyetuju: ${currentUser.nama} (${currentUser.jabatan})`,
      };

      emailjs.send(
        'service_8idlvcd',
        'TEMPLATE_d5izz7c',
        templateParams,
        'L9kckOLpayPBV7E-n'
      )
      .then(() => {
        alert(`${target.kategori} berhasil disetujui! Notifikasi email terkirim.`);
      })
      .catch((err) => {
        console.error(err);
        alert(`${target.kategori} disetujui, namun gagal mengirimkan email.`);
      });
    } else {
      alert('Pengajuan telah ditolak.');
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setIsSidebarOpen(false);
  };

  // ================= HALAMAN LOGIN & REGISTRASI =================
  if (!currentUser) {
    return (
      <div 
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          backgroundImage: `url(${bgUTS})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <div 
          className="backdrop" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}
        ></div>

        <div 
          style={{
            ...styles.loginCard,
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img 
              src={logoUTS} 
              alt="Logo Universitas Teknologi Sumbawa" 
              style={{ width: '75px', height: '75px', objectFit: 'contain', marginBottom: '10px' }} 
            />
            <h2 style={{ fontSize: '20px', color: '#1e293b' }}>E-Izin & Cuti Pegawai UTS</h2>
            <p style={{ color: '#666', fontSize: '13px', marginTop: '5px' }}>Universitas Teknologi Sumbawa (UTS)</p>
          </div>

          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="form-box">
              <div className="form-group">
                <label className="form-label">Username / NIP Pegawai</label>
                <input 
                  type="text" 
                  value={loginInput} 
                  onChange={(e) => setLoginInput(e.target.value)} 
                  placeholder="Username / NIP..." 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)} 
                  placeholder="Masukkan password..." 
                  className="form-input" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px', backgroundColor: '#f59e0b' }}
              >
                <i className="fa-solid fa-right-to-bracket"></i> Masuk Portal
              </button>

              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <span 
                  onClick={() => setIsRegisterMode(true)}
                  style={{ fontSize: '13px', color: '#0284c7', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Belum punya akun? Registrasi Pegawai Baru
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="form-box">
              <h4 style={{ textAlign: 'center', color: '#0284c7', marginBottom: '15px' }}>Formulir Registrasi Mandiri</h4>
              
              <div className="form-group">
                <label className="form-label">Nama Lengkap & Gelar</label>
                <input 
                  type="text" 
                  value={regForm.nama} 
                  onChange={(e) => setRegForm({...regForm, nama: e.target.value})} 
                  placeholder="Nama Lengkap..." 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">NIP / NIDN</label>
                <input 
                  type="text" 
                  value={regForm.nip} 
                  onChange={(e) => setRegForm({...regForm, nip: e.target.value})} 
                  placeholder="Nomor Induk Pegawai..." 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Kategori / Jabatan Pegawai</label>
                <select 
                  value={regForm.role} 
                  onChange={(e) => setRegForm({...regForm, role: e.target.value})} 
                  className="form-input"
                >
                  <option value="dosen">Dosen (Persetujuan Kaprodi)</option>
                  <option value="kaprodi">Kaprodi (Persetujuan Dekan)</option>
                  <option value="tendik_fakultas">Tendik Fakultas (Persetujuan Dekan)</option>
                  <option value="dekan">Dekan (Persetujuan Rektor)</option>
                  <option value="tendik_rektorat">Tendik Rektorat (Persetujuan Kepala Unit)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Username Pilihan</label>
                <input 
                  type="text" 
                  value={regForm.username} 
                  onChange={(e) => setRegForm({...regForm, username: e.target.value})} 
                  placeholder="Buat username..." 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password Pilihan</label>
                <input 
                  type="password" 
                  value={regForm.password} 
                  onChange={(e) => setRegForm({...regForm, password: e.target.value})} 
                  placeholder="Buat password..." 
                  className="form-input" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="btn-green" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              >
                <i className="fa-solid fa-user-plus"></i> Daftar Akun Pegawai
              </button>

              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <span 
                  onClick={() => setIsRegisterMode(false)}
                  style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-arrow-left"></i> Kembali ke Halaman Login
                </span>
              </div>
            </form>
          )}

          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(241, 245, 249, 0.8)', borderRadius: '6px', fontSize: '11px', color: '#475569', lineHeight: '1.4' }}>
            <b>Akun Demo Simulasi (Pass: 123):</b><br/>
            - Dosen: <code>dosen1</code> | Kaprodi: <code>kaprodi</code> | Dekan: <code>dekan</code><br/>
            - Tendik Rektorat: <code>tendik2</code> | Ka. Unit: <code>kepalaunit</code> | Rektor: <code>rektor</code> | Admin: <code>admin</code>
          </div>
        </div>
      </div>
    );
  }

  // ================= DASHBOARD UTAMA =================
  const pendingApprovalsCount = getPendingForCurrentUser().length;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <img src={logoUTS} alt="Logo UTS" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span>E-Izin & Cuti UTS</span>
        </div>
        <ul className="menu-list">
          <li className={activeMenu === 'dashboard' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('dashboard')}>
            <i className="fa-solid fa-chart-line icon-menu"></i> Dashboard
          </li>

          {currentUser.role !== 'admin' && (
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

      {isSidebarOpen && (
        <div className="backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Area */}
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
          {/* DASHBOARD */}
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
                  <h3>Status Sistem</h3>
                  <p className="card-value" style={{ fontSize: '15px', color: '#059669', marginTop: '12px' }}>
                    <i className="fa-solid fa-shield-check"></i> Terverifikasi UTS
                  </p>
                </div>
              </div>

              {currentUser.role !== 'admin' && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '5px solid #0284c7' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>
                      <i className="fa-solid fa-calendar-check" style={{ marginRight: '8px', color: '#0284c7' }}></i>
                      Sisa Kuota Cuti Tahunan Anda (Tahun 2026)
                    </h3>
                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                      Standar kuota resmi Universitas Teknologi Sumbawa: <b>12 Hari / Tahun</b>
                    </p>
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
                    Ringkasan Saldo Cuti Seluruh Pegawai UTS (Kuota Resmi: 12 Hari/Tahun)
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '10px' }}>NIP / ID</th>
                          <th style={{ padding: '10px' }}>Nama Pegawai</th>
                          <th style={{ padding: '10px' }}>Jabatan / Unit</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>Kuota Awal</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>Terpakai</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>Sisa Jatah Cuti</th>
                        </tr>
                      </thead>
                      <tbody>
                        {daftarPegawai.filter(p => p.role !== 'admin').map((pgw) => {
                          const terpakai = 12 - pgw.jatahCuti;
                          return (
                            <tr key={pgw.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px', fontWeight: 'bold' }}>{pgw.nip}</td>
                              <td style={{ padding: '10px' }}>{pgw.nama}</td>
                              <td style={{ padding: '10px' }}>{pgw.jabatan}</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>12 Hari</td>
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

          {/* FORM PENGAJUAN IZIN */}
          {activeMenu === 'ajukan-izin' && (
            <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ borderBottom: '2px solid #f59e0b', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}><i className="fa-solid fa-file-pen" style={{ color: '#f59e0b', marginRight: '8px' }}></i>Formulir Permohonan Izin</h3>
                <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>
                  Target Persetujuan: <b>{getInitialStatusByRole(currentUser.role)}</b>
                </p>
              </div>

              <form onSubmit={handleSubmitIzin} className="form-box">
                <div className="form-group">
                  <label className="form-label">Nama Pemohon</label>
                  <input type="text" value={currentUser.nama} className="form-input" disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis Izin (Dinamis dari Admin)</label>
                  <select value={formIzin.jenisIzin} onChange={(e) => setFormIzin({...formIzin, jenisIzin: e.target.value})} className="form-input">
                    {daftarJenisIzin.map(ji => (
                      <option key={ji.id} value={ji.nama}>{ji.nama}</option>
                    ))}
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
                  <textarea value={formIzin.keterangan} onChange={(e) => setFormIzin({...formIzin, keterangan: e.target.value})} rows="3" className="form-input" required placeholder="Tuliskan alasan lengkap permohonan izin..."></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fa-solid fa-paperclip" style={{ marginRight: '5px', color: '#f59e0b' }}></i>
                    Upload Dokumen Pendukung (PDF / Foto / Surat Dokter)
                  </label>
                  <input 
                    type="file" 
                    onChange={handleFileChangeIzin} 
                    className="form-input" 
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />
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

          {/* FORM PENGAJUAN CUTI */}
          {activeMenu === 'ajukan-cuti' && (
            <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}><i className="fa-solid fa-umbrella-beach" style={{ color: '#0284c7', marginRight: '8px' }}></i>Formulir Permohonan Cuti</h3>
                <p style={{ fontSize: '13px', color: '#666', margin: '5px 0 0 0' }}>
                  Target Persetujuan: <b>{getInitialStatusByRole(currentUser.role)}</b>
                </p>
              </div>

              {/* Banner Unduh Template Form Cuti Word */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '12px 15px', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>
                    <i className="fa-solid fa-file-word" style={{ color: '#2563eb', marginRight: '6px' }}></i>
                    Template Form Cuti Resmi UTS (.docx)
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Unduh, isi data, dan unggah kembali di bawah ini.</div>
                </div>
                <button 
                  type="button" 
                  onClick={handleDownloadTemplateCuti}
                  style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <i className="fa-solid fa-download"></i> Unduh Form
                </button>
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
                  <label className="form-label">Jenis Cuti (Dinamis dari Admin)</label>
                  <select value={formCuti.jenisCuti} onChange={(e) => setFormCuti({...formCuti, jenisCuti: e.target.value})} className="form-input">
                    {daftarJenisCuti.map(jc => (
                      <option key={jc.id} value={jc.nama}>{jc.nama}</option>
                    ))}
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

                {formCuti.tanggalMulai && formCuti.tanggalSelesai && (
                  <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px' }}>
                    Total durasi yang diajukan: <b>{hitungDurasiHari(formCuti.tanggalMulai, formCuti.tanggalSelesai)} Hari</b>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Alasan Cuti & Catatan Tambahan</label>
                  <textarea value={formCuti.keterangan} onChange={(e) => setFormCuti({...formCuti, keterangan: e.target.value})} rows="3" className="form-input" required placeholder="Tuliskan keterangan lengkap pengajuan cuti..."></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fa-solid fa-file-arrow-up" style={{ marginRight: '5px', color: '#0284c7' }}></i>
                    Upload Form Cuti Terisi (Word / PDF / Scan TTD)
                  </label>
                  <input 
                    type="file" 
                    onChange={handleFileChangeCuti} 
                    className="form-input" 
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />
                  {formCuti.namaFile && (
                    <small style={{ color: '#059669', marginTop: '5px', display: 'block', fontWeight: 'bold' }}>
                      <i className="fa-solid fa-file-check"></i> Form Cuti Terunggah: {formCuti.namaFile}
                    </small>
                  )}
                </div>

                <button type="submit" className="btn-green">
                  <i className="fa-solid fa-paper-plane"></i> Kirim Permohonan Cuti
                </button>
              </form>
            </div>
          )}

          {/* PERSETUJUAN MASUK (KHUSUS ATASAN) */}
          {activeMenu === 'persetujuan' && isApproverRole && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
              <h3>Daftar Permohonan Masuk untuk {currentUser.jabatan}</h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                Hanya menampilkan permohonan yang ditujukan kepada Anda selaku {currentUser.jabatan}.
              </p>
              <table className="table-style">
                <thead>
                  <tr className="th-tr">
                    <th className="th-cell">Kategori</th>
                    <th className="th-cell">Nama Pemohon</th>
                    <th className="th-cell">Jenis & Tanggal</th>
                    <th className="th-cell">Durasi</th>
                    <th className="th-cell">Keterangan & Lampiran</th>
                    <th className="th-cell">Status Saat Ini</th>
                    <th className="th-cell">Aksi Keputusan</th>
                  </tr>
                </thead>
                <tbody>
                  {getPendingForCurrentUser().length > 0 ? (
                    getPendingForCurrentUser().map((item) => (
                      <tr key={item.id} className="td-tr">
                        <td className="td-cell">
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            backgroundColor: item.kategori === 'Cuti' ? '#e0f2fe' : '#fef3c7',
                            color: item.kategori === 'Cuti' ? '#0369a1' : '#b45309'
                          }}>
                            {item.kategori}
                          </span>
                        </td>
                        <td className="td-cell"><b>{item.nama}</b><br/><small style={{color:'#666'}}>{item.nip}</small></td>
                        <td className="td-cell"><b>{item.jenis}</b><br/><small>{item.tglMulai} s/d {item.tglSelesai}</small></td>
                        <td className="td-cell">{item.durasi} Hari</td>
                        <td className="td-cell">
                          {item.keterangan}<br/>
                          {item.namaFile && (
                            <small style={{ color: '#0284c7', fontWeight: 'bold' }}>
                              <i className="fa-solid fa-paperclip"></i> {item.namaFile}
                            </small>
                          )}
                        </td>
                        <td className="td-cell">
                          <span className="badge">{item.status}</span>
                        </td>
                        <td className="td-cell">
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleProsesPersetujuan(item.id, 'Disetujui')} style={{ ...styles.btnAction, backgroundColor: '#059669' }}>
                              Setujui
                            </button>
                            <button onClick={() => handleProsesPersetujuan(item.id, 'Ditolak')} style={{ ...styles.btnAction, backgroundColor: '#ef4444' }}>
                              Tolak
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                        Tidak ada permohonan baru yang menunggu persetujuan Anda saat ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* MANAJEMEN UNIT, FAKULTAS, PRODI & JENIS IZIN/CUTI (KHUSUS ADMIN) */}
          {activeMenu === 'master-unit' && currentUser.role === 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {/* Bagian 1: Jenis Izin & Cuti */}
              <div style={{ borderBottom: '2px solid #cbd5e1', paddingBottom: '15px' }}>
                <h3 style={{ color: '#1e293b', marginBottom: '5px' }}>
                  <i className="fa-solid fa-sliders" style={{ color: '#0284c7', marginRight: '8px' }}></i>
                  Pengaturan Master Jenis Izin & Jenis Cuti
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Tambahkan atau hapus kategori jenis izin dan cuti yang berlaku resmi di Universitas Teknologi Sumbawa.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Form Input Jenis Izin */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #f59e0b' }}>
                  <h4 style={{ color: '#1e293b', marginBottom: '15px' }}><i className="fa-solid fa-file-signature" style={{ color: '#f59e0b', marginRight: '8px' }}></i>Master Jenis Izin</h4>
                  <form onSubmit={handleAddJenisIzin} style={{ marginBottom: '15px', display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={inputJenisIzin} 
                      onChange={(e) => setInputJenisIzin(e.target.value)} 
                      placeholder="Contoh: Izin Dinas Luar..." 
                      className="form-input" 
                      required 
                    />
                    <button type="submit" style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tambah</button>
                  </form>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {daftarJenisIzin.map(ji => (
                      <li key={ji.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <span>{ji.nama}</span>
                        <button onClick={() => handleDeleteJenisIzin(ji.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Form Input Jenis Cuti */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #0284c7' }}>
                  <h4 style={{ color: '#1e293b', marginBottom: '15px' }}><i className="fa-solid fa-umbrella-beach" style={{ color: '#0284c7', marginRight: '8px' }}></i>Master Jenis Cuti</h4>
                  <form onSubmit={handleAddJenisCuti} style={{ marginBottom: '15px', display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={inputJenisCuti} 
                      onChange={(e) => setInputJenisCuti(e.target.value)} 
                      placeholder="Contoh: Cuti Studi Lanjut..." 
                      className="form-input" 
                      required 
                    />
                    <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tambah</button>
                  </form>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {daftarJenisCuti.map(jc => (
                      <li key={jc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <span>{jc.nama}</span>
                        <button onClick={() => handleDeleteJenisCuti(jc.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bagian 2: Fakultas, Prodi & Satker */}
              <div style={{ borderBottom: '2px solid #cbd5e1', paddingBottom: '15px', marginTop: '15px' }}>
                <h3 style={{ color: '#1e293b', marginBottom: '5px' }}>
                  <i className="fa-solid fa-building-columns" style={{ color: '#059669', marginRight: '8px' }}></i>
                  Pengaturan Unit Kerja, Fakultas & Program Studi
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Kelola struktur organisasi kampus secara mandiri.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* Box Fakultas */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ color: '#1e293b', marginBottom: '15px' }}><i className="fa-solid fa-building" style={{ color: '#0284c7', marginRight: '8px' }}></i>Fakultas</h4>
                  <form onSubmit={handleAddFakultas} style={{ marginBottom: '15px', display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={inputFakultas} 
                      onChange={(e) => setInputFakultas(e.target.value)} 
                      placeholder="Nama Fakultas Baru..." 
                      className="form-input" 
                      required 
                    />
                    <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tambah</button>
                  </form>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {daftarFakultas.map(f => (
                      <li key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <span>{f.nama}</span>
                        <button onClick={() => handleDeleteFakultas(f.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Box Program Studi */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ color: '#1e293b', marginBottom: '15px' }}><i className="fa-solid fa-graduation-cap" style={{ color: '#f59e0b', marginRight: '8px' }}></i>Program Studi</h4>
                  <form onSubmit={handleAddProdi} style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <select value={pilihFakultasProdi} onChange={(e) => setPilihFakultasProdi(e.target.value)} className="form-input" style={{ fontSize: '12px' }}>
                      {daftarFakultas.map(f => (
                        <option key={f.id} value={f.nama}>{f.nama}</option>
                      ))}
                    </select>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        value={inputProdi} 
                        onChange={(e) => setInputProdi(e.target.value)} 
                        placeholder="Nama Program Studi..." 
                        className="form-input" 
                        required 
                      />
                      <button type="submit" style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tambah</button>
                    </div>
                  </form>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {daftarProdi.map(p => (
                      <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <div>
                          <b>{p.nama}</b><br/><small style={{color:'#64748b'}}>{p.fakultas}</small>
                        </div>
                        <button onClick={() => handleDeleteProdi(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Box Satuan Kerja / Biro */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ color: '#1e293b', marginBottom: '15px' }}><i className="fa-solid fa-sitemap" style={{ color: '#059669', marginRight: '8px' }}></i>Satuan Kerja / Biro</h4>
                  <form onSubmit={handleAddSatker} style={{ marginBottom: '15px', display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={inputSatker} 
                      onChange={(e) => setInputSatker(e.target.value)} 
                      placeholder="Nama Satker / Biro..." 
                      className="form-input" 
                      required 
                    />
                    <button type="submit" style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tambah</button>
                  </form>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {daftarSatker.map(s => (
                      <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <span>{s.nama}</span>
                        <button onClick={() => handleDeleteSatker(s.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* MASTER DATA PEGAWAI (ADMIN) */}
          {activeMenu === 'master-pegawai' && currentUser.role === 'admin' && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div className="form-container" style={{ flex: 1, minWidth: '280px' }}>
                <h3>Tambah / Edit Pegawai UTS</h3>
                <form onSubmit={handleSavePegawai} className="form-box">
                  <div className="form-group">
                    <label className="form-label">ID / Login ID</label>
                    <input type="text" value={formPegawai.id} onChange={(e)=>setFormPegawai({...formPegawai, id:e.target.value})} placeholder="Contoh: PGW003" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap & Gelar</label>
                    <input type="text" value={formPegawai.nama} onChange={(e)=>setFormPegawai({...formPegawai, nama:e.target.value})} placeholder="Nama..." className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">NIP</label>
                    <input type="text" value={formPegawai.nip} onChange={(e)=>setFormPegawai({...formPegawai, nip:e.target.value})} placeholder="Nomor Induk Pegawai..." className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jabatan Spesifik</label>
                    <input type="text" value={formPegawai.jabatan} onChange={(e)=>setFormPegawai({...formPegawai, jabatan:e.target.value})} placeholder="Dosen / Staf TU / Kabag..." className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fakultas / Satuan Kerja (Dinamis)</label>
                    <select value={formPegawai.departemen} onChange={(e)=>setFormPegawai({...formPegawai, departemen:e.target.value})} className="form-input">
                      <optgroup label="Fakultas">
                        {daftarFakultas.map(f => (
                          <option key={f.id} value={f.nama}>{f.nama}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Satuan Kerja / Biro">
                        {daftarSatker.map(s => (
                          <option key={s.id} value={s.nama}>{s.nama}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role Akses & Alur Persetujuan</label>
                    <select value={formPegawai.role} onChange={(e)=>setFormPegawai({...formPegawai, role:e.target.value})} className="form-input">
                      <option value="dosen">Dosen (Disetujui Kaprodi)</option>
                      <option value="kaprodi">Kaprodi (Disetujui Dekan)</option>
                      <option value="dekan">Dekan (Disetujui Rektor)</option>
                      <option value="tendik_fakultas">Tendik Fakultas (Disetujui Dekan)</option>
                      <option value="tendik_rektorat">Tendik Rektorat (Disetujui Kepala Unit)</option>
                      <option value="kepala_unit">Kepala Unit / Direktur Rektorat</option>
                      <option value="rektor">Rektor UTS</option>
                      <option value="admin">Admin Sistem</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary">
                    <i className="fa-solid fa-user-plus"></i> Simpan Pegawai
                  </button>
                </form>
              </div>

              <div style={{ flex: 2, minWidth: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
                <h3>Daftar Pegawai & Approval Akun Baru</h3>
                <table className="table-style">
                  <thead>
                    <tr className="th-tr">
                      <th className="th-cell">Username / ID</th>
                      <th className="th-cell">Nama & NIP</th>
                      <th className="th-cell">Jabatan & Unit</th>
                      <th className="th-cell">Saldo Cuti</th>
                      <th className="th-cell">Status Akun</th>
                      <th className="th-cell">Aksi Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daftarPegawai.map((p) => (
                      <tr key={p.id} className="td-tr">
                        <td className="td-cell"><b>{p.username || p.id}</b></td>
                        <td className="td-cell">{p.nama}<br/><small style={{color:'#666'}}>{p.nip}</small></td>
                        <td className="td-cell">{p.jabatan}<br/><small style={{color:'#0284c7'}}>{p.departemen}</small></td>
                        <td className="td-cell">
                          <span style={{ fontWeight: 'bold', color: '#0284c7' }}>{p.jatahCuti} Hari</span> <small style={{ color: '#64748b' }}>/ 12</small>
                        </td>
                        <td className="td-cell">
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            backgroundColor: p.statusAkun === 'Pending' ? '#fef3c7' : '#dcfce7',
                            color: p.statusAkun === 'Pending' ? '#b45309' : '#15803d'
                          }}>
                            {p.statusAkun === 'Pending' ? 'Pending' : 'Aktif'}
                          </span>
                        </td>
                        <td className="td-cell">
                          <div style={{ display: 'flex', gap: '5px' }}>
                            {p.statusAkun === 'Pending' && (
                              <button 
                                onClick={() => handleApprovePegawai(p.id)} 
                                style={{ ...styles.btnAction, backgroundColor: '#059669' }}
                                title="Setujui Akun"
                              >
                                Approve
                              </button>
                            )}
                            {!['ADM01', 'REKTOR01'].includes(p.id) && (
                              <button onClick={() => handleDeletePegawai(p.id)} className="btn-danger">
                                <i className="fa-solid fa-trash"></i>
                              </button>
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

          {/* RIWAYAT & REKAPAN */}
          {activeMenu === 'riwayat' && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>Rekapitulasi Permohonan Izin & Cuti Seluruh Pegawai UTS</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    {currentUser.role === 'admin' ? 'Akses Admin Sistem: Anda dapat melihat sisa jatah cuti pegawai, mengunduh lampiran, dan mengekspor rekap ke Excel.' : 'Menampilkan rekapitulasi riwayat pengajuan.'}
                  </p>
                </div>

                {currentUser.role === 'admin' && (
                  <button 
                    onClick={handleExportExcel}
                    style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className="fa-solid fa-file-excel"></i> Ekspor Rekapan ke Excel (.xls)
                  </button>
                )}
              </div>

              <table className="table-style">
                <thead>
                  <tr className="th-tr">
                    <th className="th-cell">Kategori</th>
                    <th className="th-cell">Nama Pemohon & Jabatan</th>
                    {currentUser.role === 'admin' && <th className="th-cell">Sisa Cuti Pegawai</th>}
                    <th className="th-cell">Jenis & Tanggal</th>
                    <th className="th-cell">Durasi</th>
                    <th className="th-cell">Keterangan</th>
                    <th className="th-cell">Dokumen / Lampiran</th>
                    <th className="th-cell">Status Persetujuan</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayatIzin.map((item) => {
                    const sisaCutiPemohon = getSisaCutiByNip(item.nip);
                    return (
                      <tr key={item.id} className="td-tr">
                        <td className="td-cell">
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            backgroundColor: item.kategori === 'Cuti' ? '#e0f2fe' : '#fef3c7',
                            color: item.kategori === 'Cuti' ? '#0369a1' : '#b45309'
                          }}>
                            {item.kategori}
                          </span>
                        </td>
                        <td className="td-cell">
                          <b>{item.nama}</b><br/>
                          <small style={{ color: '#475569' }}>{item.jabatan || item.rolePemohon}</small><br/>
                          <small style={{ color: '#94a3b8' }}>NIP: {item.nip}</small>
                        </td>

                        {currentUser.role === 'admin' && (
                          <td className="td-cell">
                            <span style={{ 
                              padding: '3px 8px', 
                              borderRadius: '12px', 
                              fontSize: '12px', 
                              fontWeight: 'bold',
                              backgroundColor: '#e0f2fe',
                              color: '#0369a1',
                              display: 'inline-block'
                            }}>
                              {sisaCutiPemohon} / 12 Hari
                            </span>
                          </td>
                        )}

                        <td className="td-cell"><b>{item.jenis}</b><br/><small>{item.tglMulai} s/d {item.tglSelesai}</small></td>
                        <td className="td-cell">{item.durasi} Hari</td>
                        <td className="td-cell">{item.keterangan}</td>
                        <td className="td-cell">
                          {item.fileDataUrl && item.fileDataUrl !== '#' ? (
                            <a 
                              href={item.fileDataUrl} 
                              download={item.namaFile} 
                              style={{ color: '#0284c7', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}
                              title="Klik untuk mendownload dokumen lampiran"
                            >
                              <i className="fa-solid fa-download"></i> {item.namaFile}
                            </a>
                          ) : (
                            <span style={{ color: '#0284c7', fontWeight: 'bold', fontSize: '12px' }}>
                              <i className="fa-solid fa-file"></i> {item.namaFile || 'Tidak Ada File'}
                            </span>
                          )}
                        </td>
                        <td className="td-cell">
                          <span className={item.status.includes('Disetujui') ? 'badge-success' : 'badge'}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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
  loginWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1e293b', padding: '20px' },
  loginCard: { backgroundColor: '#fff', padding: '35px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' },
  btnLogout: { padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
  btnAction: { padding: '6px 10px', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }
};

export default App;