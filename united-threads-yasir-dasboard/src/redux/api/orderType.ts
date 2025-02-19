/* eslint-disable @typescript-eslint/no-explicit-any */
import { TProduct } from "@/types/productType";
import { TQuoteProduct } from "@/types/quoteProductTypes";
import { TQuote } from "@/types/quoteTypes";
import { TUser } from "@/types/userType";

export type TOrder = {
  _id: string;
  user: TUser;
  product: TProduct;
  quote: TQuote;
  quantity: number;
  amount: number;
  status: TOrderStatus;
  size: string;
  orderType: TOrderType;
  paymentStatus: TPaymentStatus;
  sizesAndQuantities?: TSizeAndQuantity[];
  duoAmount: number;
  country: string;
  state?: string;
  city: string;
  houseNo: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export type TSizeAndQuantity = {
  size: string;
  quantity: number;
};

export type TPayment = {
  _id: string;
  order: string;
  amount: 1000;
  paymentGateway: string;
  status: TPaymentStatus;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export type TStripeCheckoutSession = {
  id: string;
  object: any;
  after_expiration?: null;
  allow_promotion_codes?: null;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: {
    enabled: boolean;
    liability?: null;
    status?: null;
  };
  billing_address_collection?: null;
  cancel_url: string;
  client_reference_id?: null;
  client_secret?: null;
  consent?: null;
  consent_collection?: null;
  created: number;
  currency: string;
  currency_conversion?: null;
  custom_fields: any[];
  custom_text: {
    after_submit?: null;
    shipping_address?: null;
    submit?: null;
    terms_of_service_acceptance?: null;
  };
  customer: string;
  customer_creation: string;
  customer_details: {
    address: {
      city?: null;
      country: string;
      line1?: null;
      line2?: null;
      postal_code?: null;
      state?: null;
    };
    email: string;
    name: string;
    phone?: null;
    tax_exempt: "none";
    tax_ids: any[];
  };
  customer_email?: null;
  expires_at: number;
  invoice?: null;
  invoice_creation: {
    enabled: boolean;
    invoice_data: {
      account_tax_ids?: null;
      custom_fields?: null;
      description?: null;
      footer?: null;
      issuer: {
        type: string;
      };
      metadata: Record<string, any>;
      rendering_options?: null;
    };
  };
  livemode: boolean;
  locale?: null;
  metadata: {
    order: string;
  };
  mode: "payment";
  payment_intent: string;
  payment_link?: null;
  payment_method_collection: "if_required";
  payment_method_configuration_details?: null;
  payment_method_options: {
    card: {
      request_three_d_secure: "automatic";
    };
  };
  payment_method_types: string[];
  payment_status: "paid";
  phone_number_collection: {
    enabled: boolean;
  };
  recovered_from?: null;
  saved_payment_method_options: {
    allow_redisplay_filters: string[];
    payment_method_remove?: null;
    payment_method_save?: null;
  };
  setup_intent?: null;
  shipping_address_collection?: null;
  shipping_cost?: null;
  shipping_details?: null;
  shipping_options: any[];
  status: TOrderStatus;
  submit_type?: null;
  subscription?: null;
  success_url: string;
  total_details: {
    amount_discount: number;
    amount_shipping: number;
    amount_tax: number;
  };
  ui_mode: "hosted";
  url?: null;
};

export type TOrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
export type TOrderType = "SHOP" | "QUOTE";
export type TPaymentStatus = "PAID" | "UNPAID" | "REFUNDED";
