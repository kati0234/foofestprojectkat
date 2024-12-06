import { getBands } from "@/app/lib/api";
import ArtistCard from "../components/ArtistCard";
import Image from "next/image";
import ArtisList from "../components/ArtistList";
import { getLogoUrl } from "@/app/lib/utils";
import FilterLineup from "../components/SearchFilterLineup";
import ArtistApp from "../components/ArtistApp";

// const ImageLoader = ({ src, width, quality }) => {
//   return `https://localhost:8080/${src}?w${width}&q=${quality || 75}`;
// };

export default async function Home() {
  const bands = await getBands();
  console.log(bands);

  return (
    <div>
      <ArtistApp bands={bands} />
      {/* <FilterLineup></FilterLineup>
      <ArtisList bands={bands} /> */}
      {/* <div>
        <h1 className="text-4xl font-bold text-center sm:text-left">bands</h1>
      </div>
      <div className="bg-gray-800 self-start p-4 rounded">
        <ul className="flex flex-wrap gap-3 max-w-sm">
          {bands.map((band) => (
            <li key={band.slug}>
              <ArtistCard band={band} />
    
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
