"use client";
import { useForm, useFieldArray } from "react-hook-form";
// import { postTicket } from "@/app/lib/supabase";
import { z } from "zod";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { KviteringContext } from "@/app/lib/KvitteringContext";
import { useContext } from "react";
import { AiTwotoneQuestionCircle } from "react-icons/ai";
import { GrCircleQuestion } from "react-icons/gr";
import { GrCircleInformation } from "react-icons/gr";
import { IoCloseCircleOutline } from "react-icons/io5";

import { FaRegTimesCircle } from "react-icons/fa";

const validering = z.object({
  tickets: z.array(
    z.object({
      name: z.string().min(1, "Indtast venligst et fornavn"),
      lastname: z.string().min(1, "Indtast venligst et efternavn"),
      email: z.string().regex(/@/, "Indtast venligst din e-mailadresse"),
      phonenumber: z.preprocess(
        // preprocess meget smart gør at mellem fjerens før validerieng helt genialt
        (value) => String(value).replace(/\s/g, ""), // Fjern mellemrum
        z.string().regex(/^\d{8}$/, "Telefonnummer skal være 8 cifre")
      ),
    })
  ),
});

const PersonalInfoForm = ({ onNext, onBack, formData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    // setValue,

    watch,
    // trigger,
    clearErrors,
  } = useForm({
    resolver: zodResolver(validering),
    // før var det en funktion nu er den en måde den valider på
    mode: "onBlur",
    reValidateMode: "onSubmit",

    defaultValues: {
      tickets: Array.from({ length: formData.totalTickets }, () => ({
        id: crypto.randomUUID(),
        name: "",
        lastname: "",
        email: "",
        phonenumber: "",
      })),
    },
  });

  const phoneNumber = watch("tickets", []);

  const formatPhoneNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    const formatted = cleanedValue.replace(/(\d{2})(?=\d)/g, "$1 "); // Tilføj mellemrum efter hver 2. cifre
    return formatted;
  };

  // bruges til kvitriengen
  const { setPersonalInfo } = useContext(KviteringContext); // Hent set-funktionen fra konteksten
  const [showInfo, setShowInfo] = useState(false);

  // const toggleInfo = (index) => {
  //   setShowInfo((prev) => {
  //     const updated = [...prev];
  //     updated[index] = !updated[index]; // Toggler kun infoboksen for det aktuelle indeks
  //     return updated;
  //   });
  // };

  const toggleInfo = (index) => {
    setShowInfo((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggler kun infoboksen for det aktuelle indeks
    }));
  };
  const onSubmit = (data) => {
    // giver id her
    const ticketsWithIds = data.tickets.map((ticket) => ({
      ...ticket,
      id: ticket.id || crypto.randomUUID(),
    }));

    console.log("Alle billetter efter mapping:", ticketsWithIds);
    console.log("formdata perosnligoplusomg", formData);
    // Opdater konteksten med de mappede billetter
    setPersonalInfo(ticketsWithIds);
    onNext({
      ...data,
      tickets: ticketsWithIds,
    });
    // });
  };
  return (
    <>
      {/* className=" grid grid-cols-1 lg:px-20 md:px-16 sm:px-10" */}
      <div>
        <h1 className="text-stor font-medium text-payCol">
          Personlige oplysninger
        </h1>
        {/* <p>
          For at sikre, at du modtager de korrekte billetter, eller at de bliver
          sendt til den rette modtager, bedes du venligst udfylde de nødvendige
          oplysninger.
        </p> */}
        <form onSubmit={handleSubmit(onSubmit)} className=" mt-4 flex flex-col">
          <div className="grid grid-cols-1   p-10  bg-white border-[1px]">
            {/* <p>udfyld formularen med billet modtagers informationer</p> */}
            <div>
              <h2 className=" text-xl font-medium ">
                Billet modtagers informationer *
              </h2>
              <p className="  text-neutral-600 text-sm pb-8 leading-5">
                <strong className="text-black font-medium">Bemærk: </strong>
                For at sikre korrekt levering af dine billetter, bedes du
                udfylde alle nødvendige modtageroplysninger præcist.
              </p>
              {/* <p className="  text-neutral-600 text-sm pb-8 leading-5">
                <strong className="text-black font-medium">Bemærk: </strong>
                For at sikre, at du modtager de korrekte billetter, eller at de
                bliver sendt til den rette modtager, bedes du venligst udfylde
                de nødvendige oplysninger.
              </p> */}
            </div>
            {formData?.totalTickets &&
              Array.from({ length: formData.totalTickets }).map(
                (ticket, index) => (
                  <div key={index} className=" grid-cols-1 pb-4   ">
                    <div className="  grid grid-cols-1 justify-items-center border-gray-400  px-6 ">
                      <div className=" border-[1px]  ">
                        <div className="bg-payCol p-4 flex relative justify-between">
                          <p className="text-center text-white ">
                            {index < formData.vipCount ? "VIP" : "Standart"}{" "}
                            Billet {index + 1}/{formData.totalTickets}
                          </p>
                          <button
                            type="button"
                            // className="text-sm text-white underline"
                            // onClick={() => setShowInfo(!showInfo)}
                            className="z-40"
                            onClick={() => toggleInfo(index)}
                          >
                            {/* <FaRegTimesCircle /> */}
                            {showInfo[index] ? (
                              <FaRegTimesCircle className="w-6 h-6 text-payCol" />
                            ) : (
                              <GrCircleQuestion className="w-6 h-6 text-blue-200" />
                            )}
                            {/* <GrCircleInformation /> */}
                            {/* <AiTwotoneQuestionCircle /> */}
                            {/* Hvad betyder dette? */}
                          </button>

                          {showInfo[index] && (
                            // <div className="absolute top-8 left-0 bg-white border-[1px] border-neutral-400 shadow-lg p-4 w-64 text-sm text-gray-700">
                            <div
                              className="absolute left-7 right-2 top-2
 bg-white border-[2px] border-payCol  shadow-lg  rounded-lg shadow-stone-400  text-sm text-gray-700 z-10"
                            >
                              <p className="text-center text-black"></p>

                              {/* <button
                                type="button"
                                // className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                className="absolute top-0 right-4"
                                // onClick={() => setShowInfo(false)}
                                onClick={() => toggleInfo(index)}
                              >
                                <FaRegTimesCircle className="w-6 h-6 text-payCol " />
                              </button> */}
                              <p className="p-4 text-base text-black text-balance">
                                <strong>Info:</strong> Udfyld formularen med
                                billet modtageroplysninger
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="px-6 pb-6">
                          <div className="flex flex-col">
                            <label
                              htmlFor={`tickets.${index}.name`}
                              className="text-base font-regular mb-1 pt-3"
                            >
                              Fornavn *
                            </label>
                            <input
                              {...register(`tickets.${index}.name`)}
                              id={`tickets.${index}.name`}
                              type="text"
                              placeholder="John"
                              onFocus={() =>
                                clearErrors(`tickets.${index}.name`)
                              }
                              className="border-[1px] border-neutral-400 p-2 bg-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-payCol"
                            />
                            {errors.tickets?.[index]?.name && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.tickets[index].name?.message}
                              </p>
                            )}
                          </div>

                          {/* Efternavn */}
                          <div className="flex flex-col w-[300px] ">
                            <label
                              htmlFor={`tickets.${index}.lastname`}
                              className="text-base font-regular mb-1 pt-3"
                            >
                              Efternavn *
                            </label>
                            <input
                              {...register(`tickets.${index}.lastname`)}
                              id={`tickets.${index}.lastname`}
                              type="text"
                              placeholder="Doe"
                              onFocus={() =>
                                clearErrors(`tickets.${index}.lastname`)
                              }
                              // className=" p-2 text-base bg-gray-100 focus:outline-none w-full focus:ring-2 focus:ring-payCol"
                              className="border-[1px] border-neutral-400 p-2 bg-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-payCol"
                            />
                            {errors.tickets?.[index]?.lastname && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.tickets[index].lastname?.message}
                              </p>
                            )}
                          </div>

                          {/* Telefonnummer */}
                          <div className="flex flex-col w-[300px] ">
                            <label
                              htmlFor={`tickets.${index}.phonenumber`}
                              className="text-base text-gray-800 font-regular mb-1 pt-3"
                            >
                              Mobiltelefonnummer *
                            </label>
                            <div className="relative w-full">
                              <input
                                {...register(`tickets.${index}.phonenumber`)}
                                id={`tickets.${index}.phonenumber`}
                                type="text"
                                value={formatPhoneNumber(
                                  phoneNumber[index]?.phonenumber || ""
                                )}
                                maxLength="11"
                                placeholder="12 34 56 78"
                                className="border-[1px] w-full border-neutral-400 p-2 bg-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-payCol"
                              />

                              {/* // sørge for det med mellemrum
                                // onFocus={() =>
                                //   clearErrors(`tickets.${index}.phonenumber`)
                                // } */}

                              {touchedFields.tickets?.[index]?.phonenumber &&
                                !errors.tickets?.[index]?.phonenumber && (
                                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                                    <FaCircleCheck className="text-costumGreen-fallback h-6 w-6" />
                                  </div>
                                )}
                            </div>
                            {errors.tickets?.[index]?.phonenumber && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.tickets[index].phonenumber?.message}
                              </p>
                            )}
                          </div>

                          {/* Email */}
                          <div className="flex flex-col w-[300px] ">
                            <label
                              htmlFor={`tickets.${index}.email`}
                              className="text-lg font-regular mb-1 pt-3"
                            >
                              E-mailadresse *
                            </label>
                            <input
                              {...register(`tickets.${index}.email`, {})}
                              id={`tickets.${index}.email`}
                              type="email"
                              placeholder="JohnDoe@email.com"
                              onFocus={() =>
                                clearErrors(`tickets.${index}.email`)
                              }
                              className="border-[1px] border-neutral-400 p-2 bg-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-payCol"
                              // className="border-[1px] border-black bg-gray-50 p-2 text-base focus:outline-none focus:ring-2 focus:ring-payCol"
                            />
                            {errors.tickets?.[index]?.email && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.tickets[index].email?.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="py-2 px-3 self-end place-self-end text-payCol border-2 border-payCol text-lg   mt-4"
              onClick={onBack}
            >
              Tilbage
            </button>

            <button
              type="submit"
              className="bg-payCol py-2 px-3 self-end place-self-end text-white text-lg  mt-4"
            >
              Fortsæt
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PersonalInfoForm;
