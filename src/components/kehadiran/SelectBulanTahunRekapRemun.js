import React from 'react'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'
import { namaBulan } from 'src/utils'

const SelectBulanTahunRekapRemun = (props) => {
  const date = new Date()
  let thisYear = date.getFullYear()
  let thisMonth = date.getMonth() + 1

  let options = []
  for (let i = thisMonth; i > 0; i--) {
    if (thisYear === 2024 && i < 6) {
      break
    }
    let opt = {
      label: namaBulan(i) + ' ' + thisYear,
      value: thisYear.toString() + i.toString(),
    }
    options.push(opt)
  }
  if (thisYear > 2024) {
    for (let i = 12; i > 0; i--) {
      const lastYear = thisYear - 1
      let opt = {
        label: namaBulan(i) + ' ' + lastYear,
        value: lastYear.toString() + i.toString(),
      }
      options.push(opt)
    }
  }

  return (
    <CFormSelect
      aria-label="Default select bulan tahun"
      options={options}
      value={props.tahun.toString() + props.bulan.toString()}
      onChange={(e) => props.setTahunBulan(e.target.value)}
    />
  )
}

SelectBulanTahunRekapRemun.propTypes = {
  tahun: PropTypes.number.isRequired,
  setTahunBulan: PropTypes.func,
  bulan: PropTypes.number.isRequired,
}

export default SelectBulanTahunRekapRemun
