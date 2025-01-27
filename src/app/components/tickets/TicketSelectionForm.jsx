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
    .refine((data) => data.vipCount > 0 || data.regularCount > 0, {
      message: "Du skal vælge mindst én billet",
      path: ["vipCount"], // Eller "regularCount" hvis du vil vise fejlen på det ene felt
    });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    watch, // Brug watch til at få værdierne af formularfelterne
  } = useForm({
    resolver: zodResolver(validering),
    mode: "onchange",
    reValidateMode: "onSubmit",
    defaultValues: {
      vipCount: 0, // Standardværdi for vipCount
      regularCount: 0, // Standardværdi for regularCount
    },
  });

  // bruges til kvitriengen
  const { updateCartData } = useContext(KviteringContext);

  // bruges til at opdater total ticket nok
  const vipCount = watch("vipCount"); // Standardværdi 0
  const regularCount = watch("regularCount"); // Standardværdi 0

  const totalTickets = vipCount + regularCount;

  const handleChange = (type, operation) => {
    const currentValue = watch(type);
    let newValue =
      operation === "increment" ? currentValue + 1 : currentValue - 1;
    if (newValue < 0) newValue = 0; // Undgå negative værdier

    // Kun tillad ændringen, hvis den samlede mængde ikke overstiger 8

    if (totalTickets < 8 || (operation === "decrement" && newValue >= 0)) {
      setValue(type, newValue);
      updateCartData({ [type]: newValue });
    }
  };

  const onSubmit = (data) => {
    onNext({
      ...data,
      totalTickets,
    });
  };

  return (
    <div>
      <h1 className="text-stor font-medium text-payCol">Billetter</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 mt-4">
        <div className="bg-white border-[1px] p-10">
          <h2 className="text-xl font-medium ">Vælg dine billetter </h2>
          <p className="  text-neutral-600 text-base pb-4 leading-5">
            Max antal billetter: 8
          </p>
          <div className=" place-self-center w-full ">
            <div className="flex justify-between items-center p-4 gap-10  mb-4  bg-white border-[1px]  ">
              <label htmlFor="vip" className="text-lg">
                VIP <strong> 1299,- </strong>
              </label>

              <div className="grid grid-cols-3 gap-3 pl-10 justify-center place-items-center  border-gray-400 ">
                <button
                  type="button"
                  aria-label="minus vip"
                  className="p-1   active:bg-gray-800 bg-payCol  hover:bg-blue-700"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp")
                      handleChange("vipCount", "increment");
                    if (e.key === "ArrowDown")
                      handleChange("vipCount", "decrement");
                  }}
                  onClick={() => {
                    handleChange("vipCount", "decrement");
                    clearErrors(["vipCount"]);
                  }}
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
                  className=" w-10 border-[1px] border-gray-400 text-center  text-lg"
                  readOnly
                  aria-live="polite"
                  aria-describedby="fejl-besked"
                />
                <button
                  aria-label="plus vip"
                  type="button"
                  className="p-1   active:bg-gray-800 bg-payCol  hover:bg-blue-700"
                  onClick={() => {
                    handleChange("vipCount", "increment");
                    clearErrors(["vipCount"]);
                  }}
                >
                  <HiOutlinePlus className="w-5 h-5 text-white " />
                </button>
              </div>
            </div>
            {/* //bg-[#f4f4f4] */}
            <div className="flex justify-between items-center p-4   mb-4  bg-white border-[1px]    ">
              <label htmlFor="regular" className="text-lg">
                Standard <strong> 799,-</strong>
              </label>
              <div className="grid grid-cols-3 gap-3 justify-center place-items-center">
                <button
                  type="button"
                  aria-label="minus standard"
                  onClick={() => {
                    handleChange("regularCount", "decrement");
                    clearErrors(["vipCount"]);
                  }}
                  className="p-1   active:bg-gray-800 bg-payCol  hover:bg-blue-700"
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
                  aria-describedby="fejl-besked"
                  className=" w-10 border-[1px] border-gray-400 text-center  text-lg"
                />
                <button
                  type="button"
                  aria-label="plus standard"
                  onClick={() => {
                    handleChange("regularCount", "increment");
                    clearErrors(["vipCount"]);
                  }}
                  className="p-1   active:bg-gray-800 bg-payCol hover:bg-blue-700"
                >
                  <HiOutlinePlus className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            {errors.vipCount && (
              <span id="fejl-besked" className="text-red-500 text-sm">
                {errors.vipCount.message}
              </span>
            )}
          </div>
          <p className=" italic place-self-end pr-2">
            Billetter valgt i alt <strong> ({totalTickets})</strong>
          </p>
        </div>
        <button
          type="submit"
          className="bg-payCol active:bg-gray-800 py-2 px-3 self-end place-self-end  text-white text-lg mt-4"
        >
          Fortsæt
        </button>
      </form>
    </div>
  );
};

export default TicketSelectionForm;
