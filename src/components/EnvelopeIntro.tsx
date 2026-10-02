export function EnvelopeIntro() {
  return (
    <div aria-label="Sobre de la invitación" className="envelope-intro">
      <input
        aria-label="Abrir la invitación"
        className="envelope-open-toggle"
        id="envelope-open-toggle"
        type="checkbox"
      />

      <div aria-hidden="true" className="envelope-door envelope-door-body" />

      <div aria-hidden="true" className="envelope-door envelope-door-flap" />

      <label
        aria-hidden="true"
        className="envelope-open-button"
        htmlFor="envelope-open-toggle"
      >
        <span className="envelope-seal">C&amp;M</span>
        <span className="envelope-open-label">Abrir invitación</span>
      </label>
    </div>
  );
}
