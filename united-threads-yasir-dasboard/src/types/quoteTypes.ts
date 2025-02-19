/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCategory } from "./categoryTypes";
import { TUser } from "./userType";

export type TQuote = {
  _id: string;
  name: string;
  user: TUser;
  frontSide: string;
  backSide: string;
  pantoneColor: string;
  category: TCategory;
  hexColor: string;
  colorsPreferences: string[];
  size?: string;
  isDeleted: boolean;
  images: any[];
  quantity?: number;
  sizesAndQuantities?: TSizeAndQuantity[];
  materialPreferences: string;
  quoteStatus?: TQuoteStatus;
  isAccepted?: boolean;
  price: number;
  country: string;
  state: string;
  city: string;
  houseNo?: string;
  area?: string;
  comment?: string;
  salesCount: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TSizeAndQuantity = {
  size: string;
  quantity: number;
};

export type TQuoteStatus = "pending" | "processing" | "completed" | "canceled";
