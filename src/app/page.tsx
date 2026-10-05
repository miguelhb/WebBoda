import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import { FlashCookieCleaner } from "@/components/FlashCookieCleaner";
import { HandDrawnPlan } from "@/components/HandDrawnPlan";
import { PeopleGroupCarousel } from "@/components/PeopleGroupCarousel";
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
      "/images/grupos/conchi/01_Family%20team.jpg"
  },
  {
    title: "Los Guardiola",
    text: "La familia de mamá, con quienes Conchi pasaba los veranos en el pueblo. Hoy echaremos especialmente de menos a los abuelitos, pero nos dejaron un legado lleno de anécdotas.",
    image:
      "/images/grupos/conchi/02_Los%20Guardiola_Nietos%20y%20abuelitos.JPG"
  },
  {
    title: "Los García-Belenguer",
    text: "La familia de papá. Los culpables de los viajes a Zaragoza, de hablar alto y de vivirlo todo con mucha intensidad. Miguel dice que estamos locos, pero en el fondo le gusta.",
    image:
      "/images/grupos/conchi/garcia-belenguer-horizontal.webp"
  },
  {
    title: "Inferno & Co",
    text: "El núcleo duro de Conchi: para arreglar el mundo desde el sofá, hacer deporte, comer chuches, fabricar collares, resolver scape rooms o compartir cervezas.",
    image:
      "/images/grupos/conchi/INFERNO%20%26%20Co_00.jpg"
  },
  {
    title: "Las de la uni",
    text: "Entre proyectos, maquetas, planos y alguna que otra palmera de chocolate fuimos creciendo hasta acabar en restaurantes healthy. Mención especial a Sara: sin ella, quién sabe si esta boda habría llegado a celebrarse.",
    image:
      "/images/grupos/conchi/UNI.jpg"
  },
  {
    title: "Las de la opo",
    text: "Entre apuntes y exámenes llegaron las compañeras oficiales de desayunos. Porque no hay nada mejor que compartir sufrimiento y acabar celebrando nuestros nuevos destinos.",
    image:
      "/images/grupos/conchi/opo-encuadre.webp"
  },
  {
    title: "Mis ahijados",
    text: "En los años de catequesis de San Jorge, llegaron los ahijados de Conchi, que hoy forman parte de su vida de una manera muy especial.",
    image:
      "/images/grupos/conchi/San%20Jorge.jpg"
  },
  {
    title: "Los del cole",
    text: "Crecieron con Conchi entre estudios, sufrimientos con dibujo técnico y matemáticas, baloncesto, copas, fiestas y viajes. En fin, todas esas cosas que se hacen cuando tienes 18 años  y estas en la flor de la vida.",
    image:
      "/images/grupos/conchi/COLE_00.jpg"
  },
  {
    title: "Las del Erasmus",
    text: "No hay nada que una más que pasar un año fuera de casa. No nos quedó otra opción que crear una familia. Y aunque hayan pasado los años, Lieja siempre será nuestra casa.",
    image:
      "/images/grupos/conchi/Erasmus_00.jpg"
  }
];

