import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  CAlert,
  CButton,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSwitch,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react-pro'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { KeycloakContext } from 'src/context'

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
}

const AddPengumumanModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [nama, setNama] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [pesan, setPesan] = useState('')
  const [statusPegawai, setStatusPegawai] = useState([])
  const [jenisJabatan, setJenisJabatan] = useState([])

  const keycloak = useContext(KeycloakContext)

  const handleStatusPegawai = (e) => {
    // Destructuring
    const { value, checked } = e.target

    // Case 1 : The user checks the box
    if (checked) {
      // stat.push(Number(value))
      setStatusPegawai([...statusPegawai, Number(value)])
    }

    // Case 2  : The user unchecks the box
    else {
      setStatusPegawai(statusPegawai.filter((e) => e !== Number(value)))
    }
  }

  const handleJenisJabatan = (e) => {
    const { value, checked } = e.target

    // Case 1 : The user checks the box
    if (checked) {
      // jenisJab.push(value)
      setJenisJabatan([...jenisJabatan, value])
    }

    // Case 2  : The user unchecks the box
    else {
      setJenisJabatan(jenisJabatan.filter((e) => e !== value))
    }
  }

  let modalBody = (
    <CForm>
      <CFormInput
        label="Nama"
        id="inputNama"
        type="text"
        className="mb-3"
        onChange={(e) => setNama(e.target.value)}
      />
      <div className="mb-3">
        <label>Status Pegawai</label>
        <br />
        <CFormCheck
          inline
          id="inlineCheckbox1"
          value="1"
          label="PNS"
          checked={statusPegawai.includes(1)}
          onChange={handleStatusPegawai}
        />
        <CFormCheck
          inline
          id="inlineCheckbox2"
          value="2"
          label="CPNS"
          checked={statusPegawai.includes(2)}
          onChange={handleStatusPegawai}
        />
        <CFormCheck
          inline
          id="inlineCheckbox3"
          value="5"
          label="PPPK"
          checked={statusPegawai.includes(5)}
          onChange={handleStatusPegawai}
        />
        <CFormCheck
          inline
          id="inlineCheckbox4"
          value="4"
          label="PNS DPB"
          checked={statusPegawai.includes(4)}
          onChange={handleStatusPegawai}
        />
        <CFormCheck
          inline
          id="inlineCheckbox5"
          value="3"
          label="Non ASN"
          checked={statusPegawai.includes(3)}
          onChange={handleStatusPegawai}
        />
      </div>
      <div className="mb-3">
        <label>Jenis Jabatan</label>
        <br />
        <CFormCheck
          inline
          id="inlineCheckbox6"
          value="DS"
          label="DS"
          checked={jenisJabatan.includes('DS')}
          onChange={handleJenisJabatan}
        />
        <CFormCheck
          inline
          id="inlineCheckbox7"
          value="DT"
          label="DT"
          checked={jenisJabatan.includes('DT')}
          onChange={handleJenisJabatan}
        />
        <CFormCheck
          inline
          id="inlineCheckbox8"
          value="Tendik"
          label="Tendik"
          checked={jenisJabatan.includes('Tendik')}
          onChange={handleJenisJabatan}
        />
      </div>
      <label className="mb-2">Pesan</label>
      <ReactQuill
        modules={modules}
        theme="snow"
        placeholder="Content goes here..."
        onChange={setPesan}
      />
      <CFormSwitch
        label="Aktif"
        id="formSwitchCheckDefault"
        className="mt-3"
        onChange={() => setIsActive(!isActive)}
      />
      {errorMessage && (
        <CAlert className="mt-3" color="danger">
          {errorMessage}
        </CAlert>
      )}
    </CForm>
  )

  if (loading) {
    modalBody = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    modalBody = <CAlert color="danger">Gagal! Coba lagi?</CAlert>
  }

  async function tambahAction(event) {
    event.preventDefault()
    if (statusPegawai.length < 1 || jenisJabatan.length < 1) {
      setErrorMessage('status pejabat dan jenis jabatan wajib dipilih')
      return
    }
    try {
      setLoading(true)
      await axios.post(
        `${import.meta.env.VITE_SIMPEG_REST_URL}/pengumuman`,
        {
          isActive: isActive,
          nama: nama,
          message: pesan,
          statusPegawaiId: statusPegawai,
          jenisJabatan: jenisJabatan,
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        },
      )
      setLoading(false)
      props.done()
    } catch (error) {
      if (error.response) {
        // The client was given an error response (5xx, 4xx)
        setLoading(false)
        // setErrorResp(true)
        setErrorMessage(error.response.data.message)
      } else if (error.request) {
        // The client never received a response, and the request was never left
        setLoading(false)
        setError(true)
      } else {
        // Anything else
        setLoading(false)
        setError(true)
      }
    }
  }

  return (
    <CModal visible={props.visible} onClose={() => props.setVisible(false)} size="lg">
      <CModalHeader onClose={() => props.setVisible(false)}>
        <CModalTitle>Tambah Pengumuman</CModalTitle>
      </CModalHeader>
      <CModalBody>{modalBody}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => props.setVisible(false)}>
          Batal
        </CButton>
        <CButton type="submit" color="primary" onClick={tambahAction}>
          Simpan
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

AddPengumumanModal.propTypes = {
  done: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func,
}

export default AddPengumumanModal
