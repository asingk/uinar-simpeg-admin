import React, { useEffect, useState } from 'react'
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import { CAlert, CFormSelect, CSpinner } from '@coreui/react-pro'

const GET_DAFTAR_JABATAN = gql`
  query DaftarJabatan {
    daftarJabatan {
      id
      nama
    }
  }
`

const GET_JABATAN = gql`
  query Jabatan($id: ID!) {
    jabatan(id: $id) {
      id
      nama
      level {
        id
        nama
      }
    }
  }
`

const SelectJabatan = (props) => {
  const [jabId, setJabId] = useState('')

  const [getJabatan, { data: jabData }] = useLazyQuery(GET_JABATAN)

  useEffect(() => {
    if (jabId) {
      getJabatan({ variables: { id: jabId } })
    }
  }, [getJabatan, jabId])

  const { loading, error, data: daftarJabData } = useQuery(GET_DAFTAR_JABATAN)

  if (loading) {
    return (
      <div className="text-center">
        <CSpinner />
      </div>
    )
  } else if (error) {
    return (
      <CAlert className="mt-3" color="danger">
        Error: {error.message}
      </CAlert>
    )
  }

  const jabsOptions = [{ label: '-- Pilih Jabatan --', value: '' }]

  daftarJabData?.daftarJabatan.forEach((row) => {
    const opt = {
      label: row.nama,
      value: row.id,
    }
    jabsOptions.push(opt)
  })

  let levelsOptions = [{ label: '-- Pilih Level --', value: '' }]

  jabData?.jabatan.level.forEach((row) => {
    const opt = {
      label: row.nama,
      value: row.id,
    }
    levelsOptions.push(opt)
  })

  const changeJabatanHandler = (e) => {
    setJabId(e.target.value)
    props.setLevelId('')
  }

  const changeLevelJabatanHandler = (e) => {
    props.setLevelId(e.target.value)
  }

  return (
    <>
      <CFormSelect
        aria-label="Default select jabatan"
        options={jabsOptions}
        value={jabId}
        onChange={changeJabatanHandler}
      />
      {levelsOptions.length > 1 && (
        <CFormSelect
          aria-label="Default select level"
          options={levelsOptions}
          value={props.levelId}
          onChange={changeLevelJabatanHandler}
        />
      )}
    </>
  )
}

SelectJabatan.propTypes = {
  levelId: PropTypes.string.isRequired,
  setLevelId: PropTypes.func,
}

export default SelectJabatan
