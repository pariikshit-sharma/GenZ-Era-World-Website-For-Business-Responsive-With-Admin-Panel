import { createClient } from '@/lib/supabase/server'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ProductsSectionProps {
  type: 'action-figures' | 't-shirts' | 'sneakers' | 'new-arrivals' | 'trending'
  title: string
}

export default async function ProductsSection({ type, title }: ProductsSectionProps) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`*, category:categories(*), images:product_images(*)`)
    .order('created_at', { ascending: false })
    .limit(6)

  if (type === 'new-arrivals') {
    query = query.eq('is_new_arrival', true)
  } else if (type === 'trending') {
    query = query.eq('is_trending', true)
  } else {
    const categorySlug = type
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (!category) return null
    query = query.eq('category_id', category.id)
  }

  const { data: products } = await query

  if (!products || products.length === 0) return null

  const href =
    type === 'new-arrivals' || type === 'trending'
      ? `/shop?filter=${type}`
      : `/category/${type}`

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wider">
            {title.toUpperCase()}
          </h2>
          <Link
            href={href}
            className="flex items-center gap-1 text-brand-purple-light hover:text-white transition-colors text-sm group"
          >
            See All
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
