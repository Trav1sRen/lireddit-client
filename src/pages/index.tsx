import { PlusSquareIcon, Search2Icon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
  Text
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useState } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';
import Layout from '../components/Layout';
import NoContentField from '../components/NoContentField';
import UpdootField from '../components/UpdootField';
import { Post, PostsQueryVariables, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [variables, setVariables] = useState<PostsQueryVariables>({ limit: 10 });

  /***
   * Does urql put the variables into the useEffect dependency list?
   * --- https://github.com/FormidableLabs/urql/discussions/2209
   */
  const [
    {
      data,
      fetching,
      error // This error object is constructed by `networkError` and `graphQLErrors`
    }
  ] = usePostsQuery({
    variables
  });

  const userHasPosts = () =>
    !fetching && !!data?.posts && data.posts.paginatedPosts.length > 0;

  return (
    <Layout>
      {userHasPosts && (
        <Flex align="center" justify={userHasPosts() ? 'space-between' : 'center'}>
          <InputGroup size="lg" width="70%">
            <InputLeftElement
              pointerEvents="none"
              children={<Search2Icon color="gray.300" />}
            />
            <Input placeholder="Find the posts..." />
          </InputGroup>
          <NextLink href="/create-post">
            <Button colorScheme="blue" fontSize="lg">
              Create new post
            </Button>
          </NextLink>
        </Flex>
      )}
      {fetching ? (
        <NoContentField>Loading the posts from server...</NoContentField>
      ) : !error && data?.posts ? (
        data.posts.paginatedPosts.length > 0 ? (
          <>
            <Stack spacing={8} mt={10}>
              {data.posts.paginatedPosts.map(post => {
                const {
                  postUuid,
                  title,
                  textSnippet,
                  user: { username },
                  comments
                } = post;

                return (
                  <Box p={5} shadow="md" borderWidth="1px" key={postUuid}>
                    <NextLink href={`/post/${postUuid}`}>
                      <Link _hover={{ textDecoration: 'none' }}>
                        <Heading
                          fontSize="xl"
                          fontFamily="'PT Serif Caption', sans-serif"
                        >
                          {title}
                        </Heading>
                        <Text mt={4}>{textSnippet}</Text>
                      </Link>
                    </NextLink>
                    <Flex mt={5} justify="space-between">
                      <Flex align="center" justify="space-between" maxW={250} w="100%">
                        <UpdootField post={post as Post} />
                        <NextLink href={`/post/${postUuid}#comments`}>
                          <Flex align="center" cursor="pointer">
                            <Icon as={FaRegCommentDots} w={5} h={5} />
                            <Text ml={2} fontFamily="Georgia, sans-serif">
                              {comments}
                            </Text>
                          </Flex>
                        </NextLink>
                      </Flex>
                      <Text fontSize="sm" fontFamily="Futura, sans-serif">
                        {username}
                      </Text>
                    </Flex>
                  </Box>
                );
              })}
            </Stack>
            {data.posts.hasMore ? (
              <Button
                variant="link"
                color="blue"
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
          <NoContentField>
            You got no posts, try to{' '}
            <NextLink href="/create-post">
              <Link color="blue">create a new one</Link>
            </NextLink>
            <PlusSquareIcon ml={1} color="blue" />
          </NoContentField>
        )
      ) : (
        <NoContentField color="red">
          Failed to fetch the posts from server. Please try again later...
        </NoContentField>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, {
  ssr: true
})(Index); // This urql client will be applied to the child components as well (such as Navbar)
