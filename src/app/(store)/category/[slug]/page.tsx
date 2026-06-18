import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/store/ProductCard'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const { data: products } = await supabase
    .from('products')
    .select(`*, category:categories(*), images:product_images(*)`)
    .eq('category_id', category.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-4xl sm:text-6xl text-white tracking-wider mb-2">
            {category.name.toUpperCase()}
          </h1>
          {category.description && (
            <p className="text-gray-400">{category.description}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">
            {products?.length ?? 0} product{(products?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg mb-2">No products in this category yet</p>
            <p className="text-gray-600 text-sm">Check back soon for new arrivals!</p>
          </div>
        )}
      </div>
    </div>
  )
}
