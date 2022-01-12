import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import {
  Post,
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
  usePostsQuery
} from '../generated/graphql';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import { Box, Button, Divider, Heading, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useClient } from 'urql';

const Index = () => {
  const [cursor, setCursor] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  const [fetchErr, setFetchErr] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [loadAll, setLoadAll] = useState(false);

  const [{ data }] = usePostsQuery({ variables: { limit: 10 } }); // fetching would be always 'false' as page is using SSR
  const { query } = useClient();

  const handleShowMore = async () => {
    setFetchingMore(true);

    const { data: moreData } = await query<PostsQuery, PostsQueryVariables>(
      PostsDocument,
      {
        limit: 10,
        cursor
      }
    ).toPromise();
    setFetchingMore(false);

    if (moreData?.posts) {
      const morePosts = moreData.posts;

      morePosts.length < 10 && setLoadAll(true);
      setPosts(posts => [...posts, ...(morePosts as Post[])]);
      morePosts.length && setCursor(morePosts.slice(-1)[0].createdAt);
    } else {
      setFetchErr(true);
    }
  };

  useEffect(() => {
    if (data?.posts) {
      setPosts(data.posts as Post[]);
      setCursor(data.posts.slice(-1)[0].createdAt);
    } else {
      setFetchErr(true);
    }
  }, []);

  return (
    <Layout>
      <NextLink href="/create-post">
        <Button colorScheme="teal">Create new post</Button>
      </NextLink>
      {!fetchErr ? (
        <>
          <Stack spacing={8} mt={8}>
            {posts.map(({ id, title, text }) => (
              <Box p={5} shadow="md" borderWidth="1px" key={id}>
                <Heading fontSize="xl">{title}</Heading>
                <Text mt={4} isTruncated>
                  {text}
                </Text>
              </Box>
            ))}
          </Stack>
          {!loadAll ? (
            <Button
              variant="link"
              color="teal"
              m={4}
              fontSize="lg"
              onClick={handleShowMore}
              isLoading={fetchingMore}
            >
              Show more posts...
            </Button>
          ) : (
            <Divider orientation="horizontal" m={4} />
          )}
        </>
      ) : (
        <Box mt={5}>Error when fetching posts from server</Box>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index); // This urql client will be applied to the child components as well (such as Navbar)
