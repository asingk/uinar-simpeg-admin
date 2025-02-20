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
import axios from 'axios'

const TambahKehadiranModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const tambahAction = async () => {
    setError(false)
    setLoading(true)
    await axios
      .post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/kehadiran/tambah`,
        {
          idPegawai: props.idPegawai,
          tanggal: props.tanggal,
          status: props.status,
          createdBy: loginId,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then(function () {
        props.added()
      })
      .catch(function () {
        setError(true)
      })
      .finally(function () {
        setLoading(false)
      })
  }

  let modalBody = (
    <p>
      Anda yakin ingin menambah {props.status} pada {dayjs(props.tanggal).format('D/M/YYYY')}?
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
