import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea
} from '@chakra-ui/react';

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  name: string;
  label?: string;
  size?: string;
  textarea?: boolean;
}

const InputField = ({ label, size, textarea = false, ...props }: InputFieldProps) => {
  // field will auto-accept the `name`, `value`, `onChange`, `onBlur` in props
  const [field, { error }] = useField(props);
  const InputComponent = textarea ? Textarea : Input;

  return (
    <Box mt={4}>
      <FormControl isInvalid={!!error}>
        {label && (
          <FormLabel htmlFor={field.name} fontWeight="semibold">
            {label}
          </FormLabel>
        )}
        <InputComponent {...field} {...props} id={field.name} size={size} />
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    </Box>
  );
};

export default InputField;
