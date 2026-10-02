import Link from "next/link";
import { AdminDashboard } from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <main className="page admin-page">
      <nav className="nav">
        <Link className="brand" href="/">
          <img alt="Conchi y Miguel" className="brand-logo" src="/cm-logo-transparent.webp" />
          <span>Conchi & Miguel</span>
        </Link>
        <div className="nav-links">
          <Link href="/">Web pública</Link>
        </div>
      </nav>

      <section className="section admin">
        <div className="section-head">
          <div>
            <p className="eyebrow">Zona privada</p>
            <h1 className="admin-title">Panel de Conchi & Miguel</h1>
          </div>
        </div>
        <AdminDashboard />
      </section>
    </main>
  );
}
