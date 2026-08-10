import { GiftSection } from "@/components/GiftSection";
import { FlashCookieCleaner } from "@/components/FlashCookieCleaner";
import { HandDrawnPlan } from "@/components/HandDrawnPlan";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { RsvpForm } from "@/components/RsvpForm";
import { SongSuggestionForm } from "@/components/SongSuggestionForm";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const groups = [
  {
    title: "Familia",
    text: "Los que han estado en cada etapa, los que preguntan si hemos comido y los que hacen que cualquier sitio se parezca un poco a casa.",
    image:
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Amigos de siempre",
    text: "Historias largas, bromas que nadie mas entiende y esa confianza rara de quien te ha visto en muchas versiones.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Los de camino",
    text: "Universidad, trabajo, viajes y planes que aparecieron por sorpresa. Gente que llego despues y ya no imaginamos fuera.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80"
  }
];

type FlashMessage = {
  message: string;
  section: string;
  type: "error" | "success";
};

export default async function Home() {
  const flash = parseFlashMessage(
    (await cookies()).get("wedding_form_flash")?.value
  );

  return (
    <main className="page">
      {flash ? <FlashCookieCleaner /> : null}
      <nav className="nav">
        <a className="brand" href="#inicio">
          <img alt="Conchi y Miguel" className="brand-logo" src="/cm-logo.jpeg" />
          <span>Conchi & Miguel</span>
        </a>
        <div className="nav-links">
          <a href="#plan">Planning</a>
          <a href="#historia">Historia</a>
          <a href="#fotos">Fotos</a>
          <a href="#nuestra-gente">Gente</a>
          <a href="#confirmar">Confirmar</a>
          <a href="#canciones">Canciones</a>
          <a href="#regalos">Regalos</a>
        </div>
      </nav>

      <section className="hero" id="inicio">
        <div>
          <p className="eyebrow">20 de marzo de 2027 · Madrid</p>
          <h1>Conchi & Miguel</h1>
          <p className="lead">
            Aqui encontraras el horario, la historia, fotos, autobus,
            confirmacion de asistencia y regalos. Un sitio pequeno para un dia
            bastante grande.
          </p>
          <div className="hero-actions">
            <a className="button" href="#confirmar">
              Confirmar asistencia
            </a>
            <a className="button secondary" href="#plan">
              Ver planning
            </a>
          </div>
        </div>
        <div className="hero-photo intro-photo" aria-label="Conchi y Miguel" />
      </section>

      <section className="section" id="plan">
        <div className="section-head">
          <h2>Planning</h2>
          <p className="section-copy">
            Horarios aproximados para que nadie llegue corriendo. Los detalles
            finales se podran actualizar desde el panel privado.
          </p>
        </div>
        <HandDrawnPlan />
      </section>

      <section className="section alt" id="historia">
        <div className="story-grid">
          <div>
            <p className="eyebrow">Nuestra historia</p>
            <h2>Todo empezo en 2016.</h2>
            <div className="story-text">
              <p>
                Todo empezo en 2016, nuestra primera "cita" fue en La
                Bicicleta, porque Miguel considero que llevar a Conchi a un
                sitio llamado asi era una buena idea. Conchi todavia no sabia
                lo que esa palabra significaba.
              </p>
              <p>
                Aunque tampoco podemos decir que fueramos especialmente rapidos,
                durante unos cuantos anos fuimos de cafe en cafe o de cerveza en
                cervaza. Hasta que llego un festival y, entre musica, amigos y
                probablemente alguna que otra decision cuestionable, nos unio del
                todo.
              </p>
              <p>
                Desde 2019 hemos ido haciendo lo que mejor se nos da: no parar
                quietos. Hemos acumulado planes, viajes, deporte, exposiciones y
                excusas para salir de casa. Nos cuesta bastante entender el
                concepto de "quedarnos tranquilos".
              </p>
              <p>
                Y ahora, hemos decidido juntar a la gente que queremos para
                celebrar que vamos a compartir juntos el resto de nuestra vida.
                Asi que preparaos para comer, beber, bailar, reir y, con suerte,
                no hacer deporte durante unas horas.
              </p>
              <p>
                <strong>Bienvenidos a nuestra boda.</strong>
              </p>
            </div>
          </div>
          <div className="story-photos" aria-label="Fotos de nuestra historia">
            <figure className="story-photo">
              <img
                alt="Conchi y Miguel en los primeros anos"
                src="/story-2016.jpg"
              />
            </figure>
            <figure className="story-photo">
              <img
                alt="Conchi y Miguel en una foto reciente"
                src="/story-current.jpeg"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="section" id="fotos">
        <div className="section-head">
          <h2>Fotos</h2>
          <p className="section-copy">
            Algunas imagenes de este camino. Luego iremos anadiendo un texto
            breve para cada una, con sus pequenas historias y excusas.
          </p>
        </div>
        <PhotoCarousel />
      </section>

      <section className="section alt" id="nuestra-gente">
        <div className="section-head">
          <h2>Nuestra gente</h2>
          <p className="section-copy">
            Una boda tambien es juntar mundos: familia, amigos de siempre y
            personas que llegaron por el camino y se quedaron.
          </p>
        </div>
        <div className="group-grid">
          {groups.map((group) => (
            <article className="group-card" key={group.title}>
              <div
                className="group-image"
                style={{ backgroundImage: `url(${group.image})` }}
              />
              <div className="group-body">
                <h3>{group.title}</h3>
                <p>{group.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="confirmar">
        <div className="rsvp-layout">
          <div>
            <p className="eyebrow">RSVP</p>
            <h2>Confirmanos si vienes y si necesitas autobus.</h2>
            <p className="section-copy">
              Esta respuesta se guarda para que podamos organizar asistencia,
              autobus, acompanantes y alergias desde la zona privada.
            </p>
          </div>
          {flash?.section === "confirmar" ? (
            <p className={`form-status section-form-status ${flash.type}`}>
              {flash.message}
            </p>
          ) : null}
          <RsvpForm />
        </div>
      </section>

      <section className="section alt" id="canciones">
        <div className="rsvp-layout">
          <div>
            <p className="eyebrow">Musica</p>
            <h2>Que cancion no puede faltar?</h2>
            <p className="section-copy">
              Dejanos una cancion para la cena, la fiesta o ese momento en el
              que todo el mundo decide que sabe bailar.
            </p>
          </div>
          {flash?.section === "canciones" ? (
            <p className={`form-status section-form-status ${flash.type}`}>
              {flash.message}
            </p>
          ) : null}
          <SongSuggestionForm />
        </div>
      </section>

      <section className="section" id="regalos">
        <div className="section-head">
          <h2>Regalos</h2>
          <p className="section-copy">
            El regalo es compartir con vosotros este dia. No obstante, hemos
            organizado nuestra luna de miel en pequenas etapas por si os apetece
            acompanarnos en alguna parte del viaje. Al elegir una etapa aqui nos
            ayudais a organizarlo; la aportacion se completa despues por
            transferencia.
          </p>
        </div>
        {flash?.section === "regalos" ? (
          <p className={`form-status gift-status ${flash.type}`}>
            {flash.message}
          </p>
        ) : null}
        <GiftSection />
      </section>

      <footer className="footer">
        <span>Conchi & Miguel · 20.03.2027 · Madrid</span>
        <span className="footer-dot">·</span>
        <a className="footer-admin" href="/admin">
          Acceso privado
        </a>
      </footer>
    </main>
  );
}

function parseFlashMessage(value: string | undefined): FlashMessage | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<FlashMessage>;

    if (
      typeof parsed.message === "string" &&
      typeof parsed.section === "string" &&
      (parsed.type === "error" || parsed.type === "success")
    ) {
      return {
        message: parsed.message,
        section: parsed.section,
        type: parsed.type
      };
    }
  } catch {
    try {
      const parsed = JSON.parse(decodeURIComponent(value)) as Partial<FlashMessage>;

      if (
        typeof parsed.message === "string" &&
        typeof parsed.section === "string" &&
        (parsed.type === "error" || parsed.type === "success")
      ) {
        return {
          message: parsed.message,
          section: parsed.section,
          type: parsed.type
        };
      }
    } catch {
      return null;
    }
  }

  return null;
}
