/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import httpStatus from "http-status";
import moment from "moment";
import mongoose, { Schema } from "mongoose";
import path from "path";
import { io } from "../../../server";
import QueryBuilder from "../../builder/QueryBuilder";
import config from "../../config";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import { sendMail } from "../../utils/sendMail";
import { TNotification } from "../notification/notification.interface";
import { NotificationServices } from "../notification/notification.service";
import { ORDER_STATUS } from "../order/order.constant";
import { TOrder } from "../order/order.interface";
import OrderModel from "../order/order.model";
import { PaymentModel } from "../payment/payment.model";
import UserModel from "../user/user.model";
import { TQuote } from "./quote.interface";
import QuoteModel from "./quote.model";
// Create Quote in Database
const createQuoteIntoDb = async (user: TTokenUser, payload: TQuote) => {
  const userData = await UserModel.findById(user._id).lean();

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  // Create a new Quote in the database
  const result: any = await (
    await QuoteModel.create({ ...payload, user: userData._id })
  ).populate("category user");

  const csrId = await UserModel.findOne({ role: "CSR" }).select("_id").lean();

  if (csrId) {
    // send notification to csr
    const notification: TNotification = {
      receiver: csrId._id,
      title: "New Quote Request",
      message: `A new quote request has been created by ${userData.firstName} ${userData.lastName}.`,
      type: "QUOTE",
    };

    io.emit(`notification::${csrId._id}`, {
      success: true,
      data: notification,
    });

    await NotificationServices.createNotificationIntoDb(notification);
  }

  const parentMailTemplate = path.join(process.cwd(), "/src/template/quote-details.html");
  const quoteDetailsMail = fs.readFileSync(parentMailTemplate, "utf-8");
  const html = quoteDetailsMail
    .replace(/{{FULL_NAME}}/g, userData.firstName || "" + " " + userData.lastName || "")
    .replace(/{{QUOTE_ID}}/g, result?._id.toString())
    .replace(/{{DATE}}/g, moment(result.createdAt).format("MMM, DD YYYY") || "")
    .replace(/{{EMAIL}}/g, userData.email || "")
    .replace(/{{PHONE}}/g, userData.contact || "")
    .replace(/{{CATEGORY}}/g, (result.category.name as string) || "")
    .replace(/{{PANTONE_CODE}}/g, result.pantoneColor || "")
    .replace(/{{MATERIALS_PREFERENCE}}/g, result.materialPreferences || "")
    .replace(/{{FRONT_IMAGE}}/g, String(result.frontSide))
    .replace(/{{BACK_IMAGE}}/g, String(result.backSide));

  await sendMail({
    to: config.email.user as string,
    html,
    subject: "Send a Quote Request by " + userData.firstName + " " + userData.lastName,
  });

  return result;
};

// Get All Quote from Database
const getAllQuotesFromDb = async (query: Record<string, unknown>) => {
  let createdAt: string | null = null;
  if (query.createdAt) {
    createdAt = query.createdAt as string;
    delete query.createdAt; // Remove createdAt from the main query
  }

  const quoteQuery = new QueryBuilder(QuoteModel.find().populate("user category"), query)
    .search(["name", "description", "materialPreferences"])
    .filter()
    .sort()
    .createdAtRangeFilter("createdAt", createdAt)
    .paginate()
    .fields();

  const meta = await quoteQuery.countTotal();
  const quotes = await quoteQuery.modelQuery;
  return {
    quotes,
    meta,
  };
};

// Get Product By ID
const getQuoteByIdFromDb = async (id: string) => {
  const quote = await QuoteModel.findById(id).populate("category user").lean();
  if (!quote || quote.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Quote Not Found");
  }
  return quote;
};

