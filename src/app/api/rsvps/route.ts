import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/serverSupabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const guestName = String(formData.get("guest_name") ?? "").trim();
    const attendingValue = String(formData.get("attending") ?? "");
    const isAttending = attendingValue === "yes";
    const peopleValue = isAttending
      ? Number(formData.get("number_of_people") ?? 1)
      : 1;
    const busValue = String(formData.get("bus_needed") ?? "");
    const busLabel =
      busValue === "round_trip"
        ? "Ida y vuelta"
        : busValue === "outbound_only"
          ? "Solo ida"
          : null;
    const companionNames = isAttending
      ? String(formData.get("companion_names") ?? "")
          .split("\n")
          .map((name) => name.trim())
          .filter(Boolean)
      : [];

    if (!guestName || !attendingValue) {
      return formError(request, "Completa nombre y asistencia.", "confirmar");
    }

    if (isAttending && (!busValue || peopleValue < 1)) {
      return formError(request, "Indica personas y autobús.", "confirmar");
    }

    if (isAttending && peopleValue > 1 && companionNames.length === 0) {
      return formError(request, "Indica el nombre de los acompañantes.", "confirmar");
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("rsvps").insert({
      guest_name: guestName,
      attending: isAttending,
      number_of_people: peopleValue,
      companion_names: companionNames,
      bus_needed: isAttending && busValue !== "no",
      bus_stop: isAttending ? busLabel : null,
      dietary_notes: isAttending
        ? String(formData.get("dietary_notes") ?? "").trim() || null
        : null,
      message: String(formData.get("message") ?? "").trim() || null
    });

    if (error) {
      return formError(request, `No se pudo guardar la respuesta: ${error.message}`, "confirmar");
    }

    return formSuccess(request, "Respuesta guardada. Gracias por confirmar.", "confirmar");
  } catch (error) {
    return formError(
      request,
      error instanceof Error ? error.message : "No se pudo guardar la respuesta.",
      "confirmar"
    );
  }
}

function formSuccess(request: NextRequest, message: string, hash: string) {
  return redirectWithMessage(request, "success", message, hash);
}

function formError(request: NextRequest, message: string, hash: string) {
  return redirectWithMessage(request, "error", message, hash);
}

function redirectWithMessage(
  request: NextRequest,
  type: "success" | "error",
  message: string,
  hash: string
) {
  if (request.headers.get("accept")?.includes("application/json")) {
    return NextResponse.json(
      { message, type },
      { status: type === "success" ? 200 : 400 }
    );
  }

  const referer = request.headers.get("referer");
  const url = referer ? new URL(referer) : new URL(request.nextUrl.origin);
  url.search = "";
  url.hash = hash;
  const response = NextResponse.redirect(url, 303);
  response.cookies.set(
    "wedding_form_flash",
    JSON.stringify({ message, section: hash, type }),
    {
      maxAge: 60,
      path: "/",
      sameSite: "lax"
    }
  );
  return response;
}
