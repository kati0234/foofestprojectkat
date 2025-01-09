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
  //bg-[#2463EB]
  return (
    <div className="w-72  lg:col-start-2 md:col-start-2 content-center md:place-self-start sm:place-self-center grid  pt-[61px] ">
      {/* <div className="bg-payCol">
        <p className="text-center text-xl font-bold text-wi">
          Ordreoversigt
        </p>
      </div> */}
      <div className="bg-white border-[1px] px-6 py-4 w-72  lg:col-start-2 md:col-start-1  md:place-self-start sm:place-self-center">
        {/* <div className="">
        <p>Valgte billetter:</p>
        <ul>
          <li>VIP Billetter: {vipCount} </li>
          <li>Regular Billetter: {regularCount}</li>
        </ul>
      </div> */}

        {/* <p className="uppercase leading-[0.7] font-bold text-2xl text-center italic pt-2 pb-2  border-black border-b-2">
          foo <br />
          fest
        </p> */}
        <p className="text-center text-xl font-bold text-[#2463EB]">
          Ordreoversigt
        </p>

        {totalTick > 0 ? (
          <div className="text-neutral-700">
            <div className=" max-w-72 flex flex-col gap-1  font-normal text-sm ">
              <p className="font-bold  pt-2 pb-1 text-black">Billetter</p>

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
                <div className="border-t-[1px] mt-2">
                  <p className="font-bold  pt-2 pb-1 text-black">Camping</p>
                  <div className=" flex  justify-between">
                    <p className="font-normal">Area({area})</p>
                    <p className="font-semibold">0,-</p>
                  </div>
                </div>
              )}
              {addTentSetup && (
                <div className="border-t-[1px]  mt-2">
                  <p className="font-bold  pt-2 pb-1 text-black">
                    Telt opsætning
                  </p>

                  {tent2p > 0 && (
                    <div className="flex justify-between">
                      <p>Telt 2 personer ({tent2p})</p>
                      <p className="font-semibold">299,-</p>
                    </div>
                  )}
                  {tent3p > 0 && (
                    <div className="flex justify-between mt-1">
                      <p>Telt 3 personer({tent3p})</p>
                      <p className="font-semibold ">399,-</p>
                    </div>
                  )}
                </div>
              )}
              {greenCamping && (
                <div className="flex justify-between border-t-[1px] pt-2 mt-2  ">
                  <p> Grøn Camping({greenCamping})</p>
                  <p className="font-semibold">249,-</p>
                </div>
              )}
              <div className="flex justify-between border-t-[1px] pt-2 mt-1">
                <p>Reservationsgebyr</p>
                <p className="font-semibold">99,-</p>
              </div>
            </div>
            {/* <div className=" border-black px-10 py-4 flex bg-[#d9d9d9] text-black justify-between  border-[1px]  mt-4 "> */}
            <div className="flex justify-between border-black border-t-[1px] pt-3 mt-2 ">
              <p className="font-bold">I alt</p>
              <p className="font-bold ">{totalPrice},-</p>
            </div>
          </div>
        ) : (
          <div className="p-4 place-self-center self-center bg-neutral-200 my-4 justify-center">
            <p className="text-center">Din kurv er tom</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kvitering;
// text-[#2463EB]
