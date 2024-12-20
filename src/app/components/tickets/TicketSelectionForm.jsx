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

  const totalTick = vipCount + regularCount;

  const handleTentChange = (type, operation) => {
    const currentValue = watch(type);
    let newValue =
      operation === "increment" ? currentValue + 1 : currentValue - 1;
    if (newValue < 0) newValue = 0; // Undgå negative værdier

    // Beregn den samlede mængde billetter (VIP + Regular)
    const totalTickets = vipCount + regularCount;

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
    });
  };

  return (
    <div className=" grid md:grid-cols-1 bg-white sm:px-10 m-4 lg:px-20 py-10 w-fit sm:place-self-center border-black border-2">
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className=" w-fit  ">
          <h1 className="text-stor font-medium">Billetter</h1>
          <div className="flex justify-between">
            <h2>Vælg antal billetter </h2>
            <p className="font-medium italic"> ticket ({totalTick})</p>
          </div>

          <div className="flex justify-between py-2  ">
            <label>Antal VIP 1299,-</label>
            <div className="grid grid-cols-3 gap-3 justify-center place-items-center">
              <button
                type="button"
                onClick={() => handleTentChange("vipCount", "decrement")}
              >
                <HiOutlineMinus className="w-6 h-6 " />
              </button>

              <input
                {...register("vipCount", { valueAsNumber: true })}
                type="number"
                placeholder="0"
                min="0"
                max="8"
                className=" w-10 text-center  text-lg"
                readOnly
              />
              <button
                type="button"
                onClick={() => handleTentChange("vipCount", "increment")}
              >
                <HiOutlinePlus className="w-6 h-6 " />
              </button>
            </div>
          </div>

          <div className="flex justify-between py-2 gap-7 ">
            <label>Antal normal 799,-</label>
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
          className="bg-green py-1 px-3 self-end place-self-end  border-black border-2 mt-4"
        >
          Gå videre
        </button>
      </form>
    </div>
  );
};

export default TicketSelectionForm;
