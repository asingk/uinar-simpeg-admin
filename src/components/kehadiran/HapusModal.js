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

const HapusKehadiranModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const hapusAction = async () => {
    setError(false)
    setLoading(true)
    await axios
      .post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/kehadiran/safe-delete`,
        {
          idPegawai: props.idPegawai,
          tanggal: props.tanggal,
          updatedBy: loginId,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      .then(function () {
        props.deleted()
      })
      .catch(function () {
        setError(true)
      })
      .finally(function () {
        setLoading(false)
      })
  }

  let modalBody = (
    <p>Anda yakin ingin menghapus kehadiran pada {dayjs(props.tanggal).format('D/M/YYYY')}?</p>
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
    modalBody = <CAlert color="danger">Gagal menghapus kehadiran! Coba lagi?</CAlert>
  }

  return (
    <CModal
      visible={props.visible}
      onClose={() => props.setVisible(false)}
      aria-labelledby="Modal Hapus kehadiran"
    >
      <CModalHeader>
        <CModalTitle>Hapus Kehadiran</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={props.close}>
          Tidak
        </CButton>
        <CButton variant="outline" color="danger" onClick={hapusAction}>
          Ya
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

HapusKehadiranModal.propTypes = {
  idPegawai: PropTypes.string.isRequired,
  tanggal: PropTypes.string.isRequired,
  deleted: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
  close: PropTypes.func,
}

export default HapusKehadiranModal
