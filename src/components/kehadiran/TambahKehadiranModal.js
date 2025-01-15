import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
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
import { KeycloakContext } from 'src/context'

const TambahKehadiranModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const tambahAction = async () => {
    setError(false)
    setLoading(true)
    const resp = await fetch(
      import.meta.env.VITE_KEHADIRAN_API_URL +
        '/kehadiran/tambah?idPegawai=' +
        props.idPegawai +
        '&tanggal=' +
        props.tanggal +
        '&status=' +
        props.status +
        '&addedBy=' +
        loginId,
      {
        method: 'POST',
        headers: {
          apikey: import.meta.env.VITE_API_KEY,
        },
      },
    )
    if (resp.ok) {
      setLoading(false)
      props.added()
    } else {
      setLoading(false)
      setError(true)
    }
  }

  let modalBody = (
    <p>
      Anda yakin ingin menambah {props.status} pada {dayjs(props.tanggal).format('DD/MM/YYYY')}?
    </p>
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
    modalBody = <CAlert color="danger">Gagal menambah kehadiran! Coba lagi?</CAlert>
  }

  return (
    <CModal
      visible={props.visible}
      onClose={() => props.setVisible(false)}
      aria-labelledby="Modal Hapus kehadiran"
    >
      <CModalHeader>
        <CModalTitle>Tambah Kehadiran</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="info" onClick={props.close}>
          Tidak
        </CButton>
        <CButton variant="outline" color="info" onClick={tambahAction}>
          Ya
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

TambahKehadiranModal.propTypes = {
  idPegawai: PropTypes.string.isRequired,
  tanggal: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  added: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
  close: PropTypes.func,
}

export default TambahKehadiranModal
