import { createClient } from '@/lib/supabase/server'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export default async function FeaturedSection() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`*, category:categories(*), images:product_images(*)`)
    .eq('is_featured', true)
    .neq('stock_quantity', 0)
    .order('created_at', { ascending: false })
    .limit(8)

  if (!products || products.length === 0) return null

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-brand-purple fill-brand-purple" />
            <span className="text-brand-purple-light text-sm font-medium tracking-wider uppercase">
              Handpicked
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wider">
            FEATURED
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-purple-light">
              PRODUCTS
            </span>
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-2 text-brand-purple-light hover:text-white transition-colors text-sm group"
        >
          View All
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-8 sm:hidden">
        <Link href="/shop" className="btn-outline text-sm px-6 py-2.5">
          View All Products
        </Link>
      </div>
    </section>
  )
}
