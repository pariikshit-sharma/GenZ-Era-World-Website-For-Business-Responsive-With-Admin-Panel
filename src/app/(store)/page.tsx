import HeroSection from '@/components/store/HeroSection'
import FeaturedSection from '@/components/store/FeaturedSection'
import CategorySection from '@/components/store/CategorySection'
import ProductsSection from '@/components/store/ProductsSection'
import WhyChooseUs from '@/components/store/WhyChooseUs'
import InstagramSection from '@/components/store/InstagramSection'
import ContactSection from '@/components/store/ContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <CategorySection />
      <ProductsSection type="action-figures" title="Action Figures" />
      <ProductsSection type="t-shirts" title="T-Shirts" />
      <ProductsSection type="sneakers" title="Sneakers" />
      <ProductsSection type="new-arrivals" title="New Arrivals" />
      <ProductsSection type="trending" title="Trending" />
      <WhyChooseUs />
      <InstagramSection />
      <ContactSection />
    </>
  )
}
