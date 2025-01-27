import { motion } from "motion/react";

const StepBar = ({ step }) => {
  const steps = [
    { id: 1, label: "Billetter" },
    { id: 2, label: "Registrering" },
    { id: 3, label: "Camping" },
    { id: 4, label: "Betaling " },
    { id: 5, label: "Fuldført" },
  ];

  const calculateWidth = () => `${(step / steps.length) * 100}%`;

  return (
    <div className="relative col-span-full ">
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 "></div>
      <motion.div
        className="absolute bottom-0 left-0 h-1  bg-[#2463EB]"
        initial={{ width: "0%" }}
        animate={{ width: calculateWidth() }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      ></motion.div>

      {/* Steps */}
      <div className="flex md:pt-4 lg:justify-center lg:col-start-1 lg:col-span-1  md:justify-center sm:justify-center">
        {steps.map(({ id, label }) => (
          <div key={id} className="flex items-center px-8 py-4">
            {/* Circle Indicator */}
            <div
              className={`flex items-center justify-center sm:flex-col ${
                step >= id
                  ? " text-[#2463EB] text-lg border-b-pink"
                  : "border-gray-300"
              }`}
            >
              <p className="font-semibold">{id}</p>

              {/* Label */}
              <p
                className={` md:text-lg lg:text-lg sm:text-xs ${
                  step === id
                    ? "text-[#2463EB] font-bold"
                    : step > id
                    ? "text-black"
                    : "text-black"
                } max-sm:hidden sm:hidden md:block lg:block`}
              >
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepBar;
