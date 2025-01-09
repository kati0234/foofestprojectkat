"use client";
import { useForm, useFieldArray } from "react-hook-form";
// import { postTicket } from "@/app/lib/supabase";
import { z } from "zod";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { KviteringContext } from "@/app/lib/KvitteringContext";
import { useContext } from "react";

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
    trigger,
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
              <p className=" italic text-neutral-600 text-sm pb-8">
                For at sikre, at du modtager de korrekte billetter, eller at de
                bliver sendt til den rette modtager, bedes du venligst udfylde
                de nødvendige oplysninger.
              </p>
            </div>
            {formData?.totalTickets &&
              Array.from({ length: formData.totalTickets }).map(
                (ticket, index) => (
                  <div key={index} className=" grid-cols-1 pb-4   ">
                    {/* <div className=" p-6">
                      <h2 className="text-xl">Personlige oplysinger</h2>

                      <p className="">
                        {index < formData.vipCount ? "VIP" : "Standart"} Billet{" "}
                        {index + 1}/{formData.totalTickets}
                      </p>
                      <p></p>
                    </div> */}
                    <div className="  grid grid-cols-1 justify-items-center border-gray-400  px-6 ">
                      {/* <span className="text-black font-bold text-xl italic"></span> */}
                      {/* <div className="bg-neutral-200 w-full p-4">
                        <p className="text-center">
                          {index < formData.vipCount ? "VIP" : "Standart"}{" "}
                          Billet {index + 1}/{formData.totalTickets}
                        </p>
                      </div> */}
                      {/* Navn */}
                      <div className=" border-[1px] ">
                        {/* <p className="text-lg">
                          Indtast Billetmodtagerens Informationer
                        </p> */}
                        <div className="bg-payCol p-2">
                          <p className="text-center text-white ">
                            {index < formData.vipCount ? "VIP" : "Standart"}{" "}
                            Billet {index + 1}/{formData.totalTickets}
                          </p>
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
                              // onBlur={() => handleBlur(`tickets.${index}.name`)}
                              className="border-2 border-black w-[300px] p-2 text-base focus:outline-none focus:ring-2 focus:ring-payCol"
                              // className={`border-2 p-2 text-base focus:outline-none focus:ring-2 ${
                              //   errors.tickets?.[index]?.email
                              //     ? "border-red-500 focus:ring-red-500"
                              //     : "border-lime-400 focus:ring-black"
                              // }`}
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
                              {...register(`tickets.${index}.lastname`, {
                                required: "Efternavn er påkrævet",
                              })}
                              id={`tickets.${index}.lastname`}
                              type="text"
                              placeholder="Doe"
                              onFocus={() =>
                                clearErrors(`tickets.${index}.lastname`)
                              }
                              // onBlur={() => handleBlur(`tickets.${index}.lastname`)}
                              className="border-[1px] border-neutral-400 p-2 bg-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-payCol"
                              // className={`border-2 p-2 text-base focus:outline-none focus:ring-2 ${
                              //   errors.tickets?.[index]?.email
                              //     ? "border-red-500 focus:ring-red-500"
                              //     : "border-lime-400 focus:ring-black"
                              // }`}
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
                                {...register(`tickets.${index}.phonenumber`, {
                                  // required: "Telefonnummer er påkrævet",
                                })}
                                id={`tickets.${index}.phonenumber`}
                                type="text"
                                value={formatPhoneNumber(
                                  phoneNumber[index]?.phonenumber || ""
                                )} // sørge for det med mellemrum
                                // onFocus={() =>
                                //   clearErrors(`tickets.${index}.phonenumber`)
                                // }
                                // onFocus={() => {
                                //   // Fjern ikke fejlmeddelelsen, bare fokusér på inputfeltet
                                // }}
                                // onFocus={() => {
                                //   // Fjern fejlmeddelelsen ved fokus, men lad validiteten forblive
                                //   clearErrors(`tickets.${index}.phonenumber`);
                                // }}
                                onFocus={() => {
                                  // Fjern fejlinformation kun, når brugeren begynder at ændre feltet
                                  // Vi beholder eventuelle fejl, hvis feltet er korrekt
                                  // if (!touchedFields.tickets?.[index]?.phonenumber) {
                                  //   // Do not clear errors immediately; it should happen when value changes
                                  // }
                                }}
                                // onBlur={() =>
                                //   handleBlur(`tickets.${index}.phonenumber`)
                                // }
                                placeholder="12 34 56 78"
                                className=" p-2 text-base bg-gray-100 focus:outline-none w-full focus:ring-2 focus:ring-payCol"
                                // className={`border-2 p-2 text-base focus:outline-none focus:ring-2 ${
                                //   errors.tickets?.[index]?.phonenumber
                                //     ? "border-red-500 focus:ring-red-500"
                                //     : "border-lime-400 focus:ring-black"
                                // }`}
                              />

                              {/* {isValid.tickets?.[index]?.phonenumber && (
                        <p>
                          <FaCircleCheck />
                          hay
                        </p>
                      )} */}
                              {touchedFields.tickets?.[index]?.phonenumber &&
                                !errors.tickets?.[index]?.phonenumber && (
                                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                                    <FaCircleCheck className="text-black h-6 w-6" />
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
                              {...register(`tickets.${index}.email`, {
                                required: "Email er påkrævet",
                              })}
                              id={`tickets.${index}.email`}
                              type="email"
                              placeholder="JohnDoe@email.com"
                              onFocus={() =>
                                clearErrors(`tickets.${index}.email`)
                              }
                              // onBlur={() => handleBlur(`tickets.${index}.email`)}
                              // den her stylign det er det vi ønsker no med andre fraver
                              className="border-[1px] border-black bg-gray-50 p-2 text-base focus:outline-none focus:ring-2 focus:ring-payCol"
                              // className={`border-2 p-2 text-base focus:outline-none focus:ring-2 ${
                              //   errors.tickets?.[index]?.email
                              //     ? "border-red-500 focus:border-r-indigo-800"
                              //     : "border-lime-400 focus:ring-black"
                              // }`}
                              // className="border-2 border-black p-2 text-base focus:outline-none focus:ring-2 focus:ring-customPink"
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