const miguelGroups = [
  {
    title: "Los Hernández",
    text: "La familia por parte de padre, unida hasta un punto que cuesta entender cuando vienes de fuera, y mucha culpa la tienen los abuelos. Que Manuel, Carlos y Miguel no se hayan separado desde el colegio, también ha ayudado a mantener esa unión entre primos.",
    image:
      "/images/grupos/miguel/hernandez.webp"
  },
  {
    title: "Los Benito",
    text: "La familia por parte de madre, con quien Miguel pasaba los veranos en el pueblo y con los que aprendió a montar en bici.",
    image:
      "/images/grupos/miguel/benito.webp"
  },
  {
    title: "Los de Padilla",
    text: "Eran los amigos de Miguel del pueblo hasta que llegó Conchi. Ahora son los que avisan a Conchi para jugar al tenis y a Miguel para trabajar.",
    image:
      "/images/grupos/miguel/padilla.webp"
  },
  {
    title: "Los del barrio",
    text: "Es el grupo con el que Miguel estudió (no tanto), jugó al fútbol y creció.",
    image:
      "/images/grupos/miguel/barrio-encuadre.webp"
  },
  {
    title: "Los de la bici",
    text: "¿Cuántos sábados noche ha dicho Miguel que mañana madrugaba? Estos son los culpables, identificables por su equipación de Power Ranger.",
    image:
      "/images/grupos/miguel/bici-encuadre.webp"
  },
  {
    title: "Los de la universidad",
    text: "No es sorpresa para nadie que Miguel no hizo mucha vida social en la Universidad, pero sí salió de allí con gente en la que sabe que se puede apoyar.",
    image:
      "/images/grupos/miguel/universidad.webp"
  },
  {
    title: "Los del trabajo",
    text: "Realmente no son los del trabajo. Son los que se convirtieron en amigos por casi pasar más tiempo juntos fuera del trabajo que trabajando.",
    image:
      "/images/grupos/miguel/trabajo-encuadre.webp"
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
          <img alt="Conchi y Miguel" className="brand-logo" src="/cm-logo-transparent.webp" />
          <span>Conchi & Miguel</span>
        </a>
        <div className="nav-links">
          <a href="#plan">Planning</a>
          <a href="#historia">Historia</a>
          <a href="#fotos">Fotos</a>
          <a href="#nuestra-gente">Gente</a>
          <a href="#confirmar">Confirmar</a>
          <a href="#canciones">Canciones</a>
          <a href="#regalos">Cariño</a>
        </div>
      </nav>

      <section className="hero" id="inicio">
        <div>
          <p className="eyebrow">20 de marzo de 2027 · Madrid</p>
          <h1>Conchi & Miguel</h1>
          <p className="lead">
            Aquí encontraréis toda la información del día, la confirmación de
            asistencia, las fotos, las canciones y algún detalle más para que
            lleguéis preparados al gran día.
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

      <section className="section" data-section-number="01" id="plan">
        <div className="section-head">
          <p className="section-kicker">El día</p>
          <h2>Plan del día</h2>
        </div>
        <HandDrawnPlan />
      </section>

      <section className="section alt" data-section-number="02" id="historia">
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
                cerveza. Hasta que llegó un festival y, entre música y amigos,
                nos unió del todo.
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
        </div>
      </section>

      <section className="section" data-section-number="03" id="fotos">
        <div className="section-head">
          <p className="section-kicker">Galería</p>
          <h2>Algunas imágenes de este camino</h2>
        </div>
        <PhotoCarousel />
      </section>

      <section className="section alt" data-section-number="04" id="nuestra-gente">
        <div className="section-head">
          <p className="section-kicker">Los nuestros</p>
          <h2>Nuestra gente</h2>
          <p className="section-copy">
            Una boda también es juntar mundos: familia, amigos de siempre y
            personas que llegaron por el camino y se quedaron.
          </p>
        </div>
        <div className="people-groups">
          <div className="people-group-section">
            <h3>Por parte de Conchi</h3>
            <PeopleGroupCarousel
              groups={conchiGroups}
              imageClassName="group-image-conchi"
              label="Grupos de Conchi"
            />
          </div>
          <div className="people-group-section">
            <h3>Por parte de Miguel</h3>
            <PeopleGroupCarousel
              groups={miguelGroups}
              imageClassName="group-image-miguel"
              label="Grupos de Miguel"
            />
          </div>
        </div>
      </section>

      <section className="section" data-section-number="05" id="confirmar">
        <div className="rsvp-layout">
          <div>
            <p className="eyebrow">Confirmación</p>
            <h2>Confírmanos si vienes y si necesitas autobús.</h2>
          </div>
          {flash?.section === "confirmar" ? (
            <p className={`form-status section-form-status ${flash.type}`}>
              {flash.message}
            </p>
          ) : null}
          <RsvpForm />
        </div>
      </section>

      <section className="section alt" data-section-number="06" id="canciones">
        <div className="rsvp-layout">
          <div>
            <p className="eyebrow">Canciones</p>
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

      <section className="section" data-section-number="07" id="regalos">
        <div className="section-head">
          <div className="section-title-copy">
            <p className="section-kicker">Detalles</p>
            <h2>Muestras de cariño</h2>
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
