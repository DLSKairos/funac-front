import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Search, Eye, Mail, Download, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import adminService from '../../services/adminService'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Spinner from '../../components/ui/Spinner'
import { formatDate, formatCurrency } from '../../utils/formatters'

const ESTADO_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'exitosa', label: 'Exitosa' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'fallida', label: 'Fallida' },
]

export default function DonacionesPage() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [resendingId, setResendingId] = useState(null)
  const [exporting, setExporting] = useState(false)

  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [montoMin, setMontoMin] = useState('')
  const [montoMax, setMontoMax] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  const fetchDonations = useCallback(() => {
    setLoading(true)
    const params = { page, limit }
    if (search) params.search = search
    if (estado) params.estado = estado
    if (fechaDesde) params.fecha_desde = fechaDesde
    if (fechaHasta) params.fecha_hasta = fechaHasta
    if (montoMin) params.monto_min = montoMin
    if (montoMax) params.monto_max = montoMax

    adminService.getDonations(params)
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.donaciones || data?.items || [])
        setDonations(items)
        const total = data?.total || items.length
        setTotalPages(Math.ceil(total / limit) || 1)
      })
      .catch(() => toast.error('Error al cargar donaciones'))
      .finally(() => setLoading(false))
  }, [search, estado, fechaDesde, fechaHasta, montoMin, montoMax, page])

  useEffect(() => { fetchDonations() }, [fetchDonations])

  const openDetail = async (id) => {
    try {
      const data = await adminService.getDonation(id)
      setSelected(data)
      setModalOpen(true)
    } catch {
      toast.error('Error al cargar detalles')
    }
  }

  const resendReceipt = async (id) => {
    setResendingId(id)
    try {
      await adminService.resendReceipt(id)
      toast.success('Comprobante reenviado al donante')
    } catch {
      toast.error('Error al reenviar comprobante')
    } finally {
      setResendingId(null)
    }
  }

  const exportExcel = async () => {
    setExporting(true)
    try {
      const blob = await adminService.exportDonations({ estado, fecha_desde: fechaDesde, fecha_hasta: fechaHasta })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `donaciones_${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Exportacion completada')
    } catch {
      toast.error('Error al exportar')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Donaciones</h1>
          <p className="text-gray-500 mt-1">Historial de donaciones recibidas</p>
        </div>
        <Button size="sm" variant="secondary" loading={exporting} icon={Download} onClick={exportExcel}>
          Exportar Excel
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Select
            options={ESTADO_OPTIONS}
            value={estado}
            onChange={(e) => { setEstado(e.target.value); setPage(1) }}
          />
          <Input
            type="date"
            label=""
            placeholder="Fecha desde"
            value={fechaDesde}
            onChange={(e) => { setFechaDesde(e.target.value); setPage(1) }}
          />
          <Input
            type="date"
            value={fechaHasta}
            onChange={(e) => { setFechaHasta(e.target.value); setPage(1) }}
          />
          <Input
            type="number"
            placeholder="Monto minimo"
            value={montoMin}
            onChange={(e) => { setMontoMin(e.target.value); setPage(1) }}
          />
          <Input
            type="number"
            placeholder="Monto maximo"
            value={montoMax}
            onChange={(e) => { setMontoMax(e.target.value); setPage(1) }}
          />
          <Button size="sm" variant="ghost" icon={RefreshCw} onClick={() => { setSearch(''); setEstado(''); setFechaDesde(''); setFechaHasta(''); setMontoMin(''); setMontoMax(''); setPage(1) }}>
            Limpiar filtros
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : donations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No se encontraron donaciones</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Donante</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Monto</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Estado</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Recurrente</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Fecha</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{d.nombre_completo}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{d.email}</td>
                    <td className="px-4 py-3 font-semibold text-funac-orange">{formatCurrency(d.monto)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={d.estado || 'pendiente'} />
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.recurrente ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {d.recurrente ? 'Si' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{formatDate(d.createdAt || d.fecha)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openDetail(d.id)}
                          className="p-1.5 text-funac-navy hover:bg-blue-50 rounded-lg"
                          title="Ver detalles"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => resendReceipt(d.id)}
                          disabled={resendingId === d.id || d.estado !== 'exitosa'}
                          className="p-1.5 text-funac-green hover:bg-green-50 rounded-lg disabled:opacity-30"
                          title="Reenviar comprobante"
                        >
                          {resendingId === d.id ? <Spinner size="sm" color="text-funac-green" /> : <Mail size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Pagina {page} de {totalPages}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} icon={ChevronLeft}>
                Anterior
              </Button>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Siguiente <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Detalle de Donacion" size="md">
        {selected && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Donante', value: selected.nombre_completo },
                { label: 'Email', value: selected.email },
                { label: 'Cedula', value: selected.cedula },
                { label: 'Telefono', value: selected.telefono || '—' },
                { label: 'Monto', value: formatCurrency(selected.monto) },
                { label: 'Estado', value: <Badge variant={selected.estado} /> },
                { label: 'Recurrente', value: selected.recurrente ? 'Si' : 'No' },
                { label: 'Referencia', value: selected.referencia || '—' },
                { label: 'Muro de donantes', value: selected.mostrar_en_muro ? 'Si' : 'No' },
                { label: 'Fecha', value: formatDate(selected.createdAt || selected.fecha) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                  <div className="text-sm text-gray-800 font-medium">{value}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <Button
                size="sm"
                variant="secondary"
                icon={Mail}
                loading={resendingId === selected.id}
                disabled={selected.estado !== 'exitosa'}
                onClick={() => resendReceipt(selected.id)}
              >
                Reenviar comprobante
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
