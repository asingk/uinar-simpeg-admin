import React from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const GET_DAFTAR_POSISI = gql`
  query DaftarPosisi {
    daftarPosisi {
      id
      nama
    }
  }
`

const SelectPosisi = (props) => {
  console.log('rendering... SelectPosisi')

  const { loading, error, data } = useQuery(GET_DAFTAR_POSISI)

  if (loading) {
    return <p className="text-center">Loading..</p>
  }
  if (error) {
    return <p className="text-center">Error.. :-(</p>
  }

  let options = [{ label: '-- Pilih Posisi --', value: '' }]
  data.daftarPosisi.forEach((row) => {
    const opt = {
      label: row.nama,
      value: row.id,
    }
    options.push(opt)
  })

  return (
    <CFormSelect
      aria-label="Default select posisi"
      options={options}
      value={props.posisiId}
      onChange={(e) => props.setPosisi(e.target.value)}
    />
  )
}

SelectPosisi.propTypes = {
  posisiId: PropTypes.string.isRequired,
  setPosisi: PropTypes.func,
}

export default SelectPosisi
