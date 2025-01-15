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

const UndoTambahKehadiranModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const undoTambahAction = async () => {
    setError(false)
    setLoading(true)
    const cekResp = await fetch(
      import.meta.env.VITE_KEHADIRAN_API_URL +
        '/kehadiran/search?idPegawai=' +
        props.idPegawai +
        '&status=' +
        props.status +
        '&tanggal=' +
        props.tanggal,
    )
    if (cekResp.ok) {
      const json = await cekResp.json()
      const resp = await fetch(import.meta.env.VITE_KEHADIRAN_API_URL + '/kehadiran/' + json.id, {
        method: 'DELETE',
        headers: {
          apikey: import.meta.env.VITE_API_KEY,
        },
      })
      if (resp.ok) {
        setLoading(false)
        props.undoAdd()
      } else {
        setLoading(false)
        setError(true)
      }
    }
  }

  let modalBody = (
    <p>
      Anda yakin ingin membatalkan kehadiran {props.status} pada{' '}
      {dayjs(props.tanggal).format('DD/MM/YYYY')} yang sudah ditambahkan?
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
