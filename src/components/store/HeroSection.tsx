'use client'

import Link from 'next/link'
import { Zap, ChevronDown } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number; y: number; vy: number; vx: number;
      size: number; opacity: number; color: string
    }> = []

    const colors = ['#7c3aed', '#9d4edd', '#b44ef0', '#c77dff']

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vy: -(0.2 + Math.random() * 0.8),
        vx: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let animId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()

        p.y += p.vy
        p.x += p.vx

        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
        }
      })

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black lightning-bg">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-40 z-0" />

      {/* Purple glow center */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-purple/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full bg-brand-purple-glow/15 blur-[60px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 bg-brand-purple/20 border border-brand-purple/40 rounded-full px-4 py-1.5 text-sm text-brand-purple-light mb-8 animate-fade-up">
          <Zap size={14} className="text-brand-purple animate-pulse" />
          <span>Not Your Average Pop Culture Store</span>
        </div>

        {/* Main heading */}
        <h1
          className="font-display text-6xl sm:text-8xl lg:text-[120px] text-white leading-none mb-4 tracking-wider"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <span className="block">WELCOME TO</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-purple-bright to-brand-purple-light glow-text">
            GENZERA
          </span>
          <span className="block text-4xl sm:text-5xl lg:text-6xl text-white/80 tracking-[0.2em]">WORLD</span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-300 text-base sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
          Premium Action Figures, Sneakers, Apparel & Collectibles
        </p>
        <p className="text-brand-purple-light/60 text-sm mb-10 tracking-[0.15em] uppercase">
          GenZ Era World by Kabir Luthra
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="btn-primary text-base px-8 py-4 rounded-xl flex items-center gap-2 group"
          >
            <Zap size={18} className="group-hover:animate-bounce" />
            Explore Collection
          </Link>
          <Link
            href="/shop"
            className="btn-outline text-base px-8 py-4 rounded-xl"
          >
            Shop Now
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-brand-border/50">
          {[
            { label: 'Premium Quality', value: '100%' },
            { label: 'Pan India', value: 'Shipping' },
            { label: 'Secure', value: 'Payments' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl sm:text-3xl text-brand-purple-light glow-text-sm">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <ChevronDown size={24} className="text-brand-purple/60" />
      </div>
    </section>
  )
}
