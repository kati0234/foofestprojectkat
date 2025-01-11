"use client";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { KviteringContext } from "@/app/lib/KvitteringContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { validering } from "@/app/lib/validation";
import { z } from "zod";
import { useState, useEffect } from "react";
// Preprocess og validering af kortnummer

const PaymentStep = ({ onNext, onBack, formData }) => {
  const {
    personalInfo,
    reservationId,
    timeRemaining,
    setPaymentSuccessfulContex,
  } = useContext(KviteringContext);

  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const formular = z.object({
    cardNumber: z.preprocess(
      (value) => String(value).replace(/\s/g, ""), // Fjern mellemrum
      z.string().regex(/^\d{16}$/, "Kortnummeret skal være præcis 16 cifre")
    ),
    cardHolder: z.string().min(1, "Kortindehaverens navn skal udfyldes"),
    expireDate: z
      .string()
      .regex(
        /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
        "Udløbsdato skal være i format MM/YY"
      ),
    // expireDate: z.string().min(1, "efternavn skal mindst være på 1 bogstav"),
    cvv: z.string().regex(/^\d{3}$/, "CVV skal være præcis 3 cifre"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue, // bruges til at sætte værdier dynamisk, f.eks. når vi ændrer område på vores knapper
    watch,
  } = useForm({
    resolver: zodResolver(formular),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    // defaultValues: {
    //   cardNumber: "",
    //   cardHolder: "",
    //   expireDate: "",
    //   cvv: "123",
    // },
  });

  const cardInfo = watch("cardNumber");
  const expireDateInfo = watch("expireDate");

  // useEffect(() => {
  //   console.log("FormData PAYMENT", formData);
  // }, [formData]); // Kun kald når formData ændres

  const formatExpireDate = (value) => {
    const cleanedValue = value.replace(/\D/g, ""); // Fjern ikke-cifre
    if (cleanedValue.length <= 2) return cleanedValue; // Returnér som det er, hvis der er to eller færre cifre
    return cleanedValue.slice(0, 2) + "/" + cleanedValue.slice(2, 4); // Indsæt '/' efter de første to cifre
  };

  const formatCardNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, ""); // Remove non-digits
    const formatted = cleanedValue.replace(/(\d{4})(?=\d)/g, "$1 "); // Add spaces after every 4 digits
    return formatted;
  };

  const onSubmit = (data) => {
    if (!timeRemaining || timeRemaining <= 0) return false;

    fetch("https://cerulean-abrupt-sunshine.glitch.me/fullfill-reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id: reservationId,
      }),
    })
      .then((response) => response.json())

      .then((submitData) => {
        console.log("her får vi data", submitData);

        // Hvis status og besked er som forventet
        if (submitData.message === "Reservation completed") {
          setPaymentSuccessful(true); // Opdater paymentSuccessful til true
          setPaymentSuccessfulContex(true);
          console.log("Betaling gennemført.");
          console.log(paymentSuccessful);
        } else {
          setPaymentSuccessful(false); // Hvis ikke, så mislykkes betalingen
          console.log("Betaling mislykkedes.");
        }
      })
      .catch((err) => console.error("her kommer fejl ", err));

    console.log("Form submitted:", data);
  };

  // useEffect(() => {
  //   if (paymentSuccessful && personalInfo.length > 0) {
  //     console.log("useeff data", personalInfo);

  //     personalInfo.forEach((ticket) => {
  //       fetch("https://klttbkdhdxrsuyjkwkuj.supabase.co/rest/v1/foofest", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           apikey:
  //             "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsdHRia2RoZHhyc3V5amt3a3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwODI4NDgsImV4cCI6MjA0OTY1ODg0OH0.e3FebWALlTqZTxB2vSWb0_xqWf-MxdZrVpKhTM-_dnc",
  //         },
  //         body: JSON.stringify(ticket), // Sender hvert objekt individuelt
  //       })
  //         // .then((res) => res.json())
  //         .then((res) => {
  //           console.log("Statuskode:", res.status); // Logger HTTP-statuskoden
  //           console.log("Headers:", res.headers); // Logger alle headers
  //           console.log("Content-Type:", res.headers.get("Content-Type")); // Logger Content-Type
  //           // det er det her det fiksede for der er noget med jison som bliver retuner som text
  //           return res.text(); // Brug .text() i stedet for .json() for at se rå data
  //         })
  //         .then((data) => {
  //           console.log("Data for objekt sendt:", data);
  //         });

  //       onNext({
  //         ...formData,
  //       });
  //     });
  //     console.log("Alle objekter er blevet sendt.");
  //   }
  // }, [paymentSuccessful, personalInfo]);

  useEffect(() => {
    if (paymentSuccessful && personalInfo.length > 0) {
      console.log("personalInfo data", personalInfo);

      const requests = personalInfo.map((ticket) => {
        return fetch(
          "https://klttbkdhdxrsuyjkwkuj.supabase.co/rest/v1/foofest",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsdHRia2RoZHhyc3V5amt3a3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwODI4NDgsImV4cCI6MjA0OTY1ODg0OH0.e3FebWALlTqZTxB2vSWb0_xqWf-MxdZrVpKhTM-_dnc",
            },
            body: JSON.stringify(ticket),
          }
        ).then((res) => {
          console.log("Statuskode:", res.status); // Logger HTTP-statuskoden
          console.log("Headers:", res.headers); // Logger alle headers
          console.log("Content-Type:", res.headers.get("Content-Type")); // Logger Content-Type
          // if (!res.ok) {
          //   throw new Error(`HTTP error! status: ${res.status}`);
          // }
          return res.text();
          // return res.json(); // virker ik
        });
      });

      Promise.all(requests)
        .then((responses) => {
          console.log("alt data sent syksefuld", responses);
          onNext({
            ...formData,
          });
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });

      // console.log("alle objects er send.");
    }
  }, [paymentSuccessful, personalInfo]);

  return (
    // className="grid grid-cols-1 lg:px-20 md:px-16 sm:px-10"
    <div>
      <h1 className="text-stor font-medium text-payCol">Betaling</h1>
      <form onSubmit={handleSubmit(onSubmit)} className=" grid grid-cols-1 ">
        <div className=" border-[1px] w-full flex flex-col   p-10 bg-white">
          <h2 className="text-xl font-medium pb-8">
            Udfyld betalings oblysninger *
          </h2>
          <div className="w-fit   place-self-center flex flex-col  border-[1px] p-3">
            <div className="flex flex-col">
              <label
                className="text-base font-regular mb-1 pt-3"
                htmlFor="cardHolder"
              >
                Navn på kortholder *
              </label>
              <input
                type="text"
                id="cardHolder"
                {...register("cardHolder")}
                className="border-[1px] border-neutral-400 p-2 bg-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-customPink"
                // className="border-2 border-black p-2 w-[300px]  text-base focus:outline-none focus:ring-2 focus:ring-customPink"
                name="cardHolder"
                placeholder="Indtast dit navn"
                required
              />

              {errors.cardHolder && (
                <span className="text-red-500 text-sm">
                  {errors.cardHolder.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label
                className="text-base font-regular mb-1 pt-3"
                htmlFor="cardnumber"
              >
                Kortnummer *
              </label>
              <input
                {...register("cardNumber")}
                value={formatCardNumber(cardInfo || "")} // This dynamically updates the value
                onChange={(e) => setValue("cardNumber", e.target.value)}
                className="border-[1px] border-neutral-400 p-2 bg-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-customPink"
                id="cardnumber"
                type="text"
                name="cardnumber"
                maxLength="19"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            {errors.cardNumber && (
              <span className="text-red-500 text-sm">
                {errors.cardNumber.message}
              </span>
            )}
            <div className="flex gap-3">
              <div className="flex flex-col">
                <label
                  className="text-base font-regular mb-1 pt-3"
                  htmlFor="expireDate"
                >
                  Udløbsdato *
                </label>
                <input
                  type="text"
                  {...register("expireDate")}
                  value={formatExpireDate(expireDateInfo || "")}
                  onChange={(e) => setValue("expireDate", e.target.value)}
                  placeholder="MM/YY"
                  id="expireDate"
                  maxLength="5"
                  className=" p-2 text-base bg-gray-100 focus:outline-none w-full focus:ring-2 focus:ring-payCol"
                  name="expireDate"
                />
                {errors.expireDate && (
                  <span className="text-red-500 text-sm pt-1">
                    {errors.expireDate.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  className="text-base font-regular mb-1 pt-3"
                  htmlFor="cvv"
                >
                  CVV *
                </label>
                <input
                  className="border-[1px] border-neutral-400 p-2 bg-gray-100 text-base focus:outline-none focus:ring-2 focus:ring-customPink"
                  {...register("cvv")}
                  id="cvv"
                  name="cvv"
                  placeholder="420"
                  maxLength="3"
                />
                {errors.cvv && (
                  <span className="text-red-500 text-sm pt-1">
                    {errors.cvv.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-payCol py-2 px-3 self-center place-self-center  text-white text-lg   mt-4"
          >
            Bekraft betalingen
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentStep;
