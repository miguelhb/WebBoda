"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type SubmitStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function SongSuggestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const [status, setStatus] = useState<SubmitStatus>({
    type: "idle",
    message: ""
  });

  useEffect(() => {
    if (status.message) {
      statusRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [status.message]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(form);
    const guestName = String(formData.get("guest_name") ?? "").trim();
    const songTitle = String(formData.get("song_title") ?? "").trim();

    if (!guestName || !songTitle) {
      setStatus({
        type: "error",
        message: "Indica tu nombre y la cancion."
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/song-suggestions", {
        body: formData,
        headers: {
          Accept: "application/json"
        },
        method: "POST",
      });
      const result = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        setStatus({
          type: "error",
          message: result?.message ?? "No se pudo guardar la cancion."
        });
        return;
      }

      form.reset();
      setStatus({
        type: "success",
        message:
          result?.message ??
          "Cancion guardada. Prometemos valorar seriamente cada temazo."
      });
    } catch {
      setStatus({
        type: "error",
        message:
          "No se pudo enviar la cancion. Revisa la conexion e intentalo de nuevo."
      });
      return;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      action="/api/song-suggestions"
      className="form-panel"
      method="post"
      onSubmit={handleSubmit}
    >
      <div className="field-grid">
        <label className="field">
          Nombre
          <input name="guest_name" placeholder="Tu nombre" required />
        </label>
        <label className="field">
          Cancion
          <input name="song_title" placeholder="Nombre de la cancion" required />
        </label>
        <label className="field">
          Artista
          <input name="artist" placeholder="Artista o grupo" />
        </label>
      </div>
      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Guardando..." : "Sugerir cancion"}
      </button>
      {status.message ? (
        <p
          aria-live="polite"
          className={`form-status ${status.type}`}
          ref={statusRef}
          tabIndex={-1}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
