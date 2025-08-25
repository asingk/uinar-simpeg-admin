import React from 'react'
import TableRow from './TableRow'
import PropTypes from 'prop-types'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilSortAscending, cilSortDescending } from '@coreui/icons'

const Tabel = (props) => {
  const setSorting = (sorting) => {
    props.sorting(sorting)
  }

  const pegawais = props.data
  const rows = []
  for (let index = 0; index < pegawais.length; index++) {
    const no_table = index + 1 + (props.curPage - 1) * props.limit
    rows.push(
      <TableRow
        key={no_table}
        no={no_table}
        nip={pegawais[index].id}
        nama={pegawais[index].nama}
        jabatan={pegawais[index].jabatanSaatIni?.level?.nama}
      />,
    )
  }
  return (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col">
            {'NIP/NUK '}
            {props.sort === 'asc' ? (
              <CIcon
                icon={cilSortAscending}
                onClick={() => setSorting('desc')}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <CIcon
                icon={cilSortDescending}
                onClick={() => setSorting('asc')}
                style={{ cursor: 'pointer' }}
              />
            )}
          </CTableHeaderCell>
          <CTableHeaderCell scope="col">Nama</CTableHeaderCell>
          <CTableHeaderCell scope="col">Jabatan</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>{rows}</CTableBody>
    </CTable>
  )
}

Tabel.propTypes = {
  sort: PropTypes.string.isRequired,
  sorting: PropTypes.func,
  data: PropTypes.array,
  curPage: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
}

export default Tabel
