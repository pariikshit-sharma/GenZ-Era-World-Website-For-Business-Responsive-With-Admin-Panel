import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/store/ProductDetail'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .single()

  return {
    title: product ? `${product.name} | GenZ Era World` : 'Product | GenZ Era World',
    description: product?.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`*, category:categories(*), images:product_images(*)`)
    .eq('slug', slug)
    .single()

  if (!product) notFound()

  return <ProductDetail product={product} />
}
