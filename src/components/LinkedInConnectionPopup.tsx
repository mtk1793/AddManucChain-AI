'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Linkedin } from 'lucide-react'
import { useLinkedInPopup } from '@/hooks/useLinkedInPopup'

export function LinkedInConnectionPopup() {
  const { showPopup, dismissPopup } = useLinkedInPopup()

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismissPopup}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Popup Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={dismissPopup}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Gradient Top Border */}
              <div className="h-1 bg-gradient-to-r from-[#0A2E5C] via-[#1B6B6F] to-[#0A2E5C]" />

              {/* Close Button */}
              <button
                onClick={dismissPopup}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="pt-8 pb-8 px-8 text-center">
                {/* Headshot Image */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-6 flex justify-center"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-[#0A2E5C] overflow-hidden shadow-lg">
                      <img
                        src="/mahmoud-headshot.jpg"
                        alt="Mahmoud Kiasari"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#1B6B6F] opacity-20" />
                  </div>
                </motion.div>

                {/* Personalized Greeting */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <h2 className="text-2xl font-bold text-[#0A2E5C] mb-3">
                    Let's Connect
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    I'm <span className="font-semibold text-[#0A2E5C]">Mahmoud Kiasari</span>, CEO of <span className="font-semibold text-[#1B6B6F]">AddManuChain</span>. Building certified digital manufacturing infrastructure for Navy, Aerospace, O&G, and Maritime operations. 70+ customer interviews validated. Let's explore how we can solve your supply chain challenges.
                  </p>
                </motion.div>

                {/* LinkedIn Button */}
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  href="https://www.linkedin.com/in/mahmoud-kiasari-662b19133/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismissPopup}
                  className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#0A2E5C] to-[#1B6B6F] hover:shadow-lg text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>Connect on LinkedIn</span>
                </motion.a>

                {/* Dismiss Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-gray-400 mt-4"
                >
                  Click the X or outside to dismiss
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
