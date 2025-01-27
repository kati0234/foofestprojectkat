// "use client";
import { getToday } from "../../lib/utils.js";

import Link from "next/link.js";

// bruges ik her
const dayNames = {
  mon: "Mandag",
  tue: "Tirsdag",
  wed: "Onsdag",
  thu: "Torsdag",
  fri: "Fredag",
  sat: "Lørdag",
  sun: "Søndag",
};

const TodaysActs = ({ schedule }) => {
  const currentDay = getToday();

  // Filtrer aktiviteterne, så vi kun ser dem, der matcher den aktuelle dag
  const todaysActs = schedule.filter((act) => act.day === currentDay);
  return (
    <div className=" flex flex-col py-28 lg:px-20 sm:px-10 text-black">
      <div className=" flex  flex-wrap gap-2 pb-4 ">
        <h2 className=" font-bold lg:text-6xl sm:text-4xl italic uppercase  col-start-2 text-black">
          Spiller idag - {dayNames[currentDay]}
        </h2>
        <Link
          className="bg-customPink p-2 font-medium border-2 uppercase hover:underline decoration-solid border-black place-self-center m-2 transition duration-150 ease-in-out
              hover:scale-110"
          href="/program"
        >
          se program
        </Link>
      </div>
      {todaysActs.length > 0 && (
        <ul className="flex flex-wrap col-start-2  gap-2 lg:justify-normal sm:justify-center lg:text-xl sm:text-base font-medium text-black">
          {todaysActs.map((act, index) => (
            <li
              key={index}
              className=" border-black border-2 lg:p-2 sm:p-1 w-fit text-black  items-center gap-2 flex transition duration-150 ease-in-out
              hover:scale-110 bg-background"
            >
              <Link
                className="flex flex-nowrap gap-3"
                href={`/artister/${
                  act.act
                    .toLowerCase()
                    .replace(/,\s*/g, "-") // Fjern kommaer og mellemrum efter kommaer
                    .replace(/\s+-\s+/g, "-") // Fjern mellemrum omkring bindestreger
                    .replace(/\s+/g, "-") // Erstat resterende mellemrum med bindestreger
                    .replace(/-+/g, "-") // Saml flere bindestreger til én
                }`}
              >
                <p className="uppercase">{act.act}</p>
                {/* - {dayNames[act.day]}: {act.start} -{" "}
              {act.end} */}
                {act.cancelled && (
                  <span className=" bg-customPink p-1 text-sm italic">
                    (Aflyst)
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodaysActs;
