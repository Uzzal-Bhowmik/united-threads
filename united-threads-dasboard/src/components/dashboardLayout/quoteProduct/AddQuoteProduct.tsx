import EForm from "@/components/Form/FormProvider";
import EInput from "@/components/Form/ResInput";
import ESelect from "@/components/Form/ResSelect";
import { convertPantoneToHex } from "@/lib/utils/convertHexToPanton";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetQuoteCategoriesQuery } from "@/redux/api/quoteCategoryApi";
import { useAddQuoteProductMutation } from "@/redux/api/quoteProductApi";
import { TCategory } from "@/types/categoryTypes";
import { TResponse } from "@/types/global";
import { PlusOutlined, PlusSquareFilled } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ColorPicker, Input, InputRef, Modal, Tag, theme, Tooltip, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import { PiUploadLight } from "react-icons/pi";
import { toast } from "sonner";
import * as z from "zod";

// Define validation schema in zod
export const addQuoteProductValidation = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  category: z.string({ required_error: "Category is required" }),
  size: z.array(z.string()).optional(),
});

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
};

const AddQuoteProduct = ({ open, setOpen }: TPropsType) => {
  const { token } = theme.useToken();
  const [pentonColors, setPentonColors] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  //const [colors, setColors] = useState<any[]>([]);
  const [frontSideImage, setFrontSideImage] = useState<any[]>([]);
  const [backSideImage, setBackSideImage] = useState<any[]>([]);
  const [additionalImages, setAdditionalImages] = useState<any[]>([]);
  // Size options
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => ({
    label: size,
    value: size,
  }));

  // Fetch categories
  const { data: categoryRes } = useGetQuoteCategoriesQuery({ limit: 99999 });
  const categories = categoryRes as TResponse<TCategory[]>;

  // Handle color selection
  //const handleColor = (colorObj: any) => {
  //  const { key } = colorObj;
  //  const exist = colors.find((clr) => clr.key === key);

  //  if (exist) {
  //    const rest = colors.filter((clr) => clr.key !== exist.key);
  //    setColors([...rest, colorObj]);
  //  } else {
  //    setColors([...colors, colorObj]);
  //  }
  //};

  //const handleAddNewColor = () => {
  //  setColors([...colors, { key: colors.length + 1, hex: "#ffffff" }]);
  //};

  const [addQuoteProduct, { isLoading }] = useAddQuoteProductMutation();

  // Handle image uploads
  const handleFrontSideImageChange = ({ fileList: newFileList }: any) => {
    setFrontSideImage(newFileList.slice(-1)); // Only one image
  };

  const handleBackSideImageChange = ({ fileList: newFileList }: any) => {
    setBackSideImage(newFileList.slice(-1)); // Only one image
  };

  const handleAdditionalImagesChange = ({ fileList: newFileList }: any) => {
    setAdditionalImages(newFileList); // Multiple images
  };

  // Submit form data
  const onSubmit = async (data: any) => {
    if (!frontSideImage.length || !backSideImage.length) {
      toast.error("Both front side and back side images are required.");
      return;
    }

    //const colorsPreferences = pentonColors.length
    //  ? [
    //      // Convert pentonColors to hex
    //      ...pentonColors.map((pantone) => {
    //        const convertedColor = convertPantoneToHex(pantone);
    //        console.log({ convertedColor });
    //        if (convertedColor) {
    //          return "#" + convertedColor || "#000000";
    //        } else {
    //          return pantone;
    //        }
    //      }),
    //      // Include existing hex colors
    //      //...colors.map((clr) => clr.hex),
    //    ]
    //  : [];

    const formData = new FormData();
    const payload = {
      name: data.name,
      colorsPreferences: pentonColors,
      category: data.category,
      size: data.size,
    };
    formData.append("data", JSON.stringify(payload));
    formData.append("frontSide", frontSideImage[0]?.originFileObj);
    formData.append("backSide", backSideImage[0]?.originFileObj);
    additionalImages.forEach((image: any) => {
      formData.append("images", image.originFileObj);
    });

    try {
      const res = await addQuoteProduct(formData).unwrap();
      setOpen(false);
      if (res?.data?.success) {
        toast.success(res.message);
        //setColors([]);
        setFrontSideImage([]);
        setBackSideImage([]);
        setAdditionalImages([]);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag: string) => {
    const newTags = pentonColors.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setPentonColors(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && pentonColors?.indexOf(inputValue) === -1) {
      setPentonColors([...pentonColors, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const forMap = (tag: string) => (
    <span key={tag} style={{ display: "inline-block" }}>
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
        color={`#${convertPantoneToHex(tag)}`}
      >
        {tag}
      </Tag>
    </span>
  );

  const tagChild = pentonColors.map(forMap);

  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      style={{
        minWidth: "max-content",
        position: "relative",
      }}
    >
      <div className='pb-2'>
        <div className='mt-2'>
          <EForm onSubmit={onSubmit} resolver={zodResolver(addQuoteProductValidation)}>
            {/* Product Name */}
            <EInput
              type='text'
              label='Product Name'
              placeholder='Enter Product Name'
              name='name'
              size='large'
            />

            {/* Category */}
            <ESelect
              label='Category'
              name='category'
              options={
                categories?.data?.length
                  ? categories.data.map((category: TCategory) => ({
                      value: category._id,
                      label: category.name,
                    }))
                  : []
              }
              placeholder='Select Category'
              size='large'
            />

            <div className='grid grid-cols-1 gap-x-4 mb-2'>
              {/* Select colors */}
              {/*<div>
                <label htmlFor='colors'>Select Colors (Optional)</label>

                <div className='flex items-center gap-x-4 mt-2'>
                  {colors.map((color) => (
                    <div role='button' key={color?.key}>
                      <div className='flex gap-2'>
                        <div>
                          <ColorPicker
                            defaultValue={color?.hex}
                            showText
                            allowClear
                            onChange={(value) =>
                              handleColor({
                                key: color?.key,
                                hex: `#${value.toHex()}`,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Tooltip title='Add Color'>
                    <button type='button' onClick={handleAddNewColor}>
                      <PlusSquareFilled
                        style={{
                          color: "gray",
                          fontSize: "22px",
                        }}
                      />
                    </button>
                  </Tooltip>
                </div>
              </div>*/}
              {/* input penton code */}
              <div>
                <label htmlFor='colors'>Select Pantone Code (Optional) </label>

                <>
                  <div style={{ marginBottom: 16 }}>
                    {/*<TweenOneGroup
                      appear={false}
                      enter={{ scale: 0.8, opacity: 0, type: "from", duration: 100 }}
                      leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                      onEnd={(e) => {
                        if (e.type === "appear" || e.type === "enter") {
                          (e.target as any).style = "display: inline-block";
                        }
                      }}
                    >
                      {tagChild}
                    </TweenOneGroup>*/}
                    {tagChild}
                  </div>
                  {inputVisible ? (
                    <Input
                      ref={inputRef}
                      type='text'
                      size='small'
                      style={{ width: 150 }} // Adjust width for better visibility
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputConfirm}
                      onPressEnter={handleInputConfirm}
                      placeholder='Enter Pantone Code' // Add placeholder for better UX
                    />
                  ) : (
                    <Tag onClick={showInput} style={tagPlusStyle}>
                      <PlusOutlined /> Add Pantone Code
                    </Tag>
                  )}
                </>
              </div>
            </div>

            {/* Size */}
            <ESelect
              label='Size'
              name='size'
              options={sizeOptions}
              placeholder='Select size'
              size='large'
              mode='multiple'
            />

            {/*<EInput
              type='number'
              label='Stock'
              name='stock'
              size='large'
              placeholder='Enter Stock'
            />*/}

            {/* Front Side Image Upload */}
            <div className='mt-4'>
              <p className='text-lg mb-2'>Upload Front Side Image</p>
              <Upload
                name='frontSide'
                listType='picture'
                fileList={frontSideImage}
                beforeUpload={() => false}
                onChange={handleFrontSideImageChange}
              >
                <div className='border text-18 font-500 text-primary border-primary rounded flex flex-col items-center px-[200px] py-[20px] cursor-pointer'>
                  <PiUploadLight size={40} />
                  <p>Upload Front Side Image</p>
                  <p className='text-sm'>
                    (Image must be black with a white background for better results)
                  </p>
                </div>
              </Upload>
            </div>

            {/* Back Side Image Upload */}
            <div className='mt-4'>
              <p className='text-lg mb-2'>Upload Back Side Image</p>
              <Upload
                name='backSide'
                listType='picture'
                fileList={backSideImage}
                beforeUpload={() => false}
                onChange={handleBackSideImageChange}
              >
                <div className='border text-18 font-500 text-primary border-primary rounded flex flex-col items-center px-[200px] py-[20px] cursor-pointer'>
                  <PiUploadLight size={40} />
                  <p>Upload Back Side Image </p>
                  <p className='text-sm'>
                    (Image must be black with a white background for better results)
                  </p>
                </div>
              </Upload>
            </div>

            {/* Additional Images Upload */}
            {/*<div className='mt-4'>
              <p className='text-lg mb-2'>Upload Additional Images</p>
              <Upload
                name='images'
                listType='picture'
                fileList={additionalImages}
                multiple
                beforeUpload={() => false}
                onChange={handleAdditionalImagesChange}
              >
                <div className='border text-18 font-500 text-primary border-primary rounded flex flex-col items-center px-[200px] py-[20px] cursor-pointer'>
                  <PiUploadLight size={40} />
                  <p>Upload Additional Images</p>
                </div>
              </Upload>
            </div>*/}

            {/* Submit Button */}
            <Button
              htmlType='submit'
              loading={isLoading}
              block
              size='large'
              className='mt-4 bg-primary text-white'
            >
              Submit
            </Button>
          </EForm>
        </div>
      </div>
    </Modal>
  );
};

export default AddQuoteProduct;
