import React, { useState } from 'react';
import './App.css';
import logoUTS from './assets/logo-uts.png'; // Sesuaikan nama file logo UTS Anda di folder assets
import emailjs from '@emailjs/browser';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginInput, setLoginInput] = useState('');

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Database Pegawai & Pimpinan SDM UTS
  const [pegawaiList, setPegawaiList] = useState([
    { id: 'SDM01', nama: 'Dr. Ir. Pimpinan SDM', nip: '19750101', jabatan: 'Kepala Bagian SDM', departemen: 'Kepegawaian UTS', role: 'sdm' },
    { id: 'ADMIN', nama: 'Administrator Utama', nip: '000', jabatan: 'Staff IT Admin', departemen: 'Pusat Data UTS', role: 'admin' },
    { id: 'PGW001', nama: 'Budi Santoso, M.Kom.', nip: '198501012010', jabatan: 'Dosen / Staff Prodi', departemen: 'Fakultas Teknik', role: 'pegawai' },
    { id: 'PGW002', nama: 'Siti Aminah, S.E.', nip: '199005122015', jabatan: 'Staff Administrasi', departemen: 'Biro Keuangan', role: 'pegawai' },
  ]);

  const [formPegawai, setFormPegawai] = useState({
    id: '',
    nama: '',
    nip: '',
    jabatan: '',
    departemen: 'Fakultas Teknik',
    role: 'pegawai'
  });

  const [formData, setFormData] = useState({
    jenisIzin: 'Sakit',
    tanggalMulai: '',
    tanggalSelesai: '',
    keterangan: ''
  });

  // Daftar Pengajuan Izin
  const [riwayatIzin, setRiwayatIzin] = useState([
    { id: 1, nama: 'Budi Santoso, M.Kom.', nip: '198501012010', jenis: 'Sakit', tglMulai: '2026-10-15', tglSelesai: '2026-10-16', keterangan: 'Demam dan istirahat dokter', status: 'Menunggu Persetujuan SDM' }
  ]);

  // Fungsi Login
  const handleLogin = (e) => {
    e.preventDefault();
    const found = pegawaiList.find(p => p.id.toLowerCase() === loginInput.trim().toLowerCase());
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

  // Tambah Pegawai (oleh Admin)
  const handleSavePegawai = (e) => {
    e.preventDefault();
    const pegawaiBaru = {
      ...formPegawai,
      id: formPegawai.id || `PGW00${pegawaiList.length + 1}`
    };
    setPegawaiList([...pegawaiList, pegawaiBaru]);
    alert('Data pegawai UTS berhasil ditambahkan!');
    setFormPegawai({ id: '', nama: '', nip: '', jabatan: '', departemen: 'Fakultas Teknik', role: 'pegawai' });
  };

  const handleDeletePegawai = (id) => {
    if (id === 'SDM01' || id === 'ADMIN') {
      alert('Akun Utama SDM / Admin tidak dapat dihapus!');
      return;
    }
    if (confirm('Yakin ingin menghapus data pegawai ini?')) {
      setPegawaiList(pegawaiList.filter(p => p.id !== id));
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

  // Aksi Pimpinan SDM (Setujui / Tolak Izin)
  const handleProsesPersetujuan = (id, statusKeputusan) => {
    setRiwayatIzin(riwayatIzin.map(item => {
      if (item.id === id) {
        return { ...item, status: statusKeputusan };
      }
      return item;
    }));

    if (statusKeputusan === 'Disetujui SDM') {
    // Data yang akan dikirim ke email yang sudah ada
    const templateParams = {
      nama_pegawai: izinTarget.nama,
      nip_pegawai: izinTarget.nip,
      jenis_izin: izinTarget.jenis,
      tanggal_mulai: izinTarget.tglMulai,
      tanggal_selesai: izinTarget.tglSelesai,
      keterangan: izinTarget.keterangan,
    };

    // Mengirim email menggunakan EmailJS
    emailjs.send(
      'SERVICE_ID_ANDA',   // Masukkan Service ID dari EmailJS
      'TEMPLATE_ID_ANDA',  // Masukkan Template ID dari EmailJS
      templateParams,
      'PUBLIC_KEY_ANDA'    // Masukkan Public Key dari EmailJS
    )
    .then(() => {
      alert('Izin berhasil disetujui dan rekapan laporan otomatis terkirim ke email SDM UTS!');
    })
    .catch((error) => {
      console.error('Gagal mengirim email:', error);
      alert('Izin disetujui, namun gagal mengirimkan email notification.');
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
      <div style={styles.loginWrapper}>
        <div style={styles.loginCard}>
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
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', backgroundColor: '#f59e0b' }}>
              <i className="fa-solid fa-right-to-bracket"></i> Masuk Portal
            </button>
          </form>
          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
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
              <span>{currentUser.nama} ({currentUser.role.toUpperCase()})</span>
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
                  <p className="card-value">{pegawaiList.length}</p>
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
            </div>
          )}

          {activeMenu === 'ajukan-izin' && currentUser.role === 'pegawai' && (
            <div className="form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3>Formulir Pengajuan Izin</h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                Pengajuan ini akan dikirimkan kepada Pimpinan Bagian SDM UTS atas nama Anda.
              </p>
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
                    {pegawaiList.map((p) => (
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