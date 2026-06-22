import { AnimatePresence, motion } from 'framer-motion'
import { useUiStore } from '../store/uiStore.js'

export default function ToastStack() {
  const toasts = useUiStore((s) => s.toasts)
  const removeToast = useUiStore((s) => s.removeToast)

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-6 right-4 z-[70] flex flex-col items-end gap-2 sm:right-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="pointer-events-auto flex cursor-pointer items-center gap-3 border border-line bg-bg px-4 py-3 shadow-md"
            onClick={() => removeToast(toast.id)}
            role="status"
          >
            {/* check circle inline SVG */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="shrink-0 text-accent"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <circle cx="8" cy="8" r="7" />
              <path d="M5 8l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[11px] uppercase tracking-widest">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
