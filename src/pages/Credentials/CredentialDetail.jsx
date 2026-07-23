import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useUser } from '../../contexts/UserContext'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import Navigation from '../../components/layout/Navigation'
import Button from '../../components/common/Button'
import demoCredentials from '../../data/demoCredentials.json'

const CredentialDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { profile } = useUser()
  const showSidebar = isAuthenticated && user?.role === 'young'

  const credential = demoCredentials.find((c) => c.id === parseInt(id))

  if (!credential) {
    return (
      <div className="min-h-screen bg-gray-soft-50">
        <Header />
        {showSidebar && <Sidebar />}
        <div className={`${showSidebar ? 'md:ml-64' : ''} container-custom py-12 text-center`}>
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Credencial no encontrada</h2>
          <Button onClick={() => navigate('/credentials')}>Volver a mis credenciales</Button>
        </div>
      </div>
    )
  }

  const studentName = profile?.name || user?.name || 'Estudiante MPED'
  const verificationId = `MPED-${String(credential.id).padStart(4, '0')}-${credential.category.slice(0, 2).toUpperCase()}`
  const issuedDate = new Date(credential.earnedDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

  const handleDemoAction = (action) => {
    alert(`${action}: función disponible próximamente en esta demo.`)
  }

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://miped.com/credentials/${credential.id}`)}`,
      '_blank'
    )
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'md:ml-64' : ''}>
        <div className="container-custom py-8">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between mb-8">
            <nav className="flex items-center gap-2 text-sm text-gray-soft-300">
              <button type="button" onClick={() => navigate('/credentials')} className="hover:text-primary-cyan flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Mis Credenciales
              </button>
            </nav>
          </div>

          {/* Actions bar */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 mb-6">
            <Button variant="primary" onClick={() => handleDemoAction('Descargar PDF')}>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">download</span>
                Descargar PDF
              </span>
            </Button>
            <button
              type="button"
              onClick={shareOnLinkedIn}
              className="flex items-center gap-2 px-6 py-3 bg-[#0077b5] text-white rounded-full hover:shadow-lg active:scale-95 transition-all text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-lg">share</span>
              Compartir en LinkedIn
            </button>
            <button
              type="button"
              onClick={() => handleDemoAction('Imprimir')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-primary-dark rounded-full border border-gray-soft-200 hover:bg-gray-soft-50 active:scale-95 transition-all text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-lg">print</span>
              Imprimir
            </button>
          </div>

          {/* Certificate */}
          <div className="bg-primary-dark rounded-2xl p-4 md:p-12 flex items-center justify-center mb-8">
            <div
              className="relative bg-white w-full max-w-3xl p-8 md:p-12 flex flex-col items-center text-center overflow-hidden"
              style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}
            >
              <div className="absolute inset-6 border-2 border-primary-cyan/40 pointer-events-none" />
              <div className="absolute inset-8 border border-gray-soft-200 pointer-events-none" />
              <span className="material-symbols-outlined absolute top-0 right-0 text-[120px] text-primary-dark/10">
                military_tech
              </span>

              <div className="mt-6 mb-4">
                <div className="font-display font-extrabold tracking-widest uppercase text-primary-dark mb-1">
                  MPED Academic
                </div>
                <div className="w-16 h-1 bg-primary-cyan mx-auto" />
              </div>

              <h2 className="font-display text-3xl md:text-4xl italic font-bold text-primary-cyan mt-8 mb-2">
                Certificado de Logro
              </h2>
              <p className="text-gray-soft-300 mb-8">Se otorga con distinción el presente reconocimiento a:</p>
              <h3 className="font-display text-2xl font-bold text-primary-dark mb-2 border-b-2 border-primary-cyan/40 inline-block px-8 pb-2">
                {studentName}
              </h3>
              <p className="text-gray-soft-300 mt-8 max-w-xl">Por haber completado con éxito la credencial en:</p>
              <p className="font-display text-xl text-primary-dark mt-2 font-bold">{credential.name}</p>

              <div className="flex flex-wrap items-center justify-center gap-3 my-8">
                {credential.skills.map((skill) => (
                  <span key={skill} className="bg-primary-cyan/15 text-primary-dark text-xs font-bold px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8 mt-auto pt-8 border-t border-gray-soft-200 items-end">
                <div className="flex flex-col items-center">
                  <span className="font-display italic text-2xl text-primary-dark mb-1">Elena Rivera</span>
                  <div className="w-full border-b border-gray-soft-300 mb-2" />
                  <span className="text-sm text-primary-dark font-semibold">Dra. Elena Rivera</span>
                  <span className="text-xs text-gray-soft-300">Directora Académica MPED</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-gray-soft-50 border border-gray-soft-200 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-primary-dark">qr_code_2</span>
                  </div>
                  <div className="text-xs text-gray-soft-300">Emisión: {issuedDate}</div>
                  <div className="text-xs font-bold text-primary-dark">ID: #{verificationId}</div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary-dark via-primary-cyan to-primary-dark" />
            </div>
          </div>

          {/* Verification + next step */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white border border-gray-soft-200 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-cyan/15 text-primary-dark rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">security</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-primary-dark mb-1">Certificado verificable</h4>
                <p className="text-sm text-gray-soft-300">
                  Este certificado incluye un identificador único (#{verificationId}) que permite validar su
                  autenticidad ante empleadores e instituciones educativas.
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-soft-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <h4 className="text-xs font-bold text-primary-dark uppercase tracking-wider mb-3">Próximo paso sugerido</h4>
              <p className="text-sm text-gray-soft-300 mb-4">
                Tu habilidad "{credential.category}" ahora está validada. Explora microempleos que la requieren.
              </p>
              <Button variant="primary" fullWidth onClick={() => navigate('/empleos')}>
                Ver vacantes compatibles
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  )
}

export default CredentialDetail
