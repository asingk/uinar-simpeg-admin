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
import SelectStatusPegawai from './SelectStatusPegawai'
import { KeycloakContext } from 'src/context'

const TambahRiwayatProfilModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [golongan, setGolongan] = useState('')
  const [jenisJabatan, setJenisJabatan] = useState('')
  const [unitGaji, setUnitGaji] = useState('')
  const [unitRemun, setUnitRemun] = useState('')
  const [remunGrade, setRemunGrade] = useState()
  const [grade, setGrade] = useState('')
  const [implementasiRemun, setImplementasiRemun] = useState()
  const [pajak, setPajak] = useState()
  const [uangMakanHarian, setUangMakanHarian] = useState()
  const [idStatusPegawai, setIdStatusPegawai] = useState()
  const [bulan, setBulan] = useState()
  const [namaPegawai, setNamaPegawai] = useState('')

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  const jenisJabatanOptions = [
    { label: '-- Pilih Jenis Jabatan --', value: '' },
    { label: 'DS', value: 'DS' },
    { label: 'DT', value: 'DT' },
    { label: 'Tendik', value: 'Tendik' },
  ]

  const date = new Date()
  let thisYear = date.getFullYear()
  let thisMonth = date.getMonth() + 1
  let optionsBulan = [{ label: '--Pilih Bulan--', value: '' }]
  if (thisYear === props.tahun) {
    for (let i = thisMonth; i > 0; i--) {
      let opt = {
        label: i,
        value: i,
      }
      optionsBulan.push(opt)
    }
  } else {
    for (let i = 12; i > 0; i--) {
      let opt = {
        label: i,
        value: i,
      }
      optionsBulan.push(opt)
    }
  }

  let modalBody = (
    <CForm className="row g-3">
      <CCol xs={12}>
        <CFormInput id="inputNip" label="NIP" value={props.nip} disabled={true} />
      </CCol>
      <CCol xs={12}>
        <CFormInput id="inputTahun" label="Tahun" value={props.tahun} disabled={true} />
      </CCol>
      <CCol md={12}>
        <CFormSelect
          aria-describedby="Default select bulan"
          label="Bulan"
          options={optionsBulan}
          onChange={(e) => setBulan(parseInt(e.target.value))}
        />
      </CCol>
      <CCol xs={12}>
        <CFormInput
          id="inputNama"
          label="Nama Pegawai"
          value={namaPegawai}
          onChange={(event) => setNamaPegawai(event.target.value)}
        />
      </CCol>
      <CCol md={12}>
        <SelectStatusPegawai setId={(id) => setIdStatusPegawai(Number(id))} />
      </CCol>
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
          onChange={(event) => setRemunGrade(Number(event.target.value))}
        />
      </CCol>
      <CCol xs={12}>
        <CFormInput
          id="inputImpl"
          label="Implementasi Remun (%)"
          type="number"
          value={implementasiRemun}
          onChange={(event) => setImplementasiRemun(Number(event.target.value))}
        />
      </CCol>
      <CCol xs={12}>
        <CFormInput
          id="inputPajak"
          label="Pajak (%)"
          type="number"
          value={pajak}
          onChange={(event) => setPajak(Number(event.target.value))}
        />
      </CCol>
      <CCol xs={12}>
        <CFormInput
          id="inputum"
          label="Uang Makan Harian (Rp)"
          type="number"
          value={uangMakanHarian}
          onChange={(event) => setUangMakanHarian(Number(event.target.value))}
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
      await axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/pegawai/${props.nip}/riwayat-profil`,
        {
          tahun: props.tahun,
          bulan: bulan,
          namaPegawai: namaPegawai,
          golongan: golongan,
          jenisJabatan: jenisJabatan,
          unitGaji: unitGaji,
          unitRemun: unitRemun,
          remunGrade: remunGrade,
          grade: grade,
          implementasiRemun: implementasiRemun,
          pajak: pajak,
          uangMakanHarian: uangMakanHarian,
          idStatusPegawai: idStatusPegawai,
          admin: loginId,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      props.added()
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

TambahRiwayatProfilModal.propTypes = {
  nip: PropTypes.string.isRequired,
  tahun: PropTypes.number.isRequired,
  added: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default TambahRiwayatProfilModal
