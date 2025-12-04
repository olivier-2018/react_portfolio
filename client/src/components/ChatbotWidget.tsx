/**
 * ChatbotWidget Component
 * Integrates Copilot Studio chatbot using Bot Framework Web Chat npm package
 * This imports directly from the package to avoid CDN issues
 *
 * Props:
 * - animationType: 'zoom-spring' | 'slide-bottom' | 'fade-scale' | 'bounce-in' (entrance animation)
 */

import { useEffect, useRef } from "react"
import { createDirectLine, renderWebChat } from "botframework-webchat"

interface ChatbotWidgetProps {
   animationType?: "zoom-spring" | "slide-bottom" | "fade-scale" | "bounce-in"
}

export function ChatbotWidget({ animationType = "zoom-spring" }: ChatbotWidgetProps) {
   const containerRef = useRef<HTMLDivElement>(null)

   // Animation class mapping
   const animationMap: Record<string, string> = {
      "zoom-spring": "animate-in zoom-in-95 duration-300 ease-out",
      "slide-bottom": "animate-in slide-in-from-bottom-3 duration-400 ease-out",
      "fade-scale": "animate-in fade-in duration-300 ease-out",
      "bounce-in": "animate-in bounce duration-500 ease-out",
   }

   useEffect(() => {
      if (!containerRef.current) return

      const container = containerRef.current
      let isMounted = true

      const initializeChat = async () => {
         try {
            console.log("📡 Fetching Direct Line token from backend...")

            // Determine correct backend URL (use localhost in dev mode)
            const isDevMode = process.env.NODE_ENV === "development"
            const backendUrl = isDevMode ? "http://localhost" : import.meta.env.VITE_BACKEND_URL || "http://localhost"
            const backendPort = import.meta.env.VITE_BACKEND_PORT || "3003"
            const apiPrefix = import.meta.env.VITE_API_PREFIX || "/api/v1"

            const tokenUrl = `${backendUrl}:${backendPort}${apiPrefix}/chatbot/directline-token`
            console.log(`Fetching from: ${tokenUrl}`)

            const tokenResponse = await fetch(tokenUrl, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
            })

            if (!tokenResponse.ok) {
               throw new Error(`Failed to get Direct Line token: ${tokenResponse.statusText}`)
            }

            const { token } = await tokenResponse.json()

            if (!isMounted) return

            console.log("✅ Direct Line token received")

            // Create WebChat component
            const styleOptions = {
               // Remove upload button
               hideUploadButton: true,

               // Conversation box background - pure violet
               backgroundColor: "#ddd6fe",

               // AI bubble - white background with dark text (matching user style)
               bubbleBackground: "#ffffff",
               bubbleTextColor: "#000000",
               bubbleBorderRadius: 16,

               // User bubble - white background with black text for contrast
               bubbleFromUserBackground: "#ffffff",
               bubbleFromUserTextColor: "#000000",
               bubbleFromUserBorderRadius: 16,

               // User avatar - green background
               userAvatarBackgroundColor: "#10b981",

               // Remove backgrounds
               inputTextBoxBorderRadius: 8,
               inputBoxBorderColor: "#d1d5db",
               transcriptActivityBackground: "transparent",

               // Avatar styling
               botAvatarInitials: "AI",
               userAvatarInitials: "You",

               // Accent color
               accent: "#0078d4",
            }

            container.innerHTML = ""

            const directLine = createDirectLine({
               token,
            })

            renderWebChat(
               {
                  directLine,
                  userID: "user-id-" + new Date().getTime(),
                  styleOptions,
                  webSpeechPonyfill: {
                     speechSynthesis: undefined,
                     speechRecognition: undefined,
                  },
               },
               container
            )

            // Send initial greeting to trigger agent conversation
            setTimeout(() => {
               directLine
                  .postActivity({
                     type: "event",
                     name: "StartConversation",
                     from: {
                        id: "user-id-" + new Date().getTime(),
                        name: "User",
                     },
                     value: {},
                  })
                  .subscribe()
            }, 500)

            console.log("✅ Bot Framework Web Chat loaded successfully")
         } catch (error) {
            if (isMounted) {
               console.error("❌ Failed to initialize Web Chat:", error)
               showFallback()
            }
         }
      }

      function showFallback() {
         if (isMounted) {
            container.innerHTML = `
               <div style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100%;
                  padding: 20px;
                  text-align: center;
                  background: white;
                  color: #333;
               ">
                  <p style="margin: 0 0 10px 0; font-weight: bold;">Chat with AI Assistant</p>
                  <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">Open in a new window to chat</p>
                  <a href="https://copilotstudio.microsoft.com/environments/df7d7b8e-d181-ee0e-a200-e31603502119/bots/cre4a_portfolioChatbot/webchat?__version__=2" target="_blank" rel="noopener noreferrer" style="
                     background: #0078d4;
                     color: white;
                     padding: 10px 20px;
                     border-radius: 4px;
                     text-decoration: none;
                     font-size: 14px;
                     cursor: pointer;
                  ">
                     Open Chat
                  </a>
               </div>
            `
         }
      }

      initializeChat()

      return () => {
         isMounted = false
      }
   }, [])

   return (
      <div
         ref={containerRef}
         className={`w-full h-full overflow-hidden ${animationMap[animationType]}`}
         style={{
            position: "relative",
            backgroundColor: "white",
            border: "2px solid #ccc",
         }}
      />
   )
}
