import React, { useContext, useEffect, useState } from 'react'
import DaftarPegawai from 'src/components/pegawai/DaftarPegawai'
import AddPegawaiSyncModal from 'src/components/pegawai/AddPegawaiSyncModal'
import CIcon from '@coreui/icons-react'
import { cilUserPlus } from '@coreui/icons'
import { CButton, CButtonGroup, CCol, CFormCheck, CFormInput, CRow } from '@coreui/react-pro'
import { KeycloakContext } from 'src/context'

const STATUS_PEGAWAI_PNS_ID = 1
const STATUS_PEGAWAI_CPNS_ID = 2
const STATUS_PEGAWAI_PPPK_ID = 5

const Asn = () => {
  console.debug('rendering... Asn')

  const [option, setOption] = useState([])
  const [optionStatusPeg, setOptionStatusPeg] = useState('ASN')
  const [statusPegawaiId, setStatusPegawaiId] = useState([
    STATUS_PEGAWAI_PNS_ID,
    STATUS_PEGAWAI_CPNS_ID,
    STATUS_PEGAWAI_PPPK_ID,
  ])
  const [curPage, setCurPage] = useState(1)
  const [skip, setSkip] = useState(false)
  const [search, setSearch] = useState('')
  const [enteredName, setEnteredname] = useState('')
  const [basicModal, setBasicModal] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const role = keycloak.resourceAccess['simpeg-admin']?.roles[0]

  useEffect(() => {
    const nama = setTimeout(() => {
      setSearch(enteredName)
    }, 500)

    return () => {
      clearTimeout(nama)
    }
  }, [enteredName])

  const handleOptionChange = (option) => {
    setOption(option)
    setSkip(false)
    setCurPage(1)
  }

  const handleOptionStatusPegChange = (optionStatusPeg) => {
    setOptionStatusPeg(optionStatusPeg)
    setSkip(false)
    setCurPage(1)
    switch (optionStatusPeg) {
      case 'PNS':
        setStatusPegawaiId([STATUS_PEGAWAI_PNS_ID])
        break
      case 'PPPK':
        setStatusPegawaiId([STATUS_PEGAWAI_PPPK_ID])
        break
      case 'CPNS':
        setStatusPegawaiId([STATUS_PEGAWAI_CPNS_ID])
        break
      default:
        setStatusPegawaiId([STATUS_PEGAWAI_PNS_ID, STATUS_PEGAWAI_CPNS_ID, STATUS_PEGAWAI_PPPK_ID])
        break
    }
  }

  const searchHandle = (value) => {
    setEnteredname(value)
    setSkip(false)
    setCurPage(1)
  }

  const pageChange = (page) => {
    setCurPage(page)
    setSkip(false)
  }

  const showModal = () => {
    setBasicModal(true)
  }

  return (
    <>
      <div className="text-center mb-2">
        <CButtonGroup role="group" aria-label="Pilih jenis jabatan">
          <CFormCheck
            button={{ color: 'primary', variant: 'outline' }}
            type="radio"
            name="options-outlined"
            id="semua-outlined"
            autoComplete="off"
            label="Semua"
            checked={option.length === 0}
            onChange={() => handleOptionChange([])}
          />
          <CFormCheck
            button={{ color: 'primary', variant: 'outline' }}
            type="radio"
            name="options-outlined"
            id="dosen-outlined"
            autoComplete="off"
            label="Dosen"
            checked={option.length === 2}
            onChange={() => handleOptionChange(['DS', 'DT'])}
          />
          <CFormCheck
            button={{ color: 'primary', variant: 'outline' }}
            type="radio"
            name="options-outlined"
            id="tendik-outlined"
            autoComplete="off"
            label="Tendik"
            checked={option.length === 1}
            onChange={() => handleOptionChange(['Tendik'])}
          />
        </CButtonGroup>
      </div>
      <div className="text-center mb-3">
        <CButtonGroup role="group" aria-label="Pilih jenis ASN">
          <CFormCheck
            button={{ color: 'primary', variant: 'outline' }}
            type="radio"
            name="options-status-peg"
            id="asn-status-peg"
            autoComplete="off"
            label="Semua"
            checked={optionStatusPeg === 'ASN'}
            onChange={() => handleOptionStatusPegChange('ASN')}
          />
          <CFormCheck
            button={{ color: 'primary', variant: 'outline' }}
            type="radio"
            name="options-status-peg"
            id="pns-outlined"
            autoComplete="off"
            label="PNS"
            checked={optionStatusPeg === 'PNS'}
            onChange={() => handleOptionStatusPegChange('PNS')}
          />
          <CFormCheck
            button={{ color: 'primary', variant: 'outline' }}
            type="radio"
            name="options-status-peg"
            id="pppk-outlined"
            autoComplete="off"
            label="PPPK"
            checked={optionStatusPeg === 'PPPK'}
            onChange={() => handleOptionStatusPegChange('PPPK')}
          />
          <CFormCheck
            button={{ color: 'primary', variant: 'outline' }}
            type="radio"
            name="options-status-peg"
            id="cpns-outlined"
            autoComplete="off"
            label="CPNS"
            checked={optionStatusPeg === 'CPNS'}
            onChange={() => handleOptionStatusPegChange('CPNS')}
          />
        </CButtonGroup>
      </div>
      <CRow className="justify-content-between mb-3" xs={{ gutterY: 2 }}>
        <CCol>
          <CButton onClick={showModal} disabled={role === 'keuangan'} color="primary">
            <CIcon icon={cilUserPlus} /> Tambah ASN
          </CButton>
        </CCol>
        <CCol md="4">
          <CFormInput
            type="text"
            placeholder="Cari NIP/Nama"
            aria-label="Cari NIP/Nama"
            onChange={(e) => {
              searchHandle(e.target.value)
            }}
          />
        </CCol>
        {basicModal && <AddPegawaiSyncModal show={basicModal} setBasicModal={setBasicModal} />}
      </CRow>
      <CRow>
        <DaftarPegawai
          statusPegawaiId={statusPegawaiId}
          option={option}
          search={search}
          curPage={curPage}
          changePage={pageChange}
          skip={skip}
          statusAktifId={[1]}
        />
      </CRow>
    </>
  )
}

export default Asn
