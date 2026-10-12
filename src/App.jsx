import React, { useState } from 'react';
import './App.css';
import logoUTS from './assets/logo-uts.png'; 
import bgUTS from './assets/uts.jpg'; 
import emailjs from '@emailjs/browser';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginInput, setLoginInput] = useState('');

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Database Pegawai & Pimpinan SDM UTS (Lengkap dengan properti role dan jatahCuti)
  const [daftarPegawai, setDaftarPegawai] = useState([
    { id: 'SDM01', nama: 'Pimpinan SDM UTS', nip: 'SDM01', departemen: 'Biro Kepegawaian', jabatan: 'Kepala Bagian SDM', role: 'sdm', jatahCuti: 12 },
    { id: 'ADMIN', nama: 'Admin Sistem', nip: 'ADM001', departemen: 'Puskom UTS', jabatan: 'Administrator IT', role: 'admin', jatahCuti: 12 },
    { id: 'PGW001', nama: 'Dr. Ahmad Dahlan, M.T.', nip: '198501012010', departemen: 'Fakultas Teknik', jabatan: 'Dosen Informatika', role: 'pegawai', jatahCuti: 12 },
    { id: 'PGW002', nama: 'Siti Rahma, S.Kom., M.Cs.', nip: '198502022012', departemen: 'Fakultas Teknik', jabatan: 'Dosen Sistem Informasi', role: 'pegawai', jatahCuti: 12 }
  ]);

  const [formPegawai, setFormPegawai] = useState({
    id: '',
    nama: '',
    nip: '',
    jabatan: '',
    departemen: 'Fakultas Teknik',
    role: 'pegawai',
    jatahCuti: 12
  });

  const [formData, setFormData] = useState({
    jenisIzin: 'Sakit',
    tanggalMulai: '',
    tanggalSelesai: '',
    keterangan: ''
  });

  // Daftar Pengajuan Izin
  const [riwayatIzin, setRiwayatIzin] = useState([
    { id: 1, nama: 'Dr. Ahmad Dahlan, M.T.', nip: '198501012010', jenis: 'Sakit', tglMulai: '2026-10-15', tglSelesai: '2026-10-16', keterangan: 'Demam dan istirahat dokter', status: 'Menunggu Persetujuan SDM' }
  ]);

  // Fungsi Login
  const handleLogin = (e) => {
    e.preventDefault();
    const found = daftarPegawai.find(p => p.id.toLowerCase() === loginInput.trim().toLowerCase());
    if (found) {
      setCurrentUser(found);
      setActiveMenu('dashboard');
      alert(`Selamat datang di Portal Izin UTS, ${found.nama}!`);
    } else {
      alert('ID Pegawai tidak ditemukan! Gunakan ID: SDM01, ADMIN, PGW001, atau PGW002.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginInput('');
  };

  // Tambah Pegawai (oleh Admin) - Menggunakan daftarPegawai
  const handleSavePegawai = (e) => {
    e.preventDefault();
    const pegawaiBaru = {
      ...formPegawai,
      id: formPegawai.id || `PGW00${daftarPegawai.length + 1}`,
      jatahCuti: 12
    };
    setDaftarPegawai([...daftarPegawai, pegawaiBaru]);
    alert('Data pegawai UTS berhasil ditambahkan!');
    setFormPegawai({ id: '', nama: '', nip: '', jabatan: '', departemen: 'Fakultas Teknik', role: 'pegawai', jatahCuti: 12 });
  };

  const handleDeletePegawai = (id) => {
    if (id === 'SDM01' || id === 'ADMIN') {
      alert('Akun Utama SDM / Admin tidak dapat dihapus!');
      return;
    }
    if (window.confirm('Yakin ingin menghapus data pegawai ini?')) {
      setDaftarPegawai(daftarPegawai.filter(p => p.id !== id));
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Kirim Pengajuan Izin oleh Pegawai
  const handleSubmitIzin = (e) => {
    e.preventDefault();
    const izinBaru = {
      id: Date.now(),
      nama: currentUser.nama,
      nip: currentUser.nip,
      jenis: formData.jenisIzin,
      tglMulai: formData.tanggalMulai,
      tglSelesai: formData.tanggalSelesai,
      keterangan: formData.keterangan,
      status: 'Menunggu Persetujuan SDM'
    };

    setRiwayatIzin([izinBaru, ...riwayatIzin]);
    alert('Pengajuan izin berhasil dikirim ke Pimpinan Bagian SDM UTS!');
    setFormData({ jenisIzin: 'Sakit', tanggalMulai: '', tanggalSelesai: '', keterangan: '' });
  };

  // Aksi Pimpinan SDM (Setujui / Tolak Izin) & Otomatis Potong Cuti
  const handleProsesPersetujuan = (id, statusKeputusan) => {
    const izinTarget = riwayatIzin.find(item => item.id === id);

    if (!izinTarget) {
      alert('Data izin tidak ditemukan!');
      return;
    }

    const hitungHari = (tglMulai, tglSelesai) => {
      if (!tglMulai || !tglSelesai) return 1;
      const start = new Date(tglMulai);
      const end = new Date(tglSelesai);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays || 1;
    };

    const durasiHari = hitungHari(izinTarget.tglMulai, izinTarget.tglSelesai);

    // Jika disetujui dan jenisnya cuti, potong jatah cuti pegawai
    if (statusKeputusan === 'Disetujui SDM' && izinTarget.jenis?.toLowerCase().includes('cuti')) {
      setDaftarPegawai(prev => prev.map(pgw => {
        if (pgw.nip === izinTarget.nip || pgw.id === izinTarget.nip) {
          const sisaBaru = Math.max(0, pgw.jatahCuti - durasiHari);
          return { ...pgw, jatahCuti: sisaBaru };
        }
        return pgw;
      }));
    }

    setRiwayatIzin(riwayatIzin.map(item => {
      if (item.id === id) {
        return { ...item, status: statusKeputusan };
      }
      return item;
    }));

    if (statusKeputusan === 'Disetujui SDM') {
      const templateParams = {
        to_email: 'samsu.alfin@uts.ac.id',
        nama_pegawai: izinTarget.nama || '',
        nip_pegawai: izinTarget.nip || '',
        jenis_izin: izinTarget.jenis || '',
        tanggal_mulai: izinTarget.tglMulai || '',
        tanggal_selesai: izinTarget.tglSelesai || '',
        keterangan: izinTarget.keterangan || '',
      };

      emailjs.send(
        'service_8idlvcd',
        'TEMPLATE_d5izz7c',
        templateParams,
        'L9kckOLpayPBV7E-n'
      )
      .then(() => {
        alert('Izin/Cuti berhasil disetujui! Kuota cuti terpotong dan email laporan terkirim.');
      })
      .catch((err) => {
        console.error(err);
        alert('Izin disetujui, namun gagal mengirimkan email.');
      });
    } else {
      alert('Pengajuan izin ditolak.');
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setIsSidebarOpen(false);
  };

  // ================= HALAMAN LOGIN =================
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
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img 
              src={logoUTS} 
              alt="Logo Universitas Teknologi Sumbawa" 
              style={{ width: '75px', height: '75px', objectFit: 'contain', marginBottom: '10px' }} 
            />
            <h2 style={{ fontSize: '20px', color: '#1e293b' }}>E-Izin Pegawai UTS</h2>
            <p style={{ color: '#666', fontSize: '13px', marginTop: '5px' }}>Universitas Teknologi Sumbawa (UTS)</p>
          </div>

          <form onSubmit={handleLogin} className="form-box">
            <div className="form-group">
              <label className="form-label">ID / NIP Pegawai</label>
              <input 
                type="text" 
                value={loginInput} 
                onChange={(e) => setLoginInput(e.target.value)} 
                placeholder="Contoh: SDM01 atau PGW001" 
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
          </form>

          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'rgba(241, 245, 249, 0.7)', borderRadius: '6px', fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
            <b>Akun Demo Simulasi:</b><br/>
            - Pimpinan SDM: <code>SDM01</code><br/>
            - Admin Sistem: <code>ADMIN</code><br/>
            - Pegawai (Dosen): <code>PGW001</code>
          </div>
        </div>
      </div>
    );
  }

  // ================= DASHBOARD UTAMA =================
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <img src={logoUTS} alt="Logo UTS" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span>E-Izin Pegawai UTS</span>
        </div>
        <ul className="menu-list">
          <li className={activeMenu === 'dashboard' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('dashboard')}>
            <i className="fa-solid fa-chart-line icon-menu"></i> Dashboard
          </li>

          {/* Menu khusus Pegawai */}
          {currentUser.role === 'pegawai' && (
            <li className={activeMenu === 'ajukan-izin' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('ajukan-izin')}>
              <i className="fa-solid fa-file-pen icon-menu"></i> Form Pengajuan Izin
            </li>
          )}

          {/* Menu khusus Pimpinan SDM */}
          {currentUser.role === 'sdm' && (
            <li className={activeMenu === 'persetujuan-sdm' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('persetujuan-sdm')}>
              <i className="fa-solid fa-list-check icon-menu"></i> Persetujuan Izin Masuk
              {riwayatIzin.filter(i => i.status.includes('Menunggu')).length > 0 && (
                <span style={{ backgroundColor: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', marginLeft: 'auto' }}>
                  {riwayatIzin.filter(i => i.status.includes('Menunggu')).length}
                </span>
              )}
            </li>
          )}

          {/* Menu khusus Admin */}
          {currentUser.role === 'admin' && (
            <li className={activeMenu === 'master-pegawai' ? 'menu-item menu-active' : 'menu-item'} onClick={() => handleMenuClick('master-pegawai')}>
              <i className="fa-solid fa-users-gear icon-menu"></i> Master Data Karyawan
            </li>
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
              {activeMenu === 'persetujuan-sdm' && 'Persetujuan Izin Pimpinan SDM'}
              {activeMenu === 'master-pegawai' && 'Manajemen Master Data Karyawan'}
              {activeMenu === 'riwayat' && 'Riwayat & Rekapan Laporan Izin'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="user-profile">
              <i className="fa-solid fa-circle-user" style={{ fontSize: '24px', color: '#f59e0b' }}></i>
              <span>{currentUser.nama} ({currentUser?.role ? currentUser.role.toUpperCase() : 'USER'})</span>
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
                  <h3>Total Pegawai UTS</h3>
                  <p className="card-value">{daftarPegawai.length}</p>
                </div>
                <div className="card">
                  <h3>Izin Menunggu</h3>
                  <p className="card-value" style={{ color: '#d97706' }}>
                    {riwayatIzin.filter(i => i.status.includes('Menunggu')).length}
                  </p>
                </div>
                <div className="card">
                  <h3>Status Akun</h3>
                  <p className="card-value" style={{ fontSize: '15px', color: '#059669', marginTop: '12px' }}>
                    <i className="fa-solid fa-shield-check"></i> Terverifikasi UTS
                  </p>
                </div>
              </div>
              <div className="box-info">
                <h3>Selamat Datang di Portal E-Izin Universitas Teknologi Sumbawa (UTS)</h3>
                <p>
                  Aplikasi ini dirancang khusus untuk memudahkan proses pengajuan izin pegawai secara digital. 
                  Pegawai dapat mengajukan permohonan izin (Sakit, Keperluan Lain, Cuti) yang langsung terkirim ke akun pimpinan Bagian SDM. 
                  Setelah disetujui, laporan rekapan otomatis dikirimkan ke email Bagian SDM.
                </p>
              </div>

              {/* Tabel Rekap Cuti Pegawai Khusus untuk Pimpinan SDM di Dashboard */}
              {currentUser.role === 'sdm' && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginTop: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>
                    <i className="fa-solid fa-users" style={{ marginRight: '8px', color: '#0284c7' }}></i>
                    Rekapitulasi Jatah Cuti Pegawai UTS (12 Hari/Tahun)
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '10px' }}>NIP / ID</th>
                          <th style={{ padding: '10px' }}>Nama Pegawai</th>
                          <th style={{ padding: '10px' }}>Jabatan</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>Kuota Awal</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>Terpakai</th>
                          <th style={{ padding: '10px', textAlign: 'center' }}>Sisa Cuti</th>
                        </tr>
                      </thead>
                      <tbody>
                        {daftarPegawai.map((pgw) => {
                          const terpakai = 12 - pgw.jatahCuti;
                          return (
                            <tr key={pgw.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px', fontWeight: 'bold' }}>{pgw.nip}</td>
                              <td style={{ padding: '10px' }}>{pgw.nama}</td>
                              <td style={{ padding: '10px' }}>{pgw.jabatan}</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>12 Hari</td>
                              <td style={{ padding: '10px', textAlign: 'center', color: terpakai > 0 ? '#dc2626' : '#64748b' }}>{terpakai} Hari</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>
                                <span style={{ padding: '3px 10px', borderRadius: '12px', backgroundColor: pgw.jatahCuti > 3 ? '#dcfce7' : '#fee2e2', color: pgw.jatahCuti > 3 ? '#15803d' : '#991b1b', fontWeight: 'bold' }}>
                                  {pgw.jatahCuti} Hari
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

          {activeMenu === 'ajukan-izin' && currentUser.role === 'pegawai' && (
            <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3>Formulir Pengajuan Izin</h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                Pengajuan ini akan dikirimkan kepada Pimpinan Bagian SDM UTS atas nama Anda.
              </p>
              
              {/* Card Sisa Cuti Pegawai */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '15px 20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '5px solid #f59e0b' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>Sisa Kuota Cuti Tahunan Anda</h4>
                  <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>Batas maksimal: 12 Hari per Tahun</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#0284c7' }}>
                    {(() => {
                      const pgwData = daftarPegawai.find(p => p.nip === currentUser?.nip || p.id === currentUser?.id);
                      return pgwData?.jatahCuti ?? 12;
                    })()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>Hari Tersisa</span>
                </div>
              </div>

              <form onSubmit={handleSubmitIzin} className="form-box">
                <div className="form-group">
                  <label className="form-label">Nama Pemohon</label>
                  <input type="text" value={currentUser.nama} className="form-input" disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">NIP / ID</label>
                  <input type="text" value={currentUser.nip} className="form-input" disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis Izin</label>
                  <select name="jenisIzin" value={formData.jenisIzin} onChange={handleFormChange} className="form-input">
                    <option value="Sakit">Sakit</option>
                    <option value="Izin Keperluan Pribadi">Izin Keperluan Pribadi</option>
                    <option value="Cuti Dinas">Cuti Dinas</option>
                    <option value="Cuti Tahunan">Cuti Tahunan</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Tanggal Mulai</label>
                    <input type="date" name="tanggalMulai" value={formData.tanggalMulai} onChange={handleFormChange} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Selesai</label>
                    <input type="date" name="tanggalSelesai" value={formData.tanggalSelesai} onChange={handleFormChange} className="form-input" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Keterangan / Alasan Izin</label>
                  <textarea name="keterangan" value={formData.keterangan} onChange={handleFormChange} rows="3" className="form-input" required placeholder="Tuliskan alasan lengkap..."></textarea>
                </div>
                <button type="submit" className="btn-green">
                  <i className="fa-solid fa-paper-plane"></i> Kirim Pengajuan ke Pimpinan SDM
                </button>
              </form>
            </div>
          )}

          {activeMenu === 'persetujuan-sdm' && currentUser.role === 'sdm' && (
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
              <h3>Daftar Permohonan Izin Masuk</h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                Panel Pimpinan SDM: Tinjau dan berikan persetujuan. Rekapan otomatis terkirim ke email SDM upon approval.
              </p>
              <table className="table-style">
                <thead>
                  <tr className="th-tr">
                    <th className="th-cell">Pegawai</th>
                    <th className="th-cell">Jenis & Tanggal</th>
                    <th className="th-cell">Keterangan</th>
                    <th className="th-cell">Status</th>
                    <th className="th-cell">Aksi Pimpinan</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayatIzin.map((item) => (
                    <tr key={item.id} className="td-tr">
                      <td className="td-cell"><b>{item.nama}</b><br/><small style={{color:'#666'}}>{item.nip}</small></td>
                      <td className="td-cell"><b>{item.jenis}</b><br/><small>{item.tglMulai} s/d {item.tglSelesai}</small></td>
                      <td className="td-cell">{item.keterangan}</td>
                      <td className="td-cell">
                        <span className={item.status.includes('Disetujui') ? 'badge-success' : 'badge'}>
                          {item.status}
                        </span>
                      </td>
                      <td className="td-cell">
                        {item.status.includes('Menunggu') ? (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleProsesPersetujuan(item.id, 'Disetujui SDM')} style={{ ...styles.btnAction, backgroundColor: '#059669' }}>
                              Setujui
                            </button>
                            <button onClick={() => handleProsesPersetujuan(item.id, 'Ditolak SDM')} style={{ ...styles.btnAction, backgroundColor: '#ef4444' }}>
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>Selesai diproses</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeMenu === 'master-pegawai' && currentUser.role === 'admin' && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div className="form-container" style={{ flex: 1, minWidth: '280px' }}>
                <h3>Tambah Pegawai UTS</h3>
                <form onSubmit={handleSavePegawai} className="form-box">
                  <div className="form-group">
                    <label className="form-label">ID / Login ID</label>
                    <input type="text" name="id" value={formPegawai.id} onChange={(e)=>setFormPegawai({...formPegawai, id:e.target.value})} placeholder="Contoh: PGW003" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap & Gelar</label>
                    <input type="text" name="nama" value={formPegawai.nama} onChange={(e)=>setFormPegawai({...formPegawai, nama:e.target.value})} placeholder="Nama..." className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">NIP</label>
                    <input type="text" name="nip" value={formPegawai.nip} onChange={(e)=>setFormPegawai({...formPegawai, nip:e.target.value})} placeholder="Nomor Induk Pegawai..." className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jabatan</label>
                    <input type="text" name="jabatan" value={formPegawai.jabatan} onChange={(e)=>setFormPegawai({...formPegawai, jabatan:e.target.value})} placeholder="Jabatan..." className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fakultas / Unit</label>
                    <select name="departemen" value={formPegawai.departemen} onChange={(e)=>setFormPegawai({...formPegawai, departemen:e.target.value})} className="form-input">
                      <option value="Fakultas Teknik">Fakultas Teknik</option>
                      <option value="Fakultas Ekonomi & Bisnis">Fakultas Ekonomi & Bisnis</option>
                      <option value="Biro Kepegawaian">Biro Kepegawaian</option>
                      <option value="Rektorat">Rektorat UTS</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role Akses</label>
                    <select name="role" value={formPegawai.role} onChange={(e)=>setFormPegawai({...formPegawai, role:e.target.value})} className="form-input">
                      <option value="pegawai">Pegawai / Dosen</option>
                      <option value="sdm">Pimpinan SDM</option>
                      <option value="admin">Admin Sistem</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary">
                    <i className="fa-solid fa-user-plus"></i> Simpan Pegawai
                  </button>
                </form>
              </div>

              <div style={{ flex: 2, minWidth: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
                <h3>Daftar Pegawai & Dosen Terdaftar</h3>
                <table className="table-style">
                  <thead>
                    <tr className="th-tr">
                      <th className="th-cell">ID Login</th>
                      <th className="th-cell">Nama & NIP</th>
                      <th className="th-cell">Unit / Peran</th>
                      <th className="th-cell">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daftarPegawai.map((p) => (
                      <tr key={p.id} className="td-tr">
                        <td className="td-cell"><b>{p.id}</b></td>
                        <td className="td-cell">{p.nama}<br/><small style={{color:'#666'}}>{p.nip}</small></td>
                        <td className="td-cell">{p.departemen}<br/><span className="badge">{p.role}</span></td>
                        <td className="td-cell">
                          {p.id !== 'SDM01' && p.id !== 'ADMIN' && (
                            <button onClick={() => handleDeletePegawai(p.id)} className="btn-danger">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
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
              <h3>Rekapitulasi Laporan Izin Pegawai UTS</h3>
              <table className="table-style">
                <thead>
                  <tr className="th-tr">
                    <th className="th-cell">Nama Pemohon</th>
                    <th className="th-cell">Jenis Izin</th>
                    <th className="th-cell">Tanggal</th>
                    <th className="th-cell">Keterangan</th>
                    <th className="th-cell">Status Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayatIzin.map((item) => (
                    <tr key={item.id} className="td-tr">
                      <td className="td-cell">{item.nama}<br/><small>{item.nip}</small></td>
                      <td className="td-cell">{item.jenis}</td>
                      <td className="td-cell">{item.tglMulai} s/d {item.tglSelesai}</td>
                      <td className="td-cell">{item.keterangan}</td>
                      <td className="td-cell">
                        <span className={item.status.includes('Disetujui') ? 'badge-success' : 'badge'}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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