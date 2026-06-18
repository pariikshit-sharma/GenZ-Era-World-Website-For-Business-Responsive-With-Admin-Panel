import { Shield, Truck, Star, Package, Zap, Heart } from 'lucide-react'

const features = [
  {
    icon: Star,
    title: 'Premium Quality',
    desc: '240 GSM fabrics, detailed sculpts, and premium materials on every product.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'UPI-based manual payment verification for secure transactions.',
  },
  {
    icon: Package,
    title: 'Safe Packaging',
    desc: 'Every item packed carefully to prevent damage during transit.',
  },
  {
    icon: Truck,
    title: 'Pan India Shipping',
    desc: 'We deliver everywhere in India. Free delivery on orders above ₹500.',
  },
  {
    icon: Zap,
    title: 'Easy Returns',
    desc: 'Hassle-free return policy for a worry-free shopping experience.',
  },
  {
    icon: Heart,
    title: 'Made for Fans',
    desc: 'Curated for anime fans, collectors, gamers, and pop culture enthusiasts.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4 bg-brand-darkest lightning-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-purple-light text-sm font-medium tracking-wider uppercase block mb-3">
            Why GenZ Era World
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wider">
            WHY CHOOSE
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-purple-light"> US</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group bg-brand-card border border-brand-border hover:border-brand-purple/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-card-hover"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center mb-4 group-hover:bg-brand-purple/30 group-hover:shadow-purple-sm transition-all duration-300">
                  <Icon size={20} className="text-brand-purple-light" />
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
