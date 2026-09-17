"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type SubmitStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function RsvpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDebug, setIsDebug] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const [status, setStatus] = useState<SubmitStatus>({
    type: "idle",
    message: ""
  });

  useEffect(() => {
    setIsDebug(new URLSearchParams(window.location.search).get("debug") === "rsvp");
  }, []);

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
    const attendingValue = String(formData.get("attending") ?? "");
    const isAttending = attendingValue === "yes";
    const peopleValue = isAttending
      ? Number(formData.get("number_of_people") ?? 1)
      : 1;
    const busValue = isAttending
      ? String(formData.get("bus_needed") ?? "")
      : "no";
    const companionNames = String(formData.get("companion_names") ?? "")
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);

    if (!guestName || !attendingValue) {
      setStatus({
        type: "error",
        message: "Completa nombre y asistencia."
      });
      return;
    }

    if (isAttending && (!busValue || peopleValue < 1)) {
      setStatus({
        type: "error",
        message: "Indica personas y autobús."
      });
      return;
    }

    if (isAttending && peopleValue > 1 && companionNames.length === 0) {
      setStatus({
        type: "error",
        message: "Indica el nombre de los acompañantes."
      });
      return;
    }

    formData.set("attending", attendingValue);

    if (!isAttending) {
      formData.set("number_of_people", "1");
      formData.set("bus_needed", "no");
      formData.delete("companion_names");
      formData.delete("dietary_notes");
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/rsvps", {
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
          message: result?.message ?? "No se pudo guardar la respuesta."
        });
        return;
      }

      form.reset();
      setPeopleCount(1);
      setStatus({
        type: "success",
        message:
          result?.message ?? "Respuesta guardada. Gracias por confirmar."
      });
    } catch {
      setStatus({
        type: "error",
        message:
          "No se pudo enviar la respuesta. Revisa la conexión e inténtalo de nuevo."
      });
      return;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      action="/api/rsvps"
      className="form-panel"
      method="post"
      onSubmit={handleSubmit}
    >
      <div className="field-grid">
        <label className="field">
          Nombre
          <input name="guest_name" placeholder="Tu nombre" required />
        </label>
        <div className="field full">
          Asistencia
          <div className="rsvp-choice-stack">
            <section className="rsvp-choice">
              <input
                className="rsvp-choice-input"
                id="attending-yes"
                name="attending"
                onChange={() => {
                  setPeopleCount(1);
                }}
                type="radio"
                value="yes"
              />
              <label className="rsvp-choice-trigger" htmlFor="attending-yes">
                <span>Sí, allí estaré</span>
              </label>
              <div className="rsvp-details-grid">
                <label className="field">
                  Personas
                  <input
                    min="1"
                    name="number_of_people"
                    onChange={(event) =>
                      setPeopleCount(
                        Math.max(1, Number(event.target.value) || 1)
                      )
                    }
                    placeholder="1"
                    type="number"
                    defaultValue="1"
                  />
                </label>
                <label className="field">
                  Servicio de autobús
                  <select defaultValue="" name="bus_needed">
                    <option value="" disabled>
                      Selecciona
                    </option>
                    <option value="round_trip">Sí, quiero autobús ida y vuelta</option>
                    <option value="outbound_only">Sí, quiero autobús solo ida</option>
                    <option value="no">No, voy por mi cuenta</option>
                  </select>
                </label>
                <label className="field full">
                  Nombres de acompañantes
                  <textarea
                    name="companion_names"
                    placeholder="Si venís más de una persona, un nombre por línea"
                  />
                </label>
                <label className="field full">
                  Alergias o intolerancias
                  <textarea
                    name="dietary_notes"
                    placeholder="Si no tienes, puedes dejarlo en blanco"
                  />
                </label>
              </div>
            </section>
            <section className="rsvp-choice">
              <input
                className="rsvp-choice-input"
                id="attending-no"
                name="attending"
                onChange={() => {
                  setPeopleCount(1);
                }}
                type="radio"
                value="no"
              />
              <label className="rsvp-choice-trigger" htmlFor="attending-no">
                <span>No podré ir</span>
              </label>
              <p className="rsvp-note">
                Gracias por avisarnos. Puedes dejarnos un mensaje abajo si te
                apetece.
              </p>
            </section>
          </div>
        </div>
        <label className="field full">
          Mensaje
          <textarea
            name="message"
            placeholder="Algo que nos quieras decir"
          />
        </label>
        {isDebug ? (
          <p className="form-status">
            Debug RSVP: usa los radios nativos; si se ve el bloque de Si, el
            móvil ha marcado asistencia=yes. Personas=
            {peopleCount}
          </p>
        ) : null}
      </div>
      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Enviando..." : "Enviar respuesta"}
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
