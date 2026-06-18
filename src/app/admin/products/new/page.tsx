import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-3xl text-white tracking-wider mb-8">ADD PRODUCT</h1>
      <ProductForm categories={categories ?? []} />
    </div>
  )
}
