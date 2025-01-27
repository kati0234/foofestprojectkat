"use client";
import { useContext, useEffect, useState } from "react";
import { KviteringContext } from "@/app/lib/KvitteringContext";
const ReservationTimer = ({}) => {
  const { reservationId, timeRemaining, paymentSuccessfulContex } =
    useContext(KviteringContext);

  // console.log("reservationId:", reservationId);

  // Formattering af tiden

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`; //gøre mere læsveblig alitd 2 cifre
  };

  if (!reservationId || paymentSuccessfulContex) return null;

  return (
    <div className="bg-payCol z-30  justify-center items-center mt-4    w-72  gap-6 flex">
      <h3 className="text-center p-2 text-white">
        Din reservation udløber om: {formatTime(timeRemaining)}
      </h3>
    </div>
  );
};

export default ReservationTimer;
