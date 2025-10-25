import React from 'react'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'
import { namaBulan } from 'src/utils'

const SelectBulanTahunUpload = (props) => {
  const selectChange = (e) => {
    props.setSelect(e.target.value.substring(4), e.target.value.substring(0, 4))
  }

  // Gunakan parameter dari props atau default ke tanggal sekarang
  const date = new Date()
  const defaultYear = date.getFullYear()
  const defaultMonth = date.getMonth() + 1

  const startYear = props.startYear || defaultYear
  const startMonth = props.startMonth || defaultMonth
  const endYear = props.endYear || defaultYear - 1
  const endMonth = props.endMonth || 1

  let options = [
    {
      label: '-- Pilih Periode --',
      value: '',
    },
  ]

  // Loop dari tahun dan bulan mulai sampai tahun dan bulan akhir
  let currentYear = startYear
  let currentMonth = startMonth

  while (currentYear > endYear || (currentYear === endYear && currentMonth >= endMonth)) {
    let opt = {
      label: namaBulan(currentMonth) + ' ' + currentYear,
      value: currentYear.toString() + currentMonth.toString(),
    }

    options.push(opt)

    // Mundur ke bulan sebelumnya
    currentMonth--
    if (currentMonth < 1) {
      currentMonth = 12
      currentYear--
    }
  }

  return (
    <CFormSelect
      aria-describedby="Default select bulan tahun"
      options={options}
      onChange={(e) => selectChange(e)}
    />
  )
}

SelectBulanTahunUpload.propTypes = {
  setSelect: PropTypes.func,
  startYear: PropTypes.number, // Tahun mulai (default: tahun sekarang)
  startMonth: PropTypes.number, // Bulan mulai (default: bulan sekarang)
  endYear: PropTypes.number, // Tahun akhir (default: tahun lalu)
  endMonth: PropTypes.number, // Bulan akhir (default: 1/Januari)
}

export default SelectBulanTahunUpload
