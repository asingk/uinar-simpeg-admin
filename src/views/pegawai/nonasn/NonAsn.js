import React, { useEffect, useState } from 'react'
import DaftarPegawai from 'src/components/pegawai/DaftarPegawai'
import CIcon from '@coreui/icons-react'
import { cilUserPlus } from '@coreui/icons'
import { CButton, CButtonGroup, CCol, CFormCheck, CFormInput, CRow } from '@coreui/react-pro'
import AddPegawaiNotSyncModal from '../../../components/pegawai/AddPegawaiNotSyncModal'

const STATUS_PEGAWAI_NON_ASN_ID = 3

const NonAsn = () => {
  console.debug('rendering... NonAsn')

  const [option, setOption] = useState([])
  const [curPage, setCurPage] = useState(1)
  const [skip, setSkip] = useState(false)
  const [search, setSearch] = useState('')
  const [enteredName, setEnteredname] = useState('')
  const [basicModal, setBasicModal] = useState(false)

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
      <div className="text-center mb-3">
        <CButtonGroup role="group" aria-label="Pilih jenis jabatan non ASN">
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
      <CRow className="justify-content-between mb-3">
        <CCol>
          <CButton onClick={showModal} color="primary">
            <CIcon icon={cilUserPlus} /> Tambah Non ASN
          </CButton>
        </CCol>
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Cari NUK/Nama"
            aria-label="Cari NUK/Nama"
            onChange={(e) => {
              searchHandle(e.target.value)
            }}
          />
        </CCol>
        {basicModal && (
          <AddPegawaiNotSyncModal
            statusPegawaiId={3}
            show={basicModal}
            setBasicModal={setBasicModal}
          />
        )}
      </CRow>
      <CRow>
        <DaftarPegawai
          statusPegawaiId={[STATUS_PEGAWAI_NON_ASN_ID]}
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

export default NonAsn
