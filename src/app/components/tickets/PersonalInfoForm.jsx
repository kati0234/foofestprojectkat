"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { postTicket } from "@/app/lib/supabase";
import { z } from "zod";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { KviteringContext } from "@/app/lib/KvitteringContext";
import { useContext } from "react";

const validering = z.object({
  tickets: z.array(
    z.object({
      name: z.string().min(1, "navn skal mindst være på 1 bogstav"),
      lastname: z.string().min(1, "efternavn skal mindst være på 1 bogstav"),
      email: z.string().regex(/@/, "Email skal indeholde et '@' tegn"),
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

  //før stod det nede hved hver nu er det genanvendelu
  const handleBlur = (fieldName) => {
    const isValid = trigger(fieldName); // Trigger validering

    if (isValid) {
      clearErrors(fieldName); // Fjern fejlmeddelelsen, hvis validering er korrekt
    }
  };

  // Watch for the phonenumber input
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
      <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full grid">
        <div className="grid grid-cols-3  gap-4 px-10">
          {formData?.totalTickets &&
            Array.from({ length: formData.totalTickets }).map(
              (ticket, index) => (
                <div key={index} className="">
                  <h3 className="text-xl  mb-2">Billet {index + 1}</h3>
                  <div className="border-2 bg-white border-black py-8 px-6 mb-4">
                    <span className="text-black font-bold text-xl italic">
                      {index < formData.vipCount ? "VIP" : "Regular"}
                    </span>

                    {/* Navn */}
                    <div className="flex flex-col">
                      <label
                        htmlFor={`tickets.${index}.name`}
                        className="text-lg font-regular mb-1 pt-3"
                      >
                        Navn:
                      </label>
                      <input
                        {...register(`tickets.${index}.name`)}
                        id={`tickets.${index}.name`}
                        type="text"
                        placeholder="John"
                        onFocus={() => clearErrors(`tickets.${index}.name`)}
                        // onBlur={() => handleBlur(`tickets.${index}.name`)}
                        className="border-2 border-black p-2 text-base focus:outline-none focus:ring-2 focus:ring-customPink"
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
                    <div className="flex flex-col">
                      <label
                        htmlFor={`tickets.${index}.lastname`}
                        className="text-lg font-regular mb-1 pt-3"
                      >
                        Efternavn:
                      </label>
                      <input
                        {...register(`tickets.${index}.lastname`, {
                          required: "Efternavn er påkrævet",
                        })}
                        id={`tickets.${index}.lastname`}
                        type="text"
                        placeholder="Doe"
                        onFocus={() => clearErrors(`tickets.${index}.lastname`)}
                        // onBlur={() => handleBlur(`tickets.${index}.lastname`)}
                        className="border-2 border-black p-2 text-base focus:outline-none focus:ring-2 focus:ring-customPink"
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
                    <div className="flex flex-col ">
                      <label
                        htmlFor={`tickets.${index}.phonenumber`}
                        className="text-lg font-regular mb-1 pt-3"
                      >
                        Telefonnummer:
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
                          className="border-2 border-black p-2 text-base focus:outline-none w-full focus:ring-2 focus:ring-customPink"
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
                              <FaCircleCheck className="text-green h-6 w-6" />
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
                    <div className="flex flex-col">
                      <label
                        htmlFor={`tickets.${index}.email`}
                        className="text-lg font-regular mb-1 pt-3"
                      >
                        Email:
                      </label>
                      <input
                        {...register(`tickets.${index}.email`, {
                          required: "Email er påkrævet",
                        })}
                        id={`tickets.${index}.email`}
                        type="email"
                        placeholder="JohnDoe@email.com"
                        onFocus={() => clearErrors(`tickets.${index}.email`)}
                        // onBlur={() => handleBlur(`tickets.${index}.email`)}
                        // den her stylign det er det vi ønsker no med andre fraver
                        className="border-2 border-black p-2 text-base focus:outline-none focus:ring-2 focus:ring-customPink"
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
              )
            )}
        </div>
        <button
          type="submit"
          className="bg-customPink border-black border-2 text-black text-lg py-2 px-4 place-self-center  hover:bg-green w-fit hover:text-black"
        >
          Send
        </button>
      </form>
    </>
  );
};

export default PersonalInfoForm;
