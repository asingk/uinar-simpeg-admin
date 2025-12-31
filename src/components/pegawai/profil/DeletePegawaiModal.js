import React, { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import {
  CAlert,
  CButton,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react-pro'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilWarning } from '@coreui/icons'

const DELETE_PEGAWAI = gql`
  mutation DeletePegawai($id: ID!) {
    deletePegawai(id: $id) {
      code
      success
      message
    }
  }
`

const DeletePegawaiModal = (props) => {
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  const [simpan, { data, loading, error }] = useMutation(DELETE_PEGAWAI)

  const hapusAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
        },
        refetchQueries: ['DaftarPegawai'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.deletePegawai.success) {
        setErrorMessage(data.deletePegawai.message)
      } else if (data?.deletePegawai.success) {
        props.setVisible(false)
        navigate('/pegawai/nonasn')
      }
    }
  }, [data, navigate, props])

  let modalBody = (
    <div>
      <div className="text-center mb-3">
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'var(--cui-danger-bg-subtle)',
          }}
        >
          <CIcon icon={cilWarning} size="xl" className="text-danger" />
        </div>
      </div>
      <p className="text-center mb-2 fs-5 fw-semibold">Hapus Pegawai?</p>
      <p className="text-center text-body-secondary mb-3">
        Anda yakin ingin menghapus pegawai ini secara permanen?
      </p>
      <div className="rounded p-3 mb-3" style={{ backgroundColor: 'var(--cui-secondary-bg)' }}>
        <p className="text-danger mb-0 small">
          <CIcon icon={cilWarning} className="me-2" />
          <strong>Perhatian:</strong> Tindakan ini tidak dapat dibatalkan. Semua data pegawai akan
          terhapus.
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
    </div>
  )

  if (loading) {
    modalBody = (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <CSpinner color="danger" className="mb-3" />
        <p className="text-body-secondary">Menghapus pegawai...</p>
      </div>
    )
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)} alignment="center">
      <CModalHeader className="border-0 pb-0">
        <CModalTitle>
          <CIcon icon={cilTrash} className="me-2" />
          Konfirmasi Hapus Pegawai
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="pt-2">{modalBody}</CModalBody>
      <CModalFooter className="border-0">
        <CButton
          color="secondary"
          variant="ghost"
          onClick={() => props.setVisible(false)}
          disabled={loading}
        >
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="danger" onClick={() => hapusAction()}>
          <CIcon icon={cilTrash} className="me-2" />
          Ya, Hapus
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

export default DeletePegawaiModal

DeletePegawaiModal.propTypes = {
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}
