import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useLoginStateQuery, useLogoutMutation } from '../generated/graphql';

const Navbar = () => {
  const { reload } = useRouter();
  const [{ data, fetching }] = useLoginStateQuery();
  const [{ fetching: fetchingLogout }, logout] = useLogoutMutation();

  useEffect(() => {
    document.title = 'Lireddit';
  }, []);

  let navbarContent;

  if (fetching) {
    navbarContent = null;
  } else if (!data?.loginState) {
    navbarContent = (
      <>
        <NextLink href="/login">
          <Link mr={3} color="blue" fontWeight="semibold">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="blue" fontWeight="semibold">
            Register
          </Link>
        </NextLink>
      </>
    );
  } else {
    navbarContent = (
      <Flex align="baseline" fontFamily="Futura, sans-serif">
        <Box mr={3}>{data.loginState.username}</Box>
        <Button
          color="blue"
          fontWeight="semibold"
          onClick={async () => {
            await logout();
            reload();
          }}
          isLoading={fetchingLogout}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      position="sticky"
      top={0}
      zIndex={1}
      bg="gainsboro"
      px={10}
      py={4}
      align="center"
      justify="space-between"
    >
      <NextLink href="/">
        <Heading pt={3} size="2xl" fontFamily="Papyrus, sans-serif" cursor="pointer">
          LIREDDIT
        </Heading>
      </NextLink>
      <Box>{navbarContent}</Box>
    </Flex>
  );
};

export default Navbar;
