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
import CIcon from '@coreui/icons-react'
import { cilUserFollow, cilWarning, cilCheckCircle } from '@coreui/icons'

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

  const getStatusLabel = () => {
    return props.statusPegawaiId === 1 ? 'PNS' : 'CPNS'
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)} alignment="center">
      <CModalHeader className="border-0 pb-0">
        <CModalTitle>
          <CIcon icon={cilUserFollow} className="me-2" />
          Ubah Status Pegawai
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="pt-3">
        <div className="text-center mb-3">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--cui-warning-bg-subtle)',
            }}
          >
            <CIcon icon={cilUserFollow} size="xl" className="text-warning" />
          </div>
        </div>

        <p className="text-center mb-2 fs-5 fw-semibold">Ubah Status menjadi {getStatusLabel()}?</p>
        <p className="text-center text-body-secondary mb-3">
          Apakah Anda yakin ingin mengubah status pegawai ini?
        </p>

        <div
          className="rounded p-3 mb-3"
          style={{ backgroundColor: 'var(--cui-warning-bg-subtle)' }}
        >
          <p className="text-warning mb-0 small">
            <CIcon icon={cilCheckCircle} className="me-2" />
            <strong>Info:</strong> Status pegawai akan diubah menjadi{' '}
            <strong>{getStatusLabel()}</strong>
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
          disabled={loading}
          color="secondary"
          variant="ghost"
          onClick={() => props.setVisible(false)}
        >
          Tidak
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={() => updatePegawai()}>
          <CIcon icon={cilCheckCircle} className="me-2" />
          Ya, Ubah
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
