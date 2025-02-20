import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
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
import axios from 'axios'
import { KeycloakContext } from 'src/context'

const ApproveIzinModal = (props) => {
  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const onAction = () => {
    setLoading(true)
    axios
      .put(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/usul-izin/${props.id}`,
        {
          updatedBy: loginId,
          status: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
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
    modalBody = <CAlert color="danger">Gagal! Coba lagi?</CAlert>
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Setujui Izin Pegawai</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="success" onClick={() => props.setVisible(false)}>
          Tidak
        </CButton>
        <CButton color="success" variant="outline" onClick={onAction}>
          Ya
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ApproveIzinModal.propTypes = {
  nip: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  done: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
}

export default ApproveIzinModal
