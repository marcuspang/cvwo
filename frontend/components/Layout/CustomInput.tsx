import { Input, InputProps } from "@chakra-ui/react";
import { useField } from "formik";
import { BaseProps, FormControl } from "formik-chakra-ui";
import { ForwardedRef, forwardRef } from "react";

export type InputControlProps = BaseProps & {
  inputProps?: InputProps;
  type: string;
};

export const CustomInputControl = forwardRef(
  (props: InputControlProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { name, label, type, inputProps, ...rest } = props;
    const [field] = useField(name);

    return (
      <FormControl name={name} label={label} {...rest}>
        <Input {...field} id={name} {...inputProps} ref={ref} type={type} />
      </FormControl>
    );
  }
);

CustomInputControl.displayName = "CustomInputControl";

export default CustomInputControl;
