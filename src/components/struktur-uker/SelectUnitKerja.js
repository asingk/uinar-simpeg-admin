import React from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const GET_DAFTAR_UKER = gql`
  query DaftarUnitKerja {
    daftarUnitKerja {
      id
      nama
    }
  }
`

const SelectUnitKerja = (props) => {
  console.log('rendering... SelectUnitKerja')

  const { data, loading, error } = useQuery(GET_DAFTAR_UKER)

  if (loading) {
    return <p className="text-center">Loading..</p>
  }
  if (error) {
    return <p className="text-center">Error.. :-(</p>
  }

  let options = [{ label: '-- Pilih Unit Kerja --', value: '' }]
  data.daftarUnitKerja.forEach((row) => {
    const opt = {
      label: row.nama,
      value: row.id,
    }
    options.push(opt)
  })

  return (
    <CFormSelect
      aria-label="Default select unit kerja"
      options={options}
      value={props.unitKerjaId}
      onChange={(e) => props.setUnitKerjaId(e.target.value)}
    />
  )
}

SelectUnitKerja.propTypes = {
  unitKerjaId: PropTypes.string.isRequired,
  setUnitKerjaId: PropTypes.func,
}

export default SelectUnitKerja
