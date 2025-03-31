"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { useToast } from "../../../hooks/use-toast"

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
  })

  // Inicializar el formulario con los datos del usuario cuando se activa el modo de edición
  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
    })
    setIsEditing(true)
  }

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    // Validar que el nombre no esté vacío
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    // Actualizar el perfil
    const success = await updateProfile({
      name: formData.name,
    })

    if (success) {
      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente",
      })
      setIsEditing(false)
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar tu perfil. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return <div className="flex justify-center p-8">Cargando...</div>
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "librarian":
        return "Bibliotecario"
      case "user":
        return "Usuario"
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "librarian":
        return "bg-blue-500"
      case "user":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mi Perfil</h1>

      <div className="max-w-2xl">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Gestiona tu información de perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Cambiar imagen
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                {isEditing ? (
                  // Formulario de edición
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div className="pt-2 flex space-x-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar cambios"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  // Vista de información
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
                      <p className="text-lg font-medium">{user.name}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Correo electrónico</h3>
                      <p className="text-lg font-medium">{user.email}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Rol</h3>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="font-medium">
                          <div className={`w-2 h-2 rounded-full mr-2 ${getRoleColor(user.role)}`}></div>
                          {getRoleName(user.role)}
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button onClick={handleEdit} variant="outline">
                        Editar perfil
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

