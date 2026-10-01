/** Local mobile number, shown on the site. */
export const WHATSAPP_DISPLAY = "01410210153";

/** Country code 880, leading 0 removed. This is what wa.me expects. */
export const WHATSAPP_E164 = "8801410210153";

export function whatsAppHref(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_E164}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

/** The note that opens in WhatsApp after the contact form is saved. */
export function enquiryText(name: string, email: string, message: string): string {
  const clipped = message.length > 1200 ? `${message.slice(0, 1200)}…` : message;
  return `Portfolio enquiry\nName: ${name}\nEmail: ${email}\n\n${clipped}`;
}
