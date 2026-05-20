"use client";

const PHOTOS = [
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/Hof_22-1030x690.jpg",          alt: "Campedèl-Hof" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/Alm_01.jpg",                    alt: "Seiser Alm" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/IMG_9800-1030x773.jpeg",        alt: "Küche" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/Kuh_Hof_1-1030x685.jpg",       alt: "Almvieh" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2020/11/IMG_4712-1030x773.jpeg",        alt: "Stube" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/IMG_4834-1030x773.jpeg",        alt: "Spezialitäten" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/Alm_04.jpg",                    alt: "Alm" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/IMG_9440-1030x579.jpeg",        alt: "Hofschank" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2020/11/IMG_2743-1030x773.jpeg",        alt: "Hof" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/DSC_0062-1030x685.jpg",         alt: "Südtirol" },
];

// Duplicate for seamless loop
const TRACK = [...PHOTOS, ...PHOTOS];

export function PhotoStrip() {
  return (
    <div className="mt-12 mb-2 -mx-3 sm:-mx-5 overflow-hidden relative">
      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-bg-light dark:from-bg-dark to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-bg-light dark:from-bg-dark to-transparent pointer-events-none" />

      {/* Scrolling track */}
      <div className="photo-strip-track flex gap-2.5" aria-hidden="true">
        {TRACK.map((p, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[220px] h-[148px] rounded-2xl overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="w-full h-full object-cover opacity-85 dark:opacity-70 hover:opacity-100 dark:hover:opacity-90 transition-opacity duration-500"
            />
          </div>
        ))}
      </div>

      {/* Caption */}
      <p className="text-center text-[10px] tracking-[0.22em] uppercase text-zinc-400 dark:text-zinc-600 mt-3 font-semibold">
        Campedèl · Hof · Seiser Alm
      </p>
    </div>
  );
}
