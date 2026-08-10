import { createClient } from "@supabase/supabase-js";
import {
  Contribution,
  Gift,
  GiftSectionClient
} from "@/components/GiftSectionClient";

type QueryResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

export async function GiftSection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <GiftSectionClient
        initialContributions={[]}
        initialError="Falta configurar Supabase en .env.local."
        initialGifts={[]}
      />
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const giftsResult = await withTimeout<QueryResult<Gift[]>>(
    supabase
      .from("gifts")
      .select("id,title,description,target_amount,image_url")
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
    9000
  );

  if (giftsResult.error) {
    return (
      <GiftSectionClient
        initialContributions={[]}
        initialError={`No se pudieron cargar los regalos: ${giftsResult.error.message}`}
        initialGifts={[]}
      />
    );
  }

  const contributionsResult = await withTimeout<QueryResult<Contribution[]>>(
    supabase.rpc("gift_totals"),
    9000
  );

  return (
    <GiftSectionClient
      initialContributions={contributionsResult.data ?? []}
      initialGifts={giftsResult.data ?? []}
    />
  );
}

async function withTimeout<T>(
  promise: PromiseLike<T>,
  timeoutMs: number
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("La conexion ha tardado demasiado."));
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
