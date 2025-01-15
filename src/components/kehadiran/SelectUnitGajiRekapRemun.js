import React from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'

const GET_DAFTAR_HOMEBASE_GAJI = gql`
  query DaftarUnitGaji {
    daftarUnitGaji {
      id
      nama
    }
  }
`

const SelectUnitGajiRekapRemun = (props) => {
  const { loading, error, data } = useQuery(GET_DAFTAR_HOMEBASE_GAJI)

  if (loading) {
    return <p className="text-center">Loading..</p>
  }
  if (error) {
    return <p className="text-center">Error.. :-(</p>
  }

  const gajiDefault = {
    id: '',
    nama: 'Semua Unit',
  }

  const gajis = [...data.daftarUnitGaji]
  if (gajis[0].id) {
    gajis.unshift(gajiDefault)
  }
  const gajiOptions = gajis.map((item) => (
    <option key={item.id} value={item.id}>
      {item.nama}
    </option>
  ))

  return (
    <select
      className="form-select"
      value={props.idGaji}
      onChange={(e) => props.setIdGaji(e.target.value || '')}
      disabled={props.disabled}
    >
      {gajiOptions}
    </select>
  )
}

SelectUnitGajiRekapRemun.propTypes = {
  idGaji: PropTypes.string,
  setIdGaji: PropTypes.func,
  disabled: PropTypes.bool,
}

export default SelectUnitGajiRekapRemun
