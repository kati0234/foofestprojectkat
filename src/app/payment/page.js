"use client";

import { useState, useEffect } from "react";

import TicketSelectionForm from "../components/tickets/TicketSelectionForm";
import CampingOptionsForm from "../components/tickets/CampingOptionsForm";
import PersonalInfoForm from "../components/tickets/PersonalInfoForm";
import ReviewStep from "../components/tickets/PaymentStep";
import PaymentStep from "../components/tickets/PaymentStep";
import StepBar from "../components/tickets/StepBar";
import Kvitering from "../components/tickets/Kvitering";
// import { KviteringContext } from "../lib/KvitteringContext";
import { KviteringProvider } from "../lib/KvitteringContext"; // Korriger stien til din KvitteringContext-fil
import ReservationTimer from "../components/tickets/ReservationTimer";

const Payment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    console.log("FormData efter opdatering:", formData);
  }, [formData]); // Kun kald når formData ændres

  const nextStep = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);
  return (
    <div className="grid grid-cols-[1fr]  justify-between py-20 lg:px-20 md:px-20 sm:px:10 bg-neutral-50">
      <div className="bg-neutral-50 ">
        <KviteringProvider>
          <StepBar step={step} />
          <div className=" grid  md:grid-cols-[1fr_0.4fr] sm:grid-cols-1 sm:justify-center py-16 col-span-full gap-4 max-sm:justify-items-center">
            <div className="">
              {step === 1 && <TicketSelectionForm onNext={nextStep} />}
              {step === 2 && (
                <PersonalInfoForm
                  formData={formData}
                  onBack={prevStep}
                  onNext={nextStep}
                />
              )}
              {step === 3 && (
                <CampingOptionsForm
                  onBack={prevStep}
                  onNext={nextStep}
                  formData={formData}
                />
              )}
              {step === 4 && (
                <div>
                  <PaymentStep
                    formData={formData}
                    onBack={prevStep}
                    onNext={nextStep}
                  />
                  <ReservationTimer />
                </div>
              )}
              {step === 5 && (
                <div className="bg-orange-700">
                  <div>
                    <h1 className="text-black text-2xl">
                      tillykke!! du har fuldført din ordre
                    </h1>
                  </div>
                </div>
              )}
            </div>
            <Kvitering formData={formData} />
          </div>
        </KviteringProvider>
      </div>
    </div>
  );
};

export default Payment;
