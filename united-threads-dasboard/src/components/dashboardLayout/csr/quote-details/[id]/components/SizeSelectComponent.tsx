"use client";

import React, { useEffect, useState } from "react";
import { Checkbox, Input } from "antd";
import { FieldError } from "react-hook-form";
import { TSizeAndQuantity } from "@/types/quoteProductTypes";

interface SizeAndQuantity {
  size: string;
  quantity: number | undefined;
  selected: boolean;
  price?: number;
}

interface SizeSelectComponentProps {
  defaultValues?: TSizeAndQuantity[];
  setSizesAndQuantities: React.Dispatch<React.SetStateAction<TSizeAndQuantity[]>>;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  disabled: boolean;
  errors?: {
    sizeAndQuantities?: FieldError;
  };
}

const SizeSelectComponent: React.FC<SizeSelectComponentProps> = ({
  defaultValues = [],
  setSizesAndQuantities,
  setTotalPrice,
  disabled,
  errors,
}) => {
  const [sizeAndQuantities, setSizeAndQuantities] = useState<SizeAndQuantity[]>([]);

  useEffect(() => {
    // Initialize state with checkboxes selected by default and a price field
    const initialValues = defaultValues.map((item) => ({
      ...item,
      selected: true,
      price: 0, // Default price
    }));
    setSizeAndQuantities(initialValues);
    setSizesAndQuantities(
      initialValues.map((item) => ({ size: item.size, quantity: item.quantity || 0 })),
    );
  }, [defaultValues, setSizesAndQuantities]);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const updatedSizes = sizeAndQuantities.map((item, idx) =>
      idx === index ? { ...item, selected: checked } : item,
    );
    setSizeAndQuantities(updatedSizes);
    setSizesAndQuantities(
      updatedSizes
        .filter((item) => item.selected)
        .map((item) => ({ size: item.size, quantity: item.quantity || 0 })),
    );
  };

  const handleQuantityChange = (index: number, value: string) => {
    const updatedSizes = sizeAndQuantities.map((item, idx) =>
      idx === index ? { ...item, quantity: Number(value) } : item,
    );
    setSizeAndQuantities(updatedSizes);
    setSizesAndQuantities(
      updatedSizes
        .filter((item) => item.selected)
        .map((item) => ({ size: item.size, quantity: item.quantity || 0 })),
    );
  };

  const handlePriceChange = (index: number, value: string) => {
    const updatedSizes = sizeAndQuantities.map((item, idx) =>
      idx === index ? { ...item, price: Number(value) } : item,
    );
    setSizeAndQuantities(updatedSizes);

    // Calculate total price for all selected sizes
    const total = updatedSizes.reduce((sum, item) => {
      if (item.selected && item.quantity && item.price) {
        return sum + item.quantity * item.price;
      }
      return sum;
    }, 0);

    setTotalPrice(total);
  };

  return (
    <div>
      <label htmlFor='sizeAndQuantities' className='mb-2 block font-medium'>
        Select Size, Quantity, and Price
      </label>

      <div className='space-y-4'>
        {sizeAndQuantities.map((item, index) => (
          <div key={item.size} className='grid grid-cols-4 gap-4 items-center'>
            {/* Checkbox */}
            <Checkbox
              id={item.size}
              checked={item.selected}
              onChange={(e) => handleCheckboxChange(index, e.target.checked)}
              className='flex items-center'
              disabled={disabled}
            >
              {item.size}
            </Checkbox>

            {/* Quantity and Price input (visible only if checkbox is selected) */}
            {item.selected && (
              <>
                <Input
                  type='number'
                  min={1}
                  value={item.quantity || ""}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  placeholder={`Enter quantity for ${item.size}`}
                  className=''
                  disabled={disabled}
                />
                <Input
                  type='number'
                  min={0}
                  value={item.price || ""}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  placeholder={`Unit price (${item.size})`}
                  className='w-auto'
                  disabled={disabled}
                />
                <p className='font-semibold'>
                  {/* sum of quantity * price */}
                  {item.quantity && item.price
                    ? `Sub Total: $${(item.quantity * item.price).toFixed(2)}`
                    : ""}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {errors?.sizeAndQuantities && (
        <p className='mt-2 text-red-500'>
          {errors.sizeAndQuantities.message || "Size and quantity are required"}
        </p>
      )}
    </div>
  );
};

export default SizeSelectComponent;
