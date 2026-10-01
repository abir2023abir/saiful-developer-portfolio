"use client";

import { usePathname } from "next/navigation";

/** Bangladesh mobile, leading 0 dropped, country code added. */
const WHATSAPP = "https://wa.me/8801410210153";

/**
 * Stays pinned to the bottom-right of the viewport, including while the page
 * scrolls. Hidden in the admin, where it would sit on top of the sign-in form.
 */
export default function WhatsAppButton() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp, 01410210153"
      className="fixed bottom-5 right-5 z-[70] grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:scale-105 focus-visible:outline-white"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.8.6.6-3.7-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.5 4 15 15 0 0 0 1.5.5 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.6-.3Z"
        />
      </svg>
    </a>
  );
}
