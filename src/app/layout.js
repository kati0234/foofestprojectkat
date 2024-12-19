import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/navigation/Header";
import Head from "next/head";
import Menu from "./components/navigation/Menu";
import Footer from "./components/navigation/Footer";
// import ApiContext from "./lib/ApiContext";
export const metadata = {
  title: "foofest",
  description: "Generated by create next app",
};
const inter = Inter({
  subsets: ["latin"],
  // weight: ["400", "500", "600", "700"],

  display: "swap",
  variable: "--font-inter",
  // style: ["normal", "italic"], // Normal og Italic
  // variable: "--font-inter", // Til Tailwind variable
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background font-sans ">
        <Header />
        {/* <Menu /> */}
        {/* <Navbar></Navbar> */}

        {children}
        <Footer />
      </body>
    </html>
  );
}
