const photos = [
  { caption: "Foto 1", image: "/photos/20230515_181245.jpg" },
  { caption: "Foto 2", image: "/photos/20231119_160951.jpg" },
  { caption: "Foto 3", image: "/photos/20240303_125055.jpg" },
  { caption: "Foto 4", image: "/photos/20240709_164007.jpg" },
  { caption: "Foto 5", image: "/photos/20241130_175737.jpg" },
  { caption: "Foto 6", image: "/photos/20250125_123142.jpg" },
  { caption: "Foto 7", image: "/photos/DSCN0047.JPG" },
  { caption: "Foto 8", image: "/photos/foto-miguel-hernandez.jpg" },
  { caption: "Foto 9", image: "/photos/IMG_20220924_201654.jpg" },
  { caption: "Foto 10", image: "/photos/IMG-20200201-WA0037.jpg" },
  { caption: "Foto 11", image: "/photos/IMG-20210109-WA0133.jpg" },
  { caption: "Foto 12", image: "/photos/IMG-20210523-WA0039-1.jpg" },
  { caption: "Foto 13", image: "/photos/IMG-20210808-WA0010.jpg" },
  { caption: "Foto 14", image: "/photos/IMG-20210902-WA0009.jpg" },
  { caption: "Foto 15", image: "/photos/IMG-20220709-WA0041.jpg" },
  { caption: "Foto 16", image: "/photos/IMG-20220821-WA0011.jpg" },
  { caption: "Foto 17", image: "/photos/IMG-20240310-WA0038.jpg" },
  { caption: "Foto 18", image: "/photos/IMG-20241201-WA0006.jpg" },
  { caption: "Foto 19", image: "/photos/whatsapp-2026-08-08-234134.jpeg" },
  { caption: "Foto 20", image: "/photos/IMG_0821_2.jpg" },
  { caption: "Foto 21", image: "/photos/IMG_0876_2.jpg" },
  { caption: "Foto 22", image: "/photos/IMG_1495_2.jpg" },
  { caption: "Foto 23", image: "/photos/IMG_3361_2.jpg" }
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
