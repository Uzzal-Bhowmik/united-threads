/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { Controller } from "react-hook-form";

interface InputProps {
  type: string;
  name: string;
  label?: string;
  size?: SizeType;
  placeholder?: string;
  defaultValue?: any;
  labelColor?: string;
  disabled?: boolean;
  required?: boolean;
}

const EInput = ({
  type,
  name,
  label,
  size,
  placeholder,
  defaultValue,
  disabled = false,
  required = false,
}: InputProps) => {
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error ? error.message : ""}
          required={required}
          className='w-full'
        >
          {type === "password" ? (
            <Input.Password
              {...field}
              type={type}
              id={name}
              size={size}
              placeholder={placeholder}
            />
          ) : (
            <Input
              {...field}
              type={type}
              id={name}
              size={size}
              placeholder={placeholder}
              disabled={disabled}
            />
          )}
        </Form.Item>
      )}
    />
  );
};

export default EInput;
