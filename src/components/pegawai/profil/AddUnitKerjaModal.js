import React, { useEffect, useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import SelectUnitKerja from '../SelectUnitKerja'
import {
  CAlert,
  CButton,
  CFormCheck,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'

const CREATE_UNIT_KERJA_PEGAWAI = gql`
  mutation CreateUnitKerjaPegawai(
    $pegawaiId: ID!
    $strukturOrganisasiId: ID!
    $isSecondary: Boolean!
  ) {
    createUnitKerjaPegawai(
      pegawaiId: $pegawaiId
      strukturOrganisasiId: $strukturOrganisasiId
      isSecondary: $isSecondary
    ) {
      code
      message
      success
    }
  }
`

const AddUnitKerjaModal = (props) => {
  const [strOrgId, setStrOrgId] = useState('')
  const [isSecondary, setIsSecondary] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_UNIT_KERJA_PEGAWAI)

  useEffect(() => {
    if (data) {
      if (!data?.createUnitKerjaPegawai.success) {
        setErrorMessage(data.createUnitKerjaPegawai.message)
      } else if (data?.createUnitKerjaPegawai.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  const submitJabatan = async () => {
    try {
      await simpan({
        variables: {
          pegawaiId: props.pegawaiId,
          strukturOrganisasiId: strOrgId,
          isSecondary: isSecondary,
        },
        refetchQueries: ['PegawaiProfil'],
        awaitRefetchQueries: true,
      })
    } catch (mutationErr) {
      setErrorMessage(mutationErr.message)
    }
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)} size={'lg'}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Jabatan Aktif</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <SelectUnitKerja setStrOrgId={(id) => setStrOrgId(id)} />
        <CFormCheck
          id="flexCheckChecked"
          label="Unit kerja utama"
          className="mt-2"
          checked={!isSecondary}
          onChange={(e) => setIsSecondary(!e.target.checked)}
        />
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
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Close
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={submitJabatan}>
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

AddUnitKerjaModal.propTypes = {
  pegawaiId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddUnitKerjaModal
