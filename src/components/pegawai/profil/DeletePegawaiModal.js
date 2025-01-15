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
} from '@coreui/react-pro'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

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

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Hapus Pegawai</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <>
          <p>Anda yakin ingin menghapus pegawai ini?</p>
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

export default DeletePegawaiModal

DeletePegawaiModal.propTypes = {
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}
