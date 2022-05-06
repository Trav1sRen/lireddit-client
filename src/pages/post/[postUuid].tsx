import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
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
import UpdatePostModal from '../../components/UpdatePostModal';
import UpdootField from '../../components/UpdootField';
import {
  Post,
  PostComment,
  useCommentPostMutation,
  useDeletePostMutation,
  useLoginStateQuery,
  usePostQuery
} from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface FormValues {
  comment: string;
}

const Post = () => {
  const [{ fetching: deleting }, deletePost] = useDeletePostMutation();

  const {
    isReady,
    query: { postUuid },
    replace
  } = useRouter();
  const {
    onOpen: onCommentPostOpen,
    isOpen: isCommentPostOpen,
    onClose: onCommentPostClose
  } = useDisclosure();
  const {
    onOpen: onUpdatePostOpen,
    isOpen: isUpdatePostOpen,
    onClose: onUpdatePostClose
  } = useDisclosure();

  const [{ data: loginUser }] = useLoginStateQuery();
  const { push, asPath } = useRouter();
  const [{ data, fetching }] = usePostQuery({
    pause: !isReady,
    variables: { postUuid: postUuid as string }
  });
  const [, commentPost] = useCommentPostMutation();

  const isViewSelfPost = () =>
    loginUser?.loginState?.userUuid === data!.post.user.userUuid;
  const isUserLogin = () => !fetching && loginUser?.loginState;

  return (
    <Layout variant="regular">
      {!isReady || fetching ? (
        <NoContentFiled>Loading the post details from server...</NoContentFiled>
      ) : data?.post ? (
        <Flex alignContent="flex-start" flexDir="column">
          <Heading fontSize="5xl" fontFamily="'PT Serif Caption', sans-serif">
            {data.post.title}
          </Heading>
          <Flex alignContent="flex-start" flexDir="column" mt={4}>
            <Text fontFamily="Futura, sans-serif" fontSize="sm">
              {data.post.user.username}
            </Text>
            <Text fontFamily="Futura, sans-serif" fontSize="xs">
              {`created at: ${moment(parseInt(data.post.createdAt)).fromNow()}`}
            </Text>
            <Text fontFamily="Futura, sans-serif" fontSize="xs">
              {`last update: ${moment(parseInt(data.post.updatedAt)).fromNow()}`}
            </Text>
          </Flex>
          <Text mt={8} fontSize="xl" whiteSpace="pre-line">
            {data.post.text}
          </Text>
          <Flex mt={12} align="center" justify="space-between">
            <UpdootField
              post={data.post as Post}
              iconWidth={7}
              iconHeight={7}
              numberSize="xl"
            />
            {isViewSelfPost() && (
              <Flex>
                <>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    mr={4}
                    onClick={onUpdatePostOpen}
                  >
                    Update
                  </Button>
                  <UpdatePostModal
                    post={data.post as Post}
                    isModalOpen={isUpdatePostOpen}
                    onModalClose={onUpdatePostClose}
                  />
                </>
                <Popover>
                  <PopoverTrigger>
                    <Button mr={4} fontSize="lg" variant="outline" colorScheme="red">
                      Delete
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>
                      <Text fontWeight="semibold" fontSize="lg">
                        Confirmation!
                      </Text>
                    </PopoverHeader>
                    <PopoverBody>
                      <Text fontSize="lg">Are you sure to delete this post?</Text>
                      <Button
                        mt={3}
                        colorScheme="red"
                        fontSize="md"
                        width="30%"
                        isLoading={deleting}
                        onClick={async () => {
                          const { error, data } = await deletePost({
                            postUuid: postUuid as string
                          });

                          if (!error && data?.deletePost) {
                            replace('/');
                          }
                        }}
                      >
                        Yes
                      </Button>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
            )}
          </Flex>
          <Divider mt={12} />
          {/* Why only using `align-content` is able to stretch each `Comment` to the width of `Wrapper`? */}
          <Flex mt={2} alignContent="flex-start" flexDir="column">
            <Flex justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold" id="comments">
                Comments:&nbsp;&nbsp;({data.post.comments})
              </Text>
              <Button
                colorScheme="blue"
                mr={1}
                onClick={() => {
                  isUserLogin() ? onCommentPostOpen() : push(`/login?next=${asPath}`);
                }}
              >
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
          <Drawer
            placement="bottom"
            isOpen={isCommentPostOpen}
            onClose={onCommentPostClose}
          >
            <DrawerOverlay />
            <DrawerContent w={900} h={350} m="auto" borderRadius={10} p={2}>
              <DrawerBody>
                <Formik
                  initialValues={{ comment: '' }}
                  onSubmit={async ({ comment }) => {
                    const { data: response, error } = await commentPost({
                      text: comment,
                      postUuid: data.post?.postUuid
                    });

                    if (!error && response?.commentPost) {
                      onCommentPostClose();
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
                          height={200}
                        />
                        <Button
                          type="submit"
                          mt={4}
                          colorScheme="blue"
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
