import React, { useEffect, useState } from 'react'
import { useMutation, gql } from '@apollo/client'
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
import { useNavigate } from 'react-router-dom'

const UPDATE_PEGAWAI_STATUS_PEGAWAI = gql`
  mutation UpdatePegawaiStatusPegawai($id: ID!, $statusPegawaiId: Int!) {
    updatePegawaiStatusPegawai(id: $id, statusPegawaiId: $statusPegawaiId) {
      code
      success
      message
    }
  }
`

const UpdatePegawaiStatusPegawaiModal = (props) => {
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  const [update, { data, loading, error }] = useMutation(UPDATE_PEGAWAI_STATUS_PEGAWAI)

  const updatePegawai = async () => {
    try {
      await update({
        variables: { id: props.pegawaiId, statusPegawaiId: props.statusPegawaiId },
        refetchQueries: ['DaftarPegawai'],
        awaitRefetchQueries: true,
      })
    } catch (mutationErr) {
      setErrorMessage(mutationErr.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.updatePegawaiStatusPegawai.success) {
        setErrorMessage(data.updatePegawaiStatusPegawai.message)
      } else if (data?.updatePegawaiStatusPegawai.success) {
        props.setVisible(false)
        if (props.statusPegawaiId === 2) {
          navigate('/pegawai/asn')
        } else if (props.statusPegawaiId === 1) {
          navigate('/pegawai/cpns')
        }
      }
    }
  }, [data, navigate, props])

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Ubah Status Pegawai</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <>
          <p>Apakah Anda Yakin?</p>
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
        <CButton disabled={loading} color="secondary" onClick={() => props.setVisible(false)}>
          Tidak
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={() => updatePegawai()}>
          Ya
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

UpdatePegawaiStatusPegawaiModal.propTypes = {
  pegawaiId: PropTypes.string.isRequired,
  statusPegawaiId: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default UpdatePegawaiStatusPegawaiModal
