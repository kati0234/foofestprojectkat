"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { KviteringContext } from "@/app/lib/KvitteringContext";
import { useContext } from "react";
import { GrCircleQuestion } from "react-icons/gr";
import { FaRegTimesCircle } from "react-icons/fa";

const validering = z.object({
  tickets: z.array(
    z.object({
      name: z.string().trim().min(1, "Indtast fornavn for billetmodtager"),
      lastname: z
        .string()
        .trim()
        .min(1, "Indtast efternavn for billetmodtager"),
      // email: z.string().regex(/@/, "e-mailadressen skal indholde '@'"),
      email: z
        .string()
        .regex(
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          "Email skal indeholde et '@' tegn og et '.' efter '@'"
        ),

      phonenumber: z.preprocess(
        // preprocess meget smart gør at mellem fjerens før validerieng helt genialt
        (value) => String(value).replace(/\s/g, ""), // Fjern mellemrum
        z.string().regex(/^\d{8}$/, "Mobiltelefonnummer skal være 8 cifre")
      ),
    })
  ),
});

const PersonalInfoForm = ({ onNext, onBack, formData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    clearErrors,
  } = useForm({
    resolver: zodResolver(validering),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: {
      tickets: Array.from({ length: formData.totalTickets }, () => ({
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

  const toggleInfo = (index) => {
    setShowInfo((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggler kun infoboksen for det aktuelle indeks
    }));
  };
  const onSubmit = (data) => {
    setPersonalInfo(data.tickets);
    onNext({
      ...data,
    });
  };

  return (
    <div>
      <h1 className="text-stor font-medium text-payCol">Registrering</h1>

      <form onSubmit={handleSubmit(onSubmit)} className=" mt-4 flex flex-col">
        <div className="grid grid-cols-1   p-10  bg-white border-[1px]">
          <div>
            <h2 className=" text-xl font-medium text-black ">
              Oplysninger om billetmodtager *
            </h2>
            <p className="  text-neutral-800 text-base pb-6 pt-2 leading-5">
              <strong className="text-black font-medium"> Vigtigt: </strong>
              For at sikre at du modtager dine billetter, bedes du udfylde alle
              modtageroplysninger korekt.
            </p>
          </div>
          {formData?.totalTickets &&
            Array.from({ length: formData.totalTickets }).map(
              (ticket, index) => (
                <fieldset key={index} className=" grid-cols-1 pb-4">
                  <div className="  grid grid-cols-1 justify-items-center border-gray-400  px-6 ">
                    <div className=" border-[1px]  ">
                      <div className="bg-payCol p-4 flex relative justify-between">
                        <legend className="text-center text-white ">
                          {index < formData.vipCount ? "VIP" : "Standard"}{" "}
                          {index + 1}/{formData.totalTickets}
                        </legend>
                        <button
                          type="button"
                          aria-label={
                            showInfo[index]
                              ? "Skjul information"
                              : "Vis information"
                          }
                          className="z-40"
                          onClick={() => toggleInfo(index)}
                        >
                          {showInfo[index] ? (
                            <FaRegTimesCircle className="w-6 h-6 text-payCol" />
                          ) : (
                            <GrCircleQuestion className="w-6 h-6 text-blue-200" />
                          )}
                        </button>

                        {showInfo[index] && (
                          // <div className="absolute top-8 left-0 bg-white border-[1px] border-neutral-400 shadow-lg p-4 w-64 text-sm text-gray-700">
                          <div className="absolute left-2 right-2 top-2  bg-neutral-50 border-[1px]    shadow-lg  rounded-lg shadow-stone-400  text-sm text-gray-700 z-10">
                            <p className="text-center text-black"></p>

                            <p className="p-4 text-base text-black text-balance text-center">
                              <strong>Info:</strong> Udfyld formularen med
                              billetmodtagers oplysninger
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
                            aria-required="true"
                            onFocus={() => clearErrors(`tickets.${index}.name`)}
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
                            aria-required="true"
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
                              aria-required="true"
                              aria-describedby="telfon-help-text"
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
                                  <FaCircleCheck className="text-black h-6 w-6" />
                                </div>
                              )}
                          </div>
                          {errors.tickets?.[index]?.phonenumber && (
                            <p
                              id="telfon-help-text"
                              className="text-red-500 text-sm mt-1"
                            >
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
                            type="text"
                            aria-describedby="email-help-text"
                            placeholder="JohnDoe@email.com"
                            aria-required="true"
                            onFocus={() =>
                              clearErrors(`tickets.${index}.email`)
                            }
                            className="border-[1px] border-neutral-400 p-2 bg-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-payCol"
                          />
                          {errors.tickets?.[index]?.email && (
                            <p
                              id="email-help-text"
                              className="text-red-500 text-sm mt-1"
                            >
                              {errors.tickets[index].email?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              )
            )}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="py-2 px-3 self-end place-self-end text-payCol  active:border-gray-800 active:text-gray-800 border-2 border-payCol text-lg   mt-4"
            onClick={onBack}
          >
            Tilbage
          </button>

          <button
            type="submit"
            className="bg-payCol py-2 px-3 self-end place-self-end  active:bg-gray-800  text-white text-lg  mt-4"
          >
            Fortsæt
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
