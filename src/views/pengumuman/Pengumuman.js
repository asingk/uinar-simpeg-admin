import React, { useContext, useEffect, useState } from 'react'
import { CAlert, CButton, CSpinner, CTable } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilPlus, cilTrash } from '@coreui/icons'
import axios from 'axios'
import DeletePengumumanModal from 'src/components/pengumuman/DeletePengumumanModal'
import AddPengumumanModal from 'src/components/pengumuman/AddPengumumanModal'
import EditPengumumanModal from 'src/components/pengumuman/EditPengumumanModal'
import { KeycloakContext } from 'src/context'

const Pengumuman = () => {
  console.debug('rendering... Pengumuman')

  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [isDelete, setIsDelete] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [id, setId] = useState('')
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [jenisJabatan, setJenisJabatan] = useState([])
  const [message, setMessage] = useState('')
  const [nama, setNama] = useState('')
  const [statusPegawai, setStatusPegawai] = useState([])

  const keycloak = useContext(KeycloakContext)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SIMPEG_REST_URL}/pengumuman`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      .then((response) => {
        setData(response.data?.pengumuman)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [toggle])

  const onDeleted = () => {
    setIsDelete(false)
    setToggle(!toggle)
  }

  const onDelete = (id) => {
    setId(id)
    setIsDelete(true)
  }

  const onAdded = () => {
    setIsAdd(false)
    setToggle(!toggle)
  }

  const onEdit = (id, nama, message, isActive, stat, jenisJab) => {
    setId(id)
    setNama(nama)
    setMessage(message)
    setIsActive(isActive)
    setStatusPegawai(stat.map((row) => row.id))
    setJenisJabatan(jenisJab)
    setIsEdit(true)
  }

  const onEdited = () => {
    setIsEdit(false)
    setToggle(!toggle)
  }

  const columns = [
    {
      key: 'nama',
      _props: { scope: 'col' },
    },
    {
      key: 'statusPegawai',
      label: 'Status Pegawai',
      _props: { scope: 'col' },
    },
    {
      key: 'jenisJabatan',
      label: 'Jenis Jabatan',
      _props: { scope: 'col' },
    },
    {
      key: 'isActive',
      label: '',
      _props: { scope: 'col' },
    },
    {
      key: 'action',
      label: '',
      _props: { scope: 'col' },
    },
  ]
  let items = []
  if (data) {
    data.forEach((row) => {
      const item = {
        nama: row.nama,
        statusPegawai: row.statusPegawai.map((row) => row.nama).join(', '),
        jenisJabatan: row.jenisJabatan.join(', '),
        isActive: row.isActive ? (
          <div className="badge bg-success text-wrap" style={{ width: '6rem' }}>
            Aktif
          </div>
        ) : (
          <div className="badge bg-danger text-wrap" style={{ width: '6rem' }}>
            Tidak Aktif
          </div>
        ),
        action: (
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              color="success"
              variant="outline"
              size="sm"
              onClick={() =>
                onEdit(
                  row.id,
                  row.nama,
                  row.message,
                  row.isActive,
                  row.statusPegawai,
                  row.jenisJabatan,
                )
              }
            >
              <CIcon icon={cilPencil} />
            </CButton>
            <CButton color="danger" variant="outline" size="sm" onClick={() => onDelete(row.id)}>
              <CIcon icon={cilTrash} />
            </CButton>
          </div>
        ),
        _cellProps: { id: { scope: 'row' } },
      }
      items.push(item)
    })
  } else {
    const item = {
      tanggal: 'Tidak ada data',
      _cellProps: { id: { scope: 'row' }, tanggal: { colSpan: 7 } },
    }
    items.push(item)
  }

  let table

  if (loading) {
    table = (
      <div className="d-flex justify-content-center">
        <CSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </CSpinner>
      </div>
    )
  } else if (error) {
    table = <CAlert color="danger">Error: {error}</CAlert>
  } else {
    table = <CTable responsive striped columns={columns} items={items} className="mb-4 mt-2" />
  }

  return (
    <div className="mb-4">
      <h1 className="text-center mb-3">Pengumuman</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah
        </CButton>
      </div>
      {table}
      {isDelete && (
        <DeletePengumumanModal
          id={id}
          visible={isDelete}
          setVisible={setIsDelete}
          done={onDeleted}
        />
      )}
      {isAdd && <AddPengumumanModal visible={isAdd} setVisible={setIsAdd} done={onAdded} />}
      {isEdit && (
        <EditPengumumanModal
          visible={isEdit}
          setVisible={setIsEdit}
          id={id}
          isActive={isActive}
          jenisJabatan={jenisJabatan}
          message={message}
          nama={nama}
          statusPegawai={statusPegawai}
          done={onEdited}
        />
      )}
    </div>
  )
}

export default Pengumuman
