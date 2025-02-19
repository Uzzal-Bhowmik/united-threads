export type TNotification = {
  _id: string;
  receiver: string;
  title: string;
  message: string;
  link: null | string;
  seen: boolean;
  type: "PAYMENT" | "ORDER" | "QUOTE" | "MESSAGE";
  __v: 0;
  createdAt: string;
  updatedAt: string;
};
