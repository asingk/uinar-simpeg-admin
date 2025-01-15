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

const DELETE_UNIT_KERJA_PEGAWAI = gql`
  mutation DeleteUnitKerjaPegawai($pegawaiId: ID!, $strukturOrganisasiId: ID!) {
    deleteUnitKerjaPegawai(pegawaiId: $pegawaiId, strukturOrganisasiId: $strukturOrganisasiId) {
      code
      message
      success
    }
  }
`

const HapusUnitKerjaModal = (props) => {
  const [hapus, { loading, error }] = useMutation(DELETE_UNIT_KERJA_PEGAWAI)

  const hapusAction = async () => {
    try {
      await hapus({
        variables: {
          pegawaiId: props.pegawaiId,
          strukturOrganisasiId: props.unitKerjaId,
        },
        refetchQueries: ['PegawaiProfil'],
        awaitRefetchQueries: true,
      })
      // setLoading(false)
      props.closeModal()
    } catch (mutationErr) {
      console.log(mutationErr.message)
    }
  }

  let modalBody = <p>Anda yakin ingin menghapus unit kerja ini?</p>

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
        <CModalTitle>Hapus Unit Kerja</CModalTitle>
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

HapusUnitKerjaModal.propTypes = {
  closeModal: PropTypes.func,
  pegawaiId: PropTypes.string.isRequired,
  unitKerjaId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default HapusUnitKerjaModal
