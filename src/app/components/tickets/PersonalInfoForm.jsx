import { useForm, useFieldArray } from "react-hook-form";
import { postTicket } from "@/app/lib/supabase";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//jeg definerer mine værdier til mit skema
const formular = z.object({
  tickets: z.array(
    z.object({
      name: z.string().min(1, "navn skal mindst være på 1 bogstav"),
      lastname: z.string().min(1, "efternavn skal mindst være på 1 bogstav"),
      email: z.string().email("Email skal være gyldig"),
      phonenumber: z
        .string()
        .regex(/^\d{8}$/, "Telefonnummer skal være 8 cifre"),
    })
  ),
  // cardNumber: z
  //   .string()
  //   .regex(/^\d{13,19}$/, "Kortnummeret skal være mellem 13 og 19 cifre"),
  // cardName: z.string().min(1, "udfyld venligst navn"),
  // expireYear: z.date("skal udfyldes"),
});

const PersonalInfoForm = ({ onNext, onBack, formData }) => {
  const {
    register,
    handleSubmit, // Håndterer formularindsendelse
    formState: { errors, isValid },
    setValue, // Indeholder fejlmeddelelser
  } = useForm({
    resolver: zodResolver(formular), //vi validerer med zod
    reValidateMode: "onSubmit",
    defaultValues: {
      tickets: Array.from(
        { length: formData.vipCount + formData.regularCount }, // Opretter et array af billetter baseret på antal VIP og Regular billetter
        () => ({
          name: "",
          lastname: "",
          email: "",
          phonenumber: "",
        })
      ),
    },
  });

  //opretter et array af billetter. Fields er vores array, som indeni har vores billetter.
  // const { fields } = useFieldArray({
  //   name: "tickets",
  // });

  const onSubmit = (data) => {
    console.log("Form data:", data);
    onNext(data); // Kalder onNext med udfyldt data
  };

  // Funktion til at sende data til Supabase
  const sendToSupabase = async (data) => {
    try {
      const response = await postTicket(data); // Dette er vores Supabase post funktion
      console.log(response);
      if (response?.success) {
        console.log("Data sendt til Supabase:", response);
      } else {
        console.error("Fejl ved afsendelse til Supabase");
      }
    } catch (error) {
      console.error("Fejl ved afsendelse:", error);
    }
  };

  // Funktion der håndterer send knappen, der kun aktiveres når data er valideret
  const handleSendToSupabase = (data) => {
    const tickets = data.tickets.map((ticket) => ({
      ...ticket,
      id: crypto.randomUUID(), // Generér et unikt ID for hver billet
    }));

    // Send billetter til Supabase
    tickets.forEach(async (ticket) => {
      try {
        const response = await postTicket(ticket);
        if (response?.success) {
          console.log("Billet sendt til Supabase:", response);
        } else {
          console.error("Fejl ved afsendelse af billet:", response);
        }
      } catch (error) {
        console.error("Fejl ved afsendelse:", error);
      }
    });
  };

  return (
    <>
      <div className="flex gap-4 place-self-center">
        <p>Valgte billetter:</p>
        <ul>
          <li>VIP Billetter: {formData.vipCount}</li>
          <li>Regular Billetter: {formData.regularCount}</li>
        </ul>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="gap-6 p-2 flex flex-wrap justify-center"
      >
        {formData?.vipCount + formData?.regularCount &&
          Array.from({
            length: formData?.vipCount + formData?.regularCount,
          }).map((ticket, index) => (
            <div key={index} className="w-96">
              <h3 className="text-xl font-light mb-2">Billet {index + 1}</h3>
              <div className="border-2 bg-white border-black py-8 px-6 mb-4">
                <span className="text-customPink font-bold text-xl italic">
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
                    {...register(`tickets.${index}.name`, {
                      required: "Navn er påkrævet",
                    })}
                    id={`tickets.${index}.name`}
                    type="text"
                    className="border-2 border-black p-2 text-base focus:outline-none focus:ring-2 focus:ring-customPink"
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
                    className="border-2 border-black p-2 text-base focus:outline-none focus:ring-2 focus:ring-customPink"
                  />
                  {errors.tickets?.[index]?.lastname && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tickets[index].lastname?.message}
                    </p>
                  )}
                </div>

                {/* Telefonnummer */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`tickets.${index}.phonenumber`}
                    className="text-lg font-regular mb-1 pt-3"
                  >
                    Telefonnummer:
                  </label>
                  <input
                    {...register(`tickets.${index}.phonenumber`, {
                      required: "Telefonnummer er påkrævet",
                    })}
                    id={`tickets.${index}.phonenumber`}
                    type="text"
                    className="border-2 border-black p-2 text-base focus:outline-none focus:ring-2 focus:ring-customPink"
                  />
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
                    className="border-2 border-black p-2 text-base focus:outline-none focus:ring-2 focus:ring-customPink"
                  />
                  {errors.tickets?.[index]?.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tickets[index].email?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        <button
          type="button"
          onClick={handleSubmit(handleSendToSupabase)}
          className="bg-customPink border-black border-2 text-black text-lg py-2 px-4 hover:bg-green hover:text-black w-fit"
        >
          Send til Supabase
        </button>

        {/* til form  */}
        <button
          type="submit"
          className="bg-customPink border-black border-2 text-black text-lg py-2 px-4  hover:bg-green w-fit hover:text-black"
        >
          Send
        </button>
      </form>
      <div className="flex gap-6"></div>
    </>
  );
};

export default PersonalInfoForm;
{
  /* Udløbsdato */
}
{
  /* <div className="flex flex-col">
        <label htmlFor="expireYear" className="text-lg font-medium mb-1">
          Udløbsdato:
        </label>
        <Controller
          control={control}
          name="expireYear"
          render={({ field }) => (
            <input
              {...field}
              id="expireYear"
              placeholder="MM/ÅÅ"
              className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
        {errors.expireYear && (
          <p className="text-red-500 text-sm mt-1">
            {errors.expireYear.message}
          </p>
        )}
      </div> */
}

{
  /* CVV */
}
{
  /* <div className="flex flex-col">
        <label htmlFor="cvv" className="text-lg font-medium mb-1">
          CVV:
        </label>
        <Controller
          control={control}
          name="cvv"
          render={({ field }) => (
            <input
              {...field}
              id="cvv"
              className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
        {errors.cvv && (
          <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
        )}
      </div> */
}

{
  /* Kortnummer */
}
{
  /* <div className="flex flex-col">
<label htmlFor="cardnumber" className="text-lg font-medium mb-1">
  Kortnummer:
</label>
<Controller
  control={control}
  name="cardnumber"
  render={({ field }) => (
    <input
      {...field}
      id="cardnumber"
      className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )}
/>
{errors.cardnumber && (
  <p className="text-red-500 text-sm mt-1">
    {errors.cardnumber.message}
  </p>
)}
</div> */
}
