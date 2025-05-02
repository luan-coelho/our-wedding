import GuestForm from '../guest-form'

export default function AddGuestPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Adicionar Convidado</h1>
      <GuestForm />
    </div>
  )
}
