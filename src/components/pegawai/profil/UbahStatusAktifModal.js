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
          <CFormCheck
            type="radio"
            name="flexRadioDefault"
            id={'flexRadioDefault' + key}
            checked={statusAktifId === value.id}
            onChange={() => setStatusAktifId(value.id)}
            label={value.nama}
          />,
        )
      }
    }
  }

  const onSubmit = async () => {
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

  if (props.pegawai.statusAktif.id > STATUS_AKTIF_AKTIF) {
    row.push(<p>Anda yakin ingin mengaktifkan kembali {props.pegawai.nama}?</p>)
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Nonaktifkan Pegawai</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <>
          {!getLoading && !getError && (
            <>
              {row}
              {error && (
                <CAlert className="mt-3" color="danger">
                  Error: {error.message}
                </CAlert>
              )}
              {errorMessage && (
                <CAlert className="mt-3" color="danger">
                  Error: {errorMessage}
                </CAlert>
              )}
            </>
          )}
          {getLoading && (
            <div className="d-flex justify-content-center">
              <CSpinner role="status">
                <span className="visually-hidden">Loading...</span>
              </CSpinner>
            </div>
          )}
          {getError && <CAlert color="danger">Error: {getError.message}</CAlert>}
        </>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={() => onSubmit()}>
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
