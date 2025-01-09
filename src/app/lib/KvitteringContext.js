"use client";
import Link from "next/link";
import { createContext, useContext, useState, useEffect } from "react";

export const KviteringContext = createContext();

// Opret provider til at indpakke komponenter og give adgang til context
export const KviteringProvider = ({ children }) => {
  const [cartData, setCartData] = useState({});
  const [personalInfo, setPersonalInfo] = useState([]);
  // firkat er arry...

  const [reservationId, setReservationId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeoutMessage, setTimeoutMessage] = useState("");
  const [paymentSuccessfulContex, setPaymentSuccessfulContex] = useState(false);
  const startReservation = (id, timeout) => {
    setReservationId(id);
    setTimeRemaining(timeout);
    setTimeoutMessage("");

    console.log(`Reservation startet. ID: ${id}, Timeout: ${timeout}s`);
  };
  // Funktion til at håndtere timeout
  const handleTimeout = () => {
    setTimeoutMessage(
      "Tidsgrænsen er udløbet! Din reservation er blevet annulleret."
    );
    console.log("Reservation timeout udløbet.");
  };

  useEffect(() => {
    if (timeRemaining > 0 && !paymentSuccessfulContex) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, paymentSuccessfulContex]); // Tilføj paymentSuccessfulContex som en afhængighed kunne optmrrs med den anden payment sucesfukd

  const updateCartData = (newData) => {
    setCartData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <KviteringContext.Provider
      value={{
        cartData,
        updateCartData,
        reservationId,
        timeRemaining,
        startReservation,
        timeoutMessage,
        personalInfo,
        setPersonalInfo,
        setPaymentSuccessfulContex,
        paymentSuccessfulContex,
      }}
    >
      {children}
      {timeoutMessage && (
        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white pt-10 pb-10 px-20 text-center shadow-lg">
          {/* {timeoutMessage} */}
          <p className="font-bold text-2xl">Tiden er udløbet</p>
          <p className="pb-2">din betaling er udløbet naviger til forsiden </p>
          <Link href="/" className="font-medium  ">
            <div className="border-2 border-payCol p-4">
              <p className="text-payCol text-xl ">naviger til forsiden</p>
            </div>
          </Link>
        </div>
      )}
    </KviteringContext.Provider>
  );
};
