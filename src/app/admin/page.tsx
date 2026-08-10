import Link from "next/link";
import { AdminDashboard } from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <main className="page admin-page">
      <nav className="nav">
        <Link className="brand" href="/">
          <img alt="Conchi y Miguel" className="brand-logo" src="/cm-logo.jpeg" />
          <span>Conchi & Miguel</span>
        </Link>
        <div className="nav-links">
          <Link href="/">Web publica</Link>
        </div>
      </nav>

      <section className="section admin">
        <div className="section-head">
          <div>
            <p className="eyebrow">Zona privada</p>
            <h1 className="admin-title">Panel de Conchi & Miguel</h1>
          </div>
          <p className="section-copy">
            Respuestas, autobus y aportaciones a regalos cargadas directamente
            desde Supabase.
          </p>
        </div>
        <AdminDashboard />
      </section>
    </main>
  );
}
