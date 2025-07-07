import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.EMAILJS_PUBLIC_KEY;

if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
  console.error(
    "EmailJS environment variables are missing. Please check your .env file."
  );
}

/**
 * Sends a contact form email using EmailJS.
 * @param {object} templateParams - The parameters for the email template (e.g., { from_name, from_email, message }).
 * @returns {Promise} A promise that resolves on success or rejects on failure.
 */
export const sendContactEmail = (templateParams) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return Promise.reject(new Error("EmailJS is not configured."));
  }

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
};
