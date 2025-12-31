import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPlus, cilBriefcase, cilBuilding, cilUser } from '@coreui/icons'
import HapusJabatanModal from './HapusJabatanModal'
import AddJabatanModal from './AddJabatanModal'
import HapusUnitKerjaModal from './HapusUnitKerjaModal'
import AddUnitKerjaModal from './AddUnitKerjaModal'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardText,
  CCardTitle,
  CBadge,
  CCol,
  CRow,
} from '@coreui/react-pro'
import { gql } from '@apollo/client'
import { KeycloakContext } from 'src/context'

const Header = ({ pegawai }) => {
  const [isOpenAddJabatanModal, setIsOpenAddJabatanModal] = useState(false)
  const [isOpenAddUnitKerjaModal, setIsOpenAddUnitKerjaModal] = useState(false)
  const [isOpenHapusJabatanModal, setIsOpenHapusJabatanModal] = useState(false)
  const [isOpenHapusUnitKerjaModal, setIsOpenHapusUnitKerjaModal] = useState(false)
  const [jabatanId, setJabatanId] = useState('')
  const [unitKerjaId, setUnitKerjaId] = useState('')

  const keycloak = useContext(KeycloakContext)
  const role = keycloak.resourceAccess['simpeg-admin']?.roles[0]

  let remunPosisi
  let ukerRow = []
  if (pegawai.unitKerjaSaatIni.length > 0) {
    pegawai.unitKerjaSaatIni.forEach((row) => {
      if (row.grade && !row.isSecondary) {
        remunPosisi = row.grade
      }
      const uker = row.unitKerja?.nama || ''
      const bag = row.bagian?.nama ? row.bagian?.nama + ' - ' : ''
      const sub = row.subbag?.nama ? row.subbag?.nama + ' - ' : ''
      ukerRow.push(
        <div
          className="d-flex align-items-start justify-content-between mb-3 p-3 border rounded"
          key={row.id}
          style={{
            transition: 'all 0.3s ease',
            backgroundColor: 'var(--cui-secondary-bg)',
          }}
        >
          <div className="flex-grow-1">
            <div className="fw-semibold mb-1">
              <CIcon icon={cilBuilding} className="me-2" />
              {row.posisi.nama}
            </div>
            <div className="text-body-secondary small">
              {sub}
              {bag}
              {uker}
            </div>
            {remunPosisi && (
              <CBadge color="info" className="mt-2">
                Grade {remunPosisi.id}
              </CBadge>
            )}
          </div>
          <CButton
            color="danger"
            onClick={(e) => showHapusUnitKerjaModal(e, row.id)}
            size="sm"
            disabled={role === 'keuangan'}
            className="ms-2"
          >
            <CIcon icon={cilDelete} />
          </CButton>
        </div>,
      )
    })
  }

  const showAddJabatanModal = () => {
    setIsOpenAddJabatanModal(true)
  }

  const closeAddJabatanModal = () => {
    setIsOpenAddJabatanModal(false)
  }

  const showAddUnitKerjaModal = () => {
    setIsOpenAddUnitKerjaModal(true)
  }

  const closeAddUnitKerjaModal = () => {
    setIsOpenAddUnitKerjaModal(false)
  }

  const showHapusJabatanModal = (e, id) => {
    setJabatanId(id)
    setIsOpenHapusJabatanModal(true)
  }

  const closeHapusJabatanModal = () => {
    setIsOpenHapusJabatanModal(false)
  }

  const showHapusUnitKerjaModal = (e, id) => {
    setUnitKerjaId(id)
    setIsOpenHapusUnitKerjaModal(true)
  }

  const closeHapusUnitKerjaModal = () => {
    setIsOpenHapusUnitKerjaModal(false)
  }

  return (
    <>
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <div className="d-flex align-items-center">
            <CIcon icon={cilUser} size="lg" className="me-2" />
            <CBadge
              color="light"
              className="text-primary px-3 py-2"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
            >
              {pegawai.statusPegawai.nama}
            </CBadge>
          </div>
        </CCardHeader>
        <CCardBody className="text-center py-4">
          <CCardTitle className="h3 mb-2 fw-bold text-primary">{pegawai.nama}</CCardTitle>
          <CCardText className="text-body-secondary mb-4">
            <CBadge
              color="secondary"
              className="px-3 py-2"
              style={{
                backgroundColor: 'var(--cui-secondary-bg)',
                color: 'var(--cui-body-color)',
                border: '1px solid var(--cui-border-color)',
              }}
            >
              {pegawai.id}
            </CBadge>
          </CCardText>

          <CRow className="g-3">
            {/* Jabatan Section */}
            <CCol md={12} lg={6}>
              <CCard className="h-100 border" style={{ backgroundColor: 'var(--cui-card-bg)' }}>
                <CCardBody>
                  <h6 className="text-uppercase text-body-secondary mb-3 d-flex align-items-center">
                    <CIcon icon={cilBriefcase} className="me-2" />
                    Jabatan Aktif
                  </h6>
                  {!pegawai.jabatanSaatIni ? (
                    <div className="text-center py-3">
                      <p className="text-body-secondary mb-3">Belum ada jabatan aktif</p>
                      <CButton
                        onClick={showAddJabatanModal}
                        disabled={role === 'keuangan'}
                        color="primary"
                        variant="outline"
                        className="rounded-pill"
                      >
                        <CIcon icon={cilPlus} className="me-2" />
                        Tambah Jabatan
                      </CButton>
                    </div>
                  ) : (
                    <div
                      className="p-3 rounded"
                      style={{ backgroundColor: 'var(--cui-secondary-bg)' }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="fw-bold mb-2">
                            {pegawai.jabatanSaatIni.level.jabatan.nama}
                          </div>
                          <div className="text-body-secondary small mb-1">
                            {pegawai.jabatanSaatIni.level.nama}{' '}
                            {pegawai.jabatanSaatIni.sublevel?.nama}
                          </div>
                          {pegawai.jabatanSaatIni.grade &&
                            !remunPosisi &&
                            pegawai.statusPegawai.id !== 3 && (
                              <CBadge color="info" className="mt-2">
                                Grade {pegawai.jabatanSaatIni.grade.id}
                              </CBadge>
                            )}
                        </div>
                        <CButton
                          color="danger"
                          onClick={(e) => showHapusJabatanModal(e, pegawai.jabatanSaatIni.id)}
                          size="sm"
                          disabled={role === 'keuangan'}
                        >
                          <CIcon icon={cilDelete} />
                        </CButton>
                      </div>
                    </div>
                  )}
                </CCardBody>
              </CCard>
            </CCol>

            {/* Unit Kerja Section */}
            <CCol md={12} lg={6}>
              <CCard className="h-100 border" style={{ backgroundColor: 'var(--cui-card-bg)' }}>
                <CCardBody>
                  <h6 className="text-uppercase text-body-secondary mb-3 d-flex align-items-center">
                    <CIcon icon={cilBuilding} className="me-2" />
                    Unit Kerja Aktif
                  </h6>
                  {ukerRow.length === 0 && (
                    <p className="text-body-secondary text-center">Belum ada unit kerja</p>
                  )}
                  <div className="mb-3">{ukerRow}</div>
                  <div className="text-center">
                    <CButton
                      onClick={showAddUnitKerjaModal}
                      disabled={role === 'keuangan'}
                      color="primary"
                      variant="outline"
                      size="sm"
                      className="rounded-pill"
                    >
                      <CIcon icon={cilPlus} className="me-2" />
                      Tambah Unit Kerja
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
        {pegawai.statusAktif.id > 1 && (
          <CCardFooter
            className="text-center border-top"
            style={{
              backgroundColor: 'var(--cui-warning-bg-subtle)',
              borderColor: 'var(--cui-warning-border-subtle) !important',
            }}
          >
            <strong className="text-warning">{pegawai.statusAktif.nama}</strong>
          </CCardFooter>
        )}
      </CCard>
      {isOpenAddJabatanModal ? (
        <AddJabatanModal
          pegawaiId={pegawai.id}
          visible={isOpenAddJabatanModal}
          closeModal={closeAddJabatanModal}
          setVisible={setIsOpenAddJabatanModal}
        />
      ) : (
        ''
      )}
      {isOpenHapusJabatanModal ? (
        <HapusJabatanModal
          pegawaiId={pegawai.id}
          idJab={jabatanId}
          visible={isOpenHapusJabatanModal}
          setVisible={setIsOpenHapusJabatanModal}
          closeModal={closeHapusJabatanModal}
        />
      ) : (
        ''
      )}
      {isOpenAddUnitKerjaModal ? (
        <AddUnitKerjaModal
          pegawaiId={pegawai.id}
          visible={isOpenAddUnitKerjaModal}
          closeModal={closeAddUnitKerjaModal}
          setVisible={setIsOpenAddUnitKerjaModal}
        />
      ) : (
        ''
      )}
      {isOpenHapusUnitKerjaModal ? (
        <HapusUnitKerjaModal
          pegawaiId={pegawai.id}
          unitKerjaId={unitKerjaId}
          visible={isOpenHapusUnitKerjaModal}
          setVisible={setIsOpenHapusUnitKerjaModal}
          closeModal={closeHapusUnitKerjaModal}
        />
      ) : (
        ''
      )}
    </>
  )
}

Header.propTypes = {
  pegawai: PropTypes.object.isRequired,
}

Header.fragments = {
  entry: gql`
    fragment HeaderFragment on Pegawai {
      nama
      jabatanSaatIni {
        id
        level {
          id
          nama
          jabatan {
            id
            nama
          }
        }
        sublevel {
          id
          nama
        }
        grade {
          id
        }
      }
      unitKerjaSaatIni {
        id
        unitKerja {
          id
          nama
        }
        bagian {
          id
          nama
        }
        subbag {
          id
          nama
        }
        posisi {
          id
          nama
        }
        grade {
          id
        }
        isSecondary
      }
    }
  `,
}

export default Header
