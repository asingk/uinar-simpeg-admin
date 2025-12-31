import React, { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  CCard,
  CCardBody,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cilUserUnfollow,
  cilUserFollow,
  cilSync,
  cilUserPlus,
  cilTrash,
  cilArrowLeft,
  cilHome,
  cilSchool,
  cilStar,
  cilBriefcase,
  cilEducation,
} from '@coreui/icons'
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
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [openU, setOpenU] = useState(false)
  const [openP, setOpenP] = useState(false)
  const [openC, setOpenC] = useState(false)
  const [openD, setOpenD] = useState(false)

  const keycloak = useContext(KeycloakContext)
  const role = keycloak.resourceAccess['simpeg-admin']?.roles[0]

  const { loading, error, data } = useQuery(GET_PEGAWAI, {
    variables: { id: id },
    fetchPolicy: 'no-cache',
  })

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <CSpinner color="primary" className="mb-3" style={{ width: '3rem', height: '3rem' }} />
        <p className="text-body-secondary">Memuat data pegawai...</p>
      </div>
    )
  } else if (error) {
    return (
      <CAlert color="danger" className="d-flex align-items-center">
        <CIcon icon={cilTrash} className="me-2" size="lg" />
        <div>
          <strong>Terjadi kesalahan!</strong>
          <p className="mb-0 mt-1">{error.message}</p>
        </div>
      </CAlert>
    )
  }

  return (
    <div className="mb-4">
      {/* Breadcrumb Navigation */}
      <CRow className="mb-3">
        <CCol>
          <CButton color="secondary" variant="ghost" onClick={() => navigate(-1)} className="me-2">
            <CIcon icon={cilArrowLeft} className="me-2" />
            Kembali
          </CButton>
        </CCol>
      </CRow>

      {/* Header Card */}
      <CRow>
        <CCol className="mb-4">
          <Header pegawai={data.pegawai} />
        </CCol>
      </CRow>

      {/* Data Pribadi Card */}
      <CRow>
        <CCol className="mb-4">
          <Pribadi pegawai={data.pegawai} />
        </CCol>
      </CRow>

      {/* Accordion Sections */}
      <CRow>
        <CCol className="mb-4">
          <CAccordion activeItemKey={1} alwaysOpen>
            {data.pegawai.statusPegawai.isSync && (
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>
                  <CIcon icon={cilHome} className="me-2" />
                  Alamat
                </CAccordionHeader>
                <CAccordionBody>
                  <Alamat pegawai={data.pegawai} />
                </CAccordionBody>
              </CAccordionItem>
            )}
            {data.pegawai.statusPegawai.isSync && (
              <CAccordionItem itemKey={2}>
                <CAccordionHeader>
                  <CIcon icon={cilSchool} className="me-2" />
                  Pendidikan
                </CAccordionHeader>
                <CAccordionBody>
                  <Pendidikan pegawai={data.pegawai} />
                </CAccordionBody>
              </CAccordionItem>
            )}
            {data.pegawai.statusPegawai.isSync && (
              <CAccordionItem itemKey={3}>
                <CAccordionHeader>
                  <CIcon icon={cilStar} className="me-2" />
                  Pangkat
                </CAccordionHeader>
                <CAccordionBody>
                  <Pangkat pegawai={data.pegawai} />
                </CAccordionBody>
              </CAccordionItem>
            )}
            {data.pegawai.statusPegawai.isSync && (
              <CAccordionItem itemKey={4}>
                <CAccordionHeader>
                  <CIcon icon={cilBriefcase} className="me-2" />
                  Jabatan
                </CAccordionHeader>
                <CAccordionBody>
                  <JabatanKemenag pegawai={data.pegawai} />
                </CAccordionBody>
              </CAccordionItem>
            )}
            {(data.pegawai.jenisJabatan === 'DS' || data.pegawai.jenisJabatan === 'DT') && (
              <CAccordionItem itemKey={5}>
                <CAccordionHeader>
                  <CIcon icon={cilEducation} className="me-2" />
                  Dosen
                </CAccordionHeader>
                <CAccordionBody>
                  <Dosen pegawai={data.pegawai} />
                </CAccordionBody>
              </CAccordionItem>
            )}
          </CAccordion>
        </CCol>
      </CRow>

      {/* Footer & Action Buttons */}
      <CRow>
        <CCol>
          <CCard className="shadow-sm">
            <CCardBody>
              <Footer pegawai={data.pegawai} />

              {/* Action Buttons Section */}
              <div
                className="rounded p-4 mt-4"
                style={{ backgroundColor: 'var(--cui-secondary-bg)' }}
              >
                <h6 className="text-uppercase text-body-secondary mb-3 fw-semibold">
                  Aksi Pegawai
                </h6>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {/* Status Aktif Button */}
                  <CButton
                    color={data.pegawai.statusAktif.id === 1 ? 'warning' : 'success'}
                    variant="outline"
                    onClick={() => setOpen(true)}
                    disabled={role === 'keuangan'}
                    className="rounded-pill"
                  >
                    <CIcon
                      icon={data.pegawai.statusAktif.id === 1 ? cilUserUnfollow : cilUserFollow}
                      className="me-2"
                    />
                    {data.pegawai.statusAktif.id === 1 ? 'Nonaktifkan' : 'Aktifkan'} Pegawai
                  </CButton>

                  {/* Sync Button */}
                  {data.pegawai.statusPegawai.isSync && data.pegawai.statusAktif.id === 1 && (
                    <CButton
                      color="info"
                      variant="outline"
                      onClick={() => setOpenU(true)}
                      disabled={role === 'keuangan'}
                      className="rounded-pill"
                    >
                      <CIcon icon={cilSync} className="me-2" />
                      Sync Pegawai
                    </CButton>
                  )}

                  {/* CPNS to PNS Button */}
                  {data.pegawai.statusPegawai.id === STATUS_PEGAWAI_CPNS_ID &&
                    data.pegawai.statusAktif.id === 1 && (
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() => setOpenP(true)}
                        disabled={role === 'keuangan'}
                        className="rounded-pill"
                      >
                        <CIcon icon={cilUserPlus} className="me-2" />
                        Jadikan PNS
                      </CButton>
                    )}

                  {/* PNS to CPNS Button */}
                  {data.pegawai.statusPegawai.id === STATUS_PEGAWAI_PNS_ID &&
                    data.pegawai.statusAktif.id === 1 && (
                      <CButton
                        color="warning"
                        variant="outline"
                        onClick={() => setOpenC(true)}
                        disabled={role === 'keuangan'}
                        className="rounded-pill"
                      >
                        <CIcon icon={cilUserPlus} className="me-2" />
                        Jadikan CPNS
                      </CButton>
                    )}

                  {/* Delete Button */}
                  {data.pegawai.statusPegawai.id === STATUS_PEGAWAI_NONASN_ID &&
                    data.pegawai.statusAktif.id === 1 && (
                      <CButton
                        color="danger"
                        variant="outline"
                        onClick={() => setOpenD(true)}
                        disabled={role === 'keuangan'}
                        className="rounded-pill"
                      >
                        <CIcon icon={cilTrash} className="me-2" />
                        Hapus Pegawai
                      </CButton>
                    )}
                </div>

                {/* Info for Keuangan Role */}
                {role === 'keuangan' && (
                  <div
                    className="mt-3 p-3 rounded text-center"
                    style={{ backgroundColor: 'var(--cui-info-bg-subtle)' }}
                  >
                    <p className="text-info mb-0 small">
                      <strong>Info:</strong> Anda tidak memiliki akses untuk mengubah data pegawai
                    </p>
                  </div>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modals */}
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
