import React, { MouseEventHandler, ReactElement } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex
} from '@chakra-ui/react';
import { AlertStatus } from '@chakra-ui/alert/src/alert';

interface AlertBoxPropType {
  type: AlertStatus;
  title: ReactElement | string;
  desc: ReactElement | string;
  closeBinding?: MouseEventHandler<HTMLButtonElement>;
}

const AlertBox = ({ type, title, desc, closeBinding }: AlertBoxPropType) => {
  return (
    <Alert status={type} mt={4}>
      <AlertIcon />
      <Flex ml={2} mr={2} flexDir="column">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription fontSize="sm">{desc}</AlertDescription>
      </Flex>
      {closeBinding && (
        <CloseButton onClick={closeBinding} position="absolute" right="8px" top="8px" />
      )}
    </Alert>
  );
};

export default AlertBox;
