import Image from "next/image";
import SignUpForm from "./_components/SignUpForm";
import signUpGraphic from "/public/images/sign-up/Tablet login-bro (1) 1.png";
import logo from "/public/images/login/logo.png";

export const metadata = {
  title: "Sign Up",
  description: "Sign up page",
};

export default function SignUpPage() {
  return (
    <div className="flex-center w-full gap-x-20 rounded-xl border border-gray-200 p-10 shadow-[0px_0px_2px_lightGray]">
      {/* Left */}
      <div>
        <Image src={signUpGraphic} alt="sign up graphic" />
      </div>

      {/* Right */}
      <div>
        <Image src={logo} alt="logo" className="mx-auto mb-10 w-1/2" />

        <SignUpForm />
      </div>
    </div>
  );
}
