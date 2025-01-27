import Image from "next/image";
import { getLogoUrl } from "../../lib/utils";
import Link from "next/link";
const ArtistCard = ({ band, events }) => {
  const { name, logo, slug, genre } = band;
  const { day, location, start, end, act } = events;

  const dayNames = {
    mon: "Mandag",
    tue: "Tirsdag",
    wed: "Onsdag",
    thu: "Torsdag",
    fri: "Fredag",
    sat: "Lørdag",
    sun: "Søndag",
  };
  return (
    <li
      key={band.slug}
      className="h-80 grid grid-rows-1 grid-cols-1 group text-black border-2 border-black "
    >
      <Link
        href={`/artister/${slug}`}
        // data-band={JSON.stringify(band)}
        className="grid h-full w-full grid-rows-[1fr] group grid-cols-[1fr]"
      >
        <div className="overflow-hidden h-full w-full row-start-1 col-start-1 relative">
          <div className="relative w-full h-full row-start-1 col-start-1 grid">
            <Image
              src={getLogoUrl(logo)}
              alt={`Billede af ${name}`}
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              quality={100}
              priority
              className="grayscale object-cover z-0"
            />
          </div>
          <h2 className="text-customPink absolute row-start-1 col-start-1 pb-4  z-20 m-3  italic font-bold text-4xl self-end justify-self-start top-56">
            {name}
          </h2>
          <h3 className=" row-start-1 col-start-1 absolute z-20 m-2 p-1  text-black bg-customPink self-start justify-self-end top-0 right-0">
            {genre}
          </h3>

          <div className="absolute h-full w-full bg-customPink-fallback/90 flex items-center justify-center group-hover:bottom-0 group-hover:opacity-100 opacity-0 transition-all duration-300 z-20">
            {/* {firstEvent && ( */}
            <div className=" flex flex-col-reverse justify-center items-center  ">
              <div className="self-start">
                <p className="pl-2 text-lg">
                  <strong>scene:</strong> {location}
                </p>

                <p className=" pl-2 text-lg text-black">
                  <strong>dag:</strong> {dayNames[day]}
                </p>

                <p className="text-lg pl-2">
                  <strong>Tidspunkt: </strong>
                  <span className="text-nowrap">
                    {start} - {end}
                  </span>
                </p>
              </div>
            </div>
            {/* // )} */}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ArtistCard;
