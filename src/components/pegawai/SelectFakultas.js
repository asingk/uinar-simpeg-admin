import React, { useEffect } from 'react'
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import PropTypes from 'prop-types'

const GET_DAFTAR_FAKULTAS = gql`
  query DaftarFakultas {
    daftarFakultas {
      id
      nama
    }
  }
`

const GET_FAKULTAS = gql`
  query Fakultas($id: ID!) {
    fakultas(id: $id) {
      id
      nama
      prodi {
        id
        nama
      }
    }
  }
`

const SelectFakultas = (props) => {
  const [getFakultas, { data: fakDetData }] = useLazyQuery(GET_FAKULTAS)
  useEffect(() => {
    if (props.fakultasId) {
      getFakultas({
        variables: { id: props.fakultasId },
      })
    }
  }, [props.fakultasId, getFakultas])

  const { loading, error, data } = useQuery(GET_DAFTAR_FAKULTAS)

  if (loading) {
    return (
      <div>
        <p className="text-center">Loading..</p>
      </div>
    )
  } else if (error) {
    return (
      <div>
        <p className="text-center">Error.. :-(</p>
      </div>
    )
  }

  const onChangeFakultas = (e) => {
    props.changeFakultas(e.target.value)
    props.changeProdiId(0)
  }

  const onChangeProdi = (e) => {
    props.changeProdiId(parseInt(e.target.value))
  }

  const faksDefault = {
    id: '',
    nama: '-- Pilih Fakultas --',
  }
  let faks = [...data.daftarFakultas]
  if (faks[0].id) {
    faks.unshift(faksDefault)
  }
  const fakOptions = faks.map((item, index) => (
    <option key={index} value={item.id}>
      {item.nama}
    </option>
  ))

  let prodiOptions
  if (fakDetData && fakDetData.fakultas) {
    const prodisDefault = {
      id: '',
      nama: '-- Pilih Prodi --',
    }
    let prodis = [...fakDetData.fakultas.prodi]
    if (prodis && prodis.length > 0) {
      if (prodis[0].id) {
        prodis.unshift(prodisDefault)
      }
      prodiOptions = prodis.map((item, index) => (
        <option key={index} value={item.id}>
          {item.nama}
        </option>
      ))
    }
  }

  return (
    <>
      <div className="mb-3">
        <select
          className="form-select"
          defaultValue={props.fakultasId}
          onChange={(e) => onChangeFakultas(e)}
        >
          {fakOptions}
        </select>
      </div>
      {prodiOptions && prodiOptions.length > 0 ? (
        <div className="mb-3">
          <select
            className="form-select"
            defaultValue={props.prodiId}
            onChange={(e) => onChangeProdi(e)}
          >
            {prodiOptions}
          </select>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

SelectFakultas.propTypes = {
  fakultasId: PropTypes.string,
  changeFakultas: PropTypes.func,
  changeProdiId: PropTypes.func,
  prodiId: PropTypes.number,
}

export default SelectFakultas
