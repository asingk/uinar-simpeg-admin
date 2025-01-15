import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CContainer,
  CFormSelect,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react-pro'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import SelectJabatan from './SelectJabatan'
import SelectGrade from '../SelectGrade'

const CREATE_STRUKTUR_JABATAN = gql`
  mutation CreateStrukturJabatan($input: CreateStrukturJabatanInput!) {
    createStrukturJabatan(input: $input) {
      code
      success
      message
    }
  }
`

const GET_DAFTAR_SUBLEVEL = gql`
  query DaftarSublevelJabatan {
    daftarSublevelJabatan {
      id
      nama
    }
  }
`

const AddStrukturJabatanModal = (props) => {
  console.log('rendering... AddStrukturJabatanModal')

  const [levelId, setLevelId] = useState(0)
  const [sublevelId, setSublevelId] = useState(0)
  const [grade, setGrade] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_STRUKTUR_JABATAN)
  const [getSublevel, { data: subData, loading: subLoading, error: subError }] =
    useLazyQuery(GET_DAFTAR_SUBLEVEL)

  let inputVariables = {
    levelId: levelId,
  }

  if (sublevelId > 0) {
    inputVariables.sublevelId = sublevelId
  }

  if (grade) {
    inputVariables.grade = grade
  }

  const addAction = async () => {
    try {
      await simpan({
        variables: {
          input: inputVariables,
        },
        refetchQueries: ['DaftarStrukturJabatan'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.createStrukturJabatan.success) {
        setErrorMessage(data.createStrukturJabatan.message)
      } else if (data?.createStrukturJabatan.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  useEffect(() => {
    if (levelId > 0) {
      getSublevel()
    }
  }, [getSublevel, levelId])

  let sublevelOption = [{ label: '-- Pilih Sublevel Jabatan --', value: '0' }]

  // if (subData) {
  //   const sublevelDefault = {
  //     id: 0,
  //     nama: '-- Pilih Sublevel Jabatan --',
  //   }
  //   const sublevelJab = [...subData.daftarSublevelJabatan]
  //   if (sublevelJab && sublevelJab.length > 0) {
  //     sublevelJab.unshift(sublevelDefault)
  //   }
  //   sublevelOption = sublevelJab.map((item, index) => (
  //     <option key={index} value={item.id}>
  //       {item.nama}
  //     </option>
  //   ))
  // }

  subData?.daftarSublevelJabatan.forEach((row) => {
    const opt = {
      label: row.nama,
      value: row.id,
    }
    sublevelOption.push(opt)
  })

  const onChangeSublevel = (e) => {
    setSublevelId(parseInt(e.target.value))
  }

  const onChangeGrade = (e) => {
    setGrade(e)
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Sublevel Jabatan</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CContainer className="overflow-hidden">
          <CRow xs={{ gutterY: 2 }}>
            <SelectJabatan levelId={levelId} setLevelId={(id) => setLevelId(id)} />
            {subLoading && (
              <div className="d-flex justify-content-center">
                <CSpinner />
              </div>
            )}
            {sublevelOption.length > 1 && (
              <CFormSelect
                aria-label="Default select jabatan"
                options={sublevelOption}
                value={sublevelId}
                onChange={onChangeSublevel}
              />
            )}
            {sublevelId > 0 && <SelectGrade grade={grade} setGrade={onChangeGrade} />}
            {error && (
              <CAlert className="mt-3" color="danger">
                Error: {error.message}
              </CAlert>
            )}
            {errorMessage && (
              <CAlert className="mt-3" color="danger">
                Error: {errorMessage}
              </CAlert>
            )}
            {subError && (
              <CAlert className="mt-3" color="danger">
                Error: {subError.message}
              </CAlert>
            )}
          </CRow>
        </CContainer>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={addAction}>
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

AddStrukturJabatanModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddStrukturJabatanModal
