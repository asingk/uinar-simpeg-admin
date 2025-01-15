import React from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const GET_DAFTAR_HOMEBASE_GAJI = gql`
  query DaftarUnitGaji {
    daftarUnitGaji {
      id
      nama
    }
  }
`

const SelectUnitGajiLabel = (props) => {
  const { loading, error, data } = useQuery(GET_DAFTAR_HOMEBASE_GAJI)

  if (loading) {
    return <p className="text-center">Loading..</p>
  }
  if (error) {
    return <p className="text-center">Error.. :-(</p>
  }

  const gajiOptions = [
    {
      value: '',
      label: '-- Pilih Unit Gaji --',
      // disabled: true,
    },
  ]

  const gajis = [...data.daftarUnitGaji]

  gajis.forEach((row) => {
    const gaji = {
      value: row.id,
      label: row.nama,
    }
    gajiOptions.push(gaji)
  })

  return (
    <CFormSelect
      aria-label="Pilih Unit Gaji"
      defaultValue={props.idGaji}
      disabled={props.disabled}
      options={gajiOptions}
      label="Unit Gaji"
      onChange={(e) => props.setIdGaji(e.target.value || '')}
    />
  )
}

SelectUnitGajiLabel.propTypes = {
  idGaji: PropTypes.string,
  setIdGaji: PropTypes.func,
  disabled: PropTypes.bool,
}

export default SelectUnitGajiLabel
