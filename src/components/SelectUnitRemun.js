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

const SelectUnitRemun = (props) => {
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
      label: '-- Pilih Unit Remun --',
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
      aria-label="Pilih Unit Remun"
      defaultValue={props.idGaji}
      disabled={props.disabled}
      options={gajiOptions}
      onChange={(e) => props.setIdGaji(e.target.value || '')}
    />
  )
}

SelectUnitRemun.propTypes = {
  idGaji: PropTypes.string,
  setIdGaji: PropTypes.func,
  disabled: PropTypes.bool,
}

export default SelectUnitRemun
