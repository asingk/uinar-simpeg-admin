import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
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
import { KeycloakContext } from 'src/context'

const HapusRiwayatProfilModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const keycloak = useContext(KeycloakContext)

  async function hapusAction() {
    try {
      setLoading(true)
      await axios.delete(`${import.meta.env.VITE_SIMPEG_REST_URL}/riwayat-profil/${props.id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      props.deleted()
    } catch (error) {
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        // setLoading(false)
        // setErrorResp(true)
      } else if (error.request) {
        // The client never received a response, and the request was never left
        // setLoading(false)
        setError(true)
      } else {
        // Anything else
        // setLoading(false)
        setError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  let modalBody = <p>Anda yakin ingin menghapus Riwayat Profil ini?</p>

  if (error) {
    modalBody = <CAlert color="danger">Ooooppppssss.... Terjadi kesalahan!</CAlert>
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Hapus Riwayat Profil</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="danger" onClick={hapusAction}>
          Hapus
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

HapusRiwayatProfilModal.propTypes = {
  id: PropTypes.string.isRequired,
  deleted: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default HapusRiwayatProfilModal
