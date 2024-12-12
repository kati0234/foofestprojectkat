import { getSchedule } from "../../lib/api";

import ProgramItem from "./ProgramItem";

const ProgramList = ({ schedule }) => {
  const groupedByLocation = schedule.reduce((acc, item) => {
    if (!acc[item.location]) acc[item.location] = [];
    acc[item.location].push(item);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(groupedByLocation).map(([location, events]) => (
        <div className="grid grid-cols-2" key={location}>
          <h3 className="text-5xl ">{location}</h3>
          <ul className="mt-10">
            {events
              // Filtrer events for at fjerne "break" events
              .filter((event) => event.act !== "break")
              // Sortér events efter starttidspunkt
              .sort((a, b) => a.start.localeCompare(b.start))
              .map((event, index) => (
                <ProgramItem key={index} item={event} />
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProgramList;
