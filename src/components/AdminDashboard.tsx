"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";

type Rsvp = {
  id: string;
  guest_name: string;
  attending: boolean;
  number_of_people: number;
  companion_names: string[];
  dietary_notes: string | null;
  bus_needed: boolean;
  bus_stop: string | null;
  message: string | null;
  submitted_at: string;
};

type Contribution = {
  id: string;
  gift_id: string;
  contributor_name: string;
  amount: number;
  message: string | null;
  created_at: string;
  gifts: { title: string } | { title: string }[] | null;
};

type Gift = {
  id: string;
  title: string;
  description: string | null;
  target_amount: number | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
};

type SongSuggestion = {
  id: string;
  guest_name: string;
  song_title: string;
  artist: string | null;
  moment: string | null;
  message: string | null;
  created_at: string;
};

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [songs, setSongs] = useState<SongSuggestion[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingGift, setIsCreatingGift] = useState(false);
  const [isUpdatingGift, setIsUpdatingGift] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setIsLoadingSession(false);
      setStatus({
        type: "error",
        message: "Falta configurar Supabase en .env.local."
      });
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setIsLoadingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setRsvps([]);
      setContributions([]);
      setGifts([]);
      setSongs([]);
      return;
    }

    loadAdminData();
  }, [user]);

  const stats = useMemo(() => {
    const attendingRsvps = rsvps.filter((rsvp) => rsvp.attending);
    const confirmedPeople = attendingRsvps.reduce(
      (total, rsvp) => total + rsvp.number_of_people,
      0
    );
    const busSeats = attendingRsvps.reduce(
      (total, rsvp) => total + (rsvp.bus_needed ? rsvp.number_of_people : 0),
      0
    );
    const totalGiftAmount = contributions.reduce(
      (total, contribution) => total + Number(contribution.amount),
      0
    );
    const giftTotals = contributions.reduce<Record<string, number>>(
      (totals, contribution) => {
        totals[contribution.gift_id] =
          (totals[contribution.gift_id] ?? 0) + Number(contribution.amount);
        return totals;
      },
      {}
    );

    return {
      attendingRsvps,
      busSeats,
      confirmedPeople,
      giftTotals,
      songCount: songs.length,
      totalGiftAmount
    };
  }, [contributions, rsvps, songs.length]);

  async function loadAdminData() {
    if (!supabase) {
      return;
    }

    setIsLoadingData(true);
    setStatus({ type: "idle", message: "" });

    const [rsvpResult, contributionResult, giftResult, songResult] =
      await Promise.all([
      supabase
        .from("rsvps")
        .select(
          "id,guest_name,attending,number_of_people,companion_names,dietary_notes,bus_needed,bus_stop,message,submitted_at"
        )
        .order("submitted_at", { ascending: false }),
      supabase
        .from("gift_contributions")
        .select("id,gift_id,contributor_name,amount,message,created_at,gifts(title)")
        .order("created_at", { ascending: false }),
      supabase
        .from("gifts")
        .select("id,title,description,target_amount,image_url,is_active,created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("song_suggestions")
        .select("id,guest_name,song_title,artist,moment,message,created_at")
        .order("created_at", { ascending: false })
    ]);

    setIsLoadingData(false);

    if (
      rsvpResult.error ||
      contributionResult.error ||
      giftResult.error ||
      songResult.error
    ) {
      setStatus({
        type: "error",
        message:
          rsvpResult.error?.message ??
          contributionResult.error?.message ??
          giftResult.error?.message ??
          songResult.error?.message ??
          "No se pudieron cargar los datos."
      });
      return;
    }

    setRsvps((rsvpResult.data ?? []) as Rsvp[]);
    setContributions((contributionResult.data ?? []) as Contribution[]);
    setGifts((giftResult.data ?? []) as Gift[]);
    setSongs((songResult.data ?? []) as SongSuggestion[]);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setIsSubmitting(false);

    if (error) {
      setStatus({
        type: "error",
        message: `No se pudo iniciar sesion: ${error.message}`
      });
    }
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  async function handleCreateGift(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const targetAmountValue = String(formData.get("target_amount") ?? "").trim();
    const imageUrl = String(formData.get("image_url") ?? "").trim();
    const targetAmount = targetAmountValue ? Number(targetAmountValue) : null;

    if (!title) {
      setStatus({
        type: "error",
        message: "El regalo necesita al menos un titulo."
      });
      return;
    }

    if (targetAmount !== null && targetAmount <= 0) {
      setStatus({
        type: "error",
        message: "El objetivo del regalo debe ser mayor que cero."
      });
      return;
    }

    setIsCreatingGift(true);
    setStatus({ type: "idle", message: "" });

    const { error } = await supabase.from("gifts").insert({
      title,
      description: description || null,
      target_amount: targetAmount,
      image_url: imageUrl || null,
      is_active: true
    });

    setIsCreatingGift(false);

    if (error) {
      setStatus({
        type: "error",
        message: `No se pudo crear el regalo: ${error.message}`
      });
      return;
    }

    form.reset();
    setStatus({
      type: "success",
      message: "Regalo creado. Ya aparece en la web publica."
    });
    loadAdminData();
  }

  async function handleUpdateGift(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !editingGift) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const targetAmountValue = String(formData.get("target_amount") ?? "").trim();
    const imageUrl = String(formData.get("image_url") ?? "").trim();
    const targetAmount = targetAmountValue ? Number(targetAmountValue) : null;
    const isActive = formData.get("is_active") === "on";

    if (!title) {
      setStatus({
        type: "error",
        message: "El regalo necesita titulo."
      });
      return;
    }

    if (targetAmount !== null && targetAmount <= 0) {
      setStatus({
        type: "error",
        message: "El objetivo del regalo debe ser mayor que cero."
      });
      return;
    }

    setIsUpdatingGift(true);
    setStatus({ type: "idle", message: "" });

    const { error } = await supabase
      .from("gifts")
      .update({
        title,
        description: description || null,
        target_amount: targetAmount,
        image_url: imageUrl || null,
        is_active: isActive
      })
      .eq("id", editingGift.id);

    setIsUpdatingGift(false);

    if (error) {
      setStatus({
        type: "error",
        message: `No se pudo actualizar el regalo: ${error.message}`
      });
      return;
    }

    setEditingGift(null);
    setStatus({
      type: "success",
      message: "Regalo actualizado."
    });
    loadAdminData();
  }

  if (isLoadingSession) {
    return <p className="section-copy">Cargando sesion...</p>;
  }

  if (!user) {
    return (
      <form className="form-panel admin-login" onSubmit={handleLogin}>
        <label className="field">
          Email
          <input name="email" placeholder="tu@email.com" type="email" required />
        </label>
        <label className="field">
          Contrasena
          <input name="password" type="password" required />
        </label>
        <button className="button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
        {status.message ? (
          <p className={`form-status ${status.type}`}>{status.message}</p>
        ) : null}
      </form>
    );
  }

  return (
    <>
      <div className="admin-toolbar">
        <span>{user.email}</span>
        <div>
          <button
            className="button secondary"
            onClick={() => exportRsvps(rsvps)}
            type="button"
          >
            Exportar asistencia
          </button>
          <button
            className="button secondary"
            onClick={() => exportContributions(contributions)}
            type="button"
          >
            Exportar regalos
          </button>
          <button
            className="button secondary"
            onClick={() => exportCombined(rsvps, contributions, songs)}
            type="button"
          >
            Exportar todo
          </button>
          <button
            className="button secondary"
            onClick={() => exportSongs(songs)}
            type="button"
          >
            Exportar canciones
          </button>
          <button
            className="button secondary"
            disabled={isLoadingData}
            onClick={loadAdminData}
            type="button"
          >
            Actualizar
          </button>
          <button className="button" onClick={handleLogout} type="button">
            Salir
          </button>
        </div>
      </div>

      {status.message ? (
        <p className={`form-status ${status.type}`}>{status.message}</p>
      ) : null}

      <div className="admin-grid">
        <aside className="admin-panel">
          <div className="stat">
            <span>Confirmados</span>
            <strong>{stats.confirmedPeople}</strong>
          </div>
          <div className="stat">
            <span>Respuestas si</span>
            <strong>{stats.attendingRsvps.length}</strong>
          </div>
          <div className="stat">
            <span>Plazas bus</span>
            <strong>{stats.busSeats}</strong>
          </div>
          <div className="stat">
            <span>Regalos</span>
            <strong>{formatEuros(stats.totalGiftAmount)}</strong>
          </div>
          <div className="stat">
            <span>Canciones</span>
            <strong>{stats.songCount}</strong>
          </div>
        </aside>

        <div className="admin-panel">
          <h3>Asistencia</h3>
          <table>
            <thead>
              <tr>
                <th>Invitado</th>
                <th>Asiste</th>
                <th>Personas</th>
                <th>Acompanantes</th>
                <th>Bus</th>
                <th>Alergias</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((rsvp) => (
                <tr key={rsvp.id}>
                  <td>{rsvp.guest_name}</td>
                  <td>{rsvp.attending ? "Si" : "No"}</td>
                  <td>{rsvp.number_of_people}</td>
                  <td>{rsvp.companion_names?.join(", ") || "-"}</td>
                  <td>{rsvp.bus_needed ? rsvp.bus_stop || "Si" : "No"}</td>
                  <td>{rsvp.dietary_notes || "-"}</td>
                  <td>{rsvp.message || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-panel admin-table-block">
        <h3>Aportaciones a regalos</h3>
        <table>
          <thead>
            <tr>
              <th>Persona</th>
              <th>Regalo</th>
              <th>Cantidad</th>
              <th>Mensaje</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((contribution) => (
              <tr key={contribution.id}>
                <td>{contribution.contributor_name}</td>
                <td>{getContributionGiftTitle(contribution, gifts)}</td>
                <td>{formatEuros(Number(contribution.amount))}</td>
                <td>{contribution.message || "-"}</td>
                <td>{formatDate(contribution.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-panel admin-table-block">
        <h3>Sugerencias de canciones</h3>
        <table>
          <thead>
            <tr>
              <th>Persona</th>
              <th>Cancion</th>
              <th>Artista</th>
              <th>Momento</th>
              <th>Comentario</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id}>
                <td>{song.guest_name}</td>
                <td>{song.song_title}</td>
                <td>{song.artist || "-"}</td>
                <td>{song.moment || "-"}</td>
                <td>{song.message || "-"}</td>
                <td>{formatDate(song.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-grid admin-table-block">
        <form className="form-panel" onSubmit={handleCreateGift}>
          <h3>Nuevo regalo</h3>
          <label className="field">
            Titulo
            <input name="title" placeholder="Ej. Brunch postboda" required />
          </label>
          <label className="field">
            Descripcion
            <textarea
              name="description"
              placeholder="Cuenta para que sera este regalo"
            />
          </label>
          <label className="field">
            Objetivo en euros
            <input
              min="1"
              name="target_amount"
              placeholder="500"
              step="0.01"
              type="number"
            />
          </label>
          <label className="field">
            URL de imagen
            <input
              name="image_url"
              placeholder="https://images.unsplash.com/..."
              type="url"
            />
          </label>
          <button className="button" disabled={isCreatingGift} type="submit">
            {isCreatingGift ? "Creando..." : "Crear regalo"}
          </button>
        </form>

        <div className="admin-panel">
          <h3>Regalos activos</h3>
          <table>
            <thead>
              <tr>
                <th>Regalo</th>
                <th>Descripcion</th>
                <th>Objetivo</th>
                <th>Recaudado</th>
                <th>Pendiente</th>
                <th>Estado</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {gifts.map((gift) => {
                const collected = stats.giftTotals[gift.id] ?? 0;
                const target = Number(gift.target_amount ?? 0);
                const pending = target > 0 ? Math.max(target - collected, 0) : null;

                return (
                  <tr key={gift.id}>
                    <td>{gift.title}</td>
                    <td>{gift.description || "-"}</td>
                    <td>{target > 0 ? formatEuros(target) : "-"}</td>
                    <td>{formatEuros(collected)}</td>
                    <td>{pending === null ? "-" : formatEuros(pending)}</td>
                    <td>{gift.is_active ? "Activo" : "Oculto"}</td>
                    <td>
                      <button
                        className="small-button"
                        onClick={() => setEditingGift(gift)}
                        type="button"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingGift ? (
        <form
          className="form-panel admin-table-block"
          key={editingGift.id}
          onSubmit={handleUpdateGift}
        >
          <div className="admin-form-head">
            <h3>Editar regalo</h3>
            <button
              className="button secondary"
              onClick={() => setEditingGift(null)}
              type="button"
            >
              Cancelar
            </button>
          </div>
          <div className="field-grid">
            <label className="field">
              Titulo
              <input
                defaultValue={editingGift.title}
                name="title"
                required
              />
            </label>
            <label className="field">
              Objetivo en euros
              <input
                defaultValue={editingGift.target_amount ?? ""}
                min="1"
                name="target_amount"
                step="0.01"
                type="number"
              />
            </label>
            <label className="field full">
              Descripcion
              <textarea
                defaultValue={editingGift.description ?? ""}
                name="description"
              />
            </label>
            <label className="field full">
              URL de imagen
              <input
                defaultValue={editingGift.image_url ?? ""}
                name="image_url"
                type="url"
              />
            </label>
            <label className="check-field full">
              <input
                defaultChecked={editingGift.is_active}
                name="is_active"
                type="checkbox"
              />
              Visible en la web publica
            </label>
          </div>
          <button className="button" disabled={isUpdatingGift} type="submit">
            {isUpdatingGift ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      ) : null}
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function exportRsvps(rsvps: Rsvp[]) {
  downloadCsv(
    "asistencia-boda.csv",
    [
      [
        "Invitado",
        "Asiste",
        "Personas",
        "Acompanantes",
        "Bus",
        "Parada bus",
        "Alergias",
        "Mensaje",
        "Fecha"
      ],
      ...rsvps.map((rsvp) => [
        rsvp.guest_name,
        rsvp.attending ? "Si" : "No",
        String(rsvp.number_of_people),
        rsvp.companion_names?.join(", ") ?? "",
        rsvp.bus_needed ? "Si" : "No",
        rsvp.bus_stop ?? "",
        rsvp.dietary_notes ?? "",
        rsvp.message ?? "",
        formatDate(rsvp.submitted_at)
      ])
    ]
  );
}

function exportContributions(contributions: Contribution[]) {
  downloadCsv(
    "aportaciones-regalos-boda.csv",
    [
      ["Persona", "Regalo", "Cantidad", "Mensaje", "Fecha"],
      ...contributions.map((contribution) => [
        contribution.contributor_name,
        getContributionGiftTitle(contribution),
        String(contribution.amount),
        contribution.message ?? "",
        formatDate(contribution.created_at)
      ])
    ]
  );
}

function exportSongs(songs: SongSuggestion[]) {
  downloadCsv(
    "canciones-boda.csv",
    [
      ["Persona", "Cancion", "Artista", "Momento", "Comentario", "Fecha"],
      ...songs.map((song) => [
        song.guest_name,
        song.song_title,
        song.artist ?? "",
        song.moment ?? "",
        song.message ?? "",
        formatDate(song.created_at)
      ])
    ]
  );
}

function exportCombined(
  rsvps: Rsvp[],
  contributions: Contribution[],
  songs: SongSuggestion[]
) {
  downloadCsv("datos-boda.csv", [
    ["Tipo", "Nombre", "Detalle", "Cantidad", "Mensaje", "Fecha"],
    ...rsvps.map((rsvp) => [
      "Asistencia",
      rsvp.guest_name,
      `${rsvp.attending ? "Asiste" : "No asiste"} · ${rsvp.number_of_people} persona(s) · Bus: ${
        rsvp.bus_needed ? rsvp.bus_stop || "Si" : "No"
      }`,
      "",
      [rsvp.dietary_notes, rsvp.message].filter(Boolean).join(" | "),
      formatDate(rsvp.submitted_at)
    ]),
    ...contributions.map((contribution) => [
      "Regalo",
      contribution.contributor_name,
      getContributionGiftTitle(contribution),
      String(contribution.amount),
      contribution.message ?? "",
      formatDate(contribution.created_at)
    ]),
    ...songs.map((song) => [
      "Cancion",
      song.guest_name,
      [song.song_title, song.artist].filter(Boolean).join(" - "),
      "",
      [song.moment, song.message].filter(Boolean).join(" | "),
      formatDate(song.created_at)
    ])
  ]);
}

function downloadCsv(fileName: string, rows: string[][]) {
  const csv = rows.map((row) => row.map(escapeCsvCell).join(";")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvCell(value: string) {
  const normalized = value.replace(/\r?\n/g, " ").trim();
  return `"${normalized.replace(/"/g, '""')}"`;
}

function getContributionGiftTitle(
  contribution: Contribution,
  gifts: Gift[] = []
) {
  if (Array.isArray(contribution.gifts)) {
    return contribution.gifts[0]?.title ?? fallbackGiftTitle();
  }

  if (contribution.gifts?.title) {
    return contribution.gifts.title;
  }

  return (
    gifts.find((gift) => gift.id === contribution.gift_id)?.title ??
    fallbackGiftTitle()
  );
}

function fallbackGiftTitle() {
  return "Regalo sin identificar";
}
