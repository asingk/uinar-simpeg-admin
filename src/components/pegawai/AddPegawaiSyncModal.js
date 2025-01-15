import React, { useState, useEffect } from 'react'
import { useMutation, gql, useLazyQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import SelectFakultas from './SelectFakultas'
import SelectUnitKerja from './SelectUnitKerja'
import SelectUnitGaji from '../SelectUnitGaji'
import {
  CAlert,
  CButton,
  CFormInput,
  CFormSwitch,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import SelectUnitRemun from '../SelectUnitRemun'
import SelectStrukturJab from './SelectStrukturJab'

const CREATE_PEGAWAI_SYNC = gql`
  mutation CreatePegawaiSync($input: CreatePegawaiSyncInput!) {
    createPegawaiSync(input: $input) {
      code
      success
      message
    }
  }
`

const GET_STRUKTUR_JABATAN = gql`
  query StrukturJabatan($id: ID!) {
    strukturJabatan(id: $id) {
      id
      level {
        id
        nama
        ssoRole
      }
    }
  }
`

const AddPegawaiSyncModal = (props) => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [isDosen, setIsDosen] = useState(false)
  const [fakultasId, setFakultasId] = useState('')
  const [prodiId, setProdiId] = useState()
  const [idGaji, setIdGaji] = useState('')
  const [idRemun, setIdRemun] = useState('')
  const [isStruktural, setIsStruktural] = useState(false)
  const [strukturJabatanId, setStrukturJabatanId] = useState('')
  const [strOrgId, setStrOrgId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [getStrukturJabatan, { data: jabData }] = useLazyQuery(GET_STRUKTUR_JABATAN)

  let inputVariable = {
    id: id,
    password: password,
    unitGajiId: idGaji,
    unitRemunId: idRemun,
    strukturJabatanId: strukturJabatanId,
  }

  useEffect(() => {
    getStrukturJabatan({ variables: { id: strukturJabatanId } })
    if (jabData?.strukturJabatan?.level.ssoRole === 'DSN') {
      setIsDosen(true)
    } else {
      setIsDosen(false)
    }
  }, [getStrukturJabatan, jabData?.strukturJabatan?.level.ssoRole, strukturJabatanId])

  if (isStruktural) {
    inputVariable.strukturOrganisasiId = strOrgId
  }

  if (isDosen) {
    inputVariable.prodiId = prodiId
  }

  const [simpan, { data, loading, error }] = useMutation(CREATE_PEGAWAI_SYNC)

  useEffect(() => {
    if (data) {
      if (!data?.createPegawaiSync.success) {
        setErrorMessage(data.createPegawaiSync.message)
      } else if (data?.createPegawaiSync.success) {
        props.setBasicModal(false)
      }
    }
  }, [data, props])

  const simpanPegawai = async () => {
    try {
      await simpan({
        variables: { input: inputVariable },
        refetchQueries: ['DaftarPegawai'],
        awaitRefetchQueries: true,
      })
    } catch (mutationErr) {
      console.log(mutationErr.message)
    }
  }

  return (
    <>
      <CModal scrollable visible={props.show} onClose={() => props.setBasicModal(false)}>
        <CModalHeader>
          <CModalTitle>Tambah Pegawai</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <>
            <CFormInput
              type="text"
              id="nipInput"
              value={id}
              floatingClassName="mb-3"
              floatingLabel="NIP"
              placeholder="NIP"
              onChange={(e) => {
                setId(e.target.value)
              }}
              required
            />
            <CFormInput
              type="password"
              id="passwordInput"
              value={password}
              floatingClassName="mb-3"
              floatingLabel="Password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required
            />
            <hr />
            <h5 className="text-center">Jabatan</h5>
            <SelectStrukturJab setJabPegId={(id) => setStrukturJabatanId(id)} />
            {isDosen && (
              <div className="mb-3">
                <hr />
                <SelectFakultas
                  fakultasId={fakultasId}
                  changeFakultas={(id) => setFakultasId(id)}
                  prodiId={prodiId}
                  changeProdiId={(id) => setProdiId(id)}
                />
              </div>
            )}
            <hr />
            <div className="d-flex justify-content-center">
              <CFormSwitch
                label="Unit Kerja"
                id="formSwitchUnitKerja"
                onChange={() => setIsStruktural(!isStruktural)}
                checked={isStruktural}
              />
            </div>
            {isStruktural && (
              <>
                <SelectUnitKerja setStrOrgId={(id) => setStrOrgId(id)} />
              </>
            )}
            <hr />
            <div className="mb-3">
              <SelectUnitGaji setIdGaji={(id) => setIdGaji(id)} />
            </div>
            <SelectUnitRemun setIdGaji={(id) => setIdRemun(id)} />
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

AddPegawaiSyncModal.propTypes = {
  show: PropTypes.bool,
  setBasicModal: PropTypes.func,
}

export default AddPegawaiSyncModal
