import * as z from "zod";

export const validering = z
  .object({
    vipCount: z
      .number()
      .min(0, "Antal VIP billetter skal være et positivt tal")
      .default(0),
    regularCount: z
      .number()
      .min(0, "Antal Regular billetter skal være et positivt tal")
      .default(0),
    addTentSetup: z.boolean().default(false), // Tilkøb af teltopsætning
    greenCamping: z.boolean().default(false), // Grøn camping
    tent2p: z
      .number()
      .min(0, "Antallet af 2-personers telte skal være et positivt tal")
      .default(0),
    tent3p: z
      .number()
      .min(0, "Antallet af 3-personers telte skal være et positivt tal")
      .default(0),
    area: z.string().optional("Du skal vælge et campingområde"), // Campingområdet skal vælges
  })

  // Tjekker om enten vip eller regular billetter er valgt
  .refine((data) => data.vipCount > 0 || data.regularCount > 0, {
    message: "Du skal vælge mindst én billet",
    path: ["vipCount"], // Eller "regularCount" hvis du vil vise fejlen på det ene felt
  })

  .refine(
    (data) => {
      if (data.addTentSetup) {
        // Beregn samlet antal pladser i teltene
        const totalPeopleInTents =
          (data.tent2p || 0) * 2 + (data.tent3p || 0) * 3;
        // Beregn samlet antal billetter
        // const totalTickets = (data.vipCount || 0) + (data.regularCount || 0);
        const totalTickets = data.vipCount + data.regularCount;

        console.log("Total people in tents:", totalPeopleInTents);
        console.log("Total tickets:", totalTickets);

        // Tillad højst én ekstra plads i teltene i forhold til billetterne
        const isValid = totalPeopleInTents <= totalTickets + 1;
        console.log("Is valid?", isValid);

        return isValid;
      }
      return true; // Hvis ingen teltopsætning, er alt ok
    },
    {
      message:
        "Pladserne i teltene må højst være én mere end det samlede antal billetter.",
      path: ["tent2p"], // Fokusér fejlen på teltvalget
    }
  );

// Hvis grøn camping er valgt, skal campingSelected være true
//   .refine(
//     (data) => {
//       if (data.greenCamping) {
//         return data.campingSelected === true;
//       }
//       return true;
//     },
//     {
//       message: "Du skal vælge campingplads, hvis du vælger grøn camping",
//       path: ["greenCamping"],
//     }
//   );

// Hvis teltopsætning er valgt, skal der være mindst et telt
//   .refine(
//     (data) => {
//       if (data.addTentSetup) {
//         return data.tent2p > 0 || data.tent3p > 0;
//       }
//       return true;
//     },

//     {
//       message: "Du skal vælge mindst ét telt, hvis du har valgt teltopsætning",
//       path: ["tent2p", "tent3p"],
//     }
//   )

// Hvis teltopsætning er valgt, skal det samlede antal personer i teltene matche antallet af billetter
//   .refine(
//     (data) => {
//       if (data.addTentSetup) {
//         // Beregn samlet antal personer i telte
//         const totalPeopleInTents = data.tent2p * 2 + data.tent3p * 3;
//         // Beregn samlet antal billetter
//         const totalTickets = (data.vipCount || 0) + (data.regularCount || 0);

//         // Hvis antallet af personer i teltene ikke matcher billetterne, er der en fejl
//         return totalPeopleInTents === totalTickets;
//       }
//       return true; // Hvis teltopsætning ikke er valgt, skip valideringen
//     },
//     {
//       message:
//         "Antallet af telte og personer skal matche det valgte antal billetter",
//       path: ["tent2p", "tent3p"],
//     }
//   )
