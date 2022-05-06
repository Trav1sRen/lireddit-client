import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

export type WrapperVariant = 'small' | 'regular';

interface WrapperProps {
  children: ReactNode;
  variant?: WrapperVariant;
}

const Wrapper = ({ children, variant = 'regular' }: WrapperProps) => {
  return (
    <Box mt={8} mx="auto" maxW={variant === 'regular' ? 900 : 450} w="100%">
      {children}
    </Box>
  );
};

export default Wrapper;
