import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { CButton, CCol, CFormSelect, CProgress, CProgressBar, CRow } from '@coreui/react-pro'
import SelectBulanTahunRekapRemun from '../../components/kehadiran/SelectBulanTahunRekapRemun'
import SelectUnitGajiRekapRemun from '../../components/kehadiran/SelectUnitGajiRekapRemun'
import axios from 'axios'
import { KeycloakContext } from 'src/context'

const Rekap = () => {
  console.debug('rendering... Rekap')

  const date = new Date()

  const [bulan, setBulan] = useState(date.getMonth() + 1)
  const [tahun, setTahun] = useState(date.getFullYear())
  const [idGaji, setIdGaji] = useState('')
  const [rekap, setRekap] = useState(null)
  const [jenisRekap, setJenisRekap] = useState('')

  const keycloak = useContext(KeycloakContext)
  const loginId = keycloak.idTokenParsed?.preferred_username

  useEffect(() => {
    let url
    let param = {
      tahun: tahun,
      bulan: bulan,
    }
    if (jenisRekap === 'um') {
      url = import.meta.env.VITE_KEHADIRAN_API_URL + '/rekap/uang-makan'
      param.unitGajiId = idGaji
    } else if (jenisRekap === 'remun') {
      url = import.meta.env.VITE_KEHADIRAN_API_URL + '/rekap/remun'
      param.unitRemunId = idGaji
    }
    if (!idGaji) {
      delete param.unitGajiId
      delete param.unitRemunId
    }
    axios
      .get(url, {
        params: param,
      })
      .then(function (response) {
        // handle success
        // console.log(response.data)
        setRekap(response.data)
      })
      .catch(function (error) {
        // handle error
        // console.log(error)
        setRekap(null)
      })
  }, [bulan, idGaji, jenisRekap, tahun])

  const onChangeBulan = (tahunBulan) => {
    setBulan(parseInt(tahunBulan.substr(4)))
    setTahun(parseInt(tahunBulan.substr(0, 4)))
  }

  const evt = (streamUrl) => {
    const evtSource = new EventSource(streamUrl)
    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data?.progress)
      // if (data.progress) {
      //   setProgress(data.progress)
      // } else {
      //   setProgress(0)
      // }
      setRekap(data)
      if (data.progress === 100) {
        evtSource.close()
        // setRekap(data)
      }
    }
  }

  const onGenerate = () => {
    // setGenerating(true)
    let param = {
      tahun: tahun,
      bulan: bulan,
      admin: loginId,
    }
    let url
    let streamUrl =
      import.meta.env.VITE_KEHADIRAN_API_URL +
      '/rekap/stream-generate?tahun=' +
      tahun +
      '&bulan=' +
      bulan +
      '&jenisRekap=' +
      jenisRekap
    if (jenisRekap === 'um') {
      url = import.meta.env.VITE_KEHADIRAN_API_URL + '/rekap/uang-makan'
      param.unitGajiId = idGaji
      if (idGaji) {
        streamUrl += '&unitGajiId=' + idGaji
      }
    } else if (jenisRekap === 'remun') {
      url = import.meta.env.VITE_KEHADIRAN_API_URL + '/rekap/remun'
      param.unitRemunId = idGaji
      if (idGaji) {
        streamUrl += '&unitRemunId=' + idGaji
      }
    }
    if (!idGaji) {
      delete param.unitGajiId
      delete param.unitRemunId
    }
    try {
      axios.post(url, param, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          apikey: import.meta.env.VITE_API_KEY,
        },
      })
      setRekap({ progress: 0 })
      setTimeout(evt, 1000, streamUrl)
    } catch (error) {
      console.error(error)
    }
  }

  let judul
  if (jenisRekap === 'um') {
    judul = <h1 className="text-center">Uang Makan</h1>
  } else if (jenisRekap === 'remun') {
    judul = <h1 className="text-center">Remun</h1>
  }

  return (
    <div>
      <CRow>
        <CCol md="4" className="mb-4">
          <SelectBulanTahunRekapRemun
            setTahunBulan={(tahunBulan) => onChangeBulan(tahunBulan)}
            tahun={tahun}
            bulan={bulan}
          />
        </CCol>
        <CCol md="4" className="mb-4">
          <SelectUnitGajiRekapRemun setIdGaji={(id) => setIdGaji(id)} />
        </CCol>
        <CCol md="4">
          <CFormSelect
            aria-label="pilih jenis rekap"
            onChange={(e) => setJenisRekap(e.target.value)}
          >
            <option value="">--- Pilih Jenis Rekap ---</option>
            <option value="um">Uang Makan</option>
            <option value="remun">Remun</option>
          </CFormSelect>
        </CCol>
      </CRow>
      {judul}
      {rekap?.progress < 100 && (
        <CProgress color="info" variant="striped" animated value={rekap?.progress || 0}>
          <CProgressBar className="text-dark">{rekap?.progress || 0}%</CProgressBar>
        </CProgress>
      )}
      {jenisRekap === 'um' && (
        <>
          {rekap?.progress === 100 && (
            <>
              <CRow className="mb-4">
                <CCol md={12}>
                  <CButton
                    component="a"
                    href={
                      import.meta.env.VITE_CDN_URL_REKAP_FOLDER +
                      'uang_makan_pns_baru_' +
                      rekap.namaFile +
                      '.pdf'
                    }
                    color="link"
                    target="_blank"
                  >
                    PNS PDF Format Baru
                  </CButton>
                  <CButton
                    component="a"
                    href={
                      import.meta.env.VITE_CDN_URL_REKAP_FOLDER +
                      'uang_makan_pns_baru_' +
                      rekap.namaFile +
                      '.xlsx'
                    }
                    color="link"
                    target="_blank"
                  >
                    PNS Excel Format Baru
                  </CButton>
                  <CButton
                    component="a"
                    href={
                      import.meta.env.VITE_CDN_URL_REKAP_FOLDER +
                      'uang_makan_pns_lama_' +
                      rekap.namaFile +
                      '.pdf'
                    }
                    color="link"
                    target="_blank"
                  >
                    PNS PDF Format Lama
                  </CButton>
                  <CButton
                    component="a"
                    href={
                      import.meta.env.VITE_CDN_URL_REKAP_FOLDER +
                      'uang_makan_pns_lama_' +
                      rekap.namaFile +
                      '.xlsx'
                    }
                    color="link"
                    target="_blank"
                  >
                    PNS Excel Format Lama
                  </CButton>
                  <CButton
                    component="a"
                    href={
                      import.meta.env.VITE_CDN_URL_REKAP_FOLDER +
                      'uang_makan_pppk_lama_' +
                      rekap.namaFile +
                      '.pdf'
                    }
                    color="link"
                    target="_blank"
                  >
                    PPPK PDF Format Lama
                  </CButton>
                  <CButton
                    component="a"
                    href={
                      import.meta.env.VITE_CDN_URL_REKAP_FOLDER +
                      'uang_makan_pppk_lama_' +
                      rekap.namaFile +
                      '.xlsx'
                    }
                    color="link"
                    target="_blank"
                  >
                    PPPK Excel Format Lama
                  </CButton>
                </CCol>
                <CCol md={12}>
                  <p>
                    digenerate oleh {rekap.lastModifiedBy} pada{' '}
                    {dayjs(new Date(rekap.lastModifiedDate)).format('D/M/YYYY')}
                  </p>
                </CCol>
                <CCol md={12}>
                  <CButton color="warning" variant="ghost" onClick={onGenerate}>
                    Generate Ulang?
                  </CButton>
                </CCol>
              </CRow>
            </>
          )}
        </>
      )}
      {jenisRekap === 'remun' && (
        <>
          {rekap?.progress === 100 && (
            <CRow className="mb-4">
              <CCol md={12}>
                <CButton
                  component="a"
                  href={
                    import.meta.env.VITE_CDN_URL_REKAP_FOLDER + 'remun_' + rekap.namaFile + '.pdf'
                  }
                  color="link"
                  target="_blank"
                >
                  PDF
                </CButton>
                <CButton
                  component="a"
                  href={
                    import.meta.env.VITE_CDN_URL_REKAP_FOLDER + 'remun_' + rekap.namaFile + '.xlsx'
                  }
                  color="link"
                  target="_blank"
                >
                  Excel
                </CButton>
                <CButton
                  component="a"
                  href={
                    import.meta.env.VITE_CDN_URL_REKAP_FOLDER +
                    'remun_grade_' +
                    rekap.namaFile +
                    '.xlsx'
                  }
                  color="link"
                  target="_blank"
                >
                  Grade
                </CButton>
              </CCol>
              <CCol md={12}>
                <p>
                  digenerate oleh {rekap.lastModifiedBy} pada{' '}
                  {dayjs(new Date(rekap.lastModifiedDate)).format('D/M/YYYY')}
                </p>
              </CCol>
              <CCol md={12}>
                <CButton color="warning" variant="ghost" onClick={onGenerate}>
                  Generate Ulang?
                </CButton>
              </CCol>
            </CRow>
          )}
        </>
      )}
      {!rekap && jenisRekap && (
        <CButton color="primary" onClick={onGenerate}>
          Generate
        </CButton>
      )}
    </div>
  )
}

export default Rekap
