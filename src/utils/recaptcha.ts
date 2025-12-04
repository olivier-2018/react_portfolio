import logger from "./logger"

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"
const RECAPTCHA_SCORE_THRESHOLD = 0.7

interface RecaptchaResponse {
   success: boolean
   score: number
   action: string
   challenge_ts: string
   hostname: string
   error_codes?: string[]
}

/**
 * Verify reCAPTCHA v3 token with Google's verification API
 * @param token - reCAPTCHA token from frontend
 * @param secretKey - reCAPTCHA secret key from environment
 * @returns { isValid: boolean; score: number }
 */
export async function verifyRecaptchaToken(
   token: string,
   secretKey: string
): Promise<{ isValid: boolean; score: number }> {
   try {
      if (!token) {
         logger.warn("reCAPTCHA token is missing")
         return { isValid: false, score: 0 }
      }

      if (!secretKey) {
         logger.error("reCAPTCHA secret key is not configured")
         return { isValid: false, score: 0 }
      }

      // Call Google's verification endpoint
      const response = await fetch(RECAPTCHA_VERIFY_URL, {
         method: "POST",
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
         },
         body: `secret=${secretKey}&response=${token}`,
      })

      if (!response.ok) {
         logger.error(`reCAPTCHA verification API returned status ${response.status}`)
         return { isValid: false, score: 0 }
      }

      const data = (await response.json()) as RecaptchaResponse

      // Check if verification was successful
      if (!data.success) {
         logger.warn(`reCAPTCHA verification failed: ${data.error_codes?.join(", ")}`)
         return { isValid: false, score: data.score || 0 }
      }

      // Check score threshold
      if (data.score < RECAPTCHA_SCORE_THRESHOLD) {
         logger.warn(`reCAPTCHA score too low: ${data.score} (threshold: ${RECAPTCHA_SCORE_THRESHOLD})`)
         return { isValid: false, score: data.score }
      }

      logger.info(`reCAPTCHA verification successful: score=${data.score}`)
      return { isValid: true, score: data.score }
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      logger.error(`reCAPTCHA verification error: ${message}`)
      return { isValid: false, score: 0 }
   }
}