// Update Quote in Database
const updateQuoteIntoDb = async (quoteId: string, payload: Partial<TQuote>) => {
  const updatedQuote = await QuoteModel.findOneAndUpdate(
    { _id: quoteId, isDeleted: false },
    { ...payload },
    { new: true, runValidators: true },
  );

  if (!updatedQuote) {
    throw new AppError(httpStatus.NOT_FOUND, "Quote Not Found");
  }

  const notification: TNotification = {
    receiver: updatedQuote.user,
    title: "Quote Updated",
    message: `Your quote has been ${updatedQuote.quoteStatus}.`,
    type: "QUOTE",
  };

  const notificationData = await NotificationServices.createNotificationIntoDb(notification);

  io.emit(`notification::${updatedQuote.user}`, {
    success: true,
    data: notificationData,
  });

  return updatedQuote;
};

// Soft Delete Quote in Database
const deleteQuoteIntoDb = async (id: string) => {
  const deletedQuote = await QuoteModel.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true, runValidators: true },
  );

  if (!deletedQuote) {
    throw new AppError(httpStatus.NOT_FOUND, "Quote Not Found");
  }

  return deletedQuote;
};

const getMyQuotesFromDb = async (user: TTokenUser, query: Record<string, unknown>) => {
  const filterQuery: Record<string, unknown> = {};

  let createdAt: string | null = null;

  // Extract the createdAt date and remove it from the query object
  if (query.createdAt) {
    createdAt = query.createdAt as string;
    delete query.createdAt; // Remove createdAt from the main query
  }

  Object.keys(query).forEach((key) => {
    if (key !== "createdAt") {
      if (key === "isAccepted") {
        filterQuery[key] = query[key] === "true";
      } else {
        filterQuery[key] = query[key];
      }
    }
  });

  const quotesQuery = new QueryBuilder(
    QuoteModel.find({ user: user._id, isDeleted: false }).populate("category"),
    filterQuery,
  )
    .search(["name", "description", "materialPreferences"])
    .filter()
    .sort()
    .createdAtRangeFilter("createdAt", createdAt)
    .paginate()
    .fields();

  const quotes = await quotesQuery.modelQuery;
  const meta = await quotesQuery.countTotal();
  return {
    quotes,
    meta,
  };
};

const acceptQuoteIntoDb = async (quoteId: string, user: TTokenUser) => {
  const quoteData = await QuoteModel.findOne({
    _id: quoteId,
    user: user._id,
  }).lean();

  if (!quoteData) {
    throw new AppError(httpStatus.NOT_FOUND, "Quote Not Found");
  }
  //if (quoteData.isAccepted) {
  //  throw new AppError(httpStatus.BAD_REQUEST, "Quote Already Accepted");
  //}

  if (quoteData.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Quote Already Deleted");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedQuote = await QuoteModel.findByIdAndUpdate(
      { _id: quoteId },
      {
        isAccepted: true,
      },
      { new: true, runValidators: true, session },
    );

    // AFTER ACCEPT QUOTE BY USER THEN CREATE A ORDER IN DATABASE
    const orderPayload: TOrder = {
      orderType: "QUOTE",
      quote: updatedQuote?._id,
      amount: quoteData.price,
      status: ORDER_STATUS.PENDING,
      user: new Schema.Types.ObjectId(user._id),
      paymentStatus: "UNPAID",
      quantity: quoteData.quantity,
      country: quoteData.country,
      state: quoteData.state,
      city: quoteData.city,
      houseNo: quoteData.houseNo,
      area: quoteData.area,
      size: quoteData.size,
      color: quoteData.hexColor,
      sizesAndQuantities: quoteData.sizesAndQuantities,
    };
    //const order = await OrderServices.createOrderForQuote(user, orderPayload);
    const result = await OrderModel.create([{ ...orderPayload, user: user._id }], {
      session,
    });

    await PaymentModel.create(
      [
        {
          order: result[0]._id,
          amount: result[0].amount,
        },
      ],
      {
        session,
      },
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const QuoteServices = {
  createQuoteIntoDb,
  getAllQuotesFromDb,
  getQuoteByIdFromDb,
  updateQuoteIntoDb,
  deleteQuoteIntoDb,
  getMyQuotesFromDb,
  acceptQuoteIntoDb,
};
