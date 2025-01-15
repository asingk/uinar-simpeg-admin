import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { cilFile, cilThumbDown, cilThumbUp } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CButton,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSmartPagination,
  CSpinner,
  CTable,
} from '@coreui/react-pro'
import dayjs from 'dayjs'
import ApproveIzinModal from '../../components/kehadiran/ApproveIzinModal'
import RejectIzinModal from '../../components/kehadiran/RejectIzinModal'
import { useNavigate } from 'react-router-dom'

const Izin = () => {
  console.debug('rendering... Izin')

  const [id, setId] = useState('')
  const [nip, setNip] = useState('')
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false)
  const [isOpenRejectModal, setIsOpenRejectModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [size, setSize] = useState(10)
  const [data, setData] = useState([])
  const [toggle, setToggle] = useState(false)
  const navigate = useNavigate()
  const [searchNip, setSearchNip] = useState('')

  useEffect(() => {
    let param = {
      size: size,
      page: currentPage - 1,
      status: '0',
    }
    if (searchNip.length === 18) {
      param.idPegawai = searchNip
    }
    axios
      .get(import.meta.env.VITE_KEHADIRAN_API_URL + '/usul-izin', {
        params: param,
      })
      .then((response) => {
        setCurrentPage(response.data.page.number + 1)
        setTotalPages(response.data.page.totalPages)
        setTotalElements(response.data.page.totalElements)
        if (response.data.page.totalElements > 0) setData(response.data._embedded.usulIzinModelList)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentPage, searchNip, size, toggle])

  const onApprove = (id, nip) => {
    setId(id)
    setNip(nip)
    setIsOpenApproveModal(true)
  }

  const onReject = (id, nip) => {
    setId(id)
    setNip(nip)
    setIsOpenRejectModal(true)
  }

  const columns = [
    {
      key: 'no',
      label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'nama',
      label: 'Nama Pegawai',
      _props: { scope: 'col' },
    },
    {
      key: 'nip',
      label: 'NIP/NUK',
      _props: { scope: 'col' },
    },
    {
      key: 'jenis',
      label: 'Jenis Izin',
      _props: { scope: 'col' },
    },
    {
      key: 'tanggal',
      label: 'Tanggal',
      _props: { scope: 'col' },
    },
    {
      key: 'file',
      label: '',
      _props: { scope: 'col' },
    },
    {
      key: 'aksi',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  let items = []

  if (totalElements > 0) {
    const startNo = (currentPage - 1) * size
    for (let i = 0; i < data.length; i++) {
      // const items = data[i]
      const item = {
        no: startNo + i + 1,
        nama: data[i].nama,
        nip: data[i].nip,
        jenis: data[i].izinCategoryDesc,
        tanggal:
          dayjs(data[i].startDate).format('D/M/YYYY') +
          (data[i].endDate ? ' - ' + dayjs(data[i].endDate).format('D/M/YYYY') : ''),
        file: (
          <CButton
            color="info"
            variant="outline"
            size="sm"
            href={data[i].file}
            target="_blank"
            rel="noreferrer"
          >
            <CIcon icon={cilFile} /> Lihat File
          </CButton>
        ),
        aksi: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="success"
              variant="outline"
              size="sm"
              onClick={() => onApprove(data[i].id, data[i].nip)}
            >
              <CIcon icon={cilThumbUp} /> Setujui
            </CButton>
            <CButton
              color="danger"
              variant="outline"
              size="sm"
              onClick={() => onReject(data[i].id, data[i].nip)}
            >
              <CIcon icon={cilThumbDown} /> Tolak
            </CButton>
          </div>
        ),
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    }
  } else {
    const item = {
      tanggal: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, tanggal: { colSpan: 7 } },
    }
    items.push(item)
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
    table = <CAlert color="danger">Error: {error}</CAlert>
  } else {
    table = <CTable striped responsive columns={columns} items={items} className="mb-3 mt-2" />
  }

  return (
    <div className="mb-4">
      <h1 className="text-center mb-3">Usulan Izin</h1>
      {error && <CAlert color="danger">{error}</CAlert>}
      <CRow className="justify-content-end">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Cari NIP"
            aria-label="Cari NIP"
            onChange={(e) => {
              setSearchNip(e.target.value)
            }}
          />
        </CCol>
      </CRow>
      {table}
      <CRow className="justify-content-between mt-2">
        <CCol lg={6}>
          <CSmartPagination
            activePage={currentPage}
            pages={totalPages}
            onActivePageChange={setCurrentPage}
          />
        </CCol>
        <CCol lg={3}>
          <CRow>
            <CFormLabel htmlFor="selectItemPerPagePageIzin" className="col-sm-7 col-form-label">
              Item per halaman:
            </CFormLabel>
            <CCol lg={5}>
              <CFormSelect
                id="selectItemPerPagePageIzin"
                aria-label="Default select example"
                defaultValue={'10'}
                options={[
                  { label: '5', value: '5' },
                  { label: '10', value: '10' },
                  { label: '20', value: '20' },
                  { label: '50', value: '50' },
                ]}
                onChange={(e) => setSize(Number(e.target.value))}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow className="justify-content-end">
        <CCol xs="auto">
          <CButton color="link" onClick={() => navigate('/kehadiran/riwayat-izin')}>
            Lihat Riwayat Izin
          </CButton>
        </CCol>
      </CRow>
      <ApproveIzinModal
        nip={nip}
        id={id}
        visible={isOpenApproveModal}
        setVisible={setIsOpenApproveModal}
        done={() => {
          setToggle(!toggle)
          setIsOpenApproveModal(false)
        }}
      />
      <RejectIzinModal
        nip={nip}
        id={id}
        visible={isOpenRejectModal}
        setVisible={setIsOpenRejectModal}
        done={() => {
          setToggle(!toggle)
          setIsOpenRejectModal(false)
        }}
      />
    </div>
  )
}

export default Izin
