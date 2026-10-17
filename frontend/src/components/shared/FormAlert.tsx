import { CircleAlert } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

/** Erro geral do formulário (ex.: resposta da API), com entrada/saída suave. */
export function FormAlert({ message }: { message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          key={message}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
