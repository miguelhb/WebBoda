const photos = [
  {
    caption: "Noviembre 2019 - De nuestras primeras citas",
    image: "/photos/IMG-20200201-WA0037.jpg"
  },
  {
    caption: "Enero 2021 - Filomena",
    image: "/photos/IMG-20210109-WA0133.jpg"
  },
  {
    caption: "Agosto 2021 - Llanos del Hospital (Benasque)",
    image: "/photos/IMG-20210808-WA0010.jpg"
  },
  {
    caption: "Septiembre 2021 - Fans del verano del norte",
    image: "/photos/IMG-20210902-WA0009.jpg"
  },
  {
    caption: "Agosto 2022 - La noche de Padilla",
    image: "/photos/IMG-20220821-WA0011.jpg"
  },
  {
    caption: "Agosto 2022 - excursión a Marrakech",
    image: "/photos/IMG_3361_2.jpg"
  },
  {
    caption: "Mayo 2023 - Snorkel en Cabo de Gata",
    image: "/photos/DSCN0047.JPG"
  },
  {
    caption: "Marzo 2024 - finde en Oporto",
    image: "/photos/20240303_125055.jpg"
  },
  {
    caption: "Mike Wasowsky y Celia Pelia",
    image: "/photos/IMG-20240310-WA0038.jpg"
  },
  {
    caption: "Octubre 2024 - Media Maratón de Valencia",
    image: "/photos/IMG-20241201-WA0006.jpg"
  },
  {
    caption: "Diciembre 2024 - Típica escapada navideña a Segovia",
    image: "/photos/20241130_175737.jpg"
  },
  {
    caption: "Enero 2025 - Cuando intentamos quitar el gotelé de nuestro nuevo hogar",
    image: "/photos/20250125_123142.jpg"
  },
  {
    caption: "Octubre 2025 - Ofrenda de Pilares",
    image: "/photos/ofrenda-pilares-2025.jpeg"
  },
  {
    caption: "Agosto 2026 - senderismo por el Valle de Aran",
    image: "/photos/whatsapp-2026-08-08-234134.jpeg"
  }
];

export function PhotoCarousel() {
  return (
    <div className="photo-carousel">
      <div className="photo-carousel-track" aria-label="Carrusel de fotos">
        {photos.map((photo, index) => (
          <figure
            className="photo-carousel-slide"
            id={`foto-${index + 1}`}
            key={photo.image}
          >
            <img
              alt={photo.caption}
              loading={index === 0 ? "eager" : "lazy"}
              src={photo.image}
            />
            <figcaption className="photo-carousel-caption">
              <span>
                {index + 1} / {photos.length}
              </span>
              <strong>{photo.caption}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="photo-thumbs" aria-label="Seleccionar foto">
        {photos.map((photo, index) => (
          <a
            aria-label={`Ver foto ${index + 1}`}
            href={`#foto-${index + 1}`}
            key={photo.image}
            style={{ backgroundImage: `url(${photo.image})` }}
          />
        ))}
      </div>
    </div>
  );
}
