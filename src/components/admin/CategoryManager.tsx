'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Check, X } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { Category } from '@/types'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const router = useRouter()

  const handleAdd = async () => {
    if (!newName.trim()) return
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newName.trim(), slug: slugify(newName), description: newDesc.trim() || null })
      .select()
      .single()

    if (error) { toast.error('Failed to create category'); return }
    setCategories((prev) => [...prev, data])
    setNewName(''); setNewDesc('')
    toast.success('Category created!')
  }

  const handleEdit = async (id: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .update({ name: editName, slug: slugify(editName), description: editDesc || null })
      .eq('id', id)
      .select()
      .single()

    if (error) { toast.error('Failed to update'); return }
    setCategories((prev) => prev.map((c) => c.id === id ? data : c))
    setEditingId(null)
    toast.success('Category updated!')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in it will become uncategorized.')) return
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
    toast.success('Category deleted')
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Add new */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4">Add Category</h2>
        <div className="flex gap-3">
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Category name"
              className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)"
              className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="btn-primary px-4 flex items-center gap-2 self-start"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">No categories yet</div>
        ) : (
          <div className="divide-y divide-brand-border">
            {categories.map((cat) => (
              <div key={cat.id} className="px-6 py-4">
                {editingId === cat.id ? (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-purple text-white rounded-lg px-3 py-2 text-sm outline-none"
                      />
                      <input
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-border text-white rounded-lg px-3 py-2 text-sm outline-none"
                        placeholder="Description"
                      />
                    </div>
                    <button onClick={() => handleEdit(cat.id)} className="text-green-400 hover:text-green-300 p-1">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white p-1">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{cat.name}</p>
                      {cat.description && <p className="text-gray-500 text-xs mt-0.5">{cat.description}</p>}
                      <p className="text-gray-600 text-xs mt-0.5 font-mono">{cat.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditDesc(cat.description ?? '') }}
                        className="text-gray-400 hover:text-brand-purple-light transition-colors p-1.5 rounded hover:bg-brand-purple/10"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-500/10"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
