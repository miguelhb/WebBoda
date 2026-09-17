import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import { FlashCookieCleaner } from "@/components/FlashCookieCleaner";
import { HandDrawnPlan } from "@/components/HandDrawnPlan";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { RsvpForm } from "@/components/RsvpForm";
import { SongSuggestionForm } from "@/components/SongSuggestionForm";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const conchiGroups = [
  {
    title: "El team principal",
    text: "Pablo, Teresa, Mamá y Papá. Un apoyo brutal para Conchi, a quien su hiperactividad les trae de cabeza. Siempre quiere hacer cosas y, a veces, no tantas veces como le gustaría a Conchi, consigue convencerles.",
    image:
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Los Guardiola",
    text: "La familia de mamá, con quienes Conchi pasaba los veranos en el pueblo. Hoy echaremos especialmente de menos a los abuelitos, pero nos dejaron el mejor legado: una familia increíble.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Los García-Belenguer",
    text: "La familia de papá. Los culpables de los viajes a Zaragoza, de hablar alto y de vivirlo todo con mucha intensidad. Miguel dice que estamos locos, pero en el fondo le gusta.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Inferno & Co",
    text: "El núcleo duro de Conchi: para arreglar el mundo desde el sofá, hacer deporte, comer chuches, fabricar collares, resolver scape rooms o compartir cervezas. Compañeras fieles de aventuras y secretos de Conchi.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Las de la uni",
    text: "Entre proyectos, maquetas, planos y alguna que otra palmera de chocolate fuimos creciendo hasta acabar en restaurantes healthy. Mención especial a Sara: sin ella, quién sabe si esta boda habría llegado a celebrarse.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Los de la opo",
    text: "Entre apuntes y exámenes llegaron las compañeras oficiales de desayunos. Porque no hay nada mejor que compartir sufrimiento y acabar celebrando nuestros nuevos destinos. Aquí da igual la edad: tomamos un matcha o nos montamos en las barquitas de Disney.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Mis ahijados",
    text: "En los años de San Jorge, Conchi intentó transmitir a Dios a un grupito de jóvenes. Algunas llegaron para quedarse y hoy forman parte de su vida de una manera muy especial.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Los del cole",
    text: "TexCrecieron con Conchi entre estudios, sufrimientos con dibujo técnico y matemáticas, baloncesto, copas, fiestas y viajes. En fin, todas esas cosas que se hacen cuando tienes 18 años  y estas en la flor de la vida.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Las del Erasmus",
    text: "No hay nada que una más que pasar un año fuera de casa. No nos quedó otra opción que crear una familia. Y aunque hayan pasado los años, Lieja siempre será nuestra casa y nosotras, familia.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
  }
];

