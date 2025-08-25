import React, { useContext, useRef, useState } from 'react'
import {
  CAlert,
  CButton,
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
  CToastHeader,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilCloudUpload, cilSearch } from '@coreui/icons'
import SelectTahun from '../../components/kehadiran/SelectTahun'
import axios from 'axios'
import { KeycloakContext } from 'src/context'
import SelectUnitGaji from 'src/components/SelectUnitGaji'
import dayjs from 'dayjs'

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
  ]
  const items = []

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const item = {
        bulan: data[i].bulan,
        unitGajiId: data[i].unitGajiId,
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
        `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/gaji?tahun=${tahun}&unitGajiId=${idGaji}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then(function (response) {
        // handle success
        // console.log(response)
        setData(response.data.rekapGaji)
      })
      .catch(function (error) {
        // handle error
        console.debug(error.message)
        if (error.response) {
          // The client was given an error response (5xx, 4xx)
          // setErrorResp(true)
          setErrorTable(error.response.data.message)
        } else {
          // setErrorProfilRiwayat('Ooops... terjadi kesalahan!')
        }
      })
      .finally(function () {
        // always executed
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
      // setLoading(false)
      setFile(null)
      addToast(exampleToast)
    } catch (error) {
      if (error.response) {
        console.debug(error)
        // The client was given an error response (5xx, 4xx)
        // setLoading(false)
        // setErrorResp(true)
        setErrorUpload(error.response.data.message)
      } else {
        console.debug(error)
        setErrorUpload('Ops... Terjadi kesalahan.')
        // Anything else
        // setLoading(false)
        // setError(true)
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
    table = <CTable striped responsive columns={columns} items={items} className="mb-3" />
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
      <h1 className="text-center">Gaji</h1>
      <CForm className="row g-3 my-3" onSubmit={onAdd}>
        <CRow className="justify-content-start" xs={{ gutterY: 2 }}>
          <CCol md={6}>
            <CFormInput
              type="file"
              id="uploadGajiFormFile"
              accept=".xlsx"
              onChange={handleFileChange}
              required
            />
          </CCol>
          <CCol className="d-grid gap-2 d-md-block">
            <CLoadingButton color="primary" type="submit" loading={loadingUpload}>
              <CIcon icon={cilCloudUpload} /> Upload
            </CLoadingButton>
          </CCol>
        </CRow>
      </CForm>
      {errorUpload && <CAlert color="danger">Error: {errorUpload}</CAlert>}
      <CForm className="row g-3 my-3">
        <CRow className="justify-content-start" xs={{ gutterY: 2 }}>
          <CCol md={3}>
            <SelectTahun
              setSelect={(id) => setTahun(id)}
              end={2025}
              start={date.getFullYear()}
              tahun={tahun}
            />
          </CCol>
          <CCol md={4}>
            <SelectUnitGaji setIdGaji={(id) => setIdGaji(id)} />
          </CCol>
          <CCol className="d-grid gap-2 d-md-block">
            <CButton type="submit" onClick={onSearchButton} color="primary">
              <CIcon icon={cilSearch}></CIcon>
            </CButton>
          </CCol>
        </CRow>
      </CForm>
      {table}
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
    </>
  )
}
export default Gaji
