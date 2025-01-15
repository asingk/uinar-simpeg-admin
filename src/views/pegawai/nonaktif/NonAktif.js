import React, { useEffect, useState } from 'react'
import DaftarPegawai from 'src/components/pegawai/DaftarPegawai'
import { CCol, CFormInput, CRow } from '@coreui/react-pro'
import { gql, useQuery } from '@apollo/client'

const STATUS_PEGAWAI_PNS_ID = 1
const STATUS_PEGAWAI_CPNS_ID = 2
const STATUS_PEGAWAI_NON_ASN_ID = 3
const STATUS_PEGAWAI_PNSDPB_ID = 4
const STATUS_PEGAWAI_PPPK_ID = 5

const GET_DAFTAR_STATUS_AKTIF = gql`
  query DaftarStatusAktif {
    daftarStatusAktif {
      id
      isActive
    }
  }
`

const NonAktif = () => {
  console.debug('rendering... NonAktif')

  const [option, setOption] = useState([])
  const [curPage, setCurPage] = useState(1)
  const [skip, setSkip] = useState(false)
  const [search, setSearch] = useState('')
  const [enteredName, setEnteredname] = useState('')

  const { data } = useQuery(GET_DAFTAR_STATUS_AKTIF)

  useEffect(() => {
    const nama = setTimeout(() => {
      setSearch(enteredName)
    }, 500)

    return () => {
      clearTimeout(nama)
    }
  }, [enteredName])

  useEffect(() => {
    let statusAktifId = []
    data?.daftarStatusAktif.forEach((el) => {
      // console.log(el)
      if (!el.isActive) {
        statusAktifId.push(el.id)
      }
    })
    setOption(statusAktifId)
  }, [data?.daftarStatusAktif])

  // const handleOptionChange = (option) => {
  //   setOption(option)
  //   setSkip(false)
  //   setCurPage(1)
  // }

  const searchHandle = (value) => {
    setEnteredname(value)
    setSkip(false)
    setCurPage(1)
  }

  const pageChange = (page) => {
    setCurPage(page)
    setSkip(false)
  }

  return (
    <div>
      <CRow className="justify-content-end mb-3">
        <CCol md={4}>
          <CFormInput
            type="text"
            placeholder="Cari NIP/NUK/Nama"
            aria-label="Cari NIP/NUK/Nama"
            onChange={(e) => {
              searchHandle(e.target.value)
            }}
          />
        </CCol>
      </CRow>
      <CRow>
        <DaftarPegawai
          statusPegawaiId={[
            STATUS_PEGAWAI_CPNS_ID,
            STATUS_PEGAWAI_PPPK_ID,
            STATUS_PEGAWAI_PNS_ID,
            STATUS_PEGAWAI_PNSDPB_ID,
            STATUS_PEGAWAI_NON_ASN_ID,
          ]}
          statusAktifId={option}
          search={search}
          curPage={curPage}
          changePage={pageChange}
          skip={skip}
        />
      </CRow>
    </div>
  )
}

export default NonAktif
