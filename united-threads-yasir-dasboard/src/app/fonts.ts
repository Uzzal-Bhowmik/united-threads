import {Kumbh_Sans, Poppins, Roboto} from "next/font/google";

export const poppins = Poppins({
  subsets:["latin"],
  weight: ["300",  "400", "500", "600", "700"],
  variable:"--font-poppins",
  display:"swap"
})

export const kumbh = Kumbh_Sans({
  subsets: ["latin"],
  weight: ["300",  "400", "500", "600", "700"],
  variable: "--font-kumbh",
});


export const roboto = Roboto({
  subsets:["latin"],
  weight: ["100","300","400","500","700","900"],
  variable:"--font-roboto",
  display:"swap"
})