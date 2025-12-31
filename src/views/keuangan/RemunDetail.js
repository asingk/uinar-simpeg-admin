import React, { useContext, useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilUser } from '@coreui/icons'
import axios from 'axios'
import { KeycloakContext } from 'src/context'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'

const RemunDetail = () => {
  console.debug('rendering... RemunDetail')

  const { id } = useParams()
  const keycloak = useContext(KeycloakContext)
  const navigate = useNavigate()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rekapInfo, setRekapInfo] = useState(null)

  // Kolom untuk tabel pegawai
  const employeeColumns = [
    {
      key: 'no',
      label: 'No',
      _props: { scope: 'col', className: 'text-center' },
    },
    {
      key: 'nip',
      label: 'NIP',
      _props: { scope: 'col' },
    },
    {
      key: 'nama',
      label: 'Nama',
      _props: { scope: 'col' },
    },
    {
      key: 'jabatan',
      label: 'Jabatan',
      _props: { scope: 'col' },
    },
    {
      key: 'bruto',
      label: 'Bruto',
      _props: { scope: 'col', className: 'text-end' },
    },
    {
      key: 'pphRupiah',
      label: 'PPh',
      _props: { scope: 'col', className: 'text-end' },
    },
    {
      key: 'netto',
      label: 'Netto',
      _props: { scope: 'col', className: 'text-end' },
    },
  ]

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = () => {
    setLoading(true)
    setError('')

    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/${id}/remun-pegawai`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then(function (response) {
        const pegawaiData = response.data.rekapRemunPegawai
        setData(pegawaiData)

        // Simpan info rekap dari data pertama
        if (pegawaiData.length > 0) {
          setRekapInfo({
            bulan: pegawaiData[0].bulan,
            tahun: pegawaiData[0].tahun,
            unitRemun: pegawaiData[0].unitRemun,
            createdBy: pegawaiData[0].createdBy,
            createdDate: pegawaiData[0].createdDate,
          })
        }
      })
      .catch(function (error) {
        console.debug(error)
        if (error.response) {
          setError(error.response.data.message)
        } else {
          setError('Terjadi kesalahan saat mengambil data')
        }
      })
      .finally(function () {
        setLoading(false)
      })
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getBulanName = (bulan) => {
    const bulanNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]
    return bulanNames[bulan - 1] || bulan
  }

  // Generate items untuk tabel pegawai
  const employeeItems = data.map((pegawai, index) => ({
    no: index + 1,
    nip: pegawai.nip,
    nama: pegawai.nama,
    jabatan: pegawai.jabatan,
    bruto: formatCurrency(pegawai.bruto),
    pphRupiah: formatCurrency(pegawai.pphRupiah),
    netto: formatCurrency(pegawai.netto),
    _cellProps: {
      no: { className: 'text-center' },
      bruto: { className: 'text-end' },
      pphRupiah: { className: 'text-end' },
      netto: { className: 'text-end' },
    },
  }))

  return (
    <>
      <CRow className="mb-3">
        <CCol>
          <CButton color="secondary" variant="outline" onClick={() => navigate(-1)}>
            <CIcon icon={cilArrowLeft} className="me-2" />
            Kembali
          </CButton>
        </CCol>
      </CRow>

      <h1 className="mb-4 text-center">Detail Remun Pegawai</h1>

      {/* Info Rekap */}
      {rekapInfo && (
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol md={6} lg={3} className="mb-3">
                <small className="text-medium-emphasis">Periode</small>
                <div className="fw-semibold">
                  {getBulanName(rekapInfo.bulan)} {rekapInfo.tahun}
                </div>
              </CCol>
              <CCol md={6} lg={4} className="mb-3">
                <small className="text-medium-emphasis">Unit Remun</small>
                <div className="fw-semibold">{rekapInfo.unitRemun}</div>
              </CCol>
              <CCol md={6} lg={3} className="mb-3">
                <small className="text-medium-emphasis">Di-upload oleh</small>
                <div className="fw-semibold">{rekapInfo.createdBy}</div>
              </CCol>
              <CCol md={6} lg={2} className="mb-3">
                <small className="text-medium-emphasis">Tanggal Upload</small>
                <div className="fw-semibold">
                  {dayjs(rekapInfo.createdDate).format('D/M/YYYY HH:mm')}
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      )}

      {/* Tabel Daftar Pegawai */}
      <CCard className="mb-4">
        <CCardHeader className="d-flex align-items-center justify-content-between">
          <div>
            <CIcon icon={cilUser} className="me-2" />
            <strong>Daftar Pegawai ({data.length})</strong>
          </div>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="d-flex justify-content-center">
              <CSpinner role="status">
                <span className="visually-hidden">Loading...</span>
              </CSpinner>
            </div>
          ) : error ? (
            <CAlert color="danger">Error: {error}</CAlert>
          ) : data.length > 0 ? (
            <>
              <CTable
                striped
                responsive
                hover
                columns={employeeColumns}
                items={employeeItems}
                className="mb-3"
              />
            </>
          ) : (
            <CAlert color="info">Tidak ada data pegawai</CAlert>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default RemunDetail
