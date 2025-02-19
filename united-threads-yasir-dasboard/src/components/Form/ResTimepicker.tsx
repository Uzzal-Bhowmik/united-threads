/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, TimePicker } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";

interface TTimeProps {
  name: string;
  label?: string;
  size?: SizeType;
  placeholder?: string;
}

const ResTimePicker = ({ name, label, size }: TTimeProps) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error ? error.message : ""}
        >
          <TimePicker
            {...field}
            size={size}
            style={{ width: "100%" }}
            format="HH:mm" // Display HH:mm format
            onChange={(time) => {
              field.onChange(time ? time.format("HH:mm") : ""); // Set HH:mm format on change
            }}
            value={field.value ? dayjs(field.value, "HH:mm") : null} // Ensure value is in HH:mm format
          />
        </Form.Item>
      )}
    />
  );
};

export default ResTimePicker;
