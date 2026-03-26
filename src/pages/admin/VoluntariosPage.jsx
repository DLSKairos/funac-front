import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Search, Eye, Trash2, Download, ChevronLeft, ChevronRight, FileText, Calendar } from 'lucide-react'
import adminService from '../../services/adminService'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Spinner from '../../components/ui/Spinner'
import { formatDate, formatPhone } from '../../utils/formatters'

const ESTADO_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'rechazado', label: 'Rechazado' },
]

const AREAS_LABEL = {
  construccion: 'Construccion',
  educacion: 'Educacion',
  salud: 'Salud',
  recaudacion: 'Recaudacion',
  capacitacion: 'Capacitacion',
  comunicaciones: 'Comunicaciones',
  juridico: 'Juridico',
  administrativo: 'Administrativo',
}

export default function VoluntariosPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  const fetchVolunteers = useCallback(() => {
    setLoading(true)
    adminService.getVolunteers({ search, estado, page, limit })
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.voluntarios || data?.items || [])
        setVolunteers(items)
        const total = data?.total || items.length
        setTotalPages(Math.ceil(total / limit) || 1)
      })
      .catch(() => toast.error('Error al cargar voluntarios'))
      .finally(() => setLoading(false))
  }, [search, estado, page])

  useEffect(() => { fetchVolunteers() }, [fetchVolunteers])

  const openDetail = async (id) => {
    try {
      const data = await adminService.getVolunteer(id)
      setSelected(data)
      setModalOpen(true)
    } catch {
      toast.error('Error al cargar detalles')
    }
  }

  const updateStatus = async (id, newEstado) => {
    setUpdatingId(id)
    try {
      await adminService.updateVolunteerStatus(id, { estado: newEstado })
      toast.success(`Estado actualizado a "${newEstado}"`)
      fetchVolunteers()
      if (selected?.id === id) setSelected((p) => ({ ...p, estado: newEstado }))
    } catch {
      toast.error('Error al actualizar estado')
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteVolunteer = async (id) => {
    if (!confirm('Eliminar este voluntario permanentemente?')) return
    setDeletingId(id)
    try {
      await adminService.deleteVolunteer(id)
      toast.success('Voluntario eliminado')
      setModalOpen(false)
      fetchVolunteers()
    } catch {
      toast.error('Error al eliminar')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Voluntarios</h1>
        <p className="text-gray-500 mt-1">Gestiona los registros de voluntarios</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Buscar por nombre, email o ciudad..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={ESTADO_OPTIONS}
              value={estado}
              onChange={(e) => { setEstado(e.target.value); setPage(1) }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : volunteers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No se encontraron voluntarios</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Nombre</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Ciudad</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Profesion</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Estado</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Fecha</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {volunteers.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{v.nombre_completo}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{v.email}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{v.ciudad}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{v.profesion_ocupacion || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={v.estado || 'nuevo'} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{formatDate(v.createdAt || v.fecha_registro)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openDetail(v.id)}
                        className="p-1.5 text-funac-navy hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Pagina {page} de {totalPages}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} icon={ChevronLeft}>
                Anterior
              </Button>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Siguiente
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Detalle del Voluntario" size="lg">
        {selected && (
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Nombre', value: selected.nombre_completo },
                { label: 'Cedula', value: selected.cedula },
                { label: 'Email', value: selected.email },
                { label: 'Telefono', value: formatPhone(selected.telefono) || selected.telefono },
                { label: 'Ciudad', value: selected.ciudad },
                { label: 'Direccion', value: selected.direccion || '—' },
                { label: 'Nivel estudios', value: selected.nivel_estudios || '—' },
                { label: 'Profesion', value: selected.profesion_ocupacion || '—' },
                { label: 'Disponibilidad', value: selected.disponibilidad_horaria || '—' },
                { label: 'Fecha registro', value: formatDate(selected.createdAt || selected.fecha_registro) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                  <p className="text-sm text-gray-800 font-medium">{value}</p>
                </div>
              ))}
            </div>

            {selected.motivacion && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 font-medium mb-1">Motivacion</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.motivacion}</p>
              </div>
            )}

            {selected.habilidades_especiales && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 font-medium mb-1">Habilidades especiales</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.habilidades_especiales}</p>
              </div>
            )}

            {selected.areas_interes?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 font-medium mb-2">Areas de interes</p>
                <div className="flex flex-wrap gap-2">
                  {selected.areas_interes.map((area) => (
                    <span key={area} className="px-2.5 py-1 bg-blue-100 text-funac-navy rounded-lg text-xs font-medium">
                      {AREAS_LABEL[area] || area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Estado actual */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-400 font-medium">Estado actual:</span>
              <Badge variant={selected.estado || 'nuevo'} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
              {['contactado', 'aprobado', 'rechazado'].map((est) => (
                <Button
                  key={est}
                  size="sm"
                  variant={
                    est === 'aprobado' ? 'primary' :
                    est === 'rechazado' ? 'danger' : 'secondary'
                  }
                  loading={updatingId === selected.id}
                  disabled={selected.estado === est}
                  onClick={() => updateStatus(selected.id, est)}
                >
                  {est.charAt(0).toUpperCase() + est.slice(1)}
                </Button>
              ))}
              {selected.cv_url && (
                <a href={selected.cv_url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" icon={FileText}>Ver CV</Button>
                </a>
              )}
              <Button
                size="sm"
                variant="danger"
                loading={deletingId === selected.id}
                icon={Trash2}
                onClick={() => deleteVolunteer(selected.id)}
                className="ml-auto"
              >
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