const miguelGroups = [
  {
    title: "Los Hernández",
    text: "La familia por parte de padre, unida hasta un punto que cuesta entender cuando vienes de fuera, y mucha culpa la tienen los abuelos. También que Manuel, Carlos y Miguel no se hayan separado desde que empezaron el colegio ha ayudado a mantener esta unión entre primos.",
    image:
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Los Benito",
    text: "La familia por parte de madre, con quien Miguel pasaba los veranos en el pueblo y con los que aprendió a montar en bici.",
    image:
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Los de Padilla",
    text: "Eran los amigos de Miguel del pueblo hasta que llegó Conchi. Ahora son los que avisan a Conchi para jugar al tenis y a Miguel para trabajar.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Los del barrio",
    text: "Es el grupo con el que Miguel estudió (no tanto), jugó al fútbol y creció.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Los de la bici",
    text: "¿Cuántos sábados noche ha dicho Miguel que mañana madrugaba? Estos son los culpables, identificables por su equipación de Power Ranger.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Los de la universidad",
    text: "No es sorpresa para nadie que Miguel no hizo mucha vida social en la Universidad, pero sí salió de allí con gente en la que sabe que se puede apoyar.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Los del trabajo",
    text: "Realmente no son los del trabajo. Son los que se convirtieron en amigos por casi pasar más tiempo juntos fuera del trabajo que trabajando.",
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
      <EnvelopeIntro />
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
            Aquí encontraréis toda la información del día, la confirmación de
            asistencia, las canciones, las fotos y algún detalle más para que
            lleguéis preparados a una celebración bastante grande para nosotros.
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
        </div>
        <HandDrawnPlan />
      </section>

      <section className="section alt" id="historia">
        <div className="story-grid">
          <div>
            <p className="eyebrow">Nuestra historia</p>
            <h2>Todo empezó en 2016.</h2>
            <div className="story-text">
              <p>
                Todo empezó en 2016, nuestra primera "cita" fue en La
                Bicicleta, porque Miguel consideró que llevar a Conchi a un
                sitio llamado así era una buena idea. Conchi todavía no sabía
                lo que esa palabra significaba.
              </p>
              <p>
                Aunque tampoco podemos decir que fuéramos especialmente rápidos,
                durante unos cuantos años fuimos de café en café o de cerveza en
                cerveza. Hasta que llegó un festival y, entre música, amigos y
                probablemente alguna que otra decisión cuestionable, nos unió del
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
                Así que preparaos para comer, beber, bailar, reír y, con suerte,
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
                alt="Conchi y Miguel en los primeros años"
                src="/story-2016.jpg"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="section" id="fotos">
        <div className="section-head">
          <h2>Fotos</h2>
          <p className="section-copy">
            Algunas imágenes de este camino: viajes, planes, anécdotas y
            pequeños momentos que también forman parte de nuestra historia.
          </p>
        </div>
        <PhotoCarousel />
      </section>

      <section className="section alt" id="nuestra-gente">
        <div className="section-head">
          <h2>Nuestra gente</h2>
          <p className="section-copy">
            Una boda también es juntar mundos: familia, amigos de siempre y
            personas que llegaron por el camino y se quedaron.
          </p>
        </div>
        <div className="people-groups">
          <div className="people-group-section">
            <h3>Por parte de Conchi</h3>
            <div className="group-grid" aria-label="Grupos de Conchi">
              {conchiGroups.map((group) => (
                <article className="group-card" key={group.title}>
                  <div
                    className="group-image"
                    style={{ backgroundImage: `url(${group.image})` }}
                  />
                  <div className="group-body">
                    <h4>{group.title}</h4>
                    <p>{group.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="people-group-section">
            <h3>Por parte de Miguel</h3>
            <div className="group-grid" aria-label="Grupos de Miguel">
              {miguelGroups.map((group) => (
                <article className="group-card" key={group.title}>
                  <div
                    className="group-image"
                    style={{ backgroundImage: `url(${group.image})` }}
                  />
                  <div className="group-body">
                    <h4>{group.title}</h4>
                    <p>{group.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="confirmar">
        <div className="rsvp-layout">
          <div>
            <p className="eyebrow">RSVP</p>
            <h2>Confírmanos si vienes y si necesitas autobús.</h2>
            <p className="section-copy">
              Esta respuesta se guarda para que podamos organizar asistencia,
              autobús, acompañantes y alergias desde la zona privada.
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
            <p className="eyebrow">Música</p>
            <h2>¿Qué canción no puede faltar?</h2>
            <p className="section-copy">
              Déjanos una canción para la cena, la fiesta o ese momento en el
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
          <div className="section-title-copy">
            <h2>Regalos</h2>
            <p className="section-copy">
              El mejor regalo es que nos acompañéis en este día. Si aun así os
              apetece tener un detalle con nosotros, podéis hacerlo en la
              siguiente cuenta.
            </p>
          </div>
        </div>
        <div className="account-note gift-account-only">
          <div>
            <h3>Gracias por formar parte de esta nueva etapa</h3>
            <p>
              Lo recibiremos con muchísimo cariño y lo destinaremos a empezar
              esta aventura juntos de la mejor manera posible.
            </p>
          </div>
          <span>ES16 0073 0100 5508 8516 4407</span>
        </div>
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
