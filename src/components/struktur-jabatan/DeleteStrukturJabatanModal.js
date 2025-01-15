import React, { useEffect, useState } from 'react'
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
import { gql, useMutation } from '@apollo/client'

const DELETE_STRUKTUR_JABATAN = gql`
  mutation DeleteStrukturJabatan($id: ID!) {
    deleteStrukturJabatan(id: $id) {
      code
      success
      message
    }
  }
`

const DeleteStrukturJabatanModal = (props) => {
  console.log('rendering... DeleteStrukturJabatanModal')

  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(DELETE_STRUKTUR_JABATAN)

  const hapusAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
        },
        refetchQueries: ['DaftarStrukturJabatan'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      setErrorMessage(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.deleteStrukturJabatan.success) {
        setErrorMessage(data.deleteStrukturJabatan.message)
      } else if (data?.deleteStrukturJabatan.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Hapus Struktur Jabatan</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <>
          <p>Anda yakin ingin menghapus struktur jabatan ini?</p>
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
        <CButton color="danger" onClick={() => props.setVisible(false)}>
          Tidak
        </CButton>
        <CLoadingButton
          loading={loading}
          color="danger"
          variant="outline"
          onClick={() => hapusAction()}
        >
          Ya
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

DeleteStrukturJabatanModal.propTypes = {
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default DeleteStrukturJabatanModal
