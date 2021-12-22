import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import { Box, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name: string;
  label: string;
  size?: string;
}

const InputField = ({ label, size, ...props }: InputFieldProps) => {
  // field will auto-accept the `name`, `value`, `onChange`, `onBlur` in props
  const [field, { error }] = useField(props);

  return (
    <Box mt={4}>
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
        <Input {...field} {...props} id={field.name} size={size} />
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    </Box>
  );
};

export default InputField;
