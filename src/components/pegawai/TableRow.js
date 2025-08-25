import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react-pro'

export default function TableRow(props) {
  const navigate = useNavigate()

  const rowClick = () => {
    navigate('/pegawai/profil/' + props.nip)
  }

  return (
    <CTableRow onClick={(e) => rowClick(e)}>
      <CTableHeaderCell scope="row">{props.no}</CTableHeaderCell>
      <CTableDataCell>{props.nip}</CTableDataCell>
      <CTableDataCell>{props.nama}</CTableDataCell>
      <CTableDataCell>{props.jabatan}</CTableDataCell>
    </CTableRow>
  )
}

TableRow.propTypes = {
  nip: PropTypes.string.isRequired,
  no: PropTypes.number.isRequired,
  nama: PropTypes.string.isRequired,
}
