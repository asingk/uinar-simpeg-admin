import React, { useState } from 'react'
import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
  CTable,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilPlus, cilSearch } from '@coreui/icons'
import SelectTahun from '../../components/kehadiran/SelectTahun'
import axios from 'axios'
import UbahRiwayatProfilModal from '../../components/kehadiran/UbahRiwayatProfilModal'
import HapusRiwayatProfilModal from '../../components/kehadiran/HapusRiwayatProfilModal'
import TambahRiwayatProfilModal from '../../components/kehadiran/TambahRiwayatProfilModal'

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
})

const RiwayatProfil = () => {
  console.debug('rendering... RiwayatProfil')

  const date = new Date()

  const [idPegawai, setIdPegawai] = useState('')
  const [tahun, setTahun] = useState(date.getFullYear())
  const [data, setData] = useState([])
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState('')
  const [dataEdit, setDataEdit] = useState({})
  const [isDelete, setIsDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const columns = [
    {
      key: 'bulan',
      // label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'nama',
      _props: { scope: 'col' },
    },
    {
      key: 'namaStatusPegawai',
      label: 'Status Pegawai',
      _props: { scope: 'col' },
    },
    {
      key: 'jenisJabatan',
      // label: 'Heading',
      _props: { scope: 'col' },
    },
    {
      key: 'golongan',
      _props: { scope: 'col' },
    },
    {
      key: 'unitGaji',
      _props: { scope: 'col' },
    },
    {
      key: 'unitRemun',
      _props: { scope: 'col' },
    },
    {
      key: 'grade',
      _props: { scope: 'col' },
    },
    {
      key: 'remunGrade',
      _props: { scope: 'col' },
    },
    {
      key: 'implementasiRemun',
      label: 'Implementasi Remun (%)',
      _props: { scope: 'col' },
    },
    {
      key: 'pajak',
      label: 'Pajak (%)',
      _props: { scope: 'col' },
    },
    {
      key: 'uangMakanHarian',
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
    console.log(data.length)
    for (let i = 0; i < data.length; i++) {
      const item = {
        bulan: data[i].bulan,
        nama: data[i].nama,
        namaStatusPegawai: data[i].namaStatusPegawai,
        jenisJabatan: data[i].jenisJabatan,
        golongan: data[i].golongan,
        unitGaji: data[i].unitGaji,
        unitRemun: data[i].unitRemun,
        grade: data[i].grade,
        remunGrade: formatter.format(data[i].remunGrade),
        implementasiRemun: data[i].implementasiRemun,
        pajak: data[i].pajak,
        uangMakanHarian: formatter.format(data[i].uangMakanHarian),
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="warning"
              variant="outline"
              size="sm"
              onClick={(e) => editModalAction(data[i])}
            >
              <CIcon icon={cilPencil} />
            </CButton>
            <CButton
              color="danger"
              variant="outline"
              size="sm"
              className="me-md-2"
              onClick={() => deleteModalAction(data[i].id)}
            >
              <CIcon icon={cilDelete} />
            </CButton>
          </div>
        ),
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    }
  } else {
    const item = {
      bulan: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, bulan: { colSpan: 13 } },
    }
    items.push(item)
  }

  const search = () => {
    setLoading(true)
    axios
      .get(
        import.meta.env.VITE_KEHADIRAN_API_URL +
          '/pegawai/' +
          idPegawai +
          '/riwayat-profil?' +
          'tahun=' +
          tahun,
      )
      .then(function (response) {
        // handle success
        // console.log(response)
        setData(response.data)
      })
      .catch(function (error) {
        // handle error
        console.log(error.message)
        if (error.response) {
          // The client was given an error response (5xx, 4xx)
          // setErrorResp(true)
          setError(error.response.data.message)
        } else {
          // setErrorProfilRiwayat('Ooops... terjadi kesalahan!')
        }
      })
      .finally(function () {
        // always executed
        setLoading(false)
      })
  }

  const onSearchButton = (event) => {
    event.preventDefault()
    event.stopPropagation()
    search()
  }

  function editModalAction(data) {
    setDataEdit(data)
    setIsEdit(true)
  }

  function deleteModalAction(id) {
    setId(id)
    setIsDelete(true)
  }

  function onEdit() {
    setIsEdit(false)
    search()
  }
  function onDelete() {
    setIsDelete(false)
    search()
  }

  function onAdd() {
    setIsAdd(false)
    search()
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
    table = <CTable striped responsive columns={columns} items={items} className="mb-3" />
  }

  return (
    <>
      <h1 className="text-center">Riwayat Profil</h1>
      <CForm className="row g-3 my-3">
        <CRow className="justify-content-start" xs={{ gutterY: 2 }}>
          <CCol md={4}>
            <CFormLabel htmlFor="profilInputNIP" className="visually-hidden">
              NIP/NUK
            </CFormLabel>
            <CFormInput
              type="text"
              id="profilInputNIP"
              placeholder="NIP/NUK"
              aria-label="nip/nuk"
              onChange={(e) => setIdPegawai(e.target.value)}
            />
          </CCol>
          <CCol md={3}>
            <SelectTahun
              setSelect={(id) => setTahun(id)}
              end={2023}
              start={date.getFullYear()}
              tahun={tahun}
            />
          </CCol>
          <CCol className="d-grid gap-2 d-md-block">
            <CButton type="submit" onClick={onSearchButton} color="primary">
              <CIcon icon={cilSearch}></CIcon>
            </CButton>
          </CCol>
        </CRow>
      </CForm>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah Profil
        </CButton>
      </div>
      {table}
      {isEdit && (
        <UbahRiwayatProfilModal
          visible={isEdit}
          setVisible={setIsEdit}
          data={dataEdit}
          edited={onEdit}
        />
      )}
      {isDelete && (
        <HapusRiwayatProfilModal
          id={id}
          visible={isDelete}
          setVisible={setIsDelete}
          deleted={onDelete}
        />
      )}
      {isAdd && (
        <TambahRiwayatProfilModal
          nip={idPegawai}
          tahun={tahun}
          visible={isAdd}
          setVisible={setIsAdd}
          added={onAdd}
        />
      )}
    </>
  )
}
export default RiwayatProfil
