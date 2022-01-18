import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import {
  Post,
  PostsDocument,
  PostsQuery,
  PostsQueryVariables
} from '../generated/graphql';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import { Box, Button, Divider, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useClient } from 'urql';
import AlertBox from '../components/AlertBox';
import useAsyncEffect from '../utils/useAsyncEffect';
import { nanoid } from 'nanoid';

const Index = () => {
  const [cursor, setCursor] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  const [fetchErr, setFetchErr] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [loadAll, setLoadAll] = useState(false);

  const { query } = useClient();

  const getCursor = (posts: Post[]) => posts.slice(-1)[0].createdAt;

  const setStateWithPosts = (posts: Post[]) => {
    const { length } = posts;

    if (length < 10) {
      setLoadAll(true);
    } else {
      setCursor(getCursor(posts as Post[]));
    }

    length && setPosts(prevPosts => [...prevPosts, ...(posts as Post[])]);
  };

  const handleShowMore = async () => {
    setFetchingMore(true);

    const { data } = await query<PostsQuery, PostsQueryVariables>(PostsDocument, {
      limit: 10,
      cursor
    }).toPromise();

    setFetchingMore(false);

    if (data?.posts) {
      setStateWithPosts(data.posts as Post[]);
    } else {
      setFetchErr(true);
    }
  };

  useAsyncEffect(async () => {
    const { data } = await query<PostsQuery, PostsQueryVariables>(PostsDocument, {
      limit: 10
    }).toPromise();

    if (data?.posts) {
      setStateWithPosts(data.posts as Post[]);
    } else {
      setFetchErr(true);
    }
  }, []);

  return (
    <Layout>
      <Flex px={2} align="center" justify={posts.length > 0 ? 'space-between' : 'center'}>
        <Heading pt={2.5} size="2xl">
          LIREDDIT
        </Heading>
        {posts.length > 0 && (
          <NextLink href="/create-post">
            <Button colorScheme="teal" fontSize="lg">
              Create new post
            </Button>
          </NextLink>
        )}
      </Flex>
      {!fetchErr ? (
        posts.length > 0 ? (
          <>
            <Stack spacing={8} mt={6}>
              {/* Using self-increment id causes error, nanoid is a workaround */}
              {posts.map(({ title, textSnippet }) => (
                <Box p={5} shadow="md" borderWidth="1px" key={nanoid(6)}>
                  <Heading fontSize="xl">{title}</Heading>
                  <Text mt={4}>{textSnippet}</Text>
                </Box>
              ))}
            </Stack>
            {!loadAll ? (
              <Button
                variant="link"
                color="teal"
                my={4}
                ml={4}
                fontSize="lg"
                onClick={handleShowMore}
                isLoading={fetchingMore}
              >
                Show more posts...
              </Button>
            ) : (
              <Divider orientation="horizontal" my={4} />
            )}
          </>
        ) : (
          <Flex align="center" justify="center" height={300}>
            <Box my={4}>
              <Text fontSize="2xl" fontWeight="bold">
                You got no posts, try to{' '}
                <NextLink href="/create-post">
                  <Link color="teal">create a new one ^_^</Link>
                </NextLink>
              </Text>
            </Box>
          </Flex>
        )
      ) : (
        <AlertBox
          type="error"
          title="Server Error"
          desc="Failed to fetch the posts from server. Please try again later."
        />
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index); // This urql client will be applied to the child components as well (such as Navbar)
