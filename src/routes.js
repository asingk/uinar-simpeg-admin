import React from 'react'
import { Translation } from 'react-i18next'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Asn = React.lazy(() => import('./views/pegawai/asn/Asn'))
const PnsDpb = React.lazy(() => import('./views/pegawai/pnsdpb/PnsDpb'))
const NonAsn = React.lazy(() => import('./views/pegawai/nonasn/NonAsn'))
const NonAktif = React.lazy(() => import('./views/pegawai/nonaktif/NonAktif'))
const Profil = React.lazy(() => import('./views/pegawai/Profil'))
const KehadiranPegawai = React.lazy(() => import('./views/kehadiran/RiwayatHadir'))
const Rekap = React.lazy(() => import('./views/kehadiran/Rekap'))
const RiwayatProfil = React.lazy(() => import('./views/kehadiran/RiwayatProfil'))
const Izin = React.lazy(() => import('./views/kehadiran/Izin'))
const RiwayatIzin = React.lazy(() => import('./views/kehadiran/RiwayatIzin'))
const StrukturJabatan = React.lazy(() => import('./views/struktur-jabatan/StrukturJabatan'))
const StrukturUker = React.lazy(() => import('./views/struktur-uker/StrukturUnitKerja'))
const Pengumuman = React.lazy(() => import('./views/pengumuman/Pengumuman'))
const Gaji = React.lazy(() => import('./views/keuangan/Gaji'))

const routes = [
  { path: '/', exact: true, name: <Translation>{(t) => t('home')}</Translation> },
  {
    path: '/dashboard',
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    element: Dashboard,
  },
  {
    path: '/pegawai',
    name: <Translation>{(t) => t('Pegawai')}</Translation>,
    element: Asn,
    exact: true,
  },
  { path: '/pegawai/asn', name: 'Asn', element: Asn },
  { path: '/pegawai/nonasn', name: 'NonAsn', element: NonAsn },
  { path: '/pegawai/pnsdpb', name: 'PnsDpb', element: PnsDpb },
  { path: '/pegawai/nonaktif', name: 'NonAktif', element: NonAktif },
  {
    path: '/pegawai/profil/:id',
    name: 'Profil ASN',
    element: Profil,
    exact: true,
  },
  {
    path: '/kehadiran',
    name: <Translation>{(t) => t('Kehadiran')}</Translation>,
    element: KehadiranPegawai,
    exact: true,
  },
  { path: '/kehadiran/pegawai', name: 'Riwayat Hadir', element: KehadiranPegawai },
  { path: '/kehadiran/riwayat-profil', name: 'Riwayat Profil', element: RiwayatProfil },
  { path: '/kehadiran/rekap', name: 'Rekap', element: Rekap },
  { path: '/kehadiran/izin', name: 'Izin', element: Izin },
  { path: '/kehadiran/riwayat-izin', name: 'Riwayat Izin', element: RiwayatIzin },
  {
    path: '/struktur-jabatan',
    name: <Translation>{(t) => t('Struktur Jabatan')}</Translation>,
    element: StrukturJabatan,
  },
  {
    path: '/struktur-uker',
    name: <Translation>{(t) => t('Struktur Unit Kerja')}</Translation>,
    element: StrukturUker,
  },
  {
    path: '/pengumuman',
    name: <Translation>{(t) => t('Pengumuman')}</Translation>,
    element: Pengumuman,
  },
  {
    path: '/keuangan',
    name: <Translation>{(t) => t('Keuangan')}</Translation>,
    element: Gaji,
    exact: true,
  },
  { path: '/keuangan/gaji', name: 'Gaji', element: Gaji },
]

export default routes
