import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/serverSupabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const giftId = String(formData.get("gift_id") ?? "").trim();
    const giftTitle = String(formData.get("gift_title") ?? "este regalo").trim();
    const contributorName = String(formData.get("contributor_name") ?? "").trim();
    const amount = parseEuroAmount(String(formData.get("amount") ?? ""));
    const message = String(formData.get("message") ?? "").trim();

    if (!giftId || !contributorName || amount <= 0) {
      return formError(
        request,
        "Indica tu nombre, el regalo y una cantidad mayor que cero.",
        "regalos"
      );
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("gift_contributions").insert({
      gift_id: giftId,
      contributor_name: contributorName,
      amount,
      message: message || null
    });

    if (error) {
      return formError(request, `No se pudo guardar la aportacion: ${error.message}`, "regalos");
    }

    return formSuccess(
      request,
      `Aportacion registrada para ${giftTitle}. Gracias por acompanarnos en esta etapa; cuando hagas la transferencia podremos organizarlo todo con calma.`,
      "regalos"
    );
  } catch (error) {
    return formError(
      request,
      error instanceof Error ? error.message : "No se pudo guardar la aportacion.",
      "regalos"
    );
  }
}

function parseEuroAmount(value: string) {
  return Number(value.replace(/\./g, "").replace(",", "."));
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
