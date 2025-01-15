import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBriefcase,
  cilFingerprint,
  cilNotes,
  cilPeople,
  cilSitemap,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react-pro'
import { Translation } from 'react-i18next'

const _nav = [
  {
    component: CNavItem,
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info-gradient',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Pegawai')}</Translation>,
    to: '/pegawai',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'ASN',
        to: '/pegawai/asn',
      },
      {
        component: CNavItem,
        name: 'Non ASN',
        to: '/pegawai/nonasn',
      },
      {
        component: CNavItem,
        name: 'PNS DPB',
        to: '/pegawai/pnsdpb',
      },
      {
        component: CNavItem,
        name: 'Non Aktif',
        to: '/pegawai/nonaktif',
      },
    ],
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Kehadiran')}</Translation>,
    to: '/kehadiran',
    icon: <CIcon icon={cilFingerprint} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Riwayat Hadir',
        to: '/kehadiran/pegawai',
      },
      {
        component: CNavItem,
        name: 'Riwayat Profil',
        to: '/kehadiran/riwayat-profil',
      },
      {
        component: CNavItem,
        name: 'Rekap',
        to: '/kehadiran/rekap',
      },
      {
        component: CNavItem,
        name: 'Izin',
        to: '/kehadiran/izin',
      },
    ],
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Struktur Jabatan')}</Translation>,
    to: '/struktur-jabatan',
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Struktur Unit Kerja')}</Translation>,
    to: '/struktur-uker',
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Pengumuman')}</Translation>,
    to: '/pengumuman',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
]

export default _nav
