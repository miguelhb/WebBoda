import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/serverSupabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const guestName = String(formData.get("guest_name") ?? "").trim();
    const songTitle = String(formData.get("song_title") ?? "").trim();
    const artist = String(formData.get("artist") ?? "").trim();
    const moment = String(formData.get("moment") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!guestName || !songTitle) {
      return formError(request, "Indica tu nombre y la canción.", "canciones");
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("song_suggestions").insert({
      guest_name: guestName,
      song_title: songTitle,
      artist: artist || null,
      moment: moment || null,
      message: message || null
    });

    if (error) {
      return formError(request, `No se pudo guardar la canción: ${error.message}`, "canciones");
    }

    return formSuccess(request, "Canción guardada. Prometemos valorar seriamente cada temazo.", "canciones");
  } catch (error) {
    return formError(
      request,
      error instanceof Error ? error.message : "No se pudo guardar la canción.",
      "canciones"
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
