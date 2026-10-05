"use client";

import { useEffect, useRef, useState } from "react";

type PeopleGroup = {
  title: string;
  text: string;
  image: string;
};

type PeopleGroupCarouselProps = {
  groups: PeopleGroup[];
  imageClassName: string;
  label: string;
};

export function PeopleGroupCarousel({
  groups,
  imageClassName,
  label
}: PeopleGroupCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const updateActiveDot = () => {
      const cards = Array.from(track.querySelectorAll<HTMLElement>(".group-card"));
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let nextIndex = 0;
      let shortestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(trackCenter - cardCenter);

        if (distance < shortestDistance) {
          shortestDistance = distance;
          nextIndex = index;
        }
      });

      setActiveIndex(nextIndex);
    };

    updateActiveDot();
    track.addEventListener("scroll", updateActiveDot, { passive: true });
    window.addEventListener("resize", updateActiveDot);

    return () => {
      track.removeEventListener("scroll", updateActiveDot);
      window.removeEventListener("resize", updateActiveDot);
    };
  }, [groups.length]);

  function scrollToGroup(index: number) {
    const track = trackRef.current;
    const card = track?.querySelectorAll<HTMLElement>(".group-card")[index];

    if (!track || !card) {
      return;
    }

    track.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth"
    });
  }

  return (
    <>
      <div className="group-grid" aria-label={label} ref={trackRef}>
        {groups.map((group) => (
          <article className="group-card" key={group.title}>
            <div
              className={`group-image ${imageClassName}`}
              style={{ backgroundImage: `url(${group.image})` }}
            />
            <div className="group-body">
              <h4>{group.title}</h4>
              <p>{group.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="group-scroll-dots" aria-label={`${label}: navegación`}>
        {groups.map((group, index) => (
          <button
            aria-label={`Ver ${group.title}`}
            aria-current={activeIndex === index ? "true" : undefined}
            className={activeIndex === index ? "active" : ""}
            key={group.title}
            onClick={() => scrollToGroup(index)}
            type="button"
          />
        ))}
      </div>
    </>
  );
}
