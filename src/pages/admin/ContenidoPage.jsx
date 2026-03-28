import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { Trash2, Upload, Plus, Save, Facebook, Instagram, Twitter, Youtube, Linkedin, MessageCircle } from 'lucide-react'
import adminService from '../../services/adminService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Spinner from '../../components/ui/Spinner'
import IconPicker from '../../components/ui/IconPicker'
import { formatFileSize } from '../../utils/formatters'

const TABS = ['Paginas', 'Carrusel', 'PDFs', 'Redes Sociales', 'WhatsApp']

// ─── Páginas Tab ─────────────────────────────────────────────────────────────
const PAGES_CONFIG = [
  { key: 'quienes_somos', label: 'Quienes Somos' },
  { key: 'mision_vision', label: 'Mision y Vision' },
  { key: 'valores',       label: 'Valores' },
]

function PaginasTab() {
  const [selectedPage, setSelectedPage] = useState('quienes_somos')
  const [secciones, setSecciones] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadPage = (pagina) => {
    setLoading(true)
    adminService.getAdminPageContent(pagina)
      .then((rows) => {
        if (pagina === 'mision_vision') {
          const m = rows.find((r) => r.seccion === 'mision')
          const v = rows.find((r) => r.seccion === 'vision')
          setSecciones([
            { seccion: 'mision',  contenido: m?.contenido || '', orden: 0, activo: true, icono: m?.icono || null },
            { seccion: 'vision',  contenido: v?.contenido || '', orden: 1, activo: true, icono: v?.icono || null },
          ])
        } else if (pagina === 'quienes_somos') {
          const get = (key) => rows.find((r) => r.seccion === key)
          const objs = rows
            .filter((r) => r.seccion.startsWith('objetivo_') && r.seccion !== 'objetivo_social')
            .sort((a, b) => a.orden - b.orden)
          setSecciones([
            { seccion: 'quienes_somos',   contenido: get('quienes_somos')?.contenido   || '', orden: 0, activo: true, icono: get('quienes_somos')?.icono   || null },
            { seccion: 'objetivo_social', contenido: get('objetivo_social')?.contenido || '', orden: 1, activo: true, icono: get('objetivo_social')?.icono || null },
            ...(objs.length > 0
              ? objs.map((o, i) => ({ ...o, orden: i + 2 }))
              : [{ seccion: 'objetivo_1', contenido: '', orden: 2, activo: true }]
            ),
          ])
        } else if (!rows?.length) {
          setSecciones([{ seccion: 'seccion_1', contenido: '', orden: 0, activo: true, icono: null }])
        } else {
          setSecciones(rows.map((r) => ({ ...r, icono: r.icono || null })))
        }
      })
      .catch(() => toast.error('Error al cargar contenido'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadPage(selectedPage) }, [selectedPage])

  const handleChange = (idx, field, value) => {
    setSecciones((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  const addSection = () => {
    setSecciones((prev) => [...prev, { seccion: '', contenido: '', orden: prev.length, activo: true }])
  }

  const removeSection = (idx) => {
    setSecciones((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    const invalid = secciones.some((s) => !s.seccion.trim())
    if (invalid) { toast.error('Cada seccion debe tener un nombre'); return }
    setSaving(true)
    try {
      await adminService.updatePage(selectedPage, { secciones })
      toast.success('Pagina guardada correctamente')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Editar paginas</h2>
        <Button onClick={handleSave} loading={saving} icon={Save}>Guardar cambios</Button>
      </div>

      {/* Selector de página */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {PAGES_CONFIG.map((p) => (
          <button
            key={p.key}
            onClick={() => setSelectedPage(p.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
              selectedPage === p.key
                ? 'border-funac-navy bg-funac-navy text-white'
                : 'border-gray-200 text-gray-600 hover:border-funac-navy'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : selectedPage === 'quienes_somos' ? (
        /* ── Formulario estructurado para Quiénes Somos ── */
        <div className="space-y-6 max-w-2xl">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-sm font-semibold text-gray-700">Quienes Somos</p>
              <IconPicker
                value={secciones.find((s) => s.seccion === 'quienes_somos')?.icono || null}
                onChange={(icon) => handleChange(secciones.findIndex((s) => s.seccion === 'quienes_somos'), 'icono', icon)}
              />
            </div>
            <Textarea
              rows={5}
              value={secciones.find((s) => s.seccion === 'quienes_somos')?.contenido || ''}
              onChange={(e) => handleChange(secciones.findIndex((s) => s.seccion === 'quienes_somos'), 'contenido', e.target.value)}
              placeholder="Describe quienes son como fundacion..."
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-sm font-semibold text-gray-700">Objetivo Social</p>
              <IconPicker
                value={secciones.find((s) => s.seccion === 'objetivo_social')?.icono || null}
                onChange={(icon) => handleChange(secciones.findIndex((s) => s.seccion === 'objetivo_social'), 'icono', icon)}
              />
            </div>
            <Textarea
              rows={4}
              value={secciones.find((s) => s.seccion === 'objetivo_social')?.contenido || ''}
              onChange={(e) => handleChange(secciones.findIndex((s) => s.seccion === 'objetivo_social'), 'contenido', e.target.value)}
              placeholder="Describe el objetivo social de FUNAC..."
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">Objetivos Especificos</p>
              <button
                type="button"
                onClick={() => {
                  const objs = secciones.filter((s) => s.seccion.startsWith('objetivo_') && s.seccion !== 'objetivo_social')
                  setSecciones((prev) => [...prev, {
                    seccion: `objetivo_${objs.length + 1}`,
                    contenido: '',
                    orden: prev.length,
                    activo: true,
                  }])
                }}
                className="flex items-center gap-1.5 text-xs text-funac-navy font-medium hover:underline"
              >
                <Plus size={14} /> Agregar objetivo
              </button>
            </div>
            <div className="space-y-3">
              {secciones
                .map((s, idx) => ({ ...s, _idx: idx }))
                .filter((s) => s.seccion.startsWith('objetivo_') && s.seccion !== 'objetivo_social')
                .map((sec, n) => (
                  <div key={sec.seccion} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Objetivo {n + 1}</p>
                      <Textarea
                        rows={2}
                        value={sec.contenido}
                        onChange={(e) => handleChange(sec._idx, 'contenido', e.target.value)}
                        placeholder={`Describe el objetivo especifico ${n + 1}...`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        // Eliminar y renumerar
                        setSecciones((prev) => {
                          const filtered = prev.filter((_, i) => i !== sec._idx)
                          let n = 0
                          return filtered.map((s) => {
                            if (s.seccion.startsWith('objetivo_') && s.seccion !== 'objetivo_social') {
                              n++
                              return { ...s, seccion: `objetivo_${n}`, orden: n + 1 }
                            }
                            return s
                          })
                        })
                      }}
                      className="mt-6 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      title="Eliminar objetivo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      ) : selectedPage === 'mision_vision' ? (
        /* ── Formulario simplificado solo para Misión / Visión ── */
        <div className="space-y-6 max-w-2xl">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-sm font-semibold text-gray-700">Mision</p>
              <IconPicker
                value={secciones.find((s) => s.seccion === 'mision')?.icono || null}
                onChange={(icon) => handleChange(secciones.findIndex((s) => s.seccion === 'mision'), 'icono', icon)}
              />
            </div>
            <Textarea
              rows={5}
              value={secciones.find((s) => s.seccion === 'mision')?.contenido || ''}
              onChange={(e) => handleChange(secciones.findIndex((s) => s.seccion === 'mision'), 'contenido', e.target.value)}
              placeholder="Describe la mision de FUNAC..."
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-sm font-semibold text-gray-700">Vision</p>
              <IconPicker
                value={secciones.find((s) => s.seccion === 'vision')?.icono || null}
                onChange={(icon) => handleChange(secciones.findIndex((s) => s.seccion === 'vision'), 'icono', icon)}
              />
            </div>
            <Textarea
              rows={5}
              value={secciones.find((s) => s.seccion === 'vision')?.contenido || ''}
              onChange={(e) => handleChange(secciones.findIndex((s) => s.seccion === 'vision'), 'contenido', e.target.value)}
              placeholder="Describe la vision de FUNAC..."
            />
          </div>
        </div>
      ) : (
        /* ── Editor generico para Quienes Somos y Valores ── */
        <div className="space-y-6">
          {secciones.map((sec, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1">
                  <Input
                    label="Titulo de la seccion"
                    value={sec.seccion}
                    onChange={(e) => handleChange(idx, 'seccion', e.target.value)}
                    placeholder="ej: Historia, Nuestro Equipo, Compromiso..."
                  />
                </div>
                <div className="mt-5 shrink-0">
                  <IconPicker
                    value={sec.icono || null}
                    onChange={(icon) => handleChange(idx, 'icono', icon)}
                  />
                </div>
                <label className="flex items-center gap-1.5 mt-5 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sec.activo !== false}
                    onChange={(e) => handleChange(idx, 'activo', e.target.checked)}
                    className="w-4 h-4 text-funac-orange rounded"
                  />
                  <span className="text-xs text-gray-500">Visible</span>
                </label>
                <button
                  onClick={() => removeSection(idx)}
                  className="mt-5 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="Eliminar seccion"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <Textarea
                label="Contenido"
                rows={6}
                value={sec.contenido}
                onChange={(e) => handleChange(idx, 'contenido', e.target.value)}
                placeholder="Escribe el contenido de esta seccion..."
              />
            </div>
          ))}
          <button
            onClick={addSection}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-funac-navy hover:text-funac-navy transition-colors w-full justify-center"
          >
            <Plus size={16} /> Agregar seccion
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Carousel Tab ────────────────────────────────────────────────────────────
function CarouselTab() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState([])
  const [files, setFiles] = useState([])
  const inputRef = useRef()

  const load = () => {
    adminService.getCarouselImages()
      .then((d) => setImages(Array.isArray(d) ? d : []))
      .catch(() => toast.error('Error al cargar imagenes'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || [])
    setFiles(selected)
    setPreviews(selected.map((f) => URL.createObjectURL(f)))
  }

  const handleUpload = async () => {
    if (!files.length) return
    setUploading(true)
    const formData = new FormData()
    files.forEach((f) => formData.append('images', f))
    try {
      await adminService.uploadCarouselImages(formData)
      toast.success('Imagenes subidas correctamente')
      setFiles([])
      setPreviews([])
      load()
    } catch {
      toast.error('Error al subir imagenes')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Eliminar esta imagen?')) return
    try {
      await adminService.deleteCarouselImage(id)
      toast.success('Imagen eliminada')
      load()
    } catch {
      toast.error('Error al eliminar')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Carrusel de imagenes</h2>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-funac-navy text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors"
        >
          <Upload size={15} />
          Subir imagenes
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Preview antes de subir */}
      {previews.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 rounded-xl">
          <p className="text-sm font-medium text-gray-700 mb-3">{previews.length} imagen(es) lista(s) para subir</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="w-full aspect-square object-cover rounded-lg" />
            ))}
          </div>
          <div className="flex gap-3">
            <Button size="sm" loading={uploading} onClick={handleUpload} icon={Upload}>
              Confirmar subida
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setPreviews([]); setFiles([]) }}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No hay imagenes en el carrusel</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-100">
              <img
                src={img.url_imagen || img.url}
                alt={img.titulo || 'Imagen carrusel'}
                className="w-full aspect-video object-cover"
              />
              {img.titulo && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 truncate">
                  {img.titulo}
                </div>
              )}
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── PDFs Tab ─────────────────────────────────────────────────────────────────
function PDFsTab() {
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [file, setFile] = useState(null)

  const load = () => {
    adminService.getPDFs()
      .then((d) => setPdfs(Array.isArray(d) ? d : (d?.pdfs || [])))
      .catch(() => toast.error('Error al cargar PDFs'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !titulo) { toast.error('Titulo y archivo son requeridos'); return }
    setUploading(true)
    const formData = new FormData()
    formData.append('pdf', file)
    formData.append('titulo', titulo)
    if (descripcion) formData.append('descripcion', descripcion)
    try {
      await adminService.uploadPDF(formData)
      toast.success('PDF subido correctamente')
      setTitulo(''); setDescripcion(''); setFile(null)
      load()
    } catch {
      toast.error('Error al subir el PDF')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Eliminar este PDF?')) return
    try {
      await adminService.deletePDF(id)
      toast.success('PDF eliminado')
      load()
    } catch {
      toast.error('Error al eliminar')
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Upload form */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Subir nuevo PDF</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <Input label="Titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <Textarea label="Descripcion (opcional)" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Archivo PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-funac-orange hover:file:bg-orange-100 cursor-pointer"
            />
          </div>
          <Button type="submit" loading={uploading} icon={Upload}>Subir PDF</Button>
        </form>
      </div>

      {/* PDFs list */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">PDFs publicados</h2>
        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : pdfs.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No hay PDFs publicados</div>
        ) : (
          <div className="space-y-3">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{pdf.titulo || pdf.nombre}</p>
                  {pdf.descripcion && <p className="text-xs text-gray-400 truncate">{pdf.descripcion}</p>}
                  {pdf.tamano && <p className="text-xs text-gray-400">{formatFileSize(pdf.tamano)}</p>}
                </div>
                <button
                  onClick={() => handleDelete(pdf.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Social Media Tab ─────────────────────────────────────────────────────────
const socialFields = [
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'twitter', label: 'Twitter', icon: Twitter },
  { key: 'youtube', label: 'YouTube', icon: Youtube },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'tiktok', label: 'TikTok', icon: MessageCircle },
]

function SocialTab() {
  const [redes, setRedes] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminService.getSocialMedia()
      .then((data) => {
        if (Array.isArray(data)) {
          const obj = {}
          data.forEach((r) => { obj[r.red?.toLowerCase()] = r })
          setRedes(obj)
        } else {
          setRedes(data || {})
        }
      })
      .catch(() => toast.error('Error al cargar redes sociales'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminService.updateSocialMedia(redes)
      toast.success('Redes sociales actualizadas')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6">Redes Sociales</h2>
      <div className="space-y-4 max-w-lg">
        {socialFields.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg shrink-0">
              <Icon size={18} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <Input
                label={label}
                type="url"
                placeholder={`https://...`}
                value={redes[key]?.url || ''}
                onChange={(e) => setRedes((prev) => ({
                  ...prev,
                  [key]: { ...(prev[key] || {}), red: key, url: e.target.value },
                }))}
              />
            </div>
            <label className="flex items-center gap-1.5 mt-5 shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={redes[key]?.activo ?? true}
                onChange={(e) => setRedes((prev) => ({
                  ...prev,
                  [key]: { ...(prev[key] || {}), red: key, activo: e.target.checked },
                }))}
                className="w-4 h-4 text-funac-orange rounded"
              />
              <span className="text-xs text-gray-500">Activo</span>
            </label>
          </div>
        ))}
        <Button onClick={handleSave} loading={saving} icon={Save} className="mt-4">
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}

// ─── WhatsApp Tab ─────────────────────────────────────────────────────────────
function WhatsAppTab() {
  const [config, setConfig] = useState({ codigo_pais: '57', numero: '', mensaje: '', activo: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminService.getWhatsApp()
      .then((data) => setConfig(data || config))
      .catch(() => toast.error('Error al cargar configuracion'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminService.updateWhatsApp(config)
      toast.success('WhatsApp actualizado')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Configuracion de WhatsApp</h2>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-24">
            <Input
              label="Codigo pais"
              value={config.codigo_pais}
              onChange={(e) => setConfig((p) => ({ ...p, codigo_pais: e.target.value }))}
              placeholder="57"
            />
          </div>
          <div className="flex-1">
            <Input
              label="Numero de telefono"
              type="tel"
              value={config.numero}
              onChange={(e) => setConfig((p) => ({ ...p, numero: e.target.value }))}
              placeholder="300 000 0000"
            />
          </div>
        </div>
        <Textarea
          label="Mensaje predeterminado"
          rows={3}
          value={config.mensaje}
          onChange={(e) => setConfig((p) => ({ ...p, mensaje: e.target.value }))}
          placeholder="Hola, me gustaria obtener informacion..."
        />
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.activo}
            onChange={(e) => setConfig((p) => ({ ...p, activo: e.target.checked }))}
            className="w-4 h-4 text-funac-orange rounded"
          />
          <span className="text-sm text-gray-700">Boton de WhatsApp activo</span>
        </label>
        <Button onClick={handleSave} loading={saving} icon={Save}>
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContenidoPage() {
  const [activeTab, setActiveTab] = useState(0)

  const tabComponents = [PaginasTab, CarouselTab, PDFsTab, SocialTab, WhatsAppTab]
  const ActiveComponent = tabComponents[activeTab]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Contenido</h1>
        <p className="text-gray-500 mt-1">Gestiona el contenido visible en el sitio web</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === i
                ? 'bg-white shadow text-funac-navy'
                : 'text-gray-500 hover:text-gray-700'
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
