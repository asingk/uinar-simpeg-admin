import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import Header from 'src/components/pegawai/profil/Header'
import Pribadi from 'src/components/pegawai/profil/Pribadi'
import Alamat from 'src/components/pegawai/profil/Alamat'
import Pendidikan from 'src/components/pegawai/profil/Pendidikan'
import JabatanKemenag from 'src/components/pegawai/profil/JabatanKemenag'
import Pangkat from 'src/components/pegawai/profil/Pangkat'
import Footer from 'src/components/pegawai/profil/Footer'
import UbahStatusAktifModal from 'src/components/pegawai/profil/UbahStatusAktifModal'
import SyncModal from 'src/components/pegawai/profil/SyncModal'
import Dosen from '../../components/pegawai/profil/Dosen'
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CAlert,
  CButton,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react-pro'
import UpdatePegawaiStatusPegawaiModal from '../../components/pegawai/profil/UpdatePegawaiStatusPegawaiModal'
import DeletePegawaiModal from '../../components/pegawai/profil/DeletePegawaiModal'
import { KeycloakContext } from 'src/context'

const GET_PEGAWAI = gql`
  query PegawaiProfil($id: ID!) {
    pegawai(id: $id) {
      id
      statusPegawai {
        id
        nama
        isSync
      }
      statusAktif {
        id
        nama
      }
      jenisJabatan
      ...FooterFragment
      ...PribadiFragment
      ...HeaderFragment
      ...AlamatFragment
      ...DosenFragment
      ...PendidikanFragment
      ...PangkatFragment
      ...JabatanKemenagFragment
    }
  }
  ${Footer.fragments.entry}
  ${Pribadi.fragments.entry}
  ${Header.fragments.entry}
  ${Alamat.fragments.entry}
  ${Dosen.fragments.entry}
  ${Pendidikan.fragments.entry}
  ${Pangkat.fragments.entry}
  ${JabatanKemenag.fragments.entry}
`

const STATUS_PEGAWAI_PNS_ID = 1
const STATUS_PEGAWAI_CPNS_ID = 2
const STATUS_PEGAWAI_NONASN_ID = 3

const ProfilPegawai = () => {
  console.debug('rendering... ProfilPegawai')

  const { id } = useParams()
  const [open, setOpen] = useState(false)
  const [openU, setOpenU] = useState(false)
  const [openP, setOpenP] = useState(false)
  const [openC, setOpenC] = useState(false)
  const [openD, setOpenD] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const role = keycloak.resourceAccess['simpeg-admin']?.roles[0]

  // const memo = useMemo(
  //   () => ({
  //     pegawaiId: id,
  //   }),
  //   [id],
  // )

  const { loading, error, data } = useQuery(GET_PEGAWAI, {
    variables: { id: id },
    fetchPolicy: 'no-cache',
  })

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    return <CAlert color="danger">Error: {error.message}</CAlert>
  }

  return (
    <div className="mb-3">
      <CRow>
        <CCol className="mb-4">
          <Header pegawai={data.pegawai} />
        </CCol>
      </CRow>
      <CRow>
        <CCol className="mb-4">
          <Pribadi pegawai={data.pegawai} />
        </CCol>
      </CRow>
      <CAccordion>
        {data.pegawai.statusPegawai.isSync && (
          <CAccordionItem itemKey={1}>
            <CAccordionHeader>Alamat</CAccordionHeader>
            <CAccordionBody>{<Alamat pegawai={data.pegawai} />}</CAccordionBody>
          </CAccordionItem>
        )}
        {data.pegawai.statusPegawai.isSync && (
          <CAccordionItem itemKey={2}>
            <CAccordionHeader>Pendidikan</CAccordionHeader>
            <CAccordionBody>{<Pendidikan pegawai={data.pegawai} />}</CAccordionBody>
          </CAccordionItem>
        )}
        {data.pegawai.statusPegawai.isSync && (
          <CAccordionItem itemKey={3}>
            <CAccordionHeader>Pangkat</CAccordionHeader>
            <CAccordionBody>{<Pangkat pegawai={data.pegawai} />}</CAccordionBody>
          </CAccordionItem>
        )}
        {data.pegawai.statusPegawai.isSync && (
          <CAccordionItem itemKey={4}>
            <CAccordionHeader>Jabatan</CAccordionHeader>
            <CAccordionBody>{<JabatanKemenag pegawai={data.pegawai} />}</CAccordionBody>
          </CAccordionItem>
        )}
        {(data.pegawai.jenisJabatan === 'DS' || data.pegawai.jenisJabatan === 'DT') && (
          <CAccordionItem itemKey={5}>
            <CAccordionHeader>Dosen</CAccordionHeader>
            <CAccordionBody>{<Dosen pegawai={data.pegawai} />}</CAccordionBody>
          </CAccordionItem>
        )}
      </CAccordion>
      <CRow>
        <CCol className="text-center">
          <Footer pegawai={data.pegawai} />
          <div className="d-grid gap-2 d-md-flex justify-content-md-center mb-8">
            <CButton color="secondary" onClick={() => setOpen(true)} disabled={role === 'keuangan'}>
              {data.pegawai.statusAktif.id === 1 ? 'Nonaktifkan Pegawai' : 'Aktifkan Pegawai'}
            </CButton>
            {data.pegawai.statusPegawai.isSync && data.pegawai.statusAktif.id === 1 ? (
              <CButton color="info" onClick={() => setOpenU(true)} disabled={role === 'keuangan'}>
                Sync Pegawai
              </CButton>
            ) : (
              ''
            )}
            {data.pegawai.statusPegawai.id === STATUS_PEGAWAI_CPNS_ID &&
            data.pegawai.statusAktif.id === 1 ? (
              <CButton
                color="warning"
                onClick={() => setOpenP(true)}
                disabled={role === 'keuangan'}
              >
                Jadikan PNS
              </CButton>
            ) : (
              ''
            )}
            {data.pegawai.statusPegawai.id === STATUS_PEGAWAI_PNS_ID &&
            data.pegawai.statusAktif.id === 1 ? (
              <CButton
                color="warning"
                onClick={() => setOpenC(true)}
                disabled={role === 'keuangan'}
              >
                Jadikan CPNS
              </CButton>
            ) : (
              ''
            )}
            {data.pegawai.statusPegawai.id === STATUS_PEGAWAI_NONASN_ID &&
              data.pegawai.statusAktif.id === 1 && (
                <CButton
                  color="danger"
                  onClick={() => setOpenD(true)}
                  disabled={role === 'keuangan'}
                >
                  Hapus Pegawai
                </CButton>
              )}
          </div>
        </CCol>
      </CRow>
      {open && <UbahStatusAktifModal pegawai={data.pegawai} visible={open} setVisible={setOpen} />}
      {openU && <SyncModal pegawai={data.pegawai} visible={openU} setVisible={setOpenU} />}
      {openP && (
        <UpdatePegawaiStatusPegawaiModal
          pegawaiId={data.pegawai.id}
          statusPegawaiId={1}
          visible={openP}
          setVisible={setOpenP}
        />
      )}
      {openC && (
        <UpdatePegawaiStatusPegawaiModal
          pegawaiId={data.pegawai.id}
          statusPegawaiId={2}
          visible={openC}
          setVisible={setOpenC}
        />
      )}
      {openD && <DeletePegawaiModal id={data.pegawai.id} visible={openD} setVisible={setOpenD} />}
    </div>
  )
}

export default ProfilPegawai
