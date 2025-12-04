/**
 * ChatbotDialog Component
 * Floating modal positioned bottom-right corner
 * Size: 25% width × 50% height (responsive on mobile)
 *
 * Props:
 * - isOpen: boolean - Controls dialog visibility
 * - onClose: () => void - Callback when dialog closes
 * - animationType: 'zoom-spring' | 'slide-bottom' | 'fade-scale' | 'bounce-in' - Entrance animation
 */

import { ChatbotWidget } from "./ChatbotWidget"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface ChatbotDialogProps {
   isOpen: boolean
   onClose: () => void
   animationType?: "zoom-spring" | "slide-bottom" | "fade-scale" | "bounce-in"
}

export function ChatbotDialog({ isOpen, onClose, animationType = "zoom-spring" }: ChatbotDialogProps) {
   const [mounted, setMounted] = useState(false)

   useEffect(() => {
      setMounted(true)
   }, [])

   // Handle ESC key - always set up, but only active when isOpen
   useEffect(() => {
      if (!isOpen) return

      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            onClose()
         }
      }

      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
   }, [isOpen, onClose])

   if (!mounted || !isOpen) return null

   // Animation variants
   const animationMap: Record<string, string> = {
      "zoom-spring": "animate-in zoom-in-95 duration-300 ease-out",
      "slide-bottom": "animate-in slide-in-from-bottom-4 duration-400 ease-out",
      "fade-scale": "animate-in fade-in duration-300 ease-out scale-95",
      "bounce-in": "animate-in duration-500 ease-out",
   }

   return (
      <>
         {/* Semi-transparent backdrop */}
         <div className="fixed inset-0 z-40 bg-black/50 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />

         {/* Chatbot modal - bottom right corner */}
         <div
            className={`
          fixed bottom-6 right-6 z-50
          w-[35vw] h-[80vh]
          lg:w-[35vw] lg:h-[80vh]
          md:w-[50vw] md:h-[70vh]
          sm:w-[90vw] sm:h-[75vh]
          max-h-[90vh] max-w-[95vw]
          rounded-2xl
          bg-white dark:bg-slate-900
          shadow-2xl
          flex flex-col
          overflow-hidden
          ${animationMap[animationType]}
        `}
            style={{
               boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
         >
            {/* Header with close button */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary to-secondary flex-shrink-0 rounded-t-2xl">
               <div>
                  <h3 className="text-base font-bold text-white">Portfolio Assistant</h3>
                  <p className="text-xs text-white/80">Powered by Copilot Studio</p>
               </div>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  aria-label="Close chatbot"
               >
                  <X className="w-5 h-5 text-white" />
               </button>
            </div>

            {/* Chatbot content - white background */}
            <div className="flex-1 overflow-hidden min-h-0 bg-white dark:bg-slate-800">
               <ChatbotWidget animationType={animationType} />
            </div>
         </div>
      </>
   )
}
