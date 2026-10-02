# Planning icons rollback

Estado anterior antes de usar acuarelas en el planning:

- `src/components/HandDrawnPlan.tsx` renderizaba `<HandIcon name={step.icon} />` dentro de `.paper-marker`.
- Los iconos eran SVG inline definidos en la función `HandIcon`.
- El estilo principal era `.paper-icon` en `src/app/globals.css`:
  - `width: 76px;`
  - `height: 76px;`
  - `color: var(--sage);`
  - `opacity: 0.82;`
  - `animation: paperIconFloat 4.8s ease-in-out infinite;`
- En móvil se reducían con:
  - `58px` en `max-width: 640px`
  - `48px` en `max-width: 420px`

Para volver a ese estado:

1. En `HandDrawnPlan.tsx`, sustituir:
   `<img alt="" className="paper-illustration" src={step.image} />`
   por:
   `<HandIcon name={step.icon} />`
2. Se pueden mantener las claves `image` en `planSteps` sin uso, o retirarlas.
3. Eliminar o ignorar los estilos `.paper-illustration`.
