import React from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const GET_DAFTAR_SUBBAG_UKER = gql`
  query DaftarSubbagUnitKerja {
    daftarSubbagUnitKerja {
      id
      nama
    }
  }
`

const SelectSubbagUnitKerja = (props) => {
  console.log('rendering... SelectSubbagUnitKerja')

  const { data, loading, error } = useQuery(GET_DAFTAR_SUBBAG_UKER)

  if (loading) {
    return <p className="text-center">Loading..</p>
  }
  if (error) {
    return <p className="text-center">Error.. :-(</p>
  }

  let options = [{ label: '-- Pilih Subbagian Unit Kerja --', value: '0' }]
  data.daftarSubbagUnitKerja.forEach((row) => {
    const opt = {
      label: row.nama,
      value: row.id,
    }
    options.push(opt)
  })

  return (
    <CFormSelect
      aria-label="Default select subbagian unit kerja"
      options={options}
      value={props.subbagId}
      onChange={(e) => props.setSubbagId(parseInt(e.target.value))}
    />
  )
}

SelectSubbagUnitKerja.propTypes = {
  subbagId: PropTypes.number.isRequired,
  setSubbagId: PropTypes.func,
}

export default SelectSubbagUnitKerja
