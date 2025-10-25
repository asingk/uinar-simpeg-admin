import React from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'

const HapusPotonganGajiModal = ({ visible, onClose, onConfirm, data, loading }) => {
  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilTrash} className="me-2" />
          Konfirmasi Hapus
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p className="mb-2">Apakah Anda yakin ingin menghapus data rekap potongan gaji berikut?</p>
        {data && (
          <div className="border rounded p-3 mb-3">
            <table className="mb-0">
              <tbody>
                <tr>
                  <td className="pe-3">
                    <strong>Bulan</strong>
                  </td>
                  <td>: {data.bulan}</td>
                </tr>
                <tr>
                  <td className="pe-3">
                    <strong>Tahun</strong>
                  </td>
                  <td>: {data.tahun}</td>
                </tr>
                <tr>
                  <td className="pe-3">
                    <strong>Unit Gaji</strong>
                  </td>
                  <td>: {data.unitGajiId}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <p className="text-danger mt-3 mb-0">
          <small>
            <strong>Perhatian:</strong> Data yang sudah dihapus tidak dapat dikembalikan.
          </small>
        </p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={loading}>
          Batal
        </CButton>
        <CLoadingButton color="danger" onClick={onConfirm} loading={loading}>
          <CIcon icon={cilTrash} className="me-2" />
          Hapus
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

HapusPotonganGajiModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  data: PropTypes.shape({
    bulan: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tahun: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unitGajiId: PropTypes.string,
  }),
  loading: PropTypes.bool,
}

export default HapusPotonganGajiModal
