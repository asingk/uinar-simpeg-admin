import React, { useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilPlus } from '@coreui/icons'
import { gql, useQuery } from '@apollo/client'
import { CButton, CCollapse, CMultiSelect, CSmartTable } from '@coreui/react-pro'
import AddStrukturJabatanModal from 'src/components/struktur-jabatan/AddStrukturJabatanModal'
import EditStrukturJabatanModal from 'src/components/struktur-jabatan/EditStrukturJabatanModal'
import DeleteStrukturJabatanModal from 'src/components/struktur-jabatan/DeleteStrukturJabatanModal'

const GET_JABATAN_PEGAWAI = gql`
  query DaftarStrukturJabatan($levelId: Int, $subLevelId: Int) {
    daftarStrukturJabatan(levelId: $levelId, sublevelId: $subLevelId) {
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
  }
`

const StrukturJabatan = () => {
  console.debug('rendering... StrukturJabatan')

  const [isEdit, setIsEdit] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [id, setId] = useState('')
  const [grade, setGrade] = useState('')
  const [details, setDetails] = useState([])

  const { data } = useQuery(GET_JABATAN_PEGAWAI)
  const editModalAction = (id, grade) => {
    setId(id)
    setGrade(grade)
    setIsEdit(true)
  }
  const deleteModalAction = (id) => {
    setId(id)
    setIsDelete(true)
  }
  const columns = [
    {
      key: 'jabatan',
      filter: (values, onChange) => {
        const unique = [...new Set(values)].sort()
        return (
          <CMultiSelect
            size="sm"
            onChange={(selected) => {
              const _selected = selected.map((element) => {
                return element.value
              })
              onChange((value) => {
                return Array.isArray(_selected) && _selected.length > 0
                  ? _selected.includes(value.toLowerCase())
                  : true
              })
            }}
            options={unique.map((element) => {
              return {
                value: element.toLowerCase(),
                label: element,
              }
            })}
          />
        )
      },
      sorter: false,
    },
    {
      key: 'level',
    },
    {
      key: 'sublevel',
    },
    {
      key: 'grade',
    },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]

  let items = []
  if (data?.daftarStrukturJabatan.length > 0) {
    data.daftarStrukturJabatan.forEach((row) => {
      const item = {
        id: row.id,
        jabatan: row.level.jabatan.nama,
        level: row.level.nama,
        sublevel: row.sublevel?.nama || '',
        grade: row.grade?.id || '',
      }
      items.push(item)
    })
  }

  const toggleDetails = (id) => {
    const position = details.indexOf(id)
    let newDetails = [...details]
    if (position === -1) {
      newDetails = [...details, id]
    } else {
      newDetails.splice(position, 1)
    }
    setDetails(newDetails)
  }

  return (
    <>
      <h1 className="text-center">Struktur Jabatan</h1>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <CButton color="primary" onClick={() => setIsAdd(true)}>
          <CIcon icon={cilPlus} /> Tambah
        </CButton>
      </div>
      <CSmartTable
        items={items}
        columns={columns}
        columnFilter
        columnSorter
        itemsPerPageSelect
        itemsPerPage={10}
        pagination
        scopedColumns={{
          show_details: (item) => {
            return (
              <td className="py-2">
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => {
                    toggleDetails(item.id)
                  }}
                >
                  {details.includes(item.id) ? 'Hide' : 'Show'}
                </CButton>
              </td>
            )
          },
          details: (item) => {
            return (
              <CCollapse visible={details.includes(item.id)}>
                <div className="p-3">
                  <CButton
                    size="sm"
                    color="warning"
                    onClick={() => editModalAction(item.id, item.grade?.id)}
                  >
                    <CIcon icon={cilPencil} /> Ubah
                  </CButton>
                  <CButton
                    size="sm"
                    color="danger"
                    className="ms-1"
                    onClick={() => deleteModalAction(item.id)}
                  >
                    <CIcon icon={cilDelete} /> Hapus
                  </CButton>
                </div>
              </CCollapse>
            )
          },
        }}
        tableProps={{
          responsive: true,
          hover: true,
        }}
      />
      {isAdd && <AddStrukturJabatanModal visible={isAdd} setVisible={setIsAdd} />}
      {isEdit && (
        <EditStrukturJabatanModal id={id} grade={grade} visible={isEdit} setVisible={setIsEdit} />
      )}
      {isDelete && (
        <DeleteStrukturJabatanModal visible={isDelete} setVisible={setIsDelete} id={id} />
      )}
    </>
  )
}

export default StrukturJabatan
