import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default async function CategorySection() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <section className="py-20 px-4 bg-brand-darkest">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-brand-purple-light text-sm font-medium tracking-wider uppercase block mb-3">
            Browse By
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wider">
            EXPLORE
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-purple-light"> COLLECTION</span>
          </h2>
        </div>

        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-brand-card border border-brand-border hover:border-brand-purple/50 transition-all duration-300 aspect-video flex items-end p-6"
              >
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-dark" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="relative z-10 flex items-end justify-between w-full">
                  <div>
                    <h3 className="font-display text-2xl text-white tracking-wider group-hover:text-brand-purple-light transition-colors">
                      {category.name.toUpperCase()}
                    </h3>
                    {category.description && (
                      <p className="text-gray-400 text-sm mt-1">{category.description}</p>
                    )}
                  </div>
                  <ArrowRight
                    size={20}
                    className="text-brand-purple-light opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {['Action Figures', 'T-Shirts', 'Sneakers'].map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase().replace(' ', '-')}`}
                className="group relative overflow-hidden rounded-2xl bg-brand-card border border-brand-border hover:border-brand-purple/50 transition-all duration-300 aspect-video flex items-end p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-dark" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="relative z-10 flex items-end justify-between w-full">
                  <h3 className="font-display text-2xl text-white tracking-wider group-hover:text-brand-purple-light transition-colors">
                    {cat.toUpperCase()}
                  </h3>
                  <ArrowRight size={20} className="text-brand-purple-light opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
