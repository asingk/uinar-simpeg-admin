import React, { useEffect, useState } from 'react'
import { useMutation, gql, useLazyQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
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
  CSpinner,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilUserUnfollow, cilUserFollow, cilWarning, cilCheckCircle } from '@coreui/icons'

const UPDATE_PEGAWAI_STATUS_AKTIF = gql`
  mutation UpdatePegawaiStatusAktif($id: ID!, $statusAktifId: Int!) {
    updatePegawaiStatusAktif(id: $id, statusAktifId: $statusAktifId) {
      code
      success
      message
    }
  }
`

const DAFTAR_STATUS_AKTIF = gql`
  query DaftarStatusAktif {
    daftarStatusAktif {
      id
      nama
    }
  }
`

const STATUS_AKTIF_AKTIF = 1
const STATUS_PEGAWAI_PNS_ID = 1
const STATUS_PEGAWAI_CPNS_ID = 2
const STATUS_PEGAWAI_HONORER_ID = 3
const STATUS_PEGAWAI_PNSDPB_ID = 4
const STATUS_PEGAWAI_PPPK_ID = 5

const UbahStatusAktifModal = (props) => {
  const [statusAktifId, setStatusAktifId] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const [getDaftarStatusAktif, { data: getData, loading: getLoading, error: getError }] =
    useLazyQuery(DAFTAR_STATUS_AKTIF)

  useEffect(() => {
    if (props.pegawai.statusAktif.id === STATUS_AKTIF_AKTIF) {
      getDaftarStatusAktif()
    }
  }, [getDaftarStatusAktif, props.pegawai.statusAktif.id])

  const [submit, { data, loading, error }] = useMutation(UPDATE_PEGAWAI_STATUS_AKTIF, {
    variables: {
      pegawaiId: props.pegawai.id,
      statusAktifId: statusAktifId,
    },
  })

  useEffect(() => {
    if (data) {
      if (!data?.updatePegawaiStatusAktif.success) {
        setErrorMessage(data.updatePegawaiStatusAktif.message)
      } else if (data?.updatePegawaiStatusAktif.success) {
        props.setVisible(false)
        let url
        if (
          props.pegawai.statusPegawai.id === STATUS_PEGAWAI_PNS_ID ||
          props.pegawai.statusPegawai.id === STATUS_PEGAWAI_PPPK_ID
        ) {
          url = '/pegawai/asn'
        } else if (props.pegawai.statusPegawai.id === STATUS_PEGAWAI_HONORER_ID) {
          url = '/pegawai/honorer'
        } else if (props.pegawai.statusPegawai.id === STATUS_PEGAWAI_CPNS_ID) {
          url = '/pegawai/cpns'
        } else if (props.pegawai.statusPegawai.id === STATUS_PEGAWAI_PNSDPB_ID) {
          url = '/pegawai/pnsdpb'
        }
        navigate(url)
      }
    }
  }, [data, navigate, props])

  let row = []
  if (getData) {
    for (const [key, value] of getData.daftarStatusAktif.entries()) {
      if (value.id > 1) {
        row.push(
          <div
            key={key}
            className="rounded p-3 mb-2"
            style={{
              backgroundColor:
                statusAktifId === value.id
                  ? 'var(--cui-primary-bg-subtle)'
                  : 'var(--cui-secondary-bg)',
              border:
                statusAktifId === value.id
                  ? '2px solid var(--cui-primary)'
                  : '1px solid var(--cui-border-color)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onClick={() => setStatusAktifId(value.id)}
          >
            <CFormCheck
              type="radio"
              name="flexRadioDefault"
              id={'flexRadioDefault' + key}
              checked={statusAktifId === value.id}
              onChange={() => setStatusAktifId(value.id)}
              label={
                <span className={statusAktifId === value.id ? 'fw-semibold text-primary' : ''}>
                  {value.nama}
                </span>
              }
            />
          </div>,
        )
      }
    }
  }

  const onSubmit = async () => {
    if (props.pegawai.statusAktif.id === STATUS_AKTIF_AKTIF && !statusAktifId) {
      setErrorMessage('Silakan pilih status nonaktif')
      return
    }

    try {
      await submit({
        variables: {
          id: props.pegawai.id,
          statusAktifId:
            props.pegawai.statusAktif.id === STATUS_AKTIF_AKTIF
              ? statusAktifId
              : STATUS_AKTIF_AKTIF,
        },
        refetchQueries: ['DaftarPegawai'],
        awaitRefetchQueries: true,
      })
    } catch (mutationErr) {
      console.log(mutationErr.message)
    }
  }

  const isActivating = props.pegawai.statusAktif.id > STATUS_AKTIF_AKTIF

  if (isActivating) {
    row.push(
      <div key="activate">
        <div className="text-center mb-3">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--cui-success-bg-subtle)',
            }}
          >
            <CIcon icon={cilUserFollow} size="xl" className="text-success" />
          </div>
        </div>
        <p className="text-center mb-2 fs-5 fw-semibold">Aktifkan Kembali?</p>
        <div className="rounded p-3 mb-3" style={{ backgroundColor: 'var(--cui-secondary-bg)' }}>
          <p className="mb-1 fw-semibold">{props.pegawai.nama}</p>
          <p className="mb-0 text-body-secondary small">NIP: {props.pegawai.id}</p>
        </div>
        <div className="rounded p-3" style={{ backgroundColor: 'var(--cui-success-bg-subtle)' }}>
          <p className="text-success mb-0 small">
            <CIcon icon={cilCheckCircle} className="me-2" />
            Pegawai akan diaktifkan kembali dan dapat digunakan dalam sistem
          </p>
        </div>
      </div>,
    )
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)} alignment="center">
      <CModalHeader className="border-0 pb-0">
        <CModalTitle>
          <CIcon icon={isActivating ? cilUserFollow : cilUserUnfollow} className="me-2" />
          {isActivating ? 'Aktifkan' : 'Nonaktifkan'} Pegawai
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="pt-3">
        {!getLoading && !getError && (
          <>
            {!isActivating && (
              <div className="mb-3">
                <div className="text-center mb-3">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: 'var(--cui-warning-bg-subtle)',
                    }}
                  >
                    <CIcon icon={cilUserUnfollow} size="xl" className="text-warning" />
                  </div>
                </div>
                <p className="text-center mb-3 fw-semibold">Pilih Alasan Nonaktif</p>
              </div>
            )}
            {row}
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
          </>
        )}
        {getLoading && (
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <CSpinner color="primary" className="mb-3" />
            <p className="text-body-secondary">Memuat data...</p>
          </div>
        )}
        {getError && (
          <CAlert color="danger" className="d-flex align-items-center">
            <CIcon icon={cilWarning} className="me-2" />
            <div>
              <strong>Error!</strong>
              <p className="mb-0 small mt-1">{getError.message}</p>
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
        <CLoadingButton
          loading={loading}
          color={isActivating ? 'success' : 'warning'}
          onClick={() => onSubmit()}
        >
          <CIcon icon={cilCheckCircle} className="me-2" />
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

UbahStatusAktifModal.propTypes = {
  pegawai: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default UbahStatusAktifModal
