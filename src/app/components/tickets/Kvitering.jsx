import { KviteringContext } from "@/app/lib/KvitteringContext";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { discriminatedUnion } from "zod";
const Kvitering = ({ formData, liveData }) => {
  // const { cartData } = useContext(KviteringContext); // Brug contexten til at hente data
  // const cartData = useContext(KviteringContext);
  const { cartData } = useContext(KviteringContext);

  const {
    vipCount = 0,
    regularCount = 0,
    tent2p = 0,
    tent3p = 0,
    greenCamping = false,
    area,
    addTentSetup,
  } = cartData || {};

  const vipPrice = 1299;
  const regularPrice = 799;
  const fee = 99;
  const greenCampingPrice = 249;
  const tent2pPrice = 299;
  const tent3pPrice = 399;

  const totalPrice =
    vipCount * vipPrice +
    regularCount * regularPrice +
    (addTentSetup ? tent2p * tent2pPrice + tent3p * tent3pPrice : 0) +
    (greenCamping ? greenCampingPrice : 0) +
    (vipCount > 0 || regularCount > 0 ? fee : 0);

  const totalTick = vipCount + regularCount;

  return (
    <div className="w-72  lg:col-start-2 md:col-start-2  md:place-self-start sm:place-self-center ">
      <div className="bg-white border-black rounded-lg border-2 px-8 py-8 w-72 min-h-[17rem] lg:col-start-2 md:col-start-1  md:place-self-start sm:place-self-center">
        {/* <div className="">
        <p>Valgte billetter:</p>
        <ul>
          <li>VIP Billetter: {vipCount} </li>
          <li>Regular Billetter: {regularCount}</li>
        </ul>
      </div> */}

        <p className="uppercase leading-[0.7] font-bold text-2xl text-center italic pt-4 pb-4  border-black border-b-2">
          foo <br />
          fest
        </p>
        <p className="text-center">Ordreoversigt</p>

        {totalTick > 0 ? (
          <div>
            <div className=" max-w-72 flex flex-col gap-1  font-normal  text-base ">
              <p className="font-semibold text-lg py-2">Billetter</p>

              {vipCount > 0 && (
                <div className="flex justify-between">
                  <p>Vip({vipCount})</p>
                  <p className="font-semibold">1299,-</p>
                </div>
              )}
              {regularCount > 0 && (
                <div className="flex  justify-between">
                  <p>Regular({regularCount})</p>
                  <p className="font-semibold">799,-</p>
                </div>
              )}
              {area && (
                <div>
                  <p className="font-semibold text-lg py-2">Camping</p>
                  <div className=" flex  justify-between">
                    <p className="font-normal">Area({area})</p>
                    <p className="font-semibold">0,-</p>
                  </div>
                </div>
              )}
              {addTentSetup && (
                <div>
                  <p className="font-bold text-mid py-2">Tent set up</p>

                  {tent2p > 0 && (
                    <div className="flex justify-between">
                      <p>Tent 2p ({tent2p})</p>
                      <p className="font-semibold">299,-</p>
                    </div>
                  )}
                  {tent3p > 0 && (
                    <div className="flex justify-between">
                      <p>Tent 3p({tent3p})</p>
                      <p className="font-semibold">399,-</p>
                    </div>
                  )}
                </div>
              )}
              {greenCamping && (
                <div className="flex justify-between">
                  <p> Grøn Camping({greenCamping})</p>
                  <p className="font-semibold">249,-</p>
                </div>
              )}
              <div className="flex justify-between">
                <p>Reservationsgebyr</p>
                <p className="font-semibold">99,-</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-center">Din kurv er tom</p>
          </div>
        )}
      </div>

      <div className=" border-black px-10 py-4 flex text-white justify-between bg-black border-2 rounded-lg mt-4 ">
        <p className="font-bold">I alt</p>
        <p className="font-medium">{totalPrice},-</p>
      </div>
    </div>
  );
};

export default Kvitering;
