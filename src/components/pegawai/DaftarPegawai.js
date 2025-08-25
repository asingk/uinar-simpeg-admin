import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import Tabel from './Table'
import {
  CAlert,
  CCol,
  CFormLabel,
  CFormSelect,
  CRow,
  CSmartPagination,
  CSpinner,
} from '@coreui/react-pro'

const GET_DAFTAR_PEGAWAI = gql`
  query DaftarPegawai(
    $skip: Int
    $take: Int
    $orderBy: PegawaiOrderByInput
    $filter: PegawaiFilterInput
  ) {
    daftarPegawai(skip: $skip, take: $take, orderBy: $orderBy, filter: $filter) {
      id
      count
      pegawai {
        id
        nama
        statusPegawai {
          id
          nama
        }
        jabatanSaatIni {
          level {
            nama
          }
        }
      }
    }
  }
`

const DaftarPegawai = (props) => {
  const [limit, setLimit] = useState(10)
  const [sort, setSort] = useState('asc')

  const setCurrentPage = (currentPage) => {
    props.changePage(currentPage)
  }

  const setSorting = (sorting) => {
    setSort(sorting)
  }

  const orderBy = { id: sort }
  const skip = limit * (props.curPage - 1)

  let filter = {
    searchString: props.search,
    daftarStatusAktifId: props.statusAktifId,
    daftarStatusPegawaiId: props.statusPegawaiId,
  }

  if (props.option?.length > 0) {
    filter.jenisJabatan = props.option
  }

  const { loading, error, data } = useQuery(GET_DAFTAR_PEGAWAI, {
    variables: {
      orderBy: orderBy,
      take: limit,
      skip: skip,
      filter: filter,
    },
    // skip: props.skip,
    // fetchPolicy: 'no-cache',
    // notifyOnNetworkStatusChange: true,
  })

  if (loading)
    return (
      <div className="d-flex justify-content-center">
        <CSpinner color="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  else if (error)
    return (
      <CAlert className="w-100" color="danger">
        Error: {error.message}
      </CAlert>
    )

  const daftar = data.daftarPegawai
  const count = daftar.count
  const totalPages = Math.ceil(count / limit)
  const daftarPegawai = daftar.pegawai

  return (
    <div>
      <Tabel
        statusPegawai={props.statusPegawaiId}
        limit={limit}
        curPage={props.curPage}
        data={daftarPegawai}
        sorting={setSorting}
        sort={sort}
      />
      <CRow className="justify-content-between mb-2">
        <CCol lg={6}>
          <CSmartPagination
            activePage={props.curPage}
            pages={totalPages}
            onActivePageChange={setCurrentPage}
          />
        </CCol>
        <CCol lg={3}>
          <CRow>
            <CFormLabel htmlFor="colFormLabelSm" className="col-sm-7 col-form-label">
              Item per halaman:
            </CFormLabel>
            <CCol lg={5}>
              <CFormSelect
                aria-label="Default select example"
                defaultValue={limit}
                options={[
                  { label: '5', value: '5' },
                  { label: '10', value: '10' },
                  { label: '20', value: '20' },
                  { label: '50', value: '50' },
                  { label: '100', value: '100' },
                ]}
                onChange={(e) => setLimit(Number(e.target.value))}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </div>
  )
}

DaftarPegawai.propTypes = {
  changePage: PropTypes.func,
  curPage: PropTypes.number,
  option: PropTypes.array,
  search: PropTypes.string,
  statusPegawaiId: PropTypes.array.isRequired,
  skip: PropTypes.bool,
  statusAktifId: PropTypes.array.isRequired,
}

export default DaftarPegawai
