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
import { cilCloudUpload, cilFile, cilSearch, cilTrash } from '@coreui/icons'
import SelectTahun from '../../components/kehadiran/SelectTahun'
import axios from 'axios'
import { KeycloakContext } from 'src/context'
import dayjs from 'dayjs'
import HapusPotonganGajiModal from 'src/components/keuangan/HapusPotonganGajiModal'
import SelectUnitGaji from 'src/components/SelectUnitGaji'
import SelectUnitGajiRekapRemun from 'src/components/kehadiran/SelectUnitGajiRekapRemun'
import SelectBulanTahunUpload from 'src/components/keuangan/SelectBulanTahunUpload'
import { useNavigate } from 'react-router-dom'

const PotonganUnit = () => {
  console.debug('rendering... PotonganUnit')

  const date = new Date()
  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username
  const navigate = useNavigate()

  // State untuk filter tabel
  const [tahun, setTahun] = useState(date.getFullYear())
  const [idGaji, setIdGaji] = useState('')

  // State untuk upload
  const [uploadBulan, setUploadBulan] = useState(date.getMonth() + 1)
  const [uploadTahun, setUploadTahun] = useState(date.getFullYear())
  const [uploadPeriode, setUploadPeriode] = useState('')
  const [uploadUnitGaji, setUploadUnitGaji] = useState('')
  const [file, setFile] = useState(null)

  const [data, setData] = useState([])
  const [loadingTable, setLoadingTable] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [errorTable, setErrorTable] = useState('')
  const [errorUpload, setErrorUpload] = useState('')
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [toast, addToast] = useState()
  const toaster = useRef(null)

  const columns = [
    {
      key: 'bulan',
      _props: { scope: 'col' },
    },
    {
      key: 'unitGajiId',
      label: 'Unit Gaji',
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
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]
  const items = []

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const item = {
        bulan: data[i].bulan,
        unitGajiId: data[i].unitGajiId,
        lastModifiedDate: dayjs(data[i].lastModifiedDate).format('D/M/YYYY'),
        lastModifiedBy: data[i].lastModifiedBy,
        aksi: (
          <>
            <CButton
              color="info"
              size="sm"
              className="me-2"
              onClick={() => navigate(`/keuangan/potongan-unit/${data[i].id}`)}
            >
              <CIcon icon={cilFile} className="me-1" />
              Detail
            </CButton>
            <CButton color="danger" size="sm" onClick={() => handleShowDeleteModal(data[i])}>
              <CIcon icon={cilTrash} className="me-1" />
              Hapus
            </CButton>
          </>
        ),
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    }
  } else {
    const item = {
      bulan: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, bulan: { colSpan: 5 } },
    }
    items.push(item)
  }

  const search = () => {
    setLoadingTable(true)
    axios
      .get(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/potongan-gaji?tahun=${tahun}&unitGajiId=${idGaji}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then(function (response) {
        setData(response.data.rekapPotonganGaji)
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

  const handleShowDeleteModal = (dataItem) => {
    setSelectedData(dataItem)
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    if (!loadingDelete) {
      setShowDeleteModal(false)
      setSelectedData(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedData) return

    setLoadingDelete(true)

    try {
      await axios.delete(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/${selectedData.id}/potongan-gaji`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )

      addToast(deleteSuccessToast)
      handleCloseDeleteModal()
      // Refresh tabel setelah hapus berhasil
      search()
    } catch (error) {
      console.debug(error)
      const errorMessage =
        error.response?.data?.message || 'Ops... Terjadi kesalahan saat menghapus data.'
      addToast(deleteErrorToast(errorMessage))
    } finally {
      setLoadingDelete(false)
    }
  }

  async function onAdd(event) {
    event.preventDefault()
    event.stopPropagation()

    // Validasi periode
    if (!uploadPeriode) {
      setErrorUpload('Periode harus dipilih')
      return
    }

    // Validasi unit gaji
    if (!uploadUnitGaji) {
      setErrorUpload('Unit Gaji harus dipilih')
      return
    }

    // Validasi file
    if (!file) {
      setErrorUpload('File harus dipilih')
      return
    }

    // Reset error
    setErrorUpload('')

    try {
      setLoadingUpload(true)

      // Kirim data dengan bulan, tahun, dan unit gaji id
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bulan', uploadBulan)
      formData.append('tahun', uploadTahun)
      formData.append('unitGajiId', uploadUnitGaji)
      formData.append('createdBy', loginId)

      await axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/potongan-gaji/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )

      setFile(null)
      // Reset form input file
      document.getElementById('uploadPotonganUnitFormFile').value = ''
      addToast(uploadSuccessToast)
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

  const uploadSuccessToast = (
    <CToast color="success" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Rekap potongan gaji berhasil di-upload</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const deleteSuccessToast = (
    <CToast color="success" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Data rekap potongan gaji berhasil dihapus</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const deleteErrorToast = (message) => (
    <CToast color="danger" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>{message}</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  return (
    <>
      <h1 className="mb-4 text-center">Potongan Unit Gaji</h1>

      {/* Card Upload */}
      <CCard className="mb-4">
        <CCardHeader className="d-flex align-items-center">
          <CIcon icon={cilCloudUpload} className="me-2" />
          <strong>Upload Rekap Potongan Unit Gaji</strong>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={onAdd}>
            <CRow className="g-3">
              <CCol md={6} lg={4}>
                <label className="form-label mb-2">
                  Periode <span className="text-danger">*</span>
                </label>
                <SelectBulanTahunUpload
                  setSelect={(bulan, tahun) => {
                    setUploadBulan(bulan)
                    setUploadTahun(tahun)
                    setUploadPeriode(`${tahun}${bulan}`)
                  }}
                  startYear={date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear()}
                  startMonth={date.getMonth() === 11 ? 1 : date.getMonth() + 2}
                  endYear={2025}
                  endMonth={7}
                />
              </CCol>
              <CCol md={6} lg={4}>
                <label className="form-label mb-2">
                  Unit Gaji <span className="text-danger">*</span>
                </label>
                <SelectUnitGaji
                  idGaji={uploadUnitGaji}
                  setIdGaji={(id) => setUploadUnitGaji(id)}
                  defaultLabel="-- Pilih Unit Gaji --"
                />
              </CCol>
              <CCol md={12} lg={8}>
                <label htmlFor="uploadPotonganUnitFormFile" className="form-label mb-2">
                  Pilih File Excel (.xlsx) <span className="text-danger">*</span>
                </label>
                <CFormInput
                  type="file"
                  id="uploadPotonganUnitFormFile"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  required
                />
              </CCol>
              <CCol md={12} lg={4} className="d-flex align-items-end">
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
          <strong>Daftar Rekap Potongan Unit Gaji</strong>
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
                <label className="form-label mb-2">Unit Gaji</label>
                <SelectUnitGajiRekapRemun setIdGaji={(id) => setIdGaji(id)} />
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

      <HapusPotonganGajiModal
        visible={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        data={selectedData}
        loading={loadingDelete}
      />
    </>
  )
}
export default PotonganUnit
