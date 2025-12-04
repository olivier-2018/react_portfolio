/// <reference types="vite/client" />

interface ImportMetaEnv {
   readonly VITE_API_PREFIX: string
   readonly VITE_BACKEND_URL: string
   readonly VITE_BACKEND_PORT: string
   readonly VITE_FRONTEND_PORT: string
   readonly VITE_RECAPTCHA_SITE_KEY: string
   readonly VITE_EMAILJS_SERVICE_ID: string
   readonly VITE_EMAILJS_TEMPLATE_ID: string
   readonly VITE_EMAILJS_PUBLIC_KEY: string
   readonly VITE_DB_SELECT: string
   readonly VITE_SUPABASE_URL: string
   readonly VITE_SUPABASE_ANON_KEY: string
   readonly VITE_GIT_COMMIT_DATE: string
}

interface ImportMeta {
   readonly env: ImportMetaEnv
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}
declare module '*.gif' {
  const value: string;
  export default value;
}
