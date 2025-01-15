import React, { useState } from 'react'
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

const UndoHapusKehadiranModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const undoHapusAction = async () => {
    setError(false)
    setLoading(true)
    const resp = await fetch(
      import.meta.env.VITE_KEHADIRAN_API_URL +
        '/kehadiran/undelete?idPegawai=' +
        props.idPegawai +
        '&tanggal=' +
        props.tanggal,
      {
        method: 'POST',
        headers: {
          apikey: import.meta.env.VITE_API_KEY,
        },
      },
    )
    if (resp.ok) {
      setLoading(false)
      props.undoDelete()
    } else {
      setLoading(false)
      setError(true)
    }
  }

  let modalBody = (
    <p>
      Anda yakin ingin mengembalikan kehadiran pada {dayjs(props.tanggal).format('DD/MM/YYYY')} yang
      sudah dihapus?
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
      <CAlert show className="w-100" color="warning">
        Gagal mengembalikan kehadiran! Coba lagi?
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
        <CModalTitle>Hapus Kehadiran</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="warning" onClick={props.close}>
          Tidak
        </CButton>
        <CButton variant="outline" color="warning" onClick={undoHapusAction}>
          Ya
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

UndoHapusKehadiranModal.propTypes = {
  idPegawai: PropTypes.string.isRequired,
  tanggal: PropTypes.string.isRequired,
  undoDelete: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
  close: PropTypes.func,
}

export default UndoHapusKehadiranModal
