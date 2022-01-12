import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

export type WrapperVariant = 'small' | 'regular';

interface WrapperProps {
  children: ReactNode;
  variant?: WrapperVariant;
}

const Wrapper = ({ children, variant = 'regular' }: WrapperProps) => {
  return (
    <Box mt={8} mx="auto" maxW={variant === 'regular' ? 800 : 400} w="100%">
      {children}
    </Box>
  );
};

export default Wrapper;
