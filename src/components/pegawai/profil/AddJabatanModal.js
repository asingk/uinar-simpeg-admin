import React, { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
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
import CIcon from '@coreui/icons-react'
import { cilPlus, cilWarning, cilBriefcase } from '@coreui/icons'
import SelectStrukturJab from '../SelectStrukturJab'

const CREATE_JABATAN_PEGAWAI = gql`
  mutation CreateJabatanPegawai($pegawaiId: ID!, $strukturJabatanId: ID!) {
    createJabatanPegawai(pegawaiId: $pegawaiId, strukturJabatanId: $strukturJabatanId) {
      code
      message
      success
    }
  }
`

const AddJabatanModal = (props) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [jabPegId, setJabPegId] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_JABATAN_PEGAWAI)

  useEffect(() => {
    if (data) {
      if (!data?.createJabatanPegawai.success) {
        setErrorMessage(data.createJabatanPegawai.message)
      } else if (data?.createJabatanPegawai.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  const submitJabatan = () => {
    if (!jabPegId) {
      setErrorMessage('Silakan pilih jabatan terlebih dahulu')
      return
    }

    setErrorMessage('')
    try {
      simpan({
        variables: {
          pegawaiId: props.pegawaiId,
          strukturJabatanId: jabPegId,
        },
        refetchQueries: ['PegawaiProfil'],
        awaitRefetchQueries: true,
      })
    } catch (mutationErr) {
      console.log(mutationErr.message)
    }
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)} alignment="center">
      <CModalHeader className="border-0 pb-0">
        <CModalTitle>
          <CIcon icon={cilBriefcase} className="me-2" />
          Tambah Jabatan Aktif
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="pt-3">
        <div
          className="rounded p-3 mb-3"
          style={{ backgroundColor: 'var(--cui-primary-bg-subtle)' }}
        >
          <p className="text-primary mb-0 small">
            <CIcon icon={cilBriefcase} className="me-2" />
            Pilih jabatan yang akan ditambahkan untuk pegawai ini
          </p>
        </div>

        <SelectStrukturJab setJabPegId={(id) => setJabPegId(id)} />

        {error && (
          <CAlert className="mt-3 d-flex align-items-start" color="danger">
            <CIcon icon={cilWarning} className="me-2 mt-1" />
            <div>
              <strong>Error!</strong>
              <p className="mb-0 small mt-1">{error.message}</p>
            </div>
          </CAlert>
        )}
        {errorMessage && (
          <CAlert className="mt-3 d-flex align-items-start" color="danger">
            <CIcon icon={cilWarning} className="me-2 mt-1" />
            <div>
              <strong>Error!</strong>
              <p className="mb-0 small mt-1">{errorMessage}</p>
            </div>
          </CAlert>
        )}
      </CModalBody>
      <CModalFooter className="border-0">
        <CButton
          color="secondary"
          variant="ghost"
          onClick={() => props.setVisible(false)}
          disabled={loading}
        >
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={submitJabatan}>
          <CIcon icon={cilPlus} className="me-2" />
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

AddJabatanModal.propTypes = {
  pegawaiId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddJabatanModal
