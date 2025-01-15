import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
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

const DeletePengumumanModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function hapusAction() {
    try {
      setLoading(true)
      await axios.delete(import.meta.env.VITE_SSO_API_URL + '/apps/simpeg/welcome/' + props.id, {
        headers: {
          apikey: import.meta.env.VITE_API_KEY,
        },
      })
      props.done()
    } catch (error) {
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        setLoading(false)
        // setErrorResp(true)
      } else if (error.request) {
        // The client never received a response, and the request was never left
        setLoading(false)
        setError(true)
      } else {
        // Anything else
        setLoading(false)
        setError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  let modalBody = <p>Anda yakin?</p>

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
        Gagal! Coba lagi?
      </CAlert>
    )
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Hapus Pengumuman</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CButton color="danger" variant="outline" onClick={hapusAction}>
          Hapus
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

DeletePengumumanModal.propTypes = {
  id: PropTypes.string.isRequired,
  done: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default DeletePengumumanModal
