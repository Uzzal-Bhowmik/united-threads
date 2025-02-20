export type TUser = {
  _id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  contact: string;
  profilePicture: string | null;
  role: "CUSTOMER" | "ADMIN" | "CSR";
  isActive: boolean;
  isDelete: boolean;
  validation: {
    isVerified: boolean;
    _id: string;
  };
  isMessageBlock?: boolean;
  createdAt: string;
  updatedAt: string;
};
