"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Search } from "lucide-react"

export function BookSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (query.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Buscar libro por título..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>
    </form>
  )
}

