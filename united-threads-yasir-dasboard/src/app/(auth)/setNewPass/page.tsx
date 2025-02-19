import SetNewPassForm from "@/components/(auth)/setNewPass/SetNewPassForm";

const SetPasswordPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary ">
      <div className="flex justify-center items-center md:max-w-[581px] md:h-[500px]  mx-auto border-2 border-[#363D43] md:px-12 px-6 py-5 rounded-[40px] bg-[#3A3F3F] ">
        <div>
          <div className="mb-6 text-center text-[#F8FAFC] space-y-5 font-kumbh_sans">
            <h2 className="text-2xl  font-semibold  ">Set a new password</h2>
            <p className="mt-6">
              Create a new password. Ensure it differs from previous ones for
              security
            </p>
          </div>
          <SetNewPassForm></SetNewPassForm>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;
