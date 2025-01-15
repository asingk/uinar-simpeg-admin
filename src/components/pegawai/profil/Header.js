import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPlus } from '@coreui/icons'
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
  CListGroup,
  CListGroupItem,
} from '@coreui/react-pro'
import { gql } from '@apollo/client'
import { KeycloakContext } from 'src/context'

// untuk format currency
const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

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
        <div className="mb-1" key={row.id}>
          {row.posisi.nama + ' '}
          {sub}
          {bag}
          {uker}{' '}
          {remunPosisi
            ? '; Grade ' + remunPosisi.id + ', Remun: ' + formatter.format(remunPosisi.remun)
            : ''}{' '}
          <CButton
            color="danger"
            onClick={(e) => showHapusUnitKerjaModal(e, row.id)}
            size="sm"
            disabled={role === 'keuangan'}
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
      <CCard className="text-center">
        <CCardHeader>{pegawai.statusPegawai.nama}</CCardHeader>
        <CCardBody>
          <CCardTitle>{pegawai.nama}</CCardTitle>
          <CCardText>{pegawai.id}</CCardText>
          <CListGroup flush>
            <CListGroupItem>
              {!pegawai.jabatanSaatIni ? (
                <CButton
                  onClick={showAddJabatanModal}
                  disabled={role === 'keuangan'}
                  color="primary"
                >
                  <CIcon icon={cilPlus} /> Tambah Jabatan Aktif
                </CButton>
              ) : (
                <div className="mb-1">
                  {pegawai.jabatanSaatIni.level.jabatan.nama} - {pegawai.jabatanSaatIni.level.nama}{' '}
                  {pegawai.jabatanSaatIni.sublevel?.nama}
                  {pegawai.jabatanSaatIni.grade && !remunPosisi && pegawai.statusPegawai.id !== 3
                    ? '; Grade ' +
                      pegawai.jabatanSaatIni.grade.id +
                      ', Remun: ' +
                      formatter.format(pegawai.jabatanSaatIni.grade.remun)
                    : ''}{' '}
                  <CButton
                    color="danger"
                    onClick={(e) => showHapusJabatanModal(e, pegawai.jabatanSaatIni.id)}
                    size="sm"
                    disabled={role === 'keuangan'}
                  >
                    <CIcon icon={cilDelete} />
                  </CButton>
                </div>
              )}
            </CListGroupItem>
            <CListGroupItem>
              {ukerRow}
              <CButton
                onClick={showAddUnitKerjaModal}
                disabled={role === 'keuangan'}
                color="primary"
              >
                <CIcon icon={cilPlus} /> Tambah Unit Kerja Aktif
              </CButton>
            </CListGroupItem>
          </CListGroup>
        </CCardBody>
        {pegawai.statusAktif.id > 1 && (
          <CCardFooter className="text-medium-emphasis">{pegawai.statusAktif.nama}</CCardFooter>
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
          remun
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
          remun
        }
        isSecondary
      }
    }
  `,
}

export default Header
