import { PlusSquareIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { ReactNode, useState } from 'react';
import Layout from '../components/Layout';
import { PostsQueryVariables, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [variables, setVariables] = useState<PostsQueryVariables>({ limit: 10 });

  /***
   * Does urql put the variables into the useEffect dependency list?
   * --- https://github.com/FormidableLabs/urql/discussions/2209
   */
  const [{ data, fetching }] = usePostsQuery({
    variables
  });

  const userHasPosts = (): boolean =>
    !fetching && !!data?.posts && data.posts.paginatedPosts.length > 0;

  const noPostsArea = (text: ReactNode, color: string = 'black') => (
    <Flex align="center" justify="center" height={300}>
      <Box my={4}>
        <Text fontSize="2xl" fontWeight="bold" color={color}>
          {text}
        </Text>
      </Box>
    </Flex>
  );

  return (
    <Layout>
      <Flex px={2} align="center" justify={userHasPosts() ? 'space-between' : 'center'}>
        <Heading pt={2.5} size="2xl" fontFamily="Papyrus, sans-serif">
          LIREDDIT
        </Heading>
        {userHasPosts() && (
          <NextLink href="/create-post">
            <Button colorScheme="teal" fontSize="lg">
              Create new post
            </Button>
          </NextLink>
        )}
      </Flex>
      {fetching ? (
        noPostsArea('Loading the posts from server...')
      ) : data?.posts ? (
        data.posts.paginatedPosts.length > 0 ? (
          <>
            <Stack spacing={8} mt={6}>
              {data.posts.paginatedPosts.map(
                ({ id, title, textSnippet, creator: { username } }) => (
                  <Box p={5} shadow="md" borderWidth="1px" key={id}>
                    <Heading fontSize="xl" fontFamily="'PT Serif Caption', sans-serif">
                      {title}
                    </Heading>
                    <Text mt={4}>{textSnippet}</Text>
                    <Flex align="flex-end" direction="column">
                      <Text fontSize="sm" fontFamily="Futura, sans-serif">
                        {username}
                      </Text>
                    </Flex>
                  </Box>
                )
              )}
            </Stack>
            {data.posts.hasMore ? (
              <Button
                variant="link"
                color="teal"
                my={4}
                ml={4}
                fontSize="lg"
                onClick={() =>
                  setVariables(variables => ({
                    ...variables,
                    cursor: data.posts.paginatedPosts.slice(-1)[0].createdAt
                  }))
                }
                isLoading={fetching}
              >
                Show more posts...
              </Button>
            ) : (
              <Divider orientation="horizontal" my={4} />
            )}
          </>
        ) : (
          noPostsArea(
            <>
              You got no posts, try to{' '}
              <NextLink href="/create-post">
                <Link color="teal">create a new one</Link>
              </NextLink>
              <PlusSquareIcon ml={1} color="teal" />
            </>
          )
        )
      ) : (
        noPostsArea(
          'Failed to fetch the posts from server. Please try again later...',
          'red'
        )
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index); // This urql client will be applied to the child components as well (such as Navbar)
