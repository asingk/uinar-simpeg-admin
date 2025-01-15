import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CForm,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react-pro'
import axios from 'axios'
import { KeycloakContext } from 'src/context'

const RejectIzinModal = (props) => {
  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [ket, setKet] = useState('')
  const [validated, setValidated] = useState(false)

  const onAction = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    if (!ket) return
    setLoading(true)
    axios
      .post(
        import.meta.env.VITE_KEHADIRAN_API_URL +
          '/pegawai/' +
          props.nip +
          '/usul-izin/' +
          props.id +
          '/tolak',
        {
          updatedBy: loginId,
          ket: ket,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            apikey: import.meta.env.VITE_API_KEY,
          },
        },
      )
      .then(function () {
        // console.log(response)
        props.done()
      })
      .catch(function (error) {
        // console.log(error)
        setError(error)
      })
      .finally(function () {
        setLoading(false)
      })
  }

  let modalBody = (
    <CForm noValidate validated={validated}>
      <CFormTextarea
        id="exampleFormControlTextarea1"
        label="Alasan ditolak"
        rows={3}
        text="Must be 8-20 words long."
        feedbackInvalid="Alasan harus diisi."
        onChange={(e) => setKet(e.target.value)}
        required
      ></CFormTextarea>
    </CForm>
  )

  if (loading) {
    modalBody = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    modalBody = <CAlert color="danger">Gagal! Coba lagi?</CAlert>
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tolak Izin Pegawai</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={() => props.setVisible(false)}>
          Tidak
        </CButton>
        <CButton color="danger" variant="outline" type="submit" onClick={onAction}>
          Ya
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

RejectIzinModal.propTypes = {
  nip: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  done: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
}

export default RejectIzinModal
