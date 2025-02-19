import AboutUsEditor from "@/components/dashboardLayout/aboutUs/AboutUsEditor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "About Us | United Threads ",
    template: "%s | United Threads",
  },
  description: "Generated by create next app",
};

const AboutPage = () => {
  return (
    <div>
      <h1 className='text-2xl font-bold w-full'>About</h1>
      <AboutUsEditor></AboutUsEditor>
    </div>
  );
};

export default AboutPage;
