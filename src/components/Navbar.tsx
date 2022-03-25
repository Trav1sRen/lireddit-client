import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useLoginStateQuery, useLogoutMutation } from '../generated/graphql';

const Navbar = () => {
  const [{ data, fetching }] = useLoginStateQuery();
  const [{ fetching: fetchingLogout }, logout] = useLogoutMutation();

  let navbarContent;

  if (fetching) {
    navbarContent = null;
  } else if (!data?.loginState) {
    navbarContent = (
      <>
        <NextLink href="/login">
          <Link mr={2} color="white" fontWeight="semibold">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white" fontWeight="semibold">
            Register
          </Link>
        </NextLink>
      </>
    );
  } else {
    navbarContent = (
      <Flex align="baseline" fontFamily="Futura, sans-serif">
        <Box mr={2}>{data.loginState.username}</Box>
        <Button
          variant="link"
          colorScheme="blue"
          onClick={() => logout()}
          isLoading={fetchingLogout}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex pos="sticky" top={0} zIndex={1} bg="tan" p={4}>
      <Box ml="auto">{navbarContent}</Box>
    </Flex>
  );
};

export default Navbar;
