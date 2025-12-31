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
import HapusSelisihRemunModal from 'src/components/keuangan/HapusSelisihRemunModal'
import SelectUnitGaji from 'src/components/SelectUnitGaji'
import SelectUnitGajiRekapRemun from 'src/components/kehadiran/SelectUnitGajiRekapRemun'
import SelectBulanTahunUpload from 'src/components/keuangan/SelectBulanTahunUpload'
import { useNavigate } from 'react-router-dom'
import SelectUnitRemun from 'src/components/SelectUnitRemun'

const SelisihRemun = () => {
  console.debug('rendering... SelisihRemun')

  const date = new Date()
  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username
  const navigate = useNavigate()

  // State untuk filter tabel
  const [tahun, setTahun] = useState(date.getFullYear())
  const [idRemun, setIdRemun] = useState('')

  // State untuk upload
  const [uploadBulan, setUploadBulan] = useState(date.getMonth() + 1)
  const [uploadTahun, setUploadTahun] = useState(date.getFullYear())
  const [uploadPeriode, setUploadPeriode] = useState('')
  const [uploadUnitRemun, setUploadUnitRemun] = useState('')
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
      key: 'unitRemunId',
      label: 'Unit Remun',
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
        unitRemunId: data[i].unitRemunId,
        lastModifiedDate: dayjs(data[i].lastModifiedDate).format('D/M/YYYY'),
        lastModifiedBy: data[i].lastModifiedBy,
        aksi: (
          <>
            <CButton
              color="info"
              size="sm"
              className="me-2"
              onClick={() => navigate(`/rekap/${data[i].id}/selisih-remun-pegawai`)}
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
        `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/selisih-remun?tahun=${tahun}&unitRemunId=${idRemun}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then(function (response) {
        setData(response.data.rekapSelisihRemun)
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
        `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/${selectedData.id}/selisih-remun`,
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
    if (!uploadUnitRemun) {
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
      formData.append('unitRemunId', uploadUnitRemun)
      formData.append('createdBy', loginId)

      await axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/selisih-remun/upload`,
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
      document.getElementById('uploadSelisihRemunFormFile').value = ''
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
        <CToastBody>Rekap selisih remun berhasil di-upload</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const deleteSuccessToast = (
    <CToast color="success" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Data rekap selisih remun berhasil dihapus</CToastBody>
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
      <h1 className="mb-4 text-center">Selisih Remun</h1>

      {/* Card Upload */}
      <CCard className="mb-4">
        <CCardHeader className="d-flex align-items-center">
          <CIcon icon={cilCloudUpload} className="me-2" />
          <strong>Upload Rekap Selisih Remun</strong>
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
                  Unit Remun <span className="text-danger">*</span>
                </label>
                <SelectUnitRemun
                  idGaji={uploadUnitRemun}
                  setIdGaji={(id) => setUploadUnitRemun(id)}
                />
              </CCol>
              <CCol md={12} lg={8}>
                <label htmlFor="uploadSelisihRemunFormFile" className="form-label mb-2">
                  Pilih File Excel (.xlsm) <span className="text-danger">*</span>
                </label>
                <CFormInput
                  type="file"
                  id="uploadSelisihRemunFormFile"
                  accept=".xlsm"
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
          <strong>Daftar Rekap Selisih Remun</strong>
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
                <label className="form-label mb-2">Unit Remun</label>
                <SelectUnitRemun setIdGaji={(id) => setIdRemun(id)} />
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

      <HapusSelisihRemunModal
        visible={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        data={selectedData}
        loading={loadingDelete}
      />
    </>
  )
}
export default SelisihRemun
