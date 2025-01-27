import Link from "next/link";
const ProgramItem = ({ item }) => {
  const { start, end, act, cancelled, location, day } = item;
  return (
    <li className="border-2 border-black bg-background transition-colors  mb-4 w-full text-black  duration-150 ease-in-out hover:scale-110 hover:bg-green  ">
      {/* linker til linup slug*/}
      <Link
        href={`/artister/${
          act
            .toLowerCase()
            .replace(/,\s*/g, "-") // Fjern kommaer og mellemrum efter kommaer
            .replace(/\s+-\s+/g, "-") // Fjern mellemrum omkring bindestreger
            .replace(/\s+/g, "-") // Erstat resterende mellemrum med bindestreger
            .replace(/-+/g, "-") // Saml flere bindestreger til én
        }`}
        className=" block p-4"
      >
        <div className="flex justify-between pb-2">
          <h2 className="md:text-5xl sm:text-2xl italic font-extrabold text-black">
            {act}
          </h2>
          {/* <p>{day}</p> */}
          <p className=" font-semibold md:text-xl sm:text-lg self-center text-black text-nowrap">
            {start} - {end}
            <br />
            {cancelled && (
              //skal om styles
              <span className="bg-customPink italic   text-sm p-1 text-black">
                (Cancelled)
              </span>
            )}
          </p>
        </div>
      </Link>
    </li>
  );
};

export default ProgramItem;
