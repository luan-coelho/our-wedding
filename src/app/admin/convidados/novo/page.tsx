'use client'

import GuestForm from '../guest-form'
import AdminProtected from '@/components/admin-protected'

export default function AddGuestPage() {
  return (
    <AdminProtected>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Adicionar Convidado</h1>
        <GuestForm />
      </div>
    </AdminProtected>
  )
}
