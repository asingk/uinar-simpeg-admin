import React, { useEffect, useState } from 'react'
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import { CContainer, CFormSelect, CRow } from '@coreui/react-pro'

const GET_STRUKTUR_ORG = gql`
  query StrukturOrganisasi($unitKerjaId: String, $bagianId: Int, $subbagId: Int) {
    daftarStrukturOrganisasi(unitKerjaId: $unitKerjaId, bagianId: $bagianId, subbagId: $subbagId) {
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
    }
  }
`

const SelectUnitKerja = (props) => {
  const [unitKerjaId, setUnitKerjaId] = useState('')
  const [bagianId, setBagianId] = useState(0)
  const [subbagId, setSubbagId] = useState(0)
  const [posisiId, setPosisiId] = useState('')

  const { data: ukerData, loading, error } = useQuery(GET_STRUKTUR_ORG)

  const [bagStrOrg, { data: bagStrOrgData }] = useLazyQuery(GET_STRUKTUR_ORG)
  const [subbagStrOrg, { data: subbagStrOrgData }] = useLazyQuery(GET_STRUKTUR_ORG)

  useEffect(() => {
    bagStrOrg({ variables: { unitKerjaId: unitKerjaId } })
  }, [bagStrOrg, unitKerjaId])

  useEffect(() => {
    subbagStrOrg({ variables: { unitKerjaId: unitKerjaId, bagianId: bagianId } })
  }, [bagianId, subbagStrOrg, unitKerjaId])

  if (loading) {
    return (
      <div>
        <p className="text-center">Loading..</p>
      </div>
    )
  } else if (error) {
    return (
      <div>
        <p className="text-center">Error: {error.message}</p>
      </div>
    )
  }

  let posisiOptions = [{ label: '-- Pilih Posisi --', value: '' }]
  let unitkerjaOptions = [{ label: '-- Pilih Unit Kerja --', value: '' }]
  ukerData?.daftarStrukturOrganisasi.forEach((row) => {
    if (row.unitKerja) {
      const opt = {
        label: row.unitKerja.nama,
        value: row.unitKerja.id,
      }
      unitkerjaOptions.push(opt)
    } else if (!row.unitKerja && !unitKerjaId) {
      const opt = {
        label: row.posisi.nama,
        value: row.posisi.id,
      }
      posisiOptions.push(opt)
    }
  })
  const unitKerjaOptionUnique = unitkerjaOptions
    .filter((obj, index) => {
      return index === unitkerjaOptions.findIndex((o) => obj.value === o.value)
    })
    .sort((a, b) => {
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }

      // names must be equal
      return 0
    })

  let bagianOptions = [{ label: '-- Pilih Bagian Unit Kerja --', value: '0' }]
  bagStrOrgData?.daftarStrukturOrganisasi.forEach((row) => {
    if (row.bagian) {
      const opt = {
        label: row.bagian.nama,
        value: row.bagian.id,
      }
      bagianOptions.push(opt)
    } else if (!row.bagian && bagianId < 1) {
      const opt = {
        label: row.posisi.nama,
        value: row.posisi.id,
      }
      posisiOptions.push(opt)
    }
  })

  const bagianOptionUnique = bagianOptions
    .filter((obj, index) => {
      return index === bagianOptions.findIndex((o) => obj.value === o.value)
    })
    .sort((a, b) => {
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }

      // names must be equal
      return 0
    })

  let subbagianOptions = [{ label: '-- Pilih Subbagian Unit Kerja --', value: '0' }]
  subbagStrOrgData?.daftarStrukturOrganisasi.forEach((row) => {
    if (row.subbag) {
      const opt = {
        label: row.subbag.nama,
        value: row.subbag.id,
      }
      subbagianOptions.push(opt)
    } else if (!row.subbag && subbagId < 1) {
      const posOpt = {
        label: row.posisi.nama,
        value: row.posisi.id,
      }
      posisiOptions.push(posOpt)
    }
  })

  const subbagianOptionUnique = subbagianOptions
    .filter((obj, index) => {
      return index === subbagianOptions.findIndex((o) => obj.value === o.value)
    })
    .sort((a, b) => {
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }

      // names must be equal
      return 0
    })

  if (subbagId > 0) {
    const subbagChoice = subbagStrOrgData?.daftarStrukturOrganisasi.filter(
      (el) => el.subbag?.id === subbagId,
    )
    subbagChoice?.forEach((row) => {
      const posOpt = {
        label: row.posisi.nama,
        value: row.posisi.id,
      }
      posisiOptions.push(posOpt)
    })
  }

  const pilihUnitKerja = (e) => {
    setPosisiId('')
    setBagianId(0)
    setUnitKerjaId(e.target.value)
  }

  const pilihBagianUnitKerja = (e) => {
    setBagianId(parseInt(e.target.value))
    setPosisiId('')
    setSubbagId(0)
  }

  const pilihSubBagUnitKerja = (e) => {
    setSubbagId(parseInt(e.target.value))
    setPosisiId('')
  }

  const changePosisi = (e) => {
    setPosisiId(e.target.value)
    const strOrg = ukerData.daftarStrukturOrganisasi.find(
      (element) =>
        element.posisi.id === e.target.value &&
        (unitKerjaId ? element.unitKerja?.id === unitKerjaId : element.unitKerja === null) &&
        (bagianId > 0 ? element.bagian?.id === bagianId : element.bagian === null) &&
        (subbagId > 0 ? element.subbag?.id === subbagId : element.subbag === null),
    )
    props.setStrOrgId(strOrg.id)
  }

  return (
    <CContainer className="overflow-hidden">
      <CRow xs={{ gutterY: 2 }}>
        <CFormSelect
          aria-label="Default select unit kerja"
          options={unitKerjaOptionUnique}
          value={unitKerjaId}
          onChange={pilihUnitKerja}
        />
        {unitKerjaId && bagianOptionUnique.length > 1 && (
          <CFormSelect
            aria-label="Default select bagian unit kerja"
            options={bagianOptionUnique}
            value={bagianId}
            onChange={pilihBagianUnitKerja}
          />
        )}
        {bagianId > 0 && subbagianOptionUnique.length > 1 && (
          <CFormSelect
            aria-label="Default select subbagian unit kerja"
            options={subbagianOptionUnique}
            value={subbagId}
            onChange={pilihSubBagUnitKerja}
          />
        )}
        {posisiOptions && (
          <CFormSelect
            aria-label="Default select posisi unit kerja"
            options={posisiOptions}
            value={posisiId}
            onChange={changePosisi}
          />
        )}
      </CRow>
    </CContainer>
  )
}

SelectUnitKerja.propTypes = {
  setStrOrgId: PropTypes.func,
}

export default SelectUnitKerja
