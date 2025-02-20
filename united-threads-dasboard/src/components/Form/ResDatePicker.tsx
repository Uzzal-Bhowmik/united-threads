/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, Form } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";

interface InputProps {
  name: string;
  label?: string;
  size?: SizeType;
  placeholder?: string;
  format?: string;
  labelColor?: string;
  showTime?: boolean;
}

const ResDatePicker = ({
  name,
  label,
  size,
  placeholder,
  labelColor = "black",
  format = "YYYY-MM-DD HH:mm",
  showTime = false,
}: InputProps) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={<label style={{ color: labelColor }}>{label}</label>}
          validateStatus={error ? "error" : ""}
          help={error ? error.message : ""}
        >
          <DatePicker
            showTime={showTime}
            {...field}
            id={name}
            size={size}
            placeholder={placeholder}
            format={format}
            onChange={(date) => {
              field.onChange(date ? dayjs(date).format(format) : null); // Set HH:mm format on change
            }}
            value={field.value ? dayjs(field.value) : null}
          />
        </Form.Item>
      )}
    />
  );
};

export default ResDatePicker;
