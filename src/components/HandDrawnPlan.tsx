const planSteps = [
  {
    icon: "church",
    time: "13:00",
    title: "Ceremonia",
    text: "Basílica de la Milagrosa",
    markerX: 62,
    markerY: 15,
    labelX: 35,
    labelY: 15,
    side: "left"
  },
  {
    icon: "car",
    time: "14:15",
    title: "Traslado",
    text: "Hacia Soto de Gracia (posibilidad de autobús)",
    markerX: 38,
    markerY: 33,
    labelX: 66,
    labelY: 33,
    side: "right"
  },
  {
    icon: "dinner",
    time: "15:00",
    title: "Comida",
    text: "",
    markerX: 62,
    markerY: 51,
    labelX: 35,
    labelY: 51,
    side: "left"
  },
  {
    icon: "party",
    time: "19:00",
    title: "Fiesta",
    text: "",
    markerX: 38,
    markerY: 69,
    labelX: 66,
    labelY: 69,
    side: "right"
  },
  {
    icon: "bus",
    time: "00:00",
    title: "Autobus",
    text: "Vuelta a Plaza de Castilla",
    markerX: 62,
    markerY: 87,
    labelX: 35,
    labelY: 87,
    side: "left"
  }
];

export function HandDrawnPlan() {
  return (
    <div className="paper-plan">
      <div className="paper-plan-inner">
        <svg
          aria-hidden="true"
          className="paper-route"
          preserveAspectRatio="none"
          viewBox="0 0 420 760"
        >
          <path
            className="paper-route-line"
            d="M260 114 C178 165 132 207 160 251 C205 323 298 336 260 388 C207 459 119 480 160 524 C218 587 304 602 260 661"
          />
        </svg>

        <div className="paper-markers">
          {planSteps.map((step) => (
            <div
              className="paper-marker"
              key={`${step.title}-icon`}
              style={{ left: `${step.markerX}%`, top: `${step.markerY}%` }}
            >
              <HandIcon name={step.icon} />
            </div>
          ))}
        </div>

        <div className="paper-events">
          {planSteps.map((step) => (
            <article
              className={`paper-event ${step.side}`}
              key={step.title}
              style={{ left: `${step.labelX}%`, top: `${step.labelY}%` }}
            >
              <div>
                <span>{step.time}</span>
                <h4>{step.title}</h4>
                {step.text ? <p>{step.text}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function HandIcon({ name }: { name: string }) {
  return (
    <svg
      aria-hidden="true"
      className="paper-icon"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.45"
      viewBox="0 0 64 64"
    >
      {name === "church" ? (
        <>
          <path d="M16 54c9 1 24 .7 33 0" />
          <path d="M22 54c-.3-8-.4-16 0-23 3.4-3.5 6.7-7.2 10-10.5 3.7 3.4 7 7 10 10.5-.4 7-.3 15 0 23" />
          <path d="M32 21c-.3-4-.2-8 0-11" />
          <path d="M28 14h8" />
          <path d="M28 54c0-5-.2-10 .8-13 1.5-3.5 6.7-3.2 8.2 0 .9 3 .8 8 .8 13" />
          <path d="M25 34c1.5-.4 3-.3 4.5 0" />
          <path d="M35 34c1.5-.4 3-.3 4.5 0" />
        </>
      ) : null}
      {name === "bus" ? (
        <>
          <path d="M13 40c-.2-6-.2-12 .2-18 .4-4 4-6.5 8.5-6.5h21c4.7 0 8.1 2.6 8.5 6.5.4 6 .2 12 0 18" />
          <path d="M15 39.5c10 .6 24.5 .6 34 0" />
          <path d="M19 25c6.7-.6 19.5-.6 26 0" />
          <circle cx="22" cy="45" r="3.5" />
          <circle cx="42" cy="45" r="3.5" />
          <path d="M18 32h4" />
          <path d="M42 32h4" />
        </>
      ) : null}
      {name === "car" ? (
        <>
          <path d="M12 39c3.5-1 7-1.4 10.5-1.2 2-4.5 5.5-9.5 10-10 5.8-.6 10 4.6 12.8 10 2.8 0 5.2.4 7.7 1.2" />
          <path d="M16 39c-.4 3-.2 6 .8 8.5 9.8 1 25.6 1 35.4 0 1-2.5 1.1-5.5.7-8.5" />
          <path d="M25 37c4.5-.5 10.8-.5 15.5 0" />
          <circle cx="23" cy="48" r="3.3" />
          <circle cx="46" cy="48" r="3.3" />
          <path d="M31 23c2-3 5.7-3 7.2-.4 1.8-2.5 5.6-1.8 6.2 1.2.8 4-5 7.2-6.1 8-1.2-.7-8.3-4.3-7.3-8.8Z" />
          <path d="M16 31c-1.8-1.2-3.2-2.6-4.4-4.4" />
          <path d="M20 28c-1-1.6-1.8-3.4-2.2-5.2" />
        </>
      ) : null}
      {name === "dinner" ? (
        <>
          <path d="M22 13c-.4 11-.4 28 0 40" />
          <path d="M17 13c.2 4 .1 9 0 14" />
          <path d="M22 13v14" />
          <path d="M27 13c-.2 4-.1 9 0 14" />
          <path d="M17 27c1.2 5.5 8.7 5.6 10 0" />
          <path d="M42 13c-6.8 7.2-6.6 19.4.2 25 .1 5 .1 10-.2 15" />
          <path d="M42 13c.5 10 .3 29 0 40" />
        </>
      ) : null}
      {name === "party" ? (
        <>
          <path d="M20 49c1.8-7.5 3.8-17 6.5-25 5.6 4.7 11.2 10.4 16.5 17-7.6 2.8-15.8 6.4-23 8Z" />
          <path d="M26 24c1 2.5 2.1 4.8 3.6 7" />
          <path d="M32 35c2.5.8 5 2 7.4 3.5" />
          <path d="M43 16c1-1.8 2-3.6 3-5" />
          <path d="M49 27c2-.7 4-1.3 6-2" />
          <path d="M32 14c-.7-2-1.4-4-2-6" />
          <circle cx="44" cy="21" r="1.7" />
          <circle cx="36" cy="9" r="1.3" />
        </>
      ) : null}
    </svg>
  );
}
