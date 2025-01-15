import React from 'react'
import { useQuery, gql } from '@apollo/client'
import PropTypes from 'prop-types'
import { CFormSelect } from '@coreui/react-pro'

const GET_DAFTAR_GRADE = gql`
  query DaftarGradeRemun {
    daftarGradeRemun {
      id
    }
  }
`

const SelectGrade = (props) => {
  const { loading, error, data } = useQuery(GET_DAFTAR_GRADE)

  if (loading) {
    return <p className="text-center">Loading..</p>
  }
  if (error) {
    return <p className="text-center">Error.. :-(</p>
  }

  let options = [{ label: '-- Pilih Grade --', value: '' }]
  data.daftarGradeRemun.forEach((row) => {
    let opt = {
      label: row.id,
      value: row.id,
    }
    options.push(opt)
  })

  return (
    <CFormSelect
      aria-label="Default select grade"
      defaultValue={props.grade}
      options={options}
      onChange={(e) => props.setGrade(e.target.value)}
    />
  )
}

SelectGrade.propTypes = {
  grade: PropTypes.string,
  setGrade: PropTypes.func,
}

export default SelectGrade
