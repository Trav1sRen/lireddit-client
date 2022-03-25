import { Box, Flex, Text } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface NoContentFieldProps {
  children: ReactNode;
  color?: string;
}

const NoContentField = ({ children, color = 'black' }: NoContentFieldProps) => (
  <Flex align="center" justify="center" height={300}>
    <Box my={4}>
      <Text fontSize="2xl" fontWeight="bold" color={color}>
        {children}
      </Text>
    </Box>
  </Flex>
);

export default NoContentField;
