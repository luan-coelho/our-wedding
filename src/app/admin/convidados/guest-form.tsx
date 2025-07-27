'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { routes } from '@/lib/routes'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { guestSchema, GuestFormData } from './schema'
import { Plus, Minus, Users, Heart, User, UserPlus } from 'lucide-react'
import { useMemo } from 'react'
import { guestsService } from '@/services/guests.service'

interface GuestFormProps {
  guest?: {
    id: string
    name: string
    spouse?: string | null
    children: string[] // filhos
    companions: string[]
    isConfirmed: boolean
  }
}

export default function GuestForm({ guest }: GuestFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isEditing = !!guest

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: guest?.name || '',
      spouse: guest?.spouse || '',
      children: guest?.children || [],
      companions: guest?.companions || [],
    },
  })

  // Field arrays for dynamic lists
  const {
    fields: childrenFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control: form.control,
    name: 'children',
  })

  const {
    fields: companionsFields,
    append: appendCompanion,
    remove: removeCompanion,
  } = useFieldArray({
    control: form.control,
    name: 'companions',
  })

  // Calculate total guest count
  const formValues = form.watch()
  const totalGuestCount = useMemo(() => {
    let count = 1 // Main guest
    if (formValues.spouse && formValues.spouse.trim()) count += 1
    count += formValues.children.filter((child: string) => child && child.trim()).length // filhos
    count += formValues.companions.filter((companion: string) => companion && companion.trim()).length
    return count
  }, [formValues.spouse, formValues.children, formValues.companions])

  const saveMutation = useMutation({
    mutationFn: async (data: GuestFormData) => {
      try {
        if (isEditing && guest?.id) {
          return await guestsService.update(guest.id, data)
        } else {
          return await guestsService.create(data)
        }
      } catch (error) {
        // Se for erro de nome duplicado (409), definir erro no campo específico
        if (error.status === 409) {
          form.setError('name', {
            type: 'manual',
            message: error,
          })
          throw new Error('Nome duplicado')
        }
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] })
      queryClient.invalidateQueries({ queryKey: ['guest'] })
      toast.success(isEditing ? 'Convidado atualizado com sucesso' : 'Convidado adicionado com sucesso')
      router.push(routes.frontend.admin.convidados.index)
      router.refresh()
    },
    onError: error => {
      // Só mostrar toast se não for erro de nome duplicado (que já é mostrado no campo)
      if (error instanceof Error && error.message !== 'Nome duplicado') {
        toast.error(error.message)
      }
    },
  })

  const onSubmit = (data: GuestFormData) => {
    // Filter out empty strings from arrays before submission
    const cleanedData = {
      ...data,
      children: data.children.filter((child: string) => child && child.trim()),
      companions: data.companions.filter((companion: string) => companion && companion.trim()),
    }
    saveMutation.mutate(cleanedData)
  }

  return (
    <div className="space-y-6">
      {/* Guest Count Summary Card */}
      <Card className="border-black shadow-sm bg-rose-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3">
            <Users className="h-6 w-6 text-rose-600" />
            <div className="text-center">
              <h3 className="text-2xl font-bold text-rose-900">{totalGuestCount}</h3>
              <p className="text-sm font-medium text-rose-700">
                {totalGuestCount === 1 ? 'Pessoa' : 'Pessoas'} no grupo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Form Card */}
      <Card className="border-black shadow-sm">
        <CardHeader className="border-b border-black">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Convidado' : 'Adicionar Convidado'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Primary Guest Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Informações do Convidado Principal</h3>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nome Completo *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nome completo do convidado principal"
                          className="border-black focus:border-gray-900 focus:ring-gray-900/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Spouse/Partner Information */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-rose-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Cônjuge/Parceiro(a)</h3>
                </div>

                <FormField
                  control={form.control}
                  name="spouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nome do Cônjuge/Parceiro(a)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nome completo do cônjuge ou parceiro(a)"
                          className="border-black focus:border-gray-900 focus:ring-gray-900/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Filhos Information */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Filhos</h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendChild('')}
                    className="border-black hover:bg-gray-50">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Filho
                  </Button>
                </div>

                {childrenFields.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>Nenhum filho adicionado</p>
                    <p className="text-sm">Clique em &quot;Adicionar Filho&quot; para incluir filhos no grupo</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {childrenFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-end">
                        <FormField
                          control={form.control}
                          name={`children.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-sm font-medium text-gray-700">Filho {index + 1}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Nome do filho"
                                  className="border-black focus:border-gray-900 focus:ring-gray-900/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeChild(index)}
                          className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Companions Information */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-amber-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Outros Acompanhantes</h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendCompanion('')}
                    className="border-black hover:bg-gray-50">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Acompanhante
                  </Button>
                </div>

                {companionsFields.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <UserPlus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>Nenhum acompanhante adicionado</p>
                    <p className="text-sm">
                      Clique em &quot;Adicionar Acompanhante&quot; para incluir outros familiares ou amigos
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {companionsFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-end">
                        <FormField
                          control={form.control}
                          name={`companions.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Acompanhante {index + 1}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Nome do acompanhante"
                                  className="border-black focus:border-gray-900 focus:ring-gray-900/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCompanion(index)}
                          className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button asChild variant="outline" className="border-black">
                  <Link href={routes.frontend.admin.convidados.index}>Cancelar</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="border-black shadow-sm hover:shadow-md transition-shadow">
                  {saveMutation.isPending ? 'Salvando...' : isEditing ? 'Atualizar Convidado' : 'Adicionar Convidado'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
