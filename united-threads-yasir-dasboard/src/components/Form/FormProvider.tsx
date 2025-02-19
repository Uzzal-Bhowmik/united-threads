/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "antd";
import { ReactNode, useEffect } from "react";
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form";

type TFormConfig = {
  defaultValues?: Record<string, any>;
  resolver?: any;
};

type TFormProps = {
  onSubmit: any;
  children: ReactNode;
} & TFormConfig;

const EForm = ({ onSubmit, children, defaultValues, resolver }: TFormProps) => {
  const formConfig: TFormConfig = {};

  if (resolver) {
    formConfig["resolver"] = resolver;
  }
  // set default value-------------------------
  const methods = useForm(formConfig);
  useEffect(() => {
    if (defaultValues) {
      // Set default values after form is mounted
      methods.reset(defaultValues, { keepDirtyValues: true });
    }
  }, [defaultValues, methods]);

  const submit: SubmitHandler<FieldValues> = (data) => {
    onSubmit(data);
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <Form layout='vertical' className='w-full' onFinish={methods.handleSubmit(submit)}>
        {children}
      </Form>
    </FormProvider>
  );
};
// Function to transform default values
// const transformDefaultValues = (
//   defaultValues: Record<string, any> | undefined
// ) => {
//   if (!defaultValues) return defaultValues;
//   const transformedValues: Record<string, any> = {};
//   for (const key in defaultValues) {
//     if (Object.hasOwnProperty.call(defaultValues, key)) {
//       const value = defaultValues[key];
//       transformedValues[key] =
//         value === "" || value === null ? undefined : value;
//     }
//   }

//   return transformedValues;
// };

export default EForm;
