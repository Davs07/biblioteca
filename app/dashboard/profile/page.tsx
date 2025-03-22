"use client"

import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Badge } from "../../../components/ui/badge"

export default function ProfilePage() {
  const { user } = useAuth()

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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

