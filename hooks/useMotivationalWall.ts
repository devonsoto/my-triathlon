"use client"

import { useEffect, useState } from "react"
import {
  getMotivationalItems,
  createMotivationalItem,
  deleteMotivationalItem,
} from "@/app/actions/motivational"
import type { MotivationalItem } from "@/lib/types"

export function useMotivationalWall() {
  const [items, setItems] = useState<MotivationalItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMotivationalItems().then((data) => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  async function addItem(quote: string, source?: string) {
    const item = await createMotivationalItem(quote, source)
    setItems((prev) => [item, ...prev])
  }

  async function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    await deleteMotivationalItem(id)
  }

  return { items, addItem, deleteItem, loading }
}
