import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Users, TrendingUp, UserCheck } from 'lucide-react'
import adminService from '../../services/adminService'
import { formatCurrency } from '../../utils/formatters'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'

function StatCard({ icon: Icon, title, value, subtitle, color, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
          ) : (
            <p className="text-3xl font-black text-gray-900">{value}</p>
          )}
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  )
}

function SimpleBarChart({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
      No hay datos disponibles
    </div>
  )

  const maxVal = Math.max(...data.map((d) => d.monto || d.total || 0), 1)

  return (
    <div className="flex items-end gap-2 h-48 px-2">
      {data.map((item, i) => {
        const val = item.monto || item.total || 0
        const height = Math.max((val / maxVal) * 100, 2)
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500 font-medium">
              {formatCurrency(val, 'COP').replace('$', '').trim().replace('.000', 'k')}
            </span>
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-funac-navy to-blue-500 transition-all duration-700"
              style={{ height: `${height}%` }}
              title={`${item.mes || item.label}: ${formatCurrency(val)}`}
            />
            <span className="text-xs text-gray-400 truncate w-full text-center">
              {item.mes || item.label || `M${i + 1}`}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingChart, setLoadingChart] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminService.getDashboardStats()
      .then((data) => setStats(data))
      .catch(() => setError('No se pudieron cargar las estadisticas'))
      .finally(() => setLoadingStats(false))

    adminService.getDonationsChart(6)
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data?.chart || data?.data || [])
        setChartData(arr)
      })
      .catch(() => {})
      .finally(() => setLoadingChart(false))
  }, [])

  const statCards = [
    {
      icon: DollarSign,
      title: 'Total donaciones',
      value: stats?.total_donaciones ?? '—',
      subtitle: 'Donaciones registradas',
      color: 'bg-orange-100 text-funac-orange',
    },
    {
      icon: TrendingUp,
      title: 'Monto total',
      value: stats?.monto_total !== undefined ? formatCurrency(stats.monto_total) : '—',
      subtitle: 'Recaudado en total',
      color: 'bg-green-100 text-funac-green',
    },
    {
      icon: Users,
      title: 'Voluntarios',
      value: stats?.total_voluntarios ?? '—',
      subtitle: 'Registrados',
      color: 'bg-blue-100 text-funac-navy',
    },
    {
      icon: UserCheck,
      title: 'Voluntarios nuevos',
      value: stats?.voluntarios_nuevos ?? '—',
      subtitle: 'Este mes',
      color: 'bg-yellow-100 text-funac-yellow',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen general de la fundacion</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} loading={loadingStats} />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Donaciones por mes</h2>
        {loadingChart ? (
          <div className="flex items-center justify-center h-48">
            <Spinner size="md" />
          </div>
        ) : (
          <SimpleBarChart data={chartData} />
        )}
      </div>

      {/* Recent activity */}
      {stats?.ultimas_actividades?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Actividad reciente</h2>
          <div className="space-y-3">
            {stats.ultimas_actividades.map((act, i) => (
              <div key={i} className="flex items-start gap-3 text-sm py-2 border-b border-gray-50 last:border-0">
                <div className="w-2 h-2 rounded-full bg-funac-orange mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-700">{act.descripcion || act.mensaje}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{act.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
