import Hero from "@/components/homeSections/Hero/Hero";
import Image from "next/image";
import bgFlowers from "/public/images/home/bg-flowers.png";
import Categories from "@/components/homeSections/Categories/Categories";
import Features from "@/components/homeSections/Features/Features";
import Testimonials from "@/components/homeSections/Testimonials/Testimonials";
import Products from "@/components/homeSections/Products/Products";

export const metadata = {
  title: "Home",
  description: "The official home page of The United Threads - Wear The Change",
};

export default function Home() {
  return (
    <div className="relative z-10 space-y-40 lg:mx-auto lg:w-3/4">
      <Hero />
      <Categories />
      <Products />
      <Features />
      <Testimonials />

      {/* --------- Background Flowers ------------- */}
      <div>
        <Image
          src={bgFlowers}
          alt="background flower image"
          className="absolute -right-10 top-[300px] -z-10"
        />
      </div>
      {/* ------------------------------------------ */}
    </div>
  );
}
