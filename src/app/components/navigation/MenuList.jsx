import Link from "next/link";
import { motion } from "motion/react";
const MenuList = ({ setIsOpen, isOpen }) => {
  const handleClick = () => {
    setIsOpen(false); // Lukker menuen
  };
  const links = [
    { href: "/artister", label: "Artister" },
    { href: "/program", label: "Program" },
    { href: "/billetter", label: "Billetter" },
    { href: "/", label: "Home" },
  ];

  const itemVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 1 } },
    closed: { opacity: 0, y: 50, transition: { duration: 1 } },
  };

  const ulVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  return (
    <nav className="relative ">
      <motion.ul
        variants={ulVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className=" lg:left-1/3 sm:left-32 top-64 absolute  flex flex-col  justify-self-center align-middle gap-7 "
        exit="closed"
      >
        {links.map((link, index) => (
          <motion.li
            key={index} // Unik nøgle for hvert element
            variants={itemVariants} // Animer hvert element individuelt
            whileHover={{ scale: 1.1 }} // Hover-effekt
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={link.href}
              onClick={handleClick}
              className="text-5xl uppercase text-white font-bold hover:italic duration-400 ease-in-out"
            >
              {link.label}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </nav>
  );
};

export default MenuList;
