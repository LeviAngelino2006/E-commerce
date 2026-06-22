import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * Botón reutilizable con feedback de pulsación (Framer Motion).
 * Variantes: primary (negro), outline, ghost. Puede renderizar como
 * <button>, <a> o <Link> según las props (to / href).
 */
const VARIANTS = {
  primary:
    'bg-ink text-bg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed',
  outline:
    'border border-ink text-ink hover:bg-ink hover:text-bg disabled:opacity-40 disabled:cursor-not-allowed',
  ghost: 'text-ink hover:bg-ink/5 disabled:opacity-40',
}

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  full = false,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-wide transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${full ? 'w-full' : ''} ${className}`

  const motionProps = {
    whileTap: { scale: 0.97 },
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  }

  if (to) {
    return (
      <motion.div {...motionProps} className={full ? 'w-full' : 'inline-flex'}>
        <Link to={to} className={classes} {...props}>
          {children}
        </Link>
      </motion.div>
    )
  }

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps} {...props}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button className={classes} {...motionProps} {...props}>
      {children}
    </motion.button>
  )
}
