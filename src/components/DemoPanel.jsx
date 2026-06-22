import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseIcon } from './icons.jsx'
import { brand } from '../config/brand.js'

export default function DemoPanel() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {/* Botón flotante — esquina inferior izquierda */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Sobre este demo"
        title="Sobre este demo"
        className="fixed bottom-6 left-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-ink/80 text-bg shadow-lg backdrop-blur transition-colors hover:bg-ink"
      >
        <span className="text-base font-bold leading-none" aria-hidden="true">i</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-ink/50"
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Sobre este demo"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 border-l-4 border-accent bg-[#111] p-6 text-[#f0f0f0] shadow-2xl sm:p-8"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#f0f0f0]/50">
                    Template · Demo
                  </p>
                  <h2 className="text-xl font-bold tracking-tight">Sobre este demo</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="mt-0.5 transition-colors text-[#f0f0f0]/60 hover:text-[#f0f0f0]"
                >
                  <CloseIcon />
                </button>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-[#f0f0f0]/70">
                Este es un demo re-skinnable. La versión real para cada marca incluye:
              </p>

              <ul className="space-y-2.5">
                {brand.roadmapReal.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-px shrink-0 font-mono text-accent">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-[#f0f0f0]/10 pt-4">
                <p className="text-[11px] text-[#f0f0f0]/40">
                  Desarrollado como template re-skinnable de e-commerce.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
