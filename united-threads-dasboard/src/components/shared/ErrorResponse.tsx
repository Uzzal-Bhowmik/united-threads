import { toast } from "sonner";
/* eslint-disable @typescript-eslint/no-explicit-any */
const ErrorResponse = (err: any, toastId?: number | string) => {
  if (err?.message) {
    toast.error(err?.message || "Something went wrong", {
      id: toastId,
      duration: 2000,
    });
  } else {
    toast.error(err?.data?.message || "Something went wrong", {
      id: toastId,
      duration: 2000,
    });
  }
};

export default ErrorResponse;
