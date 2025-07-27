import { Wrench, Clock, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 md:p-12 text-center space-y-8">
          {/* Ícone principal */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center">
                <Wrench className="w-12 h-12 text-rose-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <Heart className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Título principal */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Site em Construção</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Estamos criando algo muito especial para nosso grande dia!
              <br />
              Em breve você poderá acompanhar todos os detalhes do nosso casamento.
            </p>
          </div>

          {/* Seção de progresso */}
          <div className="bg-rose-50 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-rose-700">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Em Desenvolvimento</span>
            </div>
            <p className="text-rose-600">Trabalhando com muito carinho nos detalhes finais.</p>
          </div>

          {/* Mensagem motivacional */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <p className="text-sm text-gray-500 text-center">
              &ldquo;O matrimônio é a união de duas almas que se amam tanto que desejam fazer-se santas juntas.&rdquo; -
              São João Paulo II
            </p>
          </div>

          {/* Rodapé com amor */}
          <div className="pt-6">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              Feito com <Heart className="w-3 h-3 text-rose-500" /> para nosso casamento
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
