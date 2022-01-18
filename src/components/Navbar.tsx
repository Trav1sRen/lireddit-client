import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLoginStateQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

const Navbar = () => {
  const [{ data, fetching }] = useLoginStateQuery({
    // Trigger SSR becos the data is used to render HTML
    // Use dynamic isServer() check becos unsure about if Navbar is rendered on CSR or SSR page
    pause: isServer() // To run this query on browser instead of on server
  });
  const [{ fetching: fetchingLogout }, logout] = useLogoutMutation(); // Won't trigger SSR as it is binded to event

  let navbarContent;

  if (isServer() || fetching) {
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
      <Flex align="baseline" fontFamily="Futura">
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
