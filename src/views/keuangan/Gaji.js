import React, { useContext, useRef, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CLoadingButton,
  CRow,
  CSpinner,
  CTable,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilCloudUpload, cilSearch } from '@coreui/icons'
import SelectTahun from '../../components/kehadiran/SelectTahun'
import axios from 'axios'
import { KeycloakContext } from 'src/context'
import dayjs from 'dayjs'
import SelectKodeAnakSatker from 'src/components/keuangan/SelectKodeAnakSatker'

const Gaji = () => {
  console.debug('rendering... Gaji')

  const date = new Date()
  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const [tahun, setTahun] = useState(date.getFullYear())
  const [idGaji, setIdGaji] = useState('')
  const [data, setData] = useState([])
  const [loadingTable, setLoadingTable] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [errorTable, setErrorTable] = useState('')
  const [errorUpload, setErrorUpload] = useState('')
  const [file, setFile] = useState(null)
  const [toast, addToast] = useState()
  const toaster = useRef(null)

  const columns = [
    {
      key: 'bulan',
      _props: { scope: 'col' },
    },
    {
      key: 'kodeAnakSatker',
      label: 'Kode Anak Satker',
      _props: { scope: 'col' },
    },
    {
      key: 'lastModifiedDate',
      label: 'Tanggal Upload',
      _props: { scope: 'col' },
    },
    {
      key: 'lastModifiedBy',
      label: 'Di-upload oleh',
      _props: { scope: 'col' },
    },
  ]
  const items = []

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const item = {
        bulan: data[i].bulan,
        kodeAnakSatker: data[i].kodeAnakSatker,
        lastModifiedDate: dayjs(data[i].lastModifiedDate).format('D/M/YYYY'),
        lastModifiedBy: data[i].lastModifiedBy,
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    }
  } else {
    const item = {
      bulan: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, bulan: { colSpan: 4 } },
    }
    items.push(item)
  }

  const search = () => {
    setLoadingTable(true)
    axios
      .get(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/gaji?tahun=${tahun}&kodeAnakSatker=${idGaji}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then(function (response) {
        setData(response.data.rekapGaji)
      })
      .catch(function (error) {
        console.debug(error.message)
        if (error.response) {
          setErrorTable(error.response.data.message)
        }
      })
      .finally(function () {
        setLoadingTable(false)
      })
  }

  const onSearchButton = (event) => {
    event.preventDefault()
    event.stopPropagation()
    search()
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  async function onAdd(event) {
    event.preventDefault()
    event.stopPropagation()
    if (!file) return
    try {
      setLoadingUpload(true)
      await axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/gaji/upload`,
        {
          file: file,
          createdBy: loginId,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      setFile(null)
      addToast(exampleToast)
      // Refresh tabel setelah upload berhasil
      search()
    } catch (error) {
      if (error.response) {
        console.debug(error)
        setErrorUpload(error.response.data.message)
      } else {
        console.debug(error)
        setErrorUpload('Ops... Terjadi kesalahan.')
      }
    } finally {
      setLoadingUpload(false)
    }
  }

  let table

  if (loadingTable) {
    table = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (errorTable) {
    table = <CAlert color="danger">Error: {errorTable}</CAlert>
  } else {
    table = <CTable striped responsive columns={columns} items={items} className="mb-0" />
  }

  const exampleToast = (
    <CToast color="success" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Rekap gaji berhasil di-upload</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  return (
    <>
      <h1 className="mb-4 text-center">Gaji</h1>

      {/* Card Upload */}
      <CCard className="mb-4">
        <CCardHeader className="d-flex align-items-center">
          <CIcon icon={cilCloudUpload} className="me-2" />
          <strong>Upload Rekap Gaji</strong>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={onAdd}>
            <CRow className="g-3 align-items-end">
              <CCol md={8} lg={6}>
                <label htmlFor="uploadGajiFormFile" className="form-label mb-2">
                  Pilih File Excel (.xlsx)
                </label>
                <CFormInput
                  type="file"
                  id="uploadGajiFormFile"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  required
                />
              </CCol>
              <CCol md={4} lg={3}>
                <CLoadingButton
                  color="primary"
                  type="submit"
                  loading={loadingUpload}
                  className="w-100"
                >
                  <CIcon icon={cilCloudUpload} className="me-2" />
                  Upload
                </CLoadingButton>
              </CCol>
            </CRow>
            {errorUpload && (
              <CAlert color="danger" className="mt-3 mb-0">
                {errorUpload}
              </CAlert>
            )}
          </CForm>
        </CCardBody>
      </CCard>

      {/* Card Tabel */}
      <CCard className="mb-4">
        <CCardHeader className="d-flex align-items-center">
          <CIcon icon={cilSearch} className="me-2" />
          <strong>Daftar Rekap Gaji</strong>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={onSearchButton}>
            <CRow className="g-3 align-items-end mb-3">
              <CCol md={6} lg={3}>
                <label className="form-label mb-2">Tahun</label>
                <SelectTahun
                  setSelect={(id) => setTahun(id)}
                  end={2025}
                  start={date.getFullYear()}
                  tahun={tahun}
                />
              </CCol>
              <CCol md={6} lg={4}>
                <label className="form-label mb-2">Kode Anak Satker</label>
                <SelectKodeAnakSatker setIdGaji={(id) => setIdGaji(id)} />
              </CCol>
              <CCol md={12} lg={2}>
                <CButton type="submit" color="primary" className="w-100">
                  <CIcon icon={cilSearch} className="me-2" />
                  Cari
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          {table}
        </CCardBody>
      </CCard>

      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
    </>
  )
}
export default Gaji
