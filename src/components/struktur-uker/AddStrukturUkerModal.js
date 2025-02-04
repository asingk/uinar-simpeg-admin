import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CContainer,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react-pro'
import { gql, useMutation } from '@apollo/client'
import SelectUnitKerja from './SelectUnitKerja'
import SelectBagianUnitKerja from './SelectBagianUnitKerja'
import SelectSubbagUnitKerja from './SelectSubbagUnitKerja'
import SelectPosisi from './SelectPosisi'
import SelectGrade from 'src/components/SelectGrade'

const CREATE_STRUKTUR_UKER = gql`
  mutation CreateStrukturOrganisasi($input: CreateStrukturOrganisasiInput!) {
    createStrukturOrganisasi(input: $input) {
      code
      success
      message
    }
  }
`

const AddStrukturJabatanModal = (props) => {
  const [unitKerjaId, setUnitKerjaId] = useState('')
  const [bagianId, setBagianId] = useState('')
  const [subbagId, setSubbagId] = useState('')
  const [posisiId, setPosisiId] = useState('')
  const [grade, setGrade] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_STRUKTUR_UKER)

  let inputVariables = {
    posisiId: posisiId,
  }

  if (unitKerjaId) {
    inputVariables.unitKerjaId = unitKerjaId
  }

  if (bagianId) {
    inputVariables.bagianId = bagianId
  }

  if (subbagId) {
    inputVariables.subbagId = subbagId
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
        refetchQueries: ['DaftarStrukturOrganisasi'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.createStrukturOrganisasi.success) {
        setErrorMessage(data.createStrukturOrganisasi.message)
      } else if (data?.createStrukturOrganisasi.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  const onChangeUnitKerja = (e) => {
    setUnitKerjaId(e)
    setBagianId('')
    setSubbagId('')
    inputVariables.unitKerjaId = e
  }

  const onChangeBagian = (e) => {
    setBagianId(e)
    setSubbagId('')
  }

  const onChangeSubbag = (e) => {
    setSubbagId(e)
  }

  const onChangePosisi = (e) => {
    setPosisiId(e)
  }

  const onChangeGrade = (e) => {
    setGrade(e)
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)} size="lg">
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Struktur Unit Kerja</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CContainer>
          <CRow xs={{ gutterY: 2 }}>
            <SelectUnitKerja unitKerjaId={unitKerjaId} setUnitKerjaId={onChangeUnitKerja} />
            {unitKerjaId && (
              <SelectBagianUnitKerja bagianId={bagianId} setBagianId={onChangeBagian} />
            )}
            {bagianId && <SelectSubbagUnitKerja subbagId={subbagId} setSubbagId={onChangeSubbag} />}
            <SelectPosisi posisiId={posisiId} setPosisi={onChangePosisi} />
            <SelectGrade grade={grade} setGrade={onChangeGrade} />
          </CRow>
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
