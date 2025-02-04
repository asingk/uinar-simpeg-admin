import React from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const GET_DAFTAR_BAG_UKER = gql`
  query DaftarBagianUnitKerja {
    daftarBagianUnitKerja {
      id
      nama
    }
  }
`

const SelectBagianUnitKerja = (props) => {
  const { data, loading, error } = useQuery(GET_DAFTAR_BAG_UKER)

  if (loading) {
    return <p className="text-center">Loading..</p>
  }
  if (error) {
    return <p className="text-center">Error.. :-(</p>
  }

  let options = [{ label: '-- Pilih Bagian Unit Kerja --', value: '' }]
  data.daftarBagianUnitKerja.forEach((row) => {
    const opt = {
      label: row.nama,
      value: row.id,
    }
    options.push(opt)
  })

  return (
    <CFormSelect
      aria-label="Default select bagian unit kerja"
      options={options}
      value={props.bagianId}
      onChange={(e) => props.setBagianId(e.target.value)}
    />
  )
}

SelectBagianUnitKerja.propTypes = {
  bagianId: PropTypes.string.isRequired,
  setBagianId: PropTypes.func,
}

export default SelectBagianUnitKerja
