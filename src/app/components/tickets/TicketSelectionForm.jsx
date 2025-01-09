"use client";
import { useForm } from "react-hook-form";
import { validering } from "@/app/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";

import { useContext } from "react";
import { useEffect } from "react";
import { HiOutlineMinus } from "react-icons/hi";
import { HiOutlinePlus } from "react-icons/hi";
import { KviteringContext } from "@/app/lib/KvitteringContext";
import { z } from "zod";

const TicketSelectionForm = ({ onNext }) => {
  const validering = z
    .object({
      vipCount: z
        .number()
        .min(0, "Antal VIP billetter skal være et positivt tal"),
      regularCount: z
        .number()
        .min(0, "Antal Regular billetter skal være et positivt tal"),
    })

    // Tjekker om enten vip eller regular billetter er valgt
    .refine((data) => data.vipCount > 0 || data.regularCount > 0, {
      message: "Du skal vælge mindst én billet",
      path: ["vipCount"], // Eller "regularCount" hvis du vil vise fejlen på det ene felt
    });
  // her for ..data vip og regular count
  const {
    register,
    handleSubmit,
    setValue, // bruges til knapper
    formState: { errors },
    watch, // Brug watch til at få værdierne af formularfelterne
  } = useForm({
    resolver: zodResolver(validering), // Brug Zod-validering
    defaultValues: {
      vipCount: 0, // Standardværdi for vipCount
      regularCount: 0, // Standardværdi for regularCount
    },
  });
  // bruges til kvitriengen
  const { updateCartData } = useContext(KviteringContext);

  // bruges til at opdater total ticket nok
  const vipCount = watch("vipCount", 0); // Standardværdi 0
  const regularCount = watch("regularCount", 0); // Standardværdi 0

  // const totalTick = vipCount + regularCount;
  const totalTickets = vipCount + regularCount;
  const handleTentChange = (type, operation) => {
    const currentValue = watch(type);
    let newValue =
      operation === "increment" ? currentValue + 1 : currentValue - 1;
    if (newValue < 0) newValue = 0; // Undgå negative værdier

    // Beregn den samlede mængde billetter (VIP + Regular)

    // Kun tillad ændringen, hvis den samlede mængde ikke overstiger 8
    if (totalTickets < 8 || (operation === "decrement" && newValue >= 0)) {
      setValue(type, newValue);
      updateCartData({ [type]: newValue });
    }
  };

  const handleNext = (data) => {
    console.log("Går videre med data:", data);
    // Naviger til næste trin eller opdater applikationens tilstand
  };

  const onSubmit = (data) => {
    // Send både de eksisterende data og den samlede pris
    console.log("Form submitted:", data);
    onNext({
      ...data,
      totalTickets,
    });
  };

  return (
    <div>
      <div className=" ">
        <h1 className="text-stor font-medium text-payCol">Billetter</h1>
        {/* <p>tilføj billeter (max 8)</p> */}
        {/* <p>vælg biletter</p> */}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 mt-4 "
      >
        {/* <div className=" bg-white p-10 "> */}
        <div className="bg-white border-[1px] p-10">
          {/* <div className="pb-2  ">
            <h2 className="text-xl font-medium">Vælg bilet type </h2>
            <p>max antal billetter 8</p>
          </div> */}
          <h2 className="text-xl font-medium  ">Vælg bilet type </h2>
          <p className=" italic text-neutral-600 text-sm pb-2">
            max antal billeter 8{" "}
          </p>
          <div className=" place-self-center w-full  ">
            <div className="flex justify-between items-center p-4 gap-10  mb-4  bg-white border-[1px]  ">
              <label htmlFor="vip" className="text-lg">
                VIP <strong> 1299,- </strong>
              </label>

              <div className="grid grid-cols-3 gap-3 pl-10 justify-center place-items-center  border-gray-400 ">
                <button
                  type="button"
                  // className="bg-gray-300 p-1 rounded-lg active:bg-gray-400"
                  className="p-1   active:bg-gray-800 bg-payCol"
                  onClick={() => handleTentChange("vipCount", "decrement")}
                >
                  <HiOutlineMinus className="w-5 h-5 text-center text-white " />
                </button>

                <input
                  {...register("vipCount", { valueAsNumber: true })}
                  type="text"
                  id="vip"
                  placeholder="0"
                  min="0"
                  max="8"
                  // className=" placeholder:text-center w-10 text-center p-1 text-lg"
                  className=" w-10 border-[1px] border-gray-400 text-center  text-lg"
                  readOnly
                />
                <button
                  type="button"
                  // className="bg-gray-300 p-1 rounded-lg active:bg-gray-400"
                  className="p-1   active:bg-gray-800 bg-payCol"
                  onClick={() => handleTentChange("vipCount", "increment")}
                >
                  <HiOutlinePlus className="w-5 h-5 text-white " />
                </button>
              </div>
            </div>
            {/* //bg-[#f4f4f4] */}
            <div className="flex justify-between items-center p-4   mb-4  bg-white border-[1px]    ">
              <label htmlFor="regular" className="text-lg">
                Standart <strong> 799,-</strong>
              </label>
              <div className="grid grid-cols-3 gap-3 justify-center place-items-center">
                <button
                  type="button"
                  onClick={() => handleTentChange("regularCount", "decrement")}
                  // className="p-1 border-[1px] border-black active:bg-gray-200 "
                  className="p-1   active:bg-gray-800 bg-payCol"
                >
                  <HiOutlineMinus className="w-5 h-5 text-white" />
                </button>
                <input
                  {...register("regularCount", { valueAsNumber: true })}
                  type="text"
                  placeholder="0"
                  min="0"
                  max="8"
                  id="regular"
                  readOnly
                  className=" w-10 border-[1px] border-gray-400 text-center  text-lg"
                  // value={regularCount} // Bruger den værdi, der er gemt i state
                />
                <button
                  type="button"
                  onClick={() => handleTentChange("regularCount", "increment")}
                  className="p-1   active:bg-gray-800 bg-payCol"
                >
                  <HiOutlinePlus className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            {errors.vipCount && (
              <span className="text-red-500">{errors.vipCount.message}</span>
            )}
          </div>
          <p className="font-medium italic place-self-end">
            Billetter valgt i alt ({totalTickets})
          </p>
        </div>
        <button
          type="submit"
          className="bg-[#2463EB] py-2 px-3 self-end place-self-end text-white text-lg mt-4"
        >
          Fortsæt
        </button>
      </form>
    </div>
  );
};

export default TicketSelectionForm;
