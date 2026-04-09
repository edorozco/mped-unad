import Link from "next/link"
import Button from "@/src/components/common/Button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-soft-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-display font-bold text-primary-dark mb-4">404</h1>
        <p className="text-xl text-gray-soft-200 mb-8">Página no encontrada</p>
        <Link href="/">
          <Button variant="primary">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}
