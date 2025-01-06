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
    <div className=" grid grid-cols-1 lg:px-40 md:px-20 sm:px-10 ">
      <h1 className="text-stor font-medium">Billetter</h1>
      <p>vælg biletter</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 mt-4 "
      >
        <div className="  bg-white   py-10  border-gray-400 rounded-lg border-1  shadow-md shadow-gray-400 px-10 ">
          <div className="flex justify-between">
            <h2>Vælg antal billetter </h2>
            <p className="font-medium italic"> ticket ({totalTickets})</p>
          </div>
          <div className="flex justify-between py-2   ">
            <label htmlFor="vip">Antal VIP 1299,-</label>
            <div className="grid grid-cols-3 gap-3 justify-center place-items-center border-[1px] border-gray-400 ">
              <button
                type="button"
                className="bg-gray-300 p-2"
                onClick={() => handleTentChange("vipCount", "decrement")}
              >
                <HiOutlineMinus className="w-6 h-6 text-center " />
              </button>

              <input
                {...register("vipCount", { valueAsNumber: true })}
                type="number"
                id="vip"
                placeholder="0"
                min="0"
                max="8"
                className=" text-center  text-lg"
                readOnly
              />
              <button
                type="button"
                className="bg-gray-300 p-2 active:bg-gray-400"
                onClick={() => handleTentChange("vipCount", "increment")}
              >
                <HiOutlinePlus className="w-6 h-6 " />
              </button>
            </div>
          </div>

          <div className="flex justify-between py-2 gap-7 ">
            <label htmlFor="regular">Antal normal 799,-</label>
            <div className="grid grid-cols-3 gap-3 justify-center place-items-center">
              <button
                type="button"
                onClick={() => handleTentChange("regularCount", "decrement")}
              >
                <HiOutlineMinus className="w-6 h-6 " />
              </button>
              <input
                {...register("regularCount", { valueAsNumber: true })}
                type="number"
                placeholder="0"
                min="0"
                max="8"
                id="regular"
                readOnly
                className=" w-10 text-center text-lg"
                // value={regularCount} // Bruger den værdi, der er gemt i state
              />
              <button
                type="button"
                onClick={() => handleTentChange("regularCount", "increment")}
              >
                <HiOutlinePlus className="w-6 h-6 " />
              </button>
            </div>
          </div>
          {errors.vipCount && (
            <span className="text-red-500">{errors.vipCount.message}</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-black py-2 px-3 self-end place-self-end text-white text-lg  border-black border-2 mt-4"
        >
          Gå videre
        </button>
      </form>
    </div>
  );
};

export default TicketSelectionForm;
