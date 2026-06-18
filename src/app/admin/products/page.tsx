import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-white tracking-wider">PRODUCTS</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Product</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Category</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Price</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Stock</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Status</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.id} className="border-b border-brand-border/50 hover:bg-brand-dark/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-500 text-xs font-mono">{product.sku}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{(product.category as any)?.name ?? '—'}</td>
                  <td className="px-5 py-4">
                    <p className="text-white">{formatPrice(product.sale_price ?? product.price)}</p>
                    {product.sale_price && (
                      <p className="text-gray-500 text-xs line-through">{formatPrice(product.price)}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-white">{product.stock_quantity}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${
                      product.stock_status === 'in_stock' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      product.stock_status === 'low_stock' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {product.stock_status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-gray-400 hover:text-brand-purple-light transition-colors p-1.5 rounded-lg hover:bg-brand-purple/10"
                      >
                        <Edit size={15} />
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!products || products.length === 0) && (
            <div className="text-center py-16 text-gray-500">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p>No products yet. Add your first product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
