import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { Trash2, Upload, Plus, Save, Facebook, Instagram, Twitter, Youtube, Linkedin, MessageCircle } from 'lucide-react'
import adminService from '../../services/adminService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Spinner from '../../components/ui/Spinner'
import { formatFileSize } from '../../utils/formatters'

const TABS = ['Carrusel', 'PDFs', 'Redes Sociales', 'WhatsApp']

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
      .then((d) => setImages(Array.isArray(d) ? d : (d?.imagenes || [])))
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
    files.forEach((f) => formData.append('imagenes', f))
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
                src={img.url || img.imagen_url}
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

  const tabComponents = [CarouselTab, PDFsTab, SocialTab, WhatsAppTab]
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
