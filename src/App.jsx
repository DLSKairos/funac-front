import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import Home from './pages/Home'
import QuienesSomos from './pages/QuienesSomos'
import Valores from './pages/Valores'
import MisionVision from './pages/MisionVision'
import Contacto from './pages/Contacto'
import Voluntarios from './pages/Voluntarios'
import Donaciones from './pages/Donaciones'
import DonacionExito from './pages/DonacionExito'
import DonacionError from './pages/DonacionError'

// Admin pages
import Login from './pages/admin/Login'
import DashboardPage from './pages/admin/DashboardPage'
import ContenidoPage from './pages/admin/ContenidoPage'
import VoluntariosPage from './pages/admin/VoluntariosPage'
import DonacionesPage from './pages/admin/DonacionesPage'
import ConfiguracionPage from './pages/admin/ConfiguracionPage'

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

// Root layout that provides AuthContext inside the router
function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes with Navbar + Footer
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/quienes-somos', element: <QuienesSomos /> },
          { path: '/valores', element: <Valores /> },
          { path: '/mision-vision', element: <MisionVision /> },
          { path: '/contacto', element: <Contacto /> },
          { path: '/voluntarios', element: <Voluntarios /> },
          { path: '/donaciones', element: <Donaciones /> },
          { path: '/donacion/exito', element: <DonacionExito /> },
          { path: '/donacion/error', element: <DonacionError /> },
        ],
      },
      // Admin login (standalone, no navbar/footer)
      {
        path: '/admin/login',
        element: <Login />,
      },
      // Protected admin routes with sidebar layout
      {
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: '/admin', element: <DashboardPage /> },
          { path: '/admin/contenido', element: <ContenidoPage /> },
          { path: '/admin/voluntarios', element: <VoluntariosPage /> },
          { path: '/admin/donaciones', element: <DonacionesPage /> },
          { path: '/admin/configuracion', element: <ConfiguracionPage /> },
        ],
      },
    ],
  },
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
          },
        }}
      />
    </>
  )
}
