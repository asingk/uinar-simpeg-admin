import React, { useEffect, useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import SelectUnitKerja from '../SelectUnitKerja'
import {
  CAlert,
  CButton,
  CFormCheck,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilWarning, cilBuilding, cilCheckCircle } from '@coreui/icons'

const CREATE_UNIT_KERJA_PEGAWAI = gql`
  mutation CreateUnitKerjaPegawai(
    $pegawaiId: ID!
    $strukturOrganisasiId: ID!
    $isSecondary: Boolean!
  ) {
    createUnitKerjaPegawai(
      pegawaiId: $pegawaiId
      strukturOrganisasiId: $strukturOrganisasiId
      isSecondary: $isSecondary
    ) {
      code
      message
      success
    }
  }
`

const AddUnitKerjaModal = (props) => {
  const [strOrgId, setStrOrgId] = useState('')
  const [isSecondary, setIsSecondary] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(CREATE_UNIT_KERJA_PEGAWAI)

  useEffect(() => {
    if (data) {
      if (!data?.createUnitKerjaPegawai.success) {
        setErrorMessage(data.createUnitKerjaPegawai.message)
      } else if (data?.createUnitKerjaPegawai.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  const submitJabatan = async () => {
    if (!strOrgId) {
      setErrorMessage('Silakan pilih unit kerja terlebih dahulu')
      return
    }

    setErrorMessage('')
    try {
      await simpan({
        variables: {
          pegawaiId: props.pegawaiId,
          strukturOrganisasiId: strOrgId,
          isSecondary: isSecondary,
        },
        refetchQueries: ['PegawaiProfil'],
        awaitRefetchQueries: true,
      })
    } catch (mutationErr) {
      setErrorMessage(mutationErr.message)
    }
  }

  return (
    <CModal
      visible={props.visible}
      onClose={() => props.setVisible(false)}
      size="lg"
      alignment="center"
    >
      <CModalHeader className="border-0 pb-0">
        <CModalTitle>
          <CIcon icon={cilBuilding} className="me-2" />
          Tambah Unit Kerja Aktif
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="pt-3">
        <div
          className="rounded p-3 mb-3"
          style={{ backgroundColor: 'var(--cui-primary-bg-subtle)' }}
        >
          <p className="text-primary mb-0 small">
            <CIcon icon={cilBuilding} className="me-2" />
            Pilih unit kerja yang akan ditambahkan untuk pegawai ini
          </p>
        </div>

        <SelectUnitKerja setStrOrgId={(id) => setStrOrgId(id)} />

        <div className="rounded p-3 mt-3" style={{ backgroundColor: 'var(--cui-secondary-bg)' }}>
          <CFormCheck
            id="flexCheckChecked"
            label={
              <span className="d-flex align-items-center">
                <CIcon icon={cilCheckCircle} className="me-2 text-success" />
                <span className="fw-semibold">Unit kerja utama</span>
              </span>
            }
            checked={!isSecondary}
            onChange={(e) => setIsSecondary(!e.target.checked)}
          />
          <p className="text-body-secondary small mb-0 ms-4 ps-2 mt-1">
            Centang jika ini adalah unit kerja utama pegawai
          </p>
        </div>

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

AddUnitKerjaModal.propTypes = {
  pegawaiId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddUnitKerjaModal
