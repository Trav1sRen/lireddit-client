import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { Form, Formik, FormikState } from 'formik';
import moment from 'moment';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import Comment from '../../components/Comment';
import InputField from '../../components/InputField';
import Layout from '../../components/Layout';
import NoContentFiled from '../../components/NoContentField';
import UpdootField from '../../components/UpdootField';
import {
  Post,
  PostComment,
  useCommentPostMutation,
  usePostQuery
} from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface FormValues {
  comment: string;
}

const Post = () => {
  const {
    isReady,
    query: { postUuid }
  } = useRouter();
  const { onOpen, isOpen, onClose } = useDisclosure();

  const [{ data, fetching }] = usePostQuery({
    variables: { postUuid: postUuid as string },
    pause: !isReady
  });
  const [, commentPost] = useCommentPostMutation();

  return (
    <Layout variant="regular">
      {fetching || !isReady ? (
        <NoContentFiled>Loading the post details from server...</NoContentFiled>
      ) : data?.post ? (
        <Flex alignContent="flex-start" flexDir="column">
          <Heading fontSize="5xl" fontFamily="'PT Serif Caption', sans-serif">
            {data.post.title}
          </Heading>
          <Flex alignContent="flex-start" flexDir="column" mt={4}>
            <Text fontFamily="Futura, sans-serif" fontSize="sm">
              {data.post.creator.username}
            </Text>
            <Text fontFamily="Futura, sans-serif" fontSize="xs">
              {`created at: ${moment(parseInt(data.post.createdAt)).fromNow()}`}
            </Text>
            <Text fontFamily="Futura, sans-serif" fontSize="xs">
              {`last update: ${moment(parseInt(data.post.updatedAt)).fromNow()}`}
            </Text>
          </Flex>
          <Text mt={8} fontSize="xl">
            {data.post.text}
          </Text>
          <Box mt={12}>
            <UpdootField
              post={data.post as Post}
              iconWidth={7}
              iconHeight={7}
              numberSize="xl"
            />
          </Box>
          <Divider mt={12} />
          {/* Why only using `align-content` is able to stretch each `Comment` to the width of `Wrapper`? */}
          <Flex mt={2} alignContent="flex-start" flexDir="column">
            <Flex justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold" id="comments">
                Comments:&nbsp;&nbsp;({data.post.comments})
              </Text>
              <Button colorScheme="teal" mr={1} onClick={onOpen}>
                Post new comment
              </Button>
            </Flex>
            {data.post.postComments.length ? (
              <Stack mt={4}>
                {data.post.postComments.map(postComment => (
                  <Comment
                    postComment={postComment as PostComment}
                    key={postComment.postCommentUuid}
                  />
                ))}
              </Stack>
            ) : (
              <NoContentFiled>
                No comments for this post, wanna leave the first comment?
              </NoContentFiled>
            )}
          </Flex>
          <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent w={900} h={250} m="auto" borderRadius={10} p={2}>
              <DrawerBody>
                <Formik
                  initialValues={{ comment: '' }}
                  onSubmit={async ({ comment }) => {
                    const { data: response, error } = await commentPost({
                      text: comment,
                      postUuid: data.post?.postUuid
                    });

                    if (!error && response?.commentPost) {
                      onClose();
                    }
                  }}
                >
                  {({ isSubmitting }: FormikState<FormValues>) => (
                    <Form>
                      <Flex flexDir="column">
                        <Heading
                          ml={2}
                          mb={2}
                          fontSize="2xl"
                          fontFamily="'PT Serif Caption', sans-serif"
                        >
                          Post your comment
                        </Heading>
                        <InputField
                          name="comment"
                          placeholder="write your comment here..."
                          textarea
                          height={120}
                        />
                        <Button
                          type="submit"
                          mt={4}
                          colorScheme="teal"
                          isLoading={isSubmitting}
                        >
                          Submit
                        </Button>
                      </Flex>
                    </Form>
                  )}
                </Formik>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      ) : (
        <NoContentFiled color="red">
          Failed to load the post from server. Please try again later...
        </NoContentFiled>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Post);
