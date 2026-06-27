import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Form = ({
  children,
  schema,
  onSubmit,
  defaultValues = {},
  className = "",
}) => {
  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode: "onTouched", // Validates on first blur
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={`w-full ${className}`}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
};
