import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "./Hero.css";
import apparelDesignIllustration from "/public/images/hero/hero-illustration.png";

export default function Hero() {
  return (
    <div className="flex-center-between">
      {/* Left */}
      <div className="text-primary-black lg:w-1/2">
        <h1 className="font-extrabold lg:text-7xl lg:leading-[1.35]">
          Design Your Own{" "}
          <div className="relative z-10 w-max px-5 text-white">
            <div className="absolute left-0 top-2 -z-10 h-full w-full -rotate-[1deg] bg-primary-black"></div>
            Apparel
          </div>
        </h1>

        <h3 className="mb-5 mt-8 text-4xl font-medium">
          Unleash Your Creativity
        </h3>
        <p className="text-lg font-medium text-secondary-1 lg:w-3/4">
          We pride ourselves in providing a curated collection of custom apparel
          designed to inspire and empower
        </p>

        <Link href={"/products"} className="block lg:w-[43%]">
          <button
            className="flex-center-between hover-bubble mt-10 w-full rounded-full border border-primary-black bg-transparent px-4 py-2 text-lg text-primary-black"
            id="request-quote-btn"
          >
            Request to quote
            <div className="rounded-full border border-primary-black p-[6px]">
              <ArrowRight size={20} className="-rotate-45" />
            </div>
          </button>
        </Link>
      </div>

      {/* Right */}
      <div className="lg:w-1/2">
        <Image
          src={apparelDesignIllustration}
          alt="Hero section banner image"
          className="lg:ml-auto lg:w-[90%]"
        />
      </div>
    </div>
  );
}
