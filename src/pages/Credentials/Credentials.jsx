import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Navigation from '../../components/layout/Navigation'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import demoCredentials from '../../data/demoCredentials.json'
import SkillChip from '../../components/common/SkillChip'

const Credentials = () => {
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [showShare, setShowShare] = useState(false)

  const handleShare = (badge) => {
    setSelectedBadge(badge)
    setShowShare(true)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`https://miped.com/credentials/${selectedBadge.id}`)
    alert('Link copiado al portapapeles')
  }

  return (
    <div className="min-h-screen bg-gray-soft-50 pb-20 md:pb-0">
      <Header />
      <div className="container-custom py-8">
        <h1 className="text-3xl font-display font-bold text-primary-dark mb-8">
          Mis Microcredenciales
        </h1>

        {demoCredentials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoCredentials.map(badge => (
              <Card key={badge.id} hover onClick={() => setSelectedBadge(badge)}>
                <div className="text-center">
                  <div className="text-6xl mb-4">{badge.icon}</div>
                  <h3 className="text-xl font-semibold text-primary-dark mb-2">
                    {badge.name}
                  </h3>
                  <p className="text-sm text-gray-soft-200 mb-4">
                    {badge.category}
                  </p>
                  <p className="text-xs text-gray-soft-200">
                    Obtenida el {new Date(badge.earnedDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-primary-dark mb-2">
                Aún no tienes credenciales
              </h3>
              <p className="text-gray-soft-200 mb-6">
                Completa trabajos y gana microcredenciales que validen tus habilidades
              </p>
            </div>
          </Card>
        )}

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <Modal
            isOpen={!!selectedBadge}
            onClose={() => setSelectedBadge(null)}
            title={selectedBadge.name}
            size="md"
          >
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">{selectedBadge.icon}</div>
              <p className="text-gray-soft-200 mb-4">{selectedBadge.description}</p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {selectedBadge.skills.map((skill, idx) => (
                  <SkillChip key={idx} skill={skill} variant="display" />
                ))}
              </div>
              <p className="text-sm text-gray-soft-200">
                Obtenida el {new Date(selectedBadge.earnedDate).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <Button
              variant="primary"
              fullWidth
              onClick={() => handleShare(selectedBadge)}
            >
              Compartir credencial
            </Button>
          </Modal>
        )}

        {/* Share Modal */}
        <Modal
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          title="Compartir credencial"
        >
          <div className="space-y-4">
            <p className="text-gray-soft-200 text-center">
              Comparte tu microcredencial en tus redes sociales
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`He obtenido la credencial ${selectedBadge?.name} en MPED!`)}`, '_blank')
                }}
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://miped.com/credentials/${selectedBadge?.id}`)}`, '_blank')
                }}
              >
                Facebook
              </Button>
            </div>
            <Button
              variant="primary"
              fullWidth
              onClick={copyLink}
            >
              Copiar link
            </Button>
          </div>
        </Modal>
      </div>
      <Navigation />
    </div>
  )
}

export default Credentials
