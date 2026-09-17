"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";

export type Gift = {
  id: string;
  title: string;
  description: string | null;
  target_amount: number | null;
  image_url: string | null;
};

export type Contribution = {
  gift_id: string;
  total_amount: number;
};

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

type GiftSectionClientProps = {
  initialContributions: Contribution[];
  initialError?: string;
  initialGifts: Gift[];
};

export function GiftSectionClient({
  initialContributions,
  initialError,
  initialGifts
}: GiftSectionClientProps) {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [contributions, setContributions] =
    useState<Contribution[]>(initialContributions);
  const [isClientLoading, setIsClientLoading] = useState(
    initialGifts.length === 0
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStatusGiftId, setActiveStatusGiftId] = useState("");
  const [status, setStatus] = useState<FormStatus>(
    initialError
      ? { type: "error", message: initialError }
      : { type: "idle", message: "" }
  );
  useEffect(() => {
    let isMounted = true;

    async function loadFromBrowser() {
      if (initialGifts.length > 0) {
        setIsClientLoading(false);
        return;
      }

      if (!hasSupabaseConfig || !supabase) {
        setIsClientLoading(false);
        setStatus({
          type: "error",
          message: "Falta configurar Supabase en .env.local."
        });
        return;
      }

      setIsClientLoading(true);
      setStatus({ type: "idle", message: "" });

      const giftsResult = await withTimeout(
        supabase
          .from("gifts")
          .select("id,title,description,target_amount,image_url")
          .eq("is_active", true)
          .order("created_at", { ascending: true }),
        9000
      );

      if (!isMounted) {
        return;
      }

      if (giftsResult.error) {
        setIsClientLoading(false);
        setStatus({
          type: "error",
          message: `No se pudieron cargar los regalos: ${giftsResult.error.message}`
        });
        return;
      }

      setGifts(giftsResult.data ?? []);
      setIsClientLoading(false);

      const contributionsResult = await withTimeout(
        supabase.rpc("gift_totals"),
        9000
      );

      if (!isMounted) {
        return;
      }

      if (!contributionsResult.error) {
        setContributions(contributionsResult.data ?? []);
      }
    }

    loadFromBrowser();

    return () => {
      isMounted = false;
    };
  }, [initialGifts.length]);

  const totalsByGift = useMemo(() => {
    return contributions.reduce<Record<string, number>>((totals, item) => {
      totals[item.gift_id] = Number(item.total_amount);
      return totals;
    }, {});
  }, [contributions]);

  async function handleContributionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(form);
    const giftId = String(formData.get("gift_id") ?? "").trim();
    const giftTitle = String(formData.get("gift_title") ?? "este regalo").trim();
    const contributorName = String(formData.get("contributor_name") ?? "").trim();
    const amount = parseEuroAmount(String(formData.get("amount") ?? ""));
    const message = String(formData.get("message") ?? "").trim();

    if (!giftId || !contributorName || amount <= 0) {
      setActiveStatusGiftId(giftId);
      setStatus({
        type: "error",
        message: "Indica tu nombre, el regalo y una cantidad mayor que cero."
      });
      return;
    }

    setIsSubmitting(true);
    setActiveStatusGiftId(giftId);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/gift-contributions", {
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
          message: result?.message ?? "No se pudo guardar la aportación."
        });
        return;
      }

      setContributions((current) => [
        ...current.filter((item) => item.gift_id !== giftId),
        {
          gift_id: giftId,
          total_amount: (totalsByGift[giftId] ?? 0) + amount
        }
      ]);
      form.reset();
      setStatus({
        type: "success",
        message:
          result?.message ??
          `Aportación registrada para ${giftTitle}. Gracias por acompañarnos en esta etapa; cuando hagas la transferencia podremos organizarlo todo con calma.`
      });
    } catch {
      setStatus({
        type: "error",
        message:
          "No se pudo enviar la aportación. Revisa la conexión e inténtalo de nuevo."
      });
      return;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {status.message && !activeStatusGiftId ? (
        <p className={`form-status gift-status ${status.type}`}>
          {status.message}
        </p>
      ) : null}

      {isClientLoading ? (
        <p className="section-copy">Cargando regalos...</p>
      ) : null}

      {!isClientLoading && gifts.length === 0 && status.type !== "error" ? (
        <div className="empty-state">
          Todavía no hay regalos activos. Ejecuta el SQL de ejemplo en Supabase
          para cargar los primeros.
        </div>
      ) : null}

      <div className="account-note">
        <div>
          <h3>También para nuestra nueva etapa</h3>
          <p>
            Si preferís no elegir una parte concreta del viaje, podéis usar la
            misma cuenta para una aportación general.
          </p>
        </div>
        <span>ES16 0073 0100 5508 8516 4407</span>
      </div>

      <div className="gifts">
        {gifts.map((gift) => {
          const collected = totalsByGift[gift.id] ?? 0;
          const target = Number(gift.target_amount ?? 0);
          const publicProgress = getPublicGiftProgress(collected, target);

          return (
            <article className="gift" key={gift.id}>
              <div
                className="gift-image"
                style={{
                  backgroundImage: `url(${
                    gift.image_url ??
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80"
                  })`
                }}
              />
              <div className="gift-body">
                <h3>{gift.title}</h3>
                <p>{gift.description}</p>
                {target > 0 ? (
                  <>
                    <div
                      className="progress"
                      aria-label={`Estado del regalo: ${publicProgress.label}`}
                    >
                      <span style={{ width: publicProgress.width }} />
                    </div>
                    <p className="gift-meta">
                      {publicProgress.label} - Coste orientativo{" "}
                      {formatEuros(target)}
                    </p>
                  </>
                ) : null}
                <details className="gift-contribution">
                  <summary>Participar</summary>
                  <form
                    action="/api/gift-contributions"
                    method="post"
                    onSubmit={handleContributionSubmit}
                  >
                    <input name="gift_id" type="hidden" value={gift.id} />
                    <input name="gift_title" type="hidden" value={gift.title} />
                    <p className="transfer-note">
                      Con esto sabremos en qué etapa quieres participar. Para
                      completarlo, solo queda hacer la transferencia cuando
                      puedas:
                      <strong> ES16 0073 0100 5508 8516 4407</strong>
                    </p>
                    <label className="field">
                      Nombre
                      <input
                        name="contributor_name"
                        placeholder="Tu nombre"
                        required
                      />
                    </label>
                    <label className="field">
                      Cantidad
                      <input
                        inputMode="numeric"
                        min="1"
                        name="amount"
                        onInput={(event) => {
                          event.currentTarget.value = formatAmountInput(
                            event.currentTarget.value
                          );
                        }}
                        placeholder="50"
                        type="text"
                        required
                      />
                    </label>
                    <label className="field">
                      Mensaje opcional
                      <textarea
                        name="message"
                        placeholder="Algo que nos quieras decir"
                      />
                    </label>
                    <button
                      className="button"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {isSubmitting ? "Guardando..." : "Registrar aportación"}
                    </button>
                    {status.message && activeStatusGiftId === gift.id ? (
                      <p
                        aria-live="polite"
                        className={`form-status ${status.type}`}
                      >
                        {status.message}
                      </p>
                    ) : null}
                  </form>
                </details>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function formatEuros(value: number) {
  return new Intl.NumberFormat("es-ES", {
    currency: "EUR",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(value);
}

function formatAmountInput(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 0
  }).format(Number(digits));
}

function parseEuroAmount(value: string) {
  return Number(value.replace(/\./g, "").replace(",", "."));
}

function getPublicGiftProgress(collected: number, target: number) {
  if (target <= 0 || collected <= 0) {
    return {
      label: "Primeros pasos",
      width: "12%"
    };
  }

  const ratio = collected / target;

  if (ratio >= 1) {
    return {
      label: "Etapa cubierta",
      width: "100%"
    };
  }

  if (ratio >= 0.9) {
    return {
      label: "Ultimo tramo",
      width: "88%"
    };
  }

  if (ratio >= 0.65) {
    return {
      label: "Muy avanzado",
      width: "72%"
    };
  }

  if (ratio >= 0.35) {
    return {
      label: "Ya va tomando forma",
      width: "48%"
    };
  }

  return {
    label: "Primeros pasos",
    width: "22%"
  };
}

async function withTimeout<T extends { data: unknown; error: unknown }>(
  promise: PromiseLike<T>,
  timeoutMs: number
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("La conexión ha tardado demasiado."));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Error desconocido.")
    } as T;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
