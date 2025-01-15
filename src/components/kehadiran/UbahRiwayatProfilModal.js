import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import SelectUnitGajiLabel from '../SelectUnitGajiLabel'
import SelectUnitRemunLabel from '../SelectUnitRemunLabel'
import SelectGradeLabel from '../SelectGradeLabel'
import { KeycloakContext } from 'src/context'

const UbahRiwayatProfilModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [golongan, setGolongan] = useState(props.data.golongan)
  const [jenisJabatan, setJenisJabatan] = useState(props.data.jenisJabatan)
  const [unitGaji, setUnitGaji] = useState(props.data.unitGaji)
  const [unitRemun, setUnitRemun] = useState(props.data.unitRemun)
  const [remunGrade, setRemunGrade] = useState(props.data.remunGrade)
  const [grade, setGrade] = useState(props.data.grade)
  const [implementasiRemun, setImplementasiRemun] = useState(props.data.implementasiRemun)
  const [pajak, setPajak] = useState(props.data.pajak)
  const [uangMakanHarian, setUangMakanHarian] = useState(props.data.uangMakanHarian)

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const jenisJabatanOptions = [
    { label: '-- Pilih Jenis Jabatan --', value: '' },
    { label: 'DS', value: 'DS' },
    { label: 'DT', value: 'DT' },
    { label: 'Tendik', value: 'Tendik' },
  ]

  let modalBody = (
    <CForm className="row g-3">
      <CCol md={12}>
        <CFormSelect
          id="inputJab"
          label="Jenis Jabatan"
          options={jenisJabatanOptions}
          value={jenisJabatan}
          onChange={(event) => setJenisJabatan(event.target.value)}
        />
      </CCol>
      <CCol xs={12}>
        <CFormInput
          id="inputGol"
          label="Golongan"
          value={golongan}
          onChange={(event) => setGolongan(event.target.value)}
        />
      </CCol>
      <CCol md={12}>
        <SelectUnitGajiLabel idGaji={unitGaji} setIdGaji={(id) => setUnitGaji(id)} />
      </CCol>
      <CCol md={12}>
        <SelectUnitRemunLabel idGaji={unitRemun} setIdGaji={(id) => setUnitRemun(id)} />
      </CCol>
      <CCol md={12}>
        <SelectGradeLabel grade={grade} setGrade={(id) => setGrade(id)} />
      </CCol>
      <CCol xs={12}>
        <CFormInput
          id="inputRemun"
          label="Remun Grade (Rp)"
          type="number"
          value={remunGrade}
          onChange={(event) => setRemunGrade(event.target.value)}
        />
      </CCol>
      <CCol xs={12}>
        <CFormInput
          id="inputImpl"
          label="Implementasi Remun (%)"
          type="number"
          value={implementasiRemun}
          onChange={(event) => setImplementasiRemun(event.target.value)}
        />
      </CCol>
      <CCol xs={12}>
        <CFormInput
          id="inputPajak"
          label="Pajak (%)"
          type="number"
          value={pajak}
          onChange={(event) => setPajak(event.target.value)}
        />
      </CCol>
      <CCol xs={12}>
        <CFormInput
          id="inputum"
          label="Uang Makan Harian (Rp)"
          type="number"
          value={uangMakanHarian}
          onChange={(event) => setUangMakanHarian(event.target.value)}
        />
      </CCol>
    </CForm>
  )

  if (error) {
    modalBody = <CAlert color="danger">Error: {errorMessage}</CAlert>
  }

  async function submitAction() {
    try {
      setLoading(true)
      await axios.put(
        import.meta.env.VITE_KEHADIRAN_API_URL + '/riwayat-profil/' + props.data.id,
        {
          golongan: golongan,
          jenisJabatan: jenisJabatan,
          unitGaji: unitGaji,
          unitRemun: unitRemun,
          remunGrade: remunGrade,
          grade: grade,
          implementasiRemun: implementasiRemun,
          pajak: pajak,
          uangMakanHarian: uangMakanHarian,
          admin: loginId,
        },
        {
          headers: {
            apikey: import.meta.env.VITE_API_KEY,
          },
        },
      )
      props.edited()
    } catch (error) {
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        // setLoading(false)
        // setErrorResp(true)
        setErrorMessage(error.response.data.message)
      } else if (error.request) {
        // The client never received a response, and the request was never left
        // setLoading(false)
        setError(true)
      } else {
        // Anything else
        // setLoading(false)
        setError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal size="lg" visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Ubah Riwayat Profil</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={submitAction}>
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

UbahRiwayatProfilModal.propTypes = {
  edited: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
  data: PropTypes.object.isRequired,
}

export default UbahRiwayatProfilModal
