"use client";
import { motion, MotionConfig } from "motion/react";
import { useState } from "react";

const MenuBtn = ({ isOpen, setIsOpen }) => {
  return (
    <MotionConfig
      transition={{
        duration: "0.5",
        ease: "easeInOut",
      }}
      // er en spimle context provider som er fra motion som skupper værdier ned til dens børn her fx transition
    >
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        animate={isOpen ? "open" : "closed"}
        className="justify-self-end relative h-[3.75rem] w-[3.75rem] rounded-full bg-customPink text-black"
      >
        <motion.span
          className="absolute h-1 w-7 bg-white  text-black"
          initial={{
            rotate: "0deg",
            y: "-50%",
            x: "-50%",
            left: "50%",
            top: "35%",
          }}
          variants={{
            open: {
              rotate: ["0deg", "45deg"],
              top: ["35%", "50%", "50%"],
            },
            closed: {
              rotate: ["45deg", "0deg"],
              top: ["50%", "50%", "35%"],
            },
          }}
        />
        <motion.span
          className="absolute h-1 w-7 bg-white"
          initial={{
            rotate: "0deg",
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
          }}
          variants={{
            open: {
              rotate: ["0deg", "-45deg"],
            },
            closed: {
              rotate: ["-45deg", "0deg"],
            },
          }}
        />
        <motion.span
          className="absolute h-1 w-4 bg-white"
          initial={{
            rotate: "0deg",
            left: "calc(50% + 6px)",
            bottom: "35%",
            x: "-50%",
            y: "50%",
          }}
          variants={{
            open: {
              rotate: ["0deg", "45deg"],
              left: "50%",
              bottom: ["35%", "50%"],
            },
            closed: {
              rotate: ["45deg", "0deg"],
              left: "calc(50% + 6px)",
              bottom: ["50%", "35%"],
            },
          }}
        />
      </motion.button>
    </MotionConfig>
  );
};

export default MenuBtn;
