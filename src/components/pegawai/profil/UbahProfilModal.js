import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CFormInput,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import SelectUnitGaji from '../../SelectUnitGaji'
import SelectUnitRemun from '../../SelectUnitRemun'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'

const UPDATE_PEGAWAI_PROFIL = gql`
  mutation UpdatePegawaiProfil($id: ID!, $input: UpdatePegawaiProfilInput!) {
    updatePegawaiProfil(id: $id, input: $input) {
      code
      success
      message
    }
  }
`

const UbahProfilModal = (props) => {
  const [emailUinar, setEmailUinar] = useState(props.pegawai.kontak?.emailUinar)
  const [idGaji, setIdGaji] = useState(props.pegawai.unitGaji?.id)
  const [idRemun, setIdRemun] = useState(props.pegawai.unitRemun?.id)
  const [nama, setNama] = useState(props.pegawai.nama)
  const [errorMessage, setErrorMessage] = useState('')

  const [submit, { data, loading, error }] = useMutation(UPDATE_PEGAWAI_PROFIL)

  let inputVariable = {
    emailUinar: emailUinar,
    unitGajiId: idGaji,
    unitRemunId: idRemun,
  }
  if (!props.pegawai.statusPegawai.isSync) {
    inputVariable.nama = nama
  }
  const simpanPegawai = async () => {
    try {
      await submit({
        variables: {
          id: props.pegawai.id,
          input: inputVariable,
        },
        refetchQueries: ['PegawaiProfil'],
        awaitRefetchQueries: true,
      })
    } catch (mutationErr) {
      console.debug(mutationErr.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.updatePegawaiProfil.success) {
        setErrorMessage(data.updatePegawaiProfil.message)
      } else if (data?.updatePegawaiProfil.success) {
        props.setBasicModal(false)
      }
    }
  }, [data, props])

  return (
    <>
      <CModal scrollable visible={props.show} onClose={() => props.setBasicModal(false)}>
        <CModalHeader>
          <CModalTitle>Ubah Profil Pegawai</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <>
            <CFormInput
              type="email"
              id="emailInput"
              defaultValue={emailUinar}
              floatingClassName="mb-3"
              floatingLabel="Email Uinar"
              placeholder="Email Uinar"
              onChange={(e) => {
                setEmailUinar(e.target.value)
              }}
            />
            {!props.pegawai.statusPegawai.isSync && (
              <CFormInput
                type="text"
                id="namaInput"
                defaultValue={nama}
                floatingClassName="mb-3"
                floatingLabel="Nama"
                placeholder="Nama"
                onChange={(e) => {
                  setNama(e.target.value)
                }}
              />
            )}
            <div className="mb-3">
              <label className="mb-1">Unit Gaji</label>
              <SelectUnitGaji idGaji={idGaji} setIdGaji={(id) => setIdGaji(id)} />
            </div>
            <div>
              <label className="mb-1">Unit Remun</label>
              <SelectUnitRemun idGaji={idRemun} setIdGaji={(id) => setIdRemun(id)} />
            </div>
          </>
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
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => props.setBasicModal(false)}>
            Tutup
          </CButton>

          <CLoadingButton loading={loading} onClick={simpanPegawai} color="primary">
            Simpan
          </CLoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

UbahProfilModal.propTypes = {
  pegawai: PropTypes.object.isRequired,
  show: PropTypes.bool,
  setBasicModal: PropTypes.func,
}

export default UbahProfilModal
