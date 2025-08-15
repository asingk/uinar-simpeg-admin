import React, { useContext, useState } from 'react'
import { gql } from '@apollo/client'
import PropTypes from 'prop-types'

import dayjs from 'dayjs'
import { CButton, CCol, CContainer, CRow } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPen } from '@coreui/icons'
import UbahProfilModal from './UbahProfilModal'
import { KeycloakContext } from 'src/context'

const Pribadi = ({ pegawai }) => {
  const [basicModal, setBasicModal] = useState(false)
  const keycloak = useContext(KeycloakContext)
  const role = keycloak.resourceAccess['simpeg-admin']?.roles[0]

  return (
    <CContainer>
      <CRow className="justify-content-end mb-2">
        <CCol lg="1" md="2" xs="4">
          <CButton
            color={'warning'}
            onClick={() => setBasicModal(true)}
            disabled={role === 'keuangan'}
          >
            <CIcon icon={cilPen} /> Edit
          </CButton>
        </CCol>
      </CRow>
      <CRow xs={{ cols: 1, gutter: 3 }} lg={{ cols: 2, gutter: 3 }}>
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow>
              <CCol sm={3}>NIK</CCol>
              <CCol sm={9}>{pegawai.nik}</CCol>
            </CRow>
          </CCol>
        )}
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow>
              <CCol sm={3}>NUPTK</CCol>
              <CCol sm={9}>{pegawai.nuptk}</CCol>
            </CRow>
          </CCol>
        )}
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow>
              <CCol sm={3}>Tempat Lahir</CCol>
              <CCol sm={9}>{pegawai.tempatLahir}</CCol>
            </CRow>
          </CCol>
        )}
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow>
              <CCol sm={3}>Tanggal Lahir</CCol>
              <CCol sm={9}>{dayjs(pegawai.tglLahir).format('D/M/YYYY')}</CCol>
            </CRow>
          </CCol>
        )}
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow>
              <CCol sm={3}>Jenis Kelamin</CCol>
              <CCol sm={9}>{pegawai.jenisKelamin}</CCol>
            </CRow>
          </CCol>
        )}
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow className="mb-3">
              <CCol sm={3}>Agama</CCol>
              <CCol sm={9}>{pegawai.agama}</CCol>
            </CRow>
          </CCol>
        )}
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow>
              <CCol sm={3}>Status Kawin</CCol>
              <CCol sm={9}>{pegawai.statusKawin}</CCol>
            </CRow>
          </CCol>
        )}
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow>
              <CCol sm={3}>No. HP</CCol>
              <CCol sm={9}>{pegawai.kontak?.noHp}</CCol>
            </CRow>
          </CCol>
        )}
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow>
              <CCol sm={3}>Email Pribadi</CCol>
              <CCol sm={9}>{pegawai.kontak?.emailPribadi}</CCol>
            </CRow>
          </CCol>
        )}
        <CCol>
          <CRow className="mb-3">
            <CCol sm={3}>Email Uinar</CCol>
            <CCol sm={9}>{pegawai.kontak?.emailUinar}</CCol>
          </CRow>
        </CCol>
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow className="mb-3">
              <CCol sm={3}>TMT KGB YAD</CCol>
              <CCol sm={9}>
                {pegawai.tmtKgbYad ? dayjs(pegawai.tmtKgbYad).format('D/M/YYYY') : ''}
              </CCol>
            </CRow>
          </CCol>
        )}
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow className="mb-3">
              <CCol sm={3}>TMT Pensiun</CCol>
              <CCol sm={9}>
                {pegawai.tmtPensiun ? dayjs(pegawai.tmtPensiun).format('D/M/YYYY') : ''}
              </CCol>
            </CRow>
          </CCol>
        )}
        {pegawai.statusPegawai.isSync && (
          <CCol>
            <CRow className="mb-3">
              <CCol sm={3}>TMT Pangkat YAD</CCol>
              <CCol sm={9}>
                {pegawai.tmtPangkatYad ? dayjs(pegawai.tmtPangkatYad).format('D/M/YYYY') : ''}
              </CCol>
            </CRow>
          </CCol>
        )}
        <CCol>
          <CRow className="mb-3">
            <CCol sm={3}>Unit Gaji</CCol>
            <CCol sm={9}>{pegawai.unitGaji?.nama}</CCol>
          </CRow>
        </CCol>
        <CCol>
          <CRow className="mb-3">
            <CCol sm={3}>Unit Remun</CCol>
            <CCol sm={9}>{pegawai.unitRemun?.nama}</CCol>
          </CRow>
        </CCol>
      </CRow>
      {basicModal && (
        <UbahProfilModal pegawai={pegawai} show={basicModal} setBasicModal={setBasicModal} />
      )}
    </CContainer>
  )
}

Pribadi.propTypes = {
  pegawai: PropTypes.object.isRequired,
}

Pribadi.fragments = {
  entry: gql`
    fragment PribadiFragment on Pegawai {
      nama
      nik
      nuptk
      tempatLahir
      tglLahir
      jenisKelamin
      agama
      statusKawin
      kontak {
        noHp
        emailUinar
        emailPribadi
      }
      tmtPangkatYad
      tmtKgbYad
      tmtPensiun
      unitGaji {
        id
        nama
      }
      unitRemun {
        id
        nama
      }
    }
  `,
}

export default Pribadi
