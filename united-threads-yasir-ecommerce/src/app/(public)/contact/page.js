import { Phone } from "lucide-react";
import { Clock } from "lucide-react";
import ContactForm from "./_components/ContactForm";

export const metadata = {
  title: "Contact Us",
  description: "About us page",
};

export default function ContactUsPage() {
  return (
    <div className="flex-center mt-40 h-[80vh]">
      <div className="lg:w-1/2">
        <h1 className="text-center text-6xl font-extrabold text-primary-black">
          Get In Touch
        </h1>
        <div className="flex-center mb-10 mt-6 gap-x-10">
          <div className="flex-center-start gap-x-3">
            <Clock size={20} />
            <p className="text-lg">We are available 24/7</p>
          </div>

          <div className="h-1 w-1 rounded-full bg-primary-black" />

          <div className="flex-center-start gap-x-3">
            <Phone size={20} />
            <p className="text-lg">+1 (234) 8097</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
