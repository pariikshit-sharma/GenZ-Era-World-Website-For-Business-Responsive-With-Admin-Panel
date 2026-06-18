import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import { SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

interface ShopPageProps {
  searchParams: Promise<{ category?: string; filter?: string; q?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: categories } = await supabase.from('categories').select('*').order('name')

  let query = supabase
    .from('products')
    .select(`*, category:categories(*), images:product_images(*)`)
    .order('created_at', { ascending: false })

  if (params.category) {
    const cat = categories?.find(
      (c) => c.slug === params.category || c.id === params.category
    )
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (params.filter === 'new-arrivals') query = query.eq('is_new_arrival', true)
  if (params.filter === 'trending') query = query.eq('is_trending', true)

  if (params.q) {
    query = query.ilike('name', `%${params.q}%`)
  }

  const { data: products } = await query

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl sm:text-6xl text-white tracking-wider mb-2">
            {params.category
              ? categories?.find((c) => c.slug === params.category)?.name?.toUpperCase() ?? 'SHOP'
              : params.filter === 'new-arrivals'
              ? 'NEW ARRIVALS'
              : params.filter === 'trending'
              ? 'TRENDING'
              : 'SHOP ALL'}
          </h1>
          <p className="text-gray-400">
            {products?.length ?? 0} product{(products?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/shop"
            className={`text-sm px-4 py-2 rounded-full border transition-all ${
              !params.category && !params.filter
                ? 'bg-brand-purple border-brand-purple text-white'
                : 'border-brand-border text-gray-400 hover:border-brand-purple/50 hover:text-white'
            }`}
          >
            All
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`text-sm px-4 py-2 rounded-full border transition-all ${
                params.category === cat.slug
                  ? 'bg-brand-purple border-brand-purple text-white'
                  : 'border-brand-border text-gray-400 hover:border-brand-purple/50 hover:text-white'
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/shop?filter=new-arrivals"
            className={`text-sm px-4 py-2 rounded-full border transition-all ${
              params.filter === 'new-arrivals'
                ? 'bg-brand-purple border-brand-purple text-white'
                : 'border-brand-border text-gray-400 hover:border-brand-purple/50 hover:text-white'
            }`}
          >
            New Arrivals
          </Link>
          <Link
            href="/shop?filter=trending"
            className={`text-sm px-4 py-2 rounded-full border transition-all ${
              params.filter === 'trending'
                ? 'bg-brand-purple border-brand-purple text-white'
                : 'border-brand-border text-gray-400 hover:border-brand-purple/50 hover:text-white'
            }`}
          >
            Trending
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <SlidersHorizontal size={48} className="text-brand-purple/30 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No products found</p>
            <p className="text-gray-600 text-sm mb-6">Check back later for new arrivals</p>
            <Link href="/shop" className="btn-primary text-sm px-6 py-2.5">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
