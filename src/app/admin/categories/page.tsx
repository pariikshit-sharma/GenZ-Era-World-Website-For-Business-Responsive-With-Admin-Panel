import { createClient } from '@/lib/supabase/server'
import CategoryManager from '@/components/admin/CategoryManager'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-3xl text-white tracking-wider mb-8">CATEGORIES</h1>
      <CategoryManager initialCategories={categories ?? []} />
    </div>
  )
}
