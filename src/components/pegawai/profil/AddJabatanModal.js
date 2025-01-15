import React, { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import SelectStrukturJab from '../SelectStrukturJab'

const CREATE_JABATAN_PEGAWAI = gql`
  mutation CreateJabatanPegawai($pegawaiId: ID!, $strukturJabatanId: ID!) {
    createJabatanPegawai(pegawaiId: $pegawaiId, strukturJabatanId: $strukturJabatanId) {
      code
      message
      success
    }
  }
`

const AddJabatanModal = (props) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [jabPegId, setJabPegId] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_JABATAN_PEGAWAI)

  useEffect(() => {
    if (data) {
      if (!data?.createJabatanPegawai.success) {
        setErrorMessage(data.createJabatanPegawai.message)
      } else if (data?.createJabatanPegawai.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  const submitJabatan = () => {
    try {
      simpan({
        variables: {
          pegawaiId: props.pegawaiId,
          strukturJabatanId: jabPegId,
        },
        refetchQueries: ['PegawaiProfil'],
        awaitRefetchQueries: true,
      })
    } catch (mutationErr) {
      console.log(mutationErr.message)
    }
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Jabatan</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <>
          <SelectStrukturJab setJabPegId={(id) => setJabPegId(id)} />
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
        </>
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

AddJabatanModal.propTypes = {
  pegawaiId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddJabatanModal
