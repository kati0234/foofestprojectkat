"use client";
import { IoCheckmark } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineMinus } from "react-icons/hi";
import { HiOutlinePlus } from "react-icons/hi";
import { GiCampingTent } from "react-icons/gi";
import { KviteringContext } from "@/app/lib/KvitteringContext";
import { z } from "zod";

const CampingOptionsForm = ({ onNext, onBack, formData }) => {
  const validering = z
    .object({
      addTentSetup: z.boolean(), // Tilkøb af teltopsætning
      greenCamping: z.boolean(), // Grøn camping
      tent2p: z.number().min(0),
      tent3p: z.number().min(0),
      area: z.string().min(1, "Du mangler at vælge et campingområde"), // Campingområdet skal vælges
    })

    .refine(
      (data) => {
        if (data.addTentSetup) {
          const totalTickets = formData.totalTickets;
          const totalTents = data.tent2p * 2 + data.tent3p * 3; // Antallet af pladser i teltene
          if (totalTickets === 1) {
            if (data.tent2p + data.tent3p !== 1) {
              return false; // Ugyldigt, hvis der ikke vælges præcist ét telt (enten tent2p eller tent3p)
            }
          } else {
            if (totalTickets !== totalTents) {
              return false; // Ugyldigt, hvis telte og billetter ikke stemmer overens
            }
          }
        }
        return true;
      },
      {
        message:
          "Antallet af telte skal matche antallet af billetter, eller du skal vælge ét telt, hvis du har én billet",
        path: ["addTentSetup"], // Fejlbesked relateret til 3-personers telte
      }
    );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // bruges til at sætte værdier dynamisk, f.eks. når vi ændrer område på vores knapper
    watch,

    clearErrors,
  } = useForm({
    resolver: zodResolver(validering),

    mood: "onchange",
    reValidateMode: "onSubmit",
    defaultValues: {
      greenCamping: false,
      addTentSetup: false,
      area: "",
      tent2p: 0,
      tent3p: 0,
    },
  });

  const [availableSpots, setAvailableSpots] = useState([]); // Tilgængelige områder
  const [selectedArea, setSelectedArea] = useState(null);

  const { updateCartData } = useContext(KviteringContext); // Få adgang til updateCartData
  const { startReservation } = useContext(KviteringContext);
  const totalTickets = formData.totalTickets;
  console.log("formdata camping", formData);

  useEffect(() => {
    const subscription = watch((data) => {
      const { area, greenCamping, addTentSetup } = data;
      updateCartData({
        area,
        greenCamping,
        addTentSetup,
      });
    });

    // Cleanup, for at fjerne eventuelle subscriptioner
    return () => subscription.unsubscribe();
  }, [watch, updateCartData]);

  // Henter data, når komponenten er blevet rendere (kører kun én gang)
  useEffect(() => {
    fetch("https://cerulean-abrupt-sunshine.glitch.me/available-spots", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((areaData) => {
        setAvailableSpots(areaData);
        console.log("camping områder", areaData);
      })
      .catch((err) => console.error("her kommer fejl camping ", err));
  }, []);

  const handleAreaSelection = (area) => {
    const selectedSpot = availableSpots.find((spot) => spot.area === area); // Finder det valgte område

    if (!selectedSpot || totalTickets > selectedSpot.available) {
      setSelectedArea(null);
      setValue("area", ""); // Fjern værdien fra formularen
    } else {
      setSelectedArea(area);
      setValue("area", area); // Sæt værdien i formularen
      updateCartData({ area });

      // Opdater de tilgængelige pladser
      const updatedSpots = availableSpots.map((spot) => {
        if (spot.area === area) {
          spot.available -= totalTickets; // Træk de valgte billetter fra de tilgængelige pladser
        }
        return spot;
      });
      setAvailableSpots(updatedSpots); // Opdaterer tilstanden med de nye tilgængelige pladser
    }
  };

  // Håndterer plus og minus for telte
  const handleTentChange = (type, operation) => {
    const currentValue = watch(type); // Hent det nuværende antal telte af den pågældende type
    let newValue =
      operation === "increment" ? currentValue + 1 : currentValue - 1;
    if (newValue < 0) newValue = 0; // Undgå negative værdier
    setValue(type, newValue);

    updateCartData({ [type]: newValue });
    return () => currentValue.unsubscribe();
  };
  // console.log("fomdat camping", formData);
  const onSubmit = (data) => {
    console.log("resevation", data);
    fetch("https://cerulean-abrupt-sunshine.glitch.me/reserve-spot", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        area: data.area,
        amount: totalTickets,
      }),
    })
      .then((response) => response.json())
      .then((submitData) => {
        // console.log("her får vi data", submitData);
        // (submitData);
        startReservation(submitData.id, submitData.timeout / 1000);

        onNext({
          ...data,
        });
      })
      .catch((err) => console.error("her kommer fejl ", err));

    console.log("Form submitted:", data);
  };

  return (
    // className=" lg:px-28 md:px-20 sm:px-10"
    <div>
      <h1 className="text-stor font-medium text-payCol">Camping</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1  mt-4 "
      >
        <div className=" bg-white  p-10 border-[1px]">
          {/* <div className=" "></div> */}
          <div className="">
            <div className="">
              <h2 className="text-xl  font-medium">Valg af campingområde *</h2>
              <p className="font-Inter text-base  text-neutral-800 pb-2">
                Du skal vælge, hvor du ønsker at campere under festivalen.
              </p>
            </div>
            <div className="flex flex-wrap pt-4 px-4 pb-5 border-[1px]  gap-x-2   ">
              {availableSpots.map((spot, index) => {
                const totalTickets =
                  (formData.vipCount || 0) + (formData.regularCount || 0); //udskriv totalen af billetter, de har begge en fallback værdi på 0, så vi ikke kan få undefinde
                const isDisabled = totalTickets > spot.available; // Check for for mange billetter

                return (
                  <div key={index} className=" py-2 ">
                    <input
                      className="hidden peer"
                      type="radio"
                      id={spot.area}
                      value={spot.area}
                      {...register("area")} // Binding til formular
                      onClick={() => clearErrors(["area"])}
                      onChange={() => handleAreaSelection(spot.area)} // Validering
                      disabled={isDisabled} // Deaktiver området hvis der er for mange billetter
                    />

                    <label
                      htmlFor={spot.area}
                      className={`border-[1px] border-payColcursor-pointer leading-none  text-payCol  bg-payCol/10  flex flex-col  items-center py-2 px-4 text-center   text-lg
            peer-checked:bg-payCol peer-checked:text-white peer-checked:hover:bg-blue-700 
            hover:bg-gray-200 transition-all duration-200
            ${isDisabled ? "opacity-50  cursor-default" : ""}`}
                    >
                      {spot.area}
                      <span className="text-xs mt-1 flex items-center gap-1">
                        <GiCampingTent /> {spot.available} {""}/ {""}
                        {spot.spots}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>

            {errors.area && (
              <p className="text-red-500 text-base pt-2">
                {errors.area.message}
              </p>
            )}

            {/* {selectedArea && <p>Du har valgt campingområde: {selectedArea}</p>} */}
          </div>
          {/* Telte */}
          <h3 className="text-xl font-medium pt-4">Teltopsætning</h3>
          <div className="">
            <div className="flex mt-3 border-[1px] justify-between p-4 mb-2">
              <input
                className="hidden peer"
                type="checkbox"
                id="addTentSetup"
                {...register("addTentSetup")}
              />

              <span>Bestil opsætning af telt. </span>
              <label
                // className="text-lg"
                htmlFor="addTentSetup"
                className="w-6 h-6 border-2 border-payCol text-white   place-items-center place-content-center  cursor-pointer    peer-checked:text-payCol  transition-all duration-200"
              >
                <IoCheckmark className="  w-5 h-5  text-center   " />
              </label>
            </div>

            {watch("addTentSetup") && (
              <div className=" ">
                <p className=" text-base text-neutral-800 pb-2 ">
                  <strong>Bemærk:</strong> Antal pladser i teltene skal matche
                  antal billetter{" "}
                  <span className=" font-semibold">
                    ({(formData.vipCount || 0) + (formData.regularCount || 0)})
                  </span>
                  .
                  <br />
                  Gælder kun hvis der købes mere end en billet.
                </p>

                {/* {errors.tent2p && (
                  <p className="text-red-500 ">{errors.tent2p.message}</p>
                )} */}

                <div className="flex justify-between items-center p-4  border-[1px] mb-3   ">
                  <label htmlFor="tent2p" name="tent2p" className="text-lg">
                    2-personers telt{" "}
                    <span className="font-semibold">+299,-</span>
                  </label>
                  <div className=" grid grid-cols-3 gap-3 justify-center place-items-center">
                    <button
                      type="button"
                      className="p-1   active:bg-gray-800 bg-payCol  hover:bg-blue-700"
                      onClick={() => {
                        handleTentChange("tent2p", "decrement");
                        clearErrors(["addTentSetup"]);
                      }}
                    >
                      <HiOutlineMinus className="w-5 h-5 text-white" />
                    </button>
                    <input
                      // className="w-10 text-center"
                      className=" w-10 border-[1px] border-gray-400 text-center  text-lg"
                      type="text"
                      id="tent2p"
                      name="tent2p"
                      minLength="0"
                      max="8"
                      readOnly
                      {...register("tent2p", { valueAsNumber: true })}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        handleTentChange("tent2p", "increment");
                        clearErrors(["addTentSetup"]);
                      }}
                      className="p-1   active:bg-gray-800 bg-payCol  hover:bg-blue-700"
                    >
                      <HiOutlinePlus className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border-[1px]   mb-4">
                  <label htmlFor="tent3p" className="text-lg">
                    3-personers telt{" "}
                    <span className="font-semibold"> +399,-</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3 justify-center place-items-center">
                    <button
                      type="button"
                      onClick={() => {
                        handleTentChange("tent3p", "decrement");
                        clearErrors(["addTentSetup"]);
                      }}
                      className="p-1   active:bg-gray-800 bg-payCol  hover:bg-blue-700"
                    >
                      <HiOutlineMinus className="w-5 h-5 text-white " />
                    </button>
                    <input
                      type="text"
                      id="tent3p"
                      min="0"
                      max="8"
                      readOnly
                      className=" w-10 border-[1px] border-gray-400 text-center  text-lg"
                      {...register("tent3p", { valueAsNumber: true })}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleTentChange("tent3p", "increment");
                        clearErrors(["addTentSetup"]);
                      }}
                      className="p-1   active:bg-gray-800 bg-payCol  hover:bg-blue-700"
                    >
                      <HiOutlinePlus className="w-5 h-5 text-white " />
                    </button>
                  </div>
                </div>
                {errors.addTentSetup && (
                  <p className="text-red-500 text-sm">
                    {errors.addTentSetup.message}
                  </p>
                )}
              </div>
            )}
          </div>
          {/* Grøn camping */}
          <h4 className="text-xl font-medium pt-4">Grøn Camping</h4>
          <p className=" text-base text-neutral-800  pb-2 ">
            Vær med til at reducere festivalens klimaaftryk, ved at Støtte
            Klimaskovfonden med 249kr.
          </p>
          <div className="py-4 border-[1px] ">
            <div className="flex justify-between items-center px-4">
              <input
                className="hidden peer" // Skjul standard checkboks
                type="checkbox"
                id="greenCamping"
                {...register("greenCamping")}
              />
              <span className="">
                Grøn camping <span className="font-semibold">+249,-</span>{" "}
              </span>

              <label
                htmlFor="greenCamping"
                className=" peer w-6 h-6 border-2 border-payCol bg-white  place-items-center place-content-center peer-checked:text-payCol text-white  cursor-pointer   peer-checked:bg-white/0 transition-all duration-200"
              >
                <IoCheckmark className="  w-5 h-5  text-center   " />
              </label>
            </div>
            {errors.greenCamping && (
              <p className="text-red-500 text-sm">
                {errors.greenCamping.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between ">
          <button
            type="button"
            className="py-2 px-3 self-end place-self-end text-payCol border-2 border-payCol text-lg   mt-4"
            onClick={onBack}
          >
            Tilbage
          </button>

          <button
            type="submit"
            className="bg-payCol py-2 px-3 self-end place-self-end text-white text-lg   mt-4"
          >
            Fortsæt
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampingOptionsForm;
