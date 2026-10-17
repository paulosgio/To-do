import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/** Fade + leve deslize na entrada e na saída de cada página (orquestrado pelo AnimatePresence das rotas). */
export function AnimatedPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
