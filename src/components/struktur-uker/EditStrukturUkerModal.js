import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CAlert,
  CButton,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import { gql, useMutation } from '@apollo/client'
import SelectGrade from 'src/components/SelectGrade'

const UPDATE_STRUKTUR_UKER = gql`
  mutation UpdateStrukturUnitKerja($id: ID!, $grade: ID!) {
    updateStrukturOrganisasi(id: $id, grade: $grade) {
      code
      success
      message
    }
  }
`

const EditStrukturUkerModal = (props) => {
  console.log('rendering... EditStrukturUkerModal')

  const [grade, setGrade] = useState(props.grade)
  const [errorMessage, setErrorMessage] = useState('')

  const [simpan, { data, loading, error }] = useMutation(UPDATE_STRUKTUR_UKER)

  const submitAction = async () => {
    try {
      await simpan({
        variables: {
          id: props.id,
          grade: grade,
        },
        refetchQueries: ['DaftarStrukturOrganisasi'],
        awaitRefetchQueries: true,
      })
    } catch (e) {
      setErrorMessage(e.message)
    }
  }

  useEffect(() => {
    if (data) {
      if (!data?.updateStrukturOrganisasi.success) {
        setErrorMessage(data.updateStrukturOrganisasi.message)
      } else if (data?.updateStrukturOrganisasi.success) {
        props.setVisible(false)
      }
    }
  }, [data, props])

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)}>
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Edit Struktur Unit Kerja</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <>
          <SelectGrade grade={grade} setGrade={setGrade} />
          {error && (
            <CAlert className="mt-3" color="danger">
              Error: {error.message}
            </CAlert>
          )}
          {errorMessage && (
            <CAlert className="mt-3" color="danger">
              Error: {errorMessage}
            </CAlert>
          )}
        </>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CLoadingButton loading={loading} color="primary" onClick={submitAction}>
          Simpan
        </CLoadingButton>
      </CModalFooter>
    </CModal>
  )
}

EditStrukturUkerModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
  id: PropTypes.string.isRequired,
  grade: PropTypes.string,
}

export default EditStrukturUkerModal
