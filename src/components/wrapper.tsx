import React, { ReactElement } from 'react';
import { Box } from '@chakra-ui/react';

interface WrapperProps {
  children: ReactElement;
  variant?: 'small' | 'regular';
}

const Wrapper = ({ children, variant = 'regular' }: WrapperProps) => {
  return (
    <Box mt={8} mx="auto" maxW={variant === 'regular' ? 800 : 400} w="100%">
      {children}
    </Box>
  );
};

export default Wrapper;
