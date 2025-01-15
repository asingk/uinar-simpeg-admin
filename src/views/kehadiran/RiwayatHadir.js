import React, { useContext, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilSearch, cilActionUndo, cilDelete } from '@coreui/icons'

import axios from 'axios'
import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import dayjs from 'dayjs'
import SelectBulanTahun from '../../components/kehadiran/SelectBulanTahun'
import HapusKehadiranModal from '../../components/kehadiran/HapusModal'
import TambahKehadiranModal from '../../components/kehadiran/TambahKehadiranModal'
import UndoTambahKehadiranModal from '../../components/kehadiran/UndoTambahKehadiranModal'
import UndoHapusKehadiranModal from '../../components/kehadiran/UndoHapusModal'
import { KeycloakContext } from 'src/context'

const RiwayatHadir = () => {
  console.debug('rendering... RiwayatHadir')

  // const navigate = useNavigate()
  const date = new Date()
  const keycloak = useContext(KeycloakContext)
  const role = keycloak.resourceAccess['simpeg-admin']?.roles[0]

  const [bulan, setBulan] = useState(date.getMonth() + 1)
  const [tahun, setTahun] = useState(date.getFullYear())
  const [idPegawai, setIdPegawai] = useState()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [profilRiwayat, setProfilRiwayat] = useState()
  const [riwayat, setRiwayat] = useState([])
  const [isOpenTambahModal, setIsOpenTambahModal] = useState(false)
  const [tanggal, setTanggal] = useState()
  const [status, setStatus] = useState()
  const [isOpenHapusModal, setIsOpenHapusModal] = useState(false)
  const [isOpenUndoTambahModal, setIsOpenUndoTambahModal] = useState(false)
  const [isOpenUndoHapusModal, setIsOpenUndoHapusModal] = useState(false)
  const [validated, setValidated] = useState(false)

  const onChangeIdPegawai = (e) => {
    setIdPegawai(e.target.value)
  }

  const onChangeBulan = (bulan, tahun) => {
    setBulan(bulan)
    setTahun(tahun)
  }

  const onSearchSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setValidated(true)
    onSearch()
  }

  const searchProfilRiwayat = async () => {
    try {
      const respRiwayatProfil = await axios.get(
        import.meta.env.VITE_KEHADIRAN_API_URL +
          '/pegawai/' +
          idPegawai +
          '/riwayat-profil?bulan=' +
          bulan +
          '&tahun=' +
          tahun,
      )
      setProfilRiwayat(respRiwayatProfil.data[0])
    } catch (err) {
      // handle error
      // console.log(error.message)
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        // setErrorResp(true)
        // setErrorProfilRiwayat(error.response.data.message)
      } else {
        // setErrorProfilRiwayat('Ooops... terjadi kesalahan!')
      }
    }
  }

  const searchRiwayatHadir = async () => {
    try {
      const respRiwayatHadir = await axios.get(
        import.meta.env.VITE_KEHADIRAN_API_URL +
          '/pegawai/' +
          idPegawai +
          '/riwayat-hadir?bulan=' +
          bulan +
          '&tahun=' +
          tahun,
      )
      setRiwayat(respRiwayatHadir.data)
    } catch (err) {
      // handle error
      // console.log(error.message)
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        // setErrorResp(true)
        // setErrorProfilRiwayat(error.response.data.message)
      } else {
        // setErrorProfilRiwayat('Ooops... terjadi kesalahan!')
      }
    }
  }

  const onSearch = async () => {
    if (!idPegawai) return
    setLoading(true)
    setError('')
    await searchProfilRiwayat()
    await searchRiwayatHadir()
    setLoading(false)
  }

  const onAdd = () => {
    setIsOpenTambahModal(false)
    onSearch()
  }

  const showTambahModal = (tanggal, status) => {
    setTanggal(tanggal)
    setStatus(status)
    setIsOpenTambahModal(true)
  }

  const showHapusModal = (e, tanggal) => {
    setIsOpenHapusModal(true)
    setTanggal(tanggal)
  }

  const closeHapusModal = () => {
    setIsOpenHapusModal(false)
  }

  const deleted = () => {
    setIsOpenHapusModal(false)
    onSearch()
  }

  const showUndoTambahModal = (e, tanggal, status) => {
    setTanggal(tanggal)
    setStatus(status)
    setIsOpenUndoTambahModal(true)
  }

  const onUndoAdd = () => {
    setIsOpenUndoTambahModal(false)
    onSearch()
  }

  const closeUndoHapusModal = () => {
    setIsOpenUndoHapusModal(false)
  }

  const undoDelete = () => {
    setIsOpenUndoHapusModal(false)
    onSearch()
  }

  const showUndoHapusModal = (e, tanggal) => {
    setIsOpenUndoHapusModal(true)
    setTanggal(tanggal)
  }

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  let table

  if (loading) {
    table = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    table = <CAlert color="danger">Error: {error.message}</CAlert>
  } else {
    let rows
    if (riwayat.length > 0) {
      rows = riwayat.map((item) => (
        <CTableRow key={item.tanggal}>
          <CTableHeaderCell scope="row">
            {dayjs(item.tanggal).format('DD/MM/YYYY')}
          </CTableHeaderCell>
          <CTableDataCell>
            {item.keteranganDatang || (item.jamDatang ? item.jamDatang.substr(0, 5) : '-')}
          </CTableDataCell>
          {profilRiwayat?.jenisJabatan !== 'DS' && (
            <CTableDataCell>{item.telatDatang}</CTableDataCell>
          )}
          <CTableDataCell>
            {!item.jamDatang && !item.keteranganDatang && (
              <CButton
                color="info"
                variant="outline"
                size="sm"
                onClick={() => showTambahModal(item.tanggal, 'DATANG')}
                disabled={role === 'keuangan'}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            )}
            {item.keteranganDatang === 'ditambahkan' && (
              <CButton
                color="warning"
                variant="outline"
                size="sm"
                onClick={(e) => showUndoTambahModal(e, item.tanggal, 'DATANG')}
                disabled={role === 'keuangan'}
              >
                <CIcon icon={cilActionUndo} size="sm" />
              </CButton>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {item.keteranganPulang || (item.jamPulang ? item.jamPulang.substr(0, 5) : '-')}
          </CTableDataCell>
          {profilRiwayat?.jenisJabatan !== 'DS' && (
            <CTableDataCell>{item.cepatPulang}</CTableDataCell>
          )}
          <CTableDataCell>
            {!item.jamPulang && !item.keteranganPulang && (
              <CButton
                color="info"
                variant="outline"
                size="sm"
                onClick={(e) => showTambahModal(item.tanggal, 'PULANG')}
                disabled={role === 'keuangan'}
              >
                <CIcon icon={cilPlus} size="sm" />
              </CButton>
            )}
            {item.keteranganPulang === 'ditambahkan' && (
              <CButton
                color="warning"
                variant="outline"
                size="sm"
                onClick={(e) => showUndoTambahModal(e, item.tanggal, 'PULANG')}
                disabled={role === 'keuangan'}
              >
                <CIcon icon={cilActionUndo} size="sm" />
              </CButton>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {((item.jamDatang && !item.keteranganDatang) ||
              (item.jamPulang && !item.keteranganPulang)) && (
              <CButton
                color="danger"
                variant="outline"
                size="sm"
                onClick={(e) => showHapusModal(e, item.tanggal)}
                disabled={role === 'keuangan'}
              >
                <CIcon icon={cilDelete} size="sm" />
              </CButton>
            )}
            {(item.keteranganDatang === 'dihapus' || item.keteranganPulang === 'dihapus') && (
              <CButton
                color="warning"
                variant="outline"
                size="sm"
                onClick={(e) => showUndoHapusModal(e, item.tanggal)}
                disabled={role === 'keuangan'}
              >
                <CIcon icon={cilActionUndo} size="sm" />
              </CButton>
            )}
          </CTableDataCell>
        </CTableRow>
      ))
    } else {
      rows = (
        <tr>
          <td colSpan="8">Tidak ada Data</td>
        </tr>
      )
    }
    table = (
      <CTable striped responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Tanggal</CTableHeaderCell>
            <CTableHeaderCell scope="col">Datang</CTableHeaderCell>
            {profilRiwayat?.jenisJabatan !== 'DS' && (
              <CTableHeaderCell scope="col">Telat Datang</CTableHeaderCell>
            )}
            <CTableHeaderCell scope="col"></CTableHeaderCell>
            <CTableHeaderCell scope="col">Pulang</CTableHeaderCell>
            {profilRiwayat?.jenisJabatan !== 'DS' && (
              <CTableHeaderCell scope="col">Cepat Pulang</CTableHeaderCell>
            )}
            <CTableHeaderCell scope="col"></CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>{rows}</CTableBody>
      </CTable>
    )
  }

  return (
    <div>
      <h1 className="text-center">Riwayat Hadir</h1>
      <CForm
        className="row g-3 needs-validation mb-3"
        noValidate
        validated={validated}
        onSubmit={(e) => onSearchSubmit(e)}
      >
        <CCol xs="auto">
          <CFormLabel htmlFor="hadirInputNIP" className="visually-hidden">
            NIP/NUK
          </CFormLabel>
          <CFormInput
            type="text"
            id="hadirInputNIP"
            placeholder="NIP/NUK"
            onChange={(e) => onChangeIdPegawai(e)}
            required
            feedbackInvalid="Silahkan masukkan NIP/NUK"
          />
        </CCol>
        <CCol xs="auto">
          <SelectBulanTahun setSelect={(bulan, tahun) => onChangeBulan(bulan, tahun)} />
        </CCol>
        <CCol xs="auto">
          <CButton type="submit" className="mb-3" color="primary">
            <CIcon icon={cilSearch}></CIcon>
          </CButton>
        </CCol>
      </CForm>
      {table}
      {isOpenTambahModal && (
        <TambahKehadiranModal
          visible={isOpenTambahModal}
          setVisible={setIsOpenTambahModal}
          idPegawai={idPegawai}
          tanggal={tanggal}
          status={status}
          close={() => setIsOpenTambahModal(false)}
          added={onAdd}
        />
      )}
      {isOpenHapusModal && (
        <HapusKehadiranModal
          visible={isOpenHapusModal}
          setVisible={setIsOpenHapusModal}
          idPegawai={idPegawai}
          tanggal={tanggal}
          close={closeHapusModal}
          deleted={deleted}
        />
      )}
      {isOpenUndoTambahModal && (
        <UndoTambahKehadiranModal
          visible={isOpenUndoTambahModal}
          setVisible={setIsOpenUndoTambahModal}
          idPegawai={idPegawai}
          tanggal={tanggal}
          status={status}
          close={() => setIsOpenUndoTambahModal(false)}
          undoAdd={onUndoAdd}
        />
      )}
      {isOpenUndoHapusModal && (
        <UndoHapusKehadiranModal
          visible={isOpenUndoHapusModal}
          setVisible={setIsOpenUndoHapusModal}
          idPegawai={idPegawai}
          tanggal={tanggal}
          close={closeUndoHapusModal}
          undoDelete={undoDelete}
        />
      )}
      {riwayat.length > 0 && (
        <div className="d-grid gap-2 col-6 mx-auto my-2">
          <CButton
            color="primary"
            onClick={() =>
              openInNewTab('/#/kehadiran/pegawai/pdf/' + idPegawai + '/' + tahun + '/' + bulan)
            }
          >
            Buka Sebagai PDF
          </CButton>
        </div>
      )}
    </div>
  )
}

export default RiwayatHadir
