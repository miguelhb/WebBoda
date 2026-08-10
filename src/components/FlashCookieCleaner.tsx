"use client";

import { useEffect } from "react";

export function FlashCookieCleaner() {
  useEffect(() => {
    document.cookie =
      "wedding_form_flash=; Max-Age=0; path=/; SameSite=Lax";
  }, []);

  return null;
}
