import React from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'
import {
  CAlert,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react-pro'

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

  let modalBody = <p>Anda yakin ingin menghapus jabatan ini?</p>

  if (loading) {
    modalBody = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    modalBody = (
      <CAlert show className="w-100" color="danger">
        Ops, terjadi kesalahan!
      </CAlert>
    )
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Hapus Jabatan</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={() => props.setVisible(false)}>
          Tidak
        </CButton>
        <CButton color="danger" variant="outline" onClick={() => hapusAction()}>
          Ya
        </CButton>
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
