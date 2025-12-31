import React from 'react'
import PropTypes from 'prop-types'
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
import CIcon from '@coreui/icons-react'
import { cilTrash, cilWarning } from '@coreui/icons'

const DELETE_JABATAN_PEGAWAI = gql`
  mutation DeleteJabatanPegawai($pegawaiId: ID!, $strukturJabatanId: ID!) {
    deleteJabatanPegawai(pegawaiId: $pegawaiId, strukturJabatanId: $strukturJabatanId) {
      code
      message
      success
    }
  }
`

const HapusJabatanModal = (props) => {
  const [hapus, { loading, error }] = useMutation(DELETE_JABATAN_PEGAWAI)

  const hapusAction = async () => {
    try {
      await hapus({
        variables: {
          pegawaiId: props.pegawaiId,
          strukturJabatanId: props.idJab,
        },
        refetchQueries: ['PegawaiProfil'],
        awaitRefetchQueries: true,
      })
      props.closeModal()
    } catch (mutationErr) {
      console.log(mutationErr.message)
    }
  }

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
      <p className="text-center mb-2 fs-5 fw-semibold">Hapus Jabatan?</p>
      <p className="text-center text-body-secondary mb-3">
        Anda yakin ingin menghapus jabatan ini dari pegawai?
      </p>
      <div className="rounded p-3 mb-3" style={{ backgroundColor: 'var(--cui-secondary-bg)' }}>
        <p className="text-danger mb-0 small">
          <CIcon icon={cilWarning} className="me-2" />
          <strong>Perhatian:</strong> Data yang sudah dihapus tidak dapat dikembalikan.
        </p>
      </div>
    </div>
  )

  if (loading) {
    modalBody = (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <CSpinner color="primary" className="mb-3" />
        <p className="text-body-secondary">Menghapus jabatan...</p>
      </div>
    )
  } else if (error) {
    modalBody = (
      <CAlert color="danger" className="d-flex align-items-center">
        <CIcon icon={cilWarning} className="me-2" />
        <div>
          <strong>Ops, terjadi kesalahan!</strong>
          <p className="mb-0 small mt-1">{error.message}</p>
        </div>
      </CAlert>
    )
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)} alignment="center">
      <CModalHeader className="border-0 pb-0">
        <CModalTitle>
          <CIcon icon={cilTrash} className="me-2" />
          Konfirmasi Hapus
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
        <CLoadingButton color="danger" onClick={() => hapusAction()} loading={loading}>
          <CIcon icon={cilTrash} className="me-2" />
          Ya, Hapus
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

HapusJabatanModal.propTypes = {
  closeModal: PropTypes.func,
  pegawaiId: PropTypes.string.isRequired,
  idJab: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default HapusJabatanModal
