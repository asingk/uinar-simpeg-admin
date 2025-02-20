import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { cilFile } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CButton,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CPopover,
  CRow,
  CSmartPagination,
  CSpinner,
  CTable,
} from '@coreui/react-pro'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import BatalkanIzinModal from '../../components/kehadiran/BatalkanIzinModal'
import { KeycloakContext } from 'src/context'

const RiwayatIzin = () => {
  console.debug('rendering... RiwayatIzin')

  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [size, setSize] = useState(10)
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [id, setId] = useState()
  const [isOpenBatalModal, setIsOpenbatalModal] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [nip, setNip] = useState('')
  const [searchNip, setSearchNip] = useState('')

  const keycloak = useContext(KeycloakContext)

  useEffect(() => {
    let param = {
      size: size,
      page: currentPage - 1,
      status: '1,2,3',
    }
    if (searchNip.length === 18) {
      param.idPegawai = searchNip
    }
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/usul-izin`, {
        params: param,
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
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
      .then(() => {
        setLoading(false)
      })
  }, [currentPage, searchNip, size, toggle])

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
      label: 'File',
      _props: { scope: 'col' },
    },
    {
      key: 'status',
      label: '',
      _props: { scope: 'col' },
    },
  ]

  const onBatal = (data) => {
    setId(data.id)
    setNip(data.nip)
    setIsOpenbatalModal(true)
  }

  const getStatusAksi = (data) => {
    // console.log(data)
    switch (data.status) {
      case 1:
        return (
          <>
            <div className="badge bg-success text-wrap" style={{ width: '6rem' }}>
              Disetujui
            </div>
            <br />
            <span
              className="text-secondary"
              style={{ cursor: 'pointer' }}
              onClick={() => onBatal(data)}
            >
              <small>
                <u>Batalkan?</u>
              </small>
            </span>
          </>
        )
      case 2:
        return (
          <>
            <div className="badge bg-danger text-wrap" style={{ width: '6rem' }}>
              Ditolak
            </div>
            <br />
            <CPopover title="Alasan Ditolak" content={data.ket} placement="right">
              <span className="text-danger" style={{ cursor: 'pointer' }}>
                <small>
                  <u>Lihat Alasan</u>
                </small>
              </span>
            </CPopover>
          </>
        )
      default:
        return (
          <div className="badge bg-secondary text-wrap" style={{ width: '6rem' }}>
            Dibatalkan
          </div>
        )
    }
  }

  let items = []
  if (totalElements > 0) {
    const startNo = (currentPage - 1) * size
    for (let i = 0; i < data.length; i++) {
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
            <CIcon icon={cilFile} />
          </CButton>
        ),
        status: getStatusAksi(data[i]),
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
      <h1 className="text-center mb-3">Riwayat Usulan Izin</h1>
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
            <CFormLabel
              htmlFor="colFormLabelSm"
              className="col-sm-7 col-form-label col-form-label-sm"
            >
              Item per halaman:
            </CFormLabel>
            <CCol lg={5}>
              <CFormSelect
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
          <CButton color="link" onClick={() => navigate('/kehadiran/izin')}>
            Lihat Usulan Izin
          </CButton>
        </CCol>
      </CRow>
      {isOpenBatalModal && (
        <BatalkanIzinModal
          id={id}
          nip={nip}
          visible={isOpenBatalModal}
          setVisible={setIsOpenbatalModal}
          done={() => {
            setToggle(!toggle)
            setIsOpenbatalModal(false)
          }}
        />
      )}
    </div>
  )
}

export default RiwayatIzin
