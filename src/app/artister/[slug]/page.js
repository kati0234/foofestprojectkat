import { getSingleBands, getScheduleWithBands } from "@/app/lib/api";
import ArtistSingel from "@/app/components/AristSingel";

async function Single({ params }) {
  const { slug } = await params; // Hent slug fra params
  // console.log(slug); // Debug, for at sikre at slug er korrekt

  // Hent band-data baseret på slug
  const band = await getSingleBands(slug);
  // console.log(band); // Debug, for at se de hentede data

  // Hent schedule-data og filtrer for at finde events for det specifikke band
  // const scheduleBand = await getScheduleWithBands();
  // console.log(scheduleBand);

  // const events = scheduleBand.filter((event) => event.band?.slug === slug);

  // console.log(events);

  return (
    <div>
      <ArtistSingel band={band} />
      {/* Passer band-data til ArtistSingel komponenten */}
    </div>
  );
}

export default Single;
