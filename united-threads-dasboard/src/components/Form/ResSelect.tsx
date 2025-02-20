/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Select } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { Controller } from "react-hook-form";
interface OptionsProps {
  value: string | number;
  label: string;
  disabled?: boolean;
}
interface SelectProps {
  name: string;
  label?: string | any;
  placeholder?: string;
  size?: SizeType;
  options: OptionsProps[];
  defaultValue?: string | string[];
  mode?: "multiple" | "tags";
  showSearch?: boolean;
  filterOption?: (input: string, option?: { [key: string]: any }) => boolean;
}

const ESelect = ({
  name,
  label,
  placeholder,
  options,
  size,
  defaultValue,
  showSearch,
  mode,
  filterOption,
}: SelectProps) => {
  return (
    <Controller
      name={name}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error ? error.message : ""}
        >
          <Select
            mode={mode}
            filterOption={filterOption}
            showSearch={showSearch}
            defaultValue={defaultValue}
            size={size}
            options={options}
            onChange={onChange}
            placeholder={placeholder}
          />
        </Form.Item>
      )}
    />
  );
};

export default ESelect;
