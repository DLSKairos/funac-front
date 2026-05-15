import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { Lock, ChevronLeft, ChevronRight, User, Calendar } from 'lucide-react'
import adminService from '../../services/adminService'
import newsModalService from '../../services/newsModalService'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import { formatDate } from '../../utils/formatters'

const passwordSchema = yup.object({
  password_actual: yup.string().required('Contrasena actual requerida'),
  password_nueva: yup.string().required('Nueva contrasena requerida').min(8, 'Minimo 8 caracteres'),
  password_confirmacion: yup
    .string()
    .required('Confirmacion requerida')
    .oneOf([yup.ref('password_nueva')], 'Las contrasenas no coinciden'),
})

const TABS = ['Cambiar Contrasena', 'Logs de Actividad', 'Modal de Noticias']

function PasswordTab() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(passwordSchema) })

  const onSubmit = async (data) => {
    try {
      await adminService.changePassword({
        password_actual: data.password_actual,
        password_nueva: data.password_nueva,
      })
      toast.success('Contrasena actualizada correctamente')
      reset()
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al cambiar la contrasena'
      toast.error(msg)
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Cambiar Contrasena</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Contrasena actual"
          type="password"
          icon={Lock}
          error={errors.password_actual?.message}
          {...register('password_actual')}
        />
        <Input
          label="Nueva contrasena"
          type="password"
          icon={Lock}
          error={errors.password_nueva?.message}
          {...register('password_nueva')}
        />
        <Input
          label="Confirmar nueva contrasena"
          type="password"
          icon={Lock}
          error={errors.password_confirmacion?.message}
          {...register('password_confirmacion')}
        />
        <Button type="submit" loading={isSubmitting}>
          Actualizar contrasena
        </Button>
      </form>
    </div>
  )
}

function LogsTab() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 15

  const fetchLogs = useCallback(() => {
    setLoading(true)
    adminService.getLogs({ page, limit })
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.logs || data?.items || [])
        setLogs(items)
        const total = data?.total || items.length
        setTotalPages(Math.ceil(total / limit) || 1)
      })
      .catch(() => toast.error('Error al cargar logs'))
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const levelClass = {
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Logs de Actividad</h2>
      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No hay logs disponibles</div>
      ) : (
        <div className="space-y-2">
          {logs.map((log, i) => (
            <div
              key={log.id || i}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-sm"
            >
              <div className="flex items-center gap-2 shrink-0">
                <User size={14} className="text-gray-400" />
                <span className="text-gray-600 font-medium text-xs">{log.usuario || log.user || 'Sistema'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 truncate">{log.descripcion || log.mensaje || log.action}</p>
                {log.detalle && <p className="text-xs text-gray-400 mt-0.5 truncate">{log.detalle}</p>}
              </div>
              {log.nivel && (
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${levelClass[log.nivel] || levelClass.info}`}>
                  {log.nivel}
                </span>
              )}
              <div className="flex items-center gap-1 shrink-0 text-xs text-gray-400">
                <Calendar size={11} />
                {formatDate(log.createdAt || log.fecha)}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
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
  )
}

function ModalNoticiaTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    activo: false,
    titulo: '',
    subtitulo: '',
    badge_texto: '',
    highlight_texto: '',
    url_destino: '',
    etiqueta_boton: '',
  })

  useEffect(() => {
    newsModalService
      .getAdminConfig()
      .then((data) => {
        const config = data?.data ?? data
        if (config) {
          setForm({
            activo: config.activo ?? false,
            titulo: config.titulo || '',
            subtitulo: config.subtitulo || '',
            badge_texto: config.badge_texto || '',
            highlight_texto: config.highlight_texto || '',
            url_destino: config.url_destino || '',
            etiqueta_boton: config.etiqueta_boton || '',
          })
        }
      })
      .catch(() => toast.error('Error al cargar la configuración del modal'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await newsModalService.updateConfig(form)
      toast.success('Configuración del modal actualizada correctamente')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al guardar los cambios'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="max-w-lg space-y-5">
      <h2 className="text-lg font-bold text-gray-900 mb-2">Configuración del Modal de Noticias</h2>
      <p className="text-sm text-gray-500 mb-6">
        El modal aparece una vez por sesión del navegador. Si está desactivado, no se mostrará a ningún visitante.
      </p>

      {/* Toggle activo */}
      <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-200">
        <input
          type="checkbox"
          name="activo"
          checked={form.activo}
          onChange={handleChange}
          className="w-4 h-4 accent-funac-navy"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">Modal activo</p>
          <p className="text-xs text-gray-500">
            {form.activo ? 'El modal se mostrará a los visitantes' : 'El modal está desactivado'}
          </p>
        </div>
      </label>

      <Input
        label="Título del modal"
        name="titulo"
        value={form.titulo}
        onChange={handleChange}
        placeholder="Nueva campaña de ayuda"
      />
      <Input
        label="Subtítulo / descripción"
        name="subtitulo"
        value={form.subtitulo}
        onChange={handleChange}
        placeholder="Descripción breve de la novedad..."
      />
      <Input
        label="Texto del badge (etiqueta superior)"
        name="badge_texto"
        value={form.badge_texto}
        onChange={handleChange}
        placeholder="Noticia destacada"
      />
      <Input
        label="Texto destacado (resaltado con ícono)"
        name="highlight_texto"
        value={form.highlight_texto}
        onChange={handleChange}
        placeholder="Hasta el 30 de junio: cada donación será duplicada"
      />
      <Input
        label="URL de destino del botón"
        name="url_destino"
        value={form.url_destino}
        onChange={handleChange}
        placeholder="/donaciones o https://..."
      />
      <Input
        label="Texto del botón de acción"
        name="etiqueta_boton"
        value={form.etiqueta_boton}
        onChange={handleChange}
        placeholder="Quiero ayudar"
      />

      <Button onClick={handleSave} loading={saving}>
        Guardar cambios
      </Button>
    </div>
  )
}

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState(0)
  const tabComponents = [PasswordTab, LogsTab, ModalNoticiaTab]
  const ActiveComponent = tabComponents[activeTab]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Configuracion</h1>
        <p className="text-gray-500 mt-1">Ajustes y seguridad de la cuenta</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 max-w-xl">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === i ? 'bg-white shadow text-funac-navy' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <ActiveComponent />
      </div>
    </div>
  )
}
