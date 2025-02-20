import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {
  CButton,
  CCol,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CProgress,
  CProgressBar,
  CRow,
} from '@coreui/react-pro'
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

  const getRekapStatus = () => {
    let url
    let param = {
      tahun: tahun,
      bulan: bulan,
    }
    if (jenisRekap === 'um') {
      url = `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/uang-makan`
      param.unitGajiId = idGaji
    } else if (jenisRekap === 'remun') {
      url = `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/remun`
      param.unitRemunId = idGaji
    }
    if (!idGaji) {
      delete param.unitGajiId
      delete param.unitRemunId
    }
    axios
      .get(url, {
        params: param,
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then(function (response) {
        // handle success
        // console.log(response.data.progress)
        setRekap(response.data)
      })
      .catch(function () {
        // handle error
        // console.log(error)
        setRekap(null)
      })
  }

  useEffect(() => {
    getRekapStatus()
  }, [bulan, idGaji, jenisRekap, tahun])

  useEffect(() => {
    let intervalId
    if (rekap?.progress < 100) {
      intervalId = setInterval(() => {
        getRekapStatus()
      }, 1000)
    }
    // Clear the interval on unmount
    return () => clearInterval(intervalId)
  }, [rekap?.progress])

  const onChangeBulan = (tahunBulan) => {
    setBulan(parseInt(tahunBulan.substr(4)))
    setTahun(parseInt(tahunBulan.substr(0, 4)))
  }

  const onGenerate = () => {
    let param = {
      tahun: tahun,
      bulan: bulan,
      createdBy: loginId,
      jenisRekap,
    }
    if (jenisRekap === 'um') {
      delete param.unitRemun
      param.unitGaji = idGaji
    } else if (jenisRekap === 'remun') {
      delete param.unitGaji
      param.unitRemun = idGaji
    }
    if (!idGaji) {
      delete param.unitGaji
      delete param.unitRemun
    }
    try {
      axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/rekap`,
        {
          ...param,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      setRekap({ progress: 0 })
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
          {(rekap?.progress === 100 || !idGaji) && (
            <CRow className="mb-4">
              <CCol md={12} className="mb-3">
                <CListGroup flush>
                  <CListGroupItem>
                    PNS Format Baru{' '}
                    <CButton
                      color="danger"
                      variant="ghost"
                      className="rounded-pill"
                      href={`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/download?tahun=${tahun}&bulan=${bulan}&fileType=pdf&jenisRekap=um_baru&statusPegawai=PNS&unitGaji=${idGaji}`}
                      target="_blank"
                    >
                      .pdf
                    </CButton>
                    <CButton
                      color="success"
                      variant="ghost"
                      className="rounded-pill"
                      href={`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/download?tahun=${tahun}&bulan=${bulan}&fileType=xlsx&jenisRekap=um_baru&statusPegawai=PNS&unitGaji=${idGaji}`}
                      target="_blank"
                    >
                      .xlsx
                    </CButton>
                  </CListGroupItem>
                  <CListGroupItem>
                    PNS Format Lama{' '}
                    <CButton
                      color="danger"
                      variant="ghost"
                      className="rounded-pill"
                      href={`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/download?tahun=${tahun}&bulan=${bulan}&fileType=pdf&jenisRekap=um_lama&statusPegawai=PNS&unitGaji=${idGaji}`}
                      target="_blank"
                    >
                      .pdf
                    </CButton>
                    <CButton
                      color="success"
                      variant="ghost"
                      className="rounded-pill"
                      href={`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/download?tahun=${tahun}&bulan=${bulan}&fileType=xlsx&jenisRekap=um_lama&statusPegawai=PNS&unitGaji=${idGaji}`}
                      target="_blank"
                    >
                      .xlsx
                    </CButton>
                  </CListGroupItem>
                  <CListGroupItem>
                    PPPK Format Lama{' '}
                    <CButton
                      color="danger"
                      variant="ghost"
                      className="rounded-pill"
                      href={`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/download?tahun=${tahun}&bulan=${bulan}&fileType=pdf&jenisRekap=um_lama&statusPegawai=PPPK&unitGaji=${idGaji}`}
                      target="_blank"
                    >
                      .pdf
                    </CButton>
                    <CButton
                      color="success"
                      variant="ghost"
                      className="rounded-pill"
                      href={`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/download?tahun=${tahun}&bulan=${bulan}&fileType=xlsx&jenisRekap=um_lama&statusPegawai=PPPK&unitGaji=${idGaji}`}
                      target="_blank"
                    >
                      .xlsx
                    </CButton>
                  </CListGroupItem>
                </CListGroup>
              </CCol>
              {idGaji && (
                <>
                  <CCol md={12}>
                    <p>
                      digenerate oleh {rekap.lastModifiedBy} pada{' '}
                      {dayjs(new Date(rekap.lastModifiedDate)).format('D/M/YYYY')}
                    </p>
                  </CCol>
                  <CCol md={12}>
                    <CButton color="warning" variant="outline" onClick={onGenerate}>
                      Generate Ulang
                    </CButton>
                  </CCol>
                </>
              )}
            </CRow>
          )}
        </>
      )}
      {jenisRekap === 'remun' && (
        <>
          {(rekap?.progress === 100 || !idGaji) && (
            <CRow className="mb-4">
              <CCol md={12} className="mb-3">
                <CListGroup flush>
                  <CListGroupItem>
                    Remun Pegawai{' '}
                    <CButton
                      color="danger"
                      variant="ghost"
                      className="rounded-pill"
                      href={`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/download?tahun=${tahun}&bulan=${bulan}&fileType=pdf&jenisRekap=remun&unitRemun=${idGaji}`}
                      target="_blank"
                    >
                      .pdf
                    </CButton>
                    <CButton
                      color="success"
                      variant="ghost"
                      className="rounded-pill"
                      href={`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/download?tahun=${tahun}&bulan=${bulan}&fileType=xlsx&jenisRekap=remun&unitRemun=${idGaji}`}
                      target="_blank"
                    >
                      .xlsx
                    </CButton>
                  </CListGroupItem>
                  <CListGroupItem>
                    Remun Grade{' '}
                    <CButton
                      color="success"
                      variant="ghost"
                      className="rounded-pill"
                      href={`${import.meta.env.VITE_SIMPEG_REST_URL}/rekap/download?tahun=${tahun}&bulan=${bulan}&fileType=xlsx&jenisRekap=remun_grade&unitRemun=${idGaji}`}
                      target="_blank"
                    >
                      .xlsx
                    </CButton>
                  </CListGroupItem>
                </CListGroup>
              </CCol>
              {idGaji && (
                <>
                  <CCol md={12}>
                    <p>
                      digenerate oleh {rekap.lastModifiedBy} pada{' '}
                      {dayjs(new Date(rekap.lastModifiedDate)).format('D/M/YYYY')}
                    </p>
                  </CCol>
                  <CCol md={12}>
                    <CButton color="warning" variant="outline" onClick={onGenerate}>
                      Generate Ulang
                    </CButton>
                  </CCol>
                </>
              )}
            </CRow>
          )}
        </>
      )}
      {!rekap && jenisRekap && idGaji && (
        <CButton color="primary" onClick={onGenerate}>
          Generate
        </CButton>
      )}
    </div>
  )
}

export default Rekap
