import React from 'react'
import PropTypes from 'prop-types'
import { CCol, CRow } from '@coreui/react-pro'
import { gql } from '@apollo/client'

const Alamat = ({ pegawai }) => {
  return (
    <CRow xs={{ cols: 1, gutter: 3 }} lg={{ cols: 2, gutter: 3 }}>
      <CCol>
        <CRow>
          <CCol sm={3}>Alamat</CCol>
          <CCol sm={9}>{pegawai.alamat?.deskripsi}</CCol>
        </CRow>
      </CCol>
      <CCol>
        <CRow>
          <CCol sm={3}>Kota/Kab</CCol>
          <CCol sm={9}>{pegawai.alamat?.kabKota}</CCol>
        </CRow>
      </CCol>
      <CCol>
        <CRow>
          <CCol sm={3}>Provinsi</CCol>
          <CCol sm={9}>{pegawai.alamat?.provinsi}</CCol>
        </CRow>
      </CCol>
      <CCol>
        <CRow>
          <CCol sm={3}>Kode POS</CCol>
          <CCol sm={9}>{pegawai.alamat?.kodePos}</CCol>
        </CRow>
      </CCol>
    </CRow>
  )
}

Alamat.propTypes = {
  pegawai: PropTypes.object.isRequired,
}

Alamat.fragments = {
  entry: gql`
    fragment AlamatFragment on Pegawai {
      alamat {
        deskripsi
        kabKota
        provinsi
        kodePos
      }
    }
  `,
}

export default Alamat
