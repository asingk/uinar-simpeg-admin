import React from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const GET_DAFTAR_STATUS_PEGAWAI = gql`
  query DaftarStatusPegawai {
    daftarStatusPegawai {
      id
      nama
    }
  }
`

const SelectStatusPegawai = (props) => {
  const { loading, error, data } = useQuery(GET_DAFTAR_STATUS_PEGAWAI)

  if (loading) {
    return <p className="text-center">Loading..</p>
  }
  if (error) {
    return <p className="text-center">Error.. :-(</p>
  }

  const statusPegawaiOptions = [
    {
      value: 0,
      label: '-- Pilih Status Pegawai --',
    },
  ]

  const stat = [...data.daftarStatusPegawai]
  stat.forEach((row) => {
    const statPeg = {
      value: row.id,
      label: row.nama,
    }
    statusPegawaiOptions.push(statPeg)
  })

  return (
    <CFormSelect
      aria-label="Pilih Status Pegawai"
      label="Status Pegawai"
      value={props.id}
      options={statusPegawaiOptions}
      onChange={(e) => props.setId(e.target.value)}
    />
  )
}

SelectStatusPegawai.propTypes = {
  id: PropTypes.number,
  setId: PropTypes.func,
}

export default SelectStatusPegawai
