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
import CIcon from '@coreui/icons-react'
import { cilSync, cilWarning, cilUser } from '@coreui/icons'

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
    <CModal visible={props.visible} onClose={() => props.setVisible(false)} alignment="center">
      <CModalHeader className="border-0 pb-0">
        <CModalTitle>
          <CIcon icon={cilSync} className="me-2" />
          Sinkronisasi Pegawai
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="pt-3">
        <div className="text-center mb-3">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--cui-info-bg-subtle)',
            }}
          >
            <CIcon icon={cilSync} size="xl" className="text-info" />
          </div>
        </div>

        <p className="text-center mb-2 fs-5 fw-semibold">Sync Data Pegawai?</p>

        <div className="rounded p-3 mb-3" style={{ backgroundColor: 'var(--cui-secondary-bg)' }}>
          <div className="d-flex align-items-start">
            <CIcon icon={cilUser} className="me-2 mt-1 text-info" />
            <div>
              <p className="mb-1 fw-semibold">{props.pegawai.nama}</p>
              <p className="mb-0 text-body-secondary small">NIP: {props.pegawai.id}</p>
            </div>
          </div>
        </div>

        <div className="rounded p-3 mb-3" style={{ backgroundColor: 'var(--cui-info-bg-subtle)' }}>
          <p className="text-info mb-0 small">
            <CIcon icon={cilSync} className="me-2" />
            <strong>Info:</strong> Data pegawai akan disinkronkan dengan database terbaru
          </p>
        </div>

        {error && (
          <CAlert className="mt-3 d-flex align-items-start" color="danger">
            <CIcon icon={cilWarning} className="me-2 mt-1" />
            <div>
              <strong>Error!</strong>
              <p className="mb-0 small mt-1">{error.message}</p>
            </div>
          </CAlert>
        )}
        {errorMessage && (
          <CAlert className="mt-3 d-flex align-items-start" color="danger">
            <CIcon icon={cilWarning} className="me-2 mt-1" />
            <div>
              <strong>Error!</strong>
              <p className="mb-0 small mt-1">{errorMessage}</p>
            </div>
          </CAlert>
        )}
      </CModalBody>
      <CModalFooter className="border-0">
        <CButton
          color="secondary"
          variant="ghost"
          onClick={() => props.setVisible(false)}
          disabled={loading}
        >
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="info" onClick={() => updatePegawai()}>
          <CIcon icon={cilSync} className="me-2" />
          Sinkronkan
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
