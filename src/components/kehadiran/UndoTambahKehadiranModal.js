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
import axios from 'axios'
import { KeycloakContext } from 'src/context'

const UndoTambahKehadiranModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const keycloak = useContext(KeycloakContext)

  const cekResp = async () => {
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${props.idPegawai}/kehadiran/search?status=${props.status}&tanggal=${props.tanggal}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      return resp.data
    } catch (error) {
      console.error(error)
    }
  }

  const deleteKehadiran = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SIMPEG_REST_URL}/kehadiran/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      props.undoAdd()
    } catch (error) {
      setError(true)
    }
  }

  const undoTambahAction = async () => {
    setError(false)
    setLoading(true)
    const data = await cekResp()
    await deleteKehadiran(data.id)
    setLoading(false)
  }

  let modalBody = (
    <p>
      Anda yakin ingin membatalkan kehadiran {props.status} pada{' '}
      {dayjs(props.tanggal).format('D/M/YYYY')} yang sudah ditambahkan?
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
    modalBody = (
      <CAlert show className="w-100" color="danger">
        Gagal membatalkan kehadiran! Coba lagi?
      </CAlert>
    )
  }

  return (
    <CModal
      visible={props.visible}
      onClose={() => props.setVisible(false)}
      aria-labelledby="Modal Hapus kehadiran"
    >
      <CModalHeader>
        <CModalTitle>Batalkan Kehadiran</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="warning" onClick={props.close}>
          Tidak
        </CButton>
        <CButton variant="outline" color="warning" onClick={undoTambahAction}>
          Ya
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

UndoTambahKehadiranModal.propTypes = {
  idPegawai: PropTypes.string.isRequired,
  tanggal: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  undoAdd: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
  close: PropTypes.func,
}

export default UndoTambahKehadiranModal
