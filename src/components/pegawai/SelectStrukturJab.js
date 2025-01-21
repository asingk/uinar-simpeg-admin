import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { CAlert, CContainer, CFormSelect, CRow, CSpinner } from '@coreui/react-pro'

const GET_DAFTAR_STRUKTUR_JABATAN = gql`
  query DaftarStrukturJabatan($levelId: ID, $subLevelId: ID) {
    daftarStrukturJabatan(levelId: $levelId, sublevelId: $subLevelId) {
      id
      level {
        id
        nama
        jabatan {
          nama
        }
      }
      sublevel {
        id
        nama
      }
    }
  }
`

const SelectStrukturJab = (props) => {
  const [levelId, setLevelId] = useState('')
  const [sublevelId, setSublevelId] = useState('')

  const {
    data: levelData,
    loading: levelLoading,
    error: levelError,
  } = useQuery(GET_DAFTAR_STRUKTUR_JABATAN)
  const [get, { data: sublevelData, loading: sublevelLoading, error: sublevelError }] =
    useLazyQuery(GET_DAFTAR_STRUKTUR_JABATAN)

  let sublevelOptions = [{ label: '-- Pilih Sublevel --', value: '0' }]

  useEffect(() => {
    if (levelId > 0 && sublevelId === 0) {
      get({ variables: { levelId: levelId } })
      if (sublevelData?.daftarStrukturJabatan.length === 1 && sublevelOptions.length === 1) {
        props.setJabPegId(sublevelData.daftarStrukturJabatan[0].id)
      } else {
        props.setJabPegId('')
      }
    }
  }, [get, levelId, props, sublevelData?.daftarStrukturJabatan, sublevelId, sublevelOptions.length])

  if (levelLoading) {
    return (
      <div className="text-center">
        <CSpinner />
      </div>
    )
  } else if (levelError) {
    return (
      <CAlert className="mt-3" color="danger">
        Error: {levelError.message}
      </CAlert>
    )
  }

  let levelOptions = [{ label: '-- Pilih Level --', value: '0' }]
  levelData?.daftarStrukturJabatan.forEach((row) => {
    const opt = {
      label: row.level.jabatan.nama + ' - ' + row.level.nama,
      value: row.level.id,
    }
    levelOptions.push(opt)
  })

  const levelOptionsUnique = levelOptions
    .filter((obj, index) => {
      return index === levelOptions.findIndex((o) => obj.value === o.value)
    })
    .sort((a, b) => {
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }

      // names must be equal
      return 0
    })

  sublevelData?.daftarStrukturJabatan.forEach((row) => {
    if (row.sublevel) {
      const opt = {
        label: row.sublevel.nama,
        value: row.sublevel.id,
      }
      sublevelOptions.push(opt)
    }
  })

  sublevelOptions.sort((a, b) => {
    if (a.label < b.label) {
      return -1
    }
    if (a.label > b.label) {
      return 1
    }

    // names must be equal
    return 0
  })

  const onChangeLevel = (e) => {
    setLevelId(e.target.value)
    setSublevelId('')
  }

  const onChangeSublevel = (e) => {
    setSublevelId(e.target.value)
    const jabpeg = sublevelData.daftarStrukturJabatan.find(
      (element) => element.sublevel?.id === e.target.value,
    )
    props.setJabPegId(jabpeg?.id)
  }

  return (
    <CContainer className="overflow-hidden">
      <CRow xs={{ gutterY: 3 }}>
        <CFormSelect
          aria-label="Default select level"
          options={levelOptionsUnique}
          value={levelId}
          onChange={onChangeLevel}
        />
        {sublevelLoading && (
          <div className="text-center">
            <CSpinner />
          </div>
        )}
        {levelId > 0 && sublevelOptions.length > 1 && (
          <CFormSelect
            aria-label="Default select sublevel"
            options={sublevelOptions}
            value={sublevelId}
            onChange={onChangeSublevel}
          />
        )}
        {sublevelError && (
          <CAlert className="mt-3" color="danger">
            Error: {sublevelError.message}
          </CAlert>
        )}
      </CRow>
    </CContainer>
  )
}

SelectStrukturJab.propTypes = {
  setJabPegId: PropTypes.func,
}

export default SelectStrukturJab
