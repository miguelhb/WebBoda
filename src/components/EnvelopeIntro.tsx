"use client";

import { useEffect, useState } from "react";

const storageKey = "wedding-envelope-intro-seen";

export function EnvelopeIntro() {
  const [shouldShow, setShouldShow] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  const closeIntro = () => {
    try {
      sessionStorage.setItem(storageKey, "true");
    } catch {
      // If sessionStorage is unavailable, the intro simply plays again next load.
    }

    setShouldShow(false);
  };

  useEffect(() => {
    let hasSeenIntro = false;

    try {
      hasSeenIntro = sessionStorage.getItem(storageKey) === "true";
    } catch {
      hasSeenIntro = false;
    }

    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || hasSeenIntro) {
      setShouldShow(false);
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, 4800);
    const removeTimer = window.setTimeout(() => {
      closeIntro();
    }, 5150);

    return () => {
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      aria-label="Abriendo invitacion"
      className={`envelope-intro${isLeaving ? " leaving" : ""}`}
      onAnimationEnd={(event) => {
        if (event.currentTarget === event.target) {
          closeIntro();
        }
      }}
      role="status"
    >
      <img
        aria-hidden="true"
        alt=""
        className="envelope-video"
        src="/envelope-intro.webp"
      />
    </div>
  );
}
