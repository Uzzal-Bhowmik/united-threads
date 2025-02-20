/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { Button, ColorPicker, Form, Select, Skeleton } from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import { LuCalendarDays } from "react-icons/lu";
import { TbMessage } from "react-icons/tb";
import rgbHex from "rgb-hex";
import Swal from "sweetalert2";

// Import necessary types
import generatePantoneColor from "@/lib/utils/convertHexToPanton";
import { useGetSingleQuoteQuery, useUpdateQuoteMutation } from "@/redux/api/quoteApi";
import { TResponse } from "@/types/global";
import { TSizeAndQuantity } from "@/types/quoteProductTypes";
import { TQuote } from "@/types/quoteTypes";
import { ScrollText } from "lucide-react";
import SizeSelectComponent from "./components/SizeSelectComponent";

type FieldType = {
  category: string;
  size: string;
  color: string;
  quantity: number;
  materialPreference: string;
  price: number;
  comment: string;
};

const QuoteOrderDetailsContainer = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetSingleQuoteQuery({ quoteId: id });
  const quote = (data as TResponse<TQuote>)?.data;
  const user = quote?.user;
  const [sizeAndQuantities, setSizeAndQuantities] = useState<TSizeAndQuantity[]>([]);
  const [pantoneColor, setPantoneColor] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>(quote?.hexColor || "#000000"); // Initial color
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [updateQuote] = useUpdateQuoteMutation();
  const router = useRouter();

  // Update Pantone color whenever selected color changes
  //useEffect(() => {
  //  if (selectedColor) {
  //    const pantoneColorObject = new simpleColorConverter({
  //      hex6: selectedColor,
  //      to: "pantone",
  //    });
  //    setPantoneColor(pantoneColorObject?.color || "Unknown Pantone");
  //  }
  //}, [selectedColor]);

  const handleColorChange = (css: string) => {
    // convert rgb to hex

    const hex = rgbHex(css);
    const panton = generatePantoneColor(`#${hex}`);
    setPantoneColor(panton.pantone);
    setSelectedColor(hex);
  };

  const onFinish = (values: FieldType) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to accept this quote?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = {
            quoteStatus: "processing",
            hexColor: selectedColor,
            materialPreferences: values.materialPreference,
            sizesAndQuantities: sizeAndQuantities,
            price: totalPrice,
            quantity: values.quantity,
            size: values.size,
            pantoneColor: pantoneColor,
            comment: values.comment,
          };
          //return;
          const formData = new FormData();
          formData.append("data", JSON.stringify(payload));

          const res = await updateQuote({
            quoteId: id,
            data: formData,
          }).unwrap();

          if (res?.success) {
            Swal.fire({
              title: "Accepted!",
              text: "The quote has been accepted.",
              icon: "success",
            }).then(() => {
              router.replace("/csr/quote-details");
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: res?.message,
              icon: "error",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong.",
            icon: "error",
          });
        }
      }
    });
  };

  useEffect(() => {
    setPantoneColor(quote?.pantoneColor || "#000000");
  }, [quote?.pantoneColor]);

  return (
    <>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <div>
          {/* Product Information */}
          <div>
            <Form
              layout='vertical'
              onFinish={onFinish}
              initialValues={{
                category: quote?.category?.name,
                size: quote?.size,
                color: quote?.hexColor,
                quantity: quote?.quantity,
                materialPreference: quote?.materialPreferences,
              }}
            >
              <div>
                <div className='grid lg:grid-cols-3'>
                  <div className=' max-w-lg lg:col-span-2'>
                    <div className='flex gap-3'>
                      <>
                        <ScrollText className='w-12 h-12 rounded-md bg-primaryBlack text-primaryWhite py-2 px-2' />
                      </>
                      <div>
                        <div className='space-y-3'>
                          <h2 className='text-xl font-bold'>Quote Details</h2>
                          <p className='font-bold'>Quote ID: #{quote?._id}</p>
                        </div>
                        <div className='flex items-center gap-3 mt-1 mb-5'>
                          <LuCalendarDays className='w-6 h-6' />
                          <p className='text-md'>
                            {moment(quote?.createdAt).format("MMM Do, YYYY")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Form.Item label='Category' name='category'>
                      <Select size='large' disabled />
                    </Form.Item>

                    {/*<Form.Item label='Size' name='size'>
                      <Select
                        disabled={quote.isAccepted}
                        size='large'
                        placeholder='Please Select a size'
                        options={[
                          { value: "S", label: "S" },
                          { value: "M", label: "M" },
                          { value: "L", label: "L" },
                          { value: "XL", label: "XL" },
                          { value: "XXL", label: "XXL" },
                        ]}
                      />
                    </Form.Item>*/}

                    <div className='flex items-start gap-x-3'>
                      <Form.Item name='color' className=''>
                        <ColorPicker
                          disabled={quote.isAccepted}
                          size='large'
                          onChange={(value, css) => handleColorChange(css)}
                          value={selectedColor.toString()}
                        />
                      </Form.Item>
                      <div className='text-sm'>
                        <p>Pantone code</p>
                        <p>{pantoneColor}</p>
                      </div>
                    </div>

                    {/*<Form.Item label='Quantity' name='quantity'>
                      <InputNumber
                        disabled={quote.isAccepted}
                        size='large'
                        style={{ width: "100%" }}
                        placeholder='Please input quantity'
                      />
                    </Form.Item>*/}
                    <div>
                      <SizeSelectComponent
                        disabled={!!quote.isAccepted}
                        setTotalPrice={setTotalPrice}
                        setSizesAndQuantities={setSizeAndQuantities}
                        defaultValues={quote?.sizesAndQuantities}
                      />
                    </div>
                    {/* Total price display */}
                    <div className='my-4 mt-6 text-end'>
                      <p className='font-bold text-xl'>
                        Total Price: ${totalPrice ? totalPrice.toFixed(2) : quote.price}
                      </p>
                    </div>

                    {/*<Form.Item label='Price' name='price' rules={[{ required: true }]}>
                      <InputNumber
                        disabled={quote.isAccepted}
                        defaultValue={quote?.price}
                        size='large'
                        style={{ width: "100%" }}
                        placeholder='Please input price'
                      />
                    </Form.Item>*/}

                    <Form.Item label='Materials Preference' name='materialPreference'>
                      <TextArea disabled={quote.isAccepted} rows={4} placeholder='Write here...' />
                    </Form.Item>
                  </div>

                  <div className='w-full space-y-3 h-full flex flex-col justify-between'>
                    <div className='flex gap-3'>
                      <CiUser className='w-12 h-12 rounded-md bg-primaryBlack text-primaryWhite py-2 px-2' />
                      <div className='w-full'>
                        <div className='flex items-center justify-between w-full'>
                          <h2 className='text-xl font-bold mb-3'>Retailer</h2>
                        </div>
                        <p className='mb-2'>
                          Full Name: {user?.firstName} {user?.lastName}
                        </p>
                        <p className='mb-2'>Email: {user?.email}</p>
                        <p className='mb-2'>Phone: {user?.contact}</p>
                      </div>
                    </div>
                    <Link href={`/csr/message/${user?._id}`}>
                      <Button size='large' icon={<TbMessage />} block>
                        Message Retailer
                      </Button>
                    </Link>

                    <div className='flex gap-4'>
                      <div className='flex flex-col gap-1 justify-center items-center'>
                        <Image
                          src={quote?.frontSide}
                          alt='productImage'
                          className='border border-black px-4 py-8 h-full max-h-[300px] w-auto rounded-md'
                          width={300}
                          height={300}
                        />
                        <figcaption className='text-[#00B047] text-xl font-medium'>
                          Front Side
                        </figcaption>
                      </div>
                      <div className='flex flex-col gap-1 justify-center items-center'>
                        <Image
                          src={quote?.backSide}
                          alt='productImage'
                          className='border border-black px-4 py-8 h-full max-h-[300px] w-auto rounded-md'
                          width={300}
                          height={300}
                        />
                        <figcaption className='text-[#00B047] text-xl font-medium'>
                          Back Side
                        </figcaption>
                      </div>
                    </div>
                    <div>
                      <Form.Item label='Comment (Optional)' name='comment'>
                        <TextArea
                          disabled={quote.isAccepted}
                          defaultValue={quote?.comment}
                          rows={4}
                          placeholder='Write comment for Retailer...'
                        />
                      </Form.Item>
                      <Button disabled={quote.isAccepted} htmlType='submit' block size='large'>
                        {quote.isAccepted ? "Accepted" : "Quote Accept"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteOrderDetailsContainer;
