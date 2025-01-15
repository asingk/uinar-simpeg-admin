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

const SYNC_ASN = gql`
  mutation SyncAsn($id: ID!) {
    syncAsn(id: $id) {
      code
      success
      message
    }
  }
`

const SyncModal = (props) => {
  const [errorMessage, setErrorMessage] = useState('')

  const [update, { data, loading, error }] = useMutation(SYNC_ASN)

  const updatePegawai = async () => {
    try {
      await update({
        variables: { id: props.pegawai.id },
        refetchQueries: ['PegawaiProfil'],
        awaitRefetchQueries: true,
      })
    } catch (mutationErr) {
      setErrorMessage(mutationErr.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.syncAsn.success) {
        setErrorMessage(data.syncAsn.message)
      } else if (data?.syncAsn.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Update Pegawai</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <>
          Apakah Anda ingin sinkronisasi Pegawai: {props.pegawai.nama} ?
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
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={() => updatePegawai()}>
          Update
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

SyncModal.propTypes = {
  pegawai: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default SyncModal
