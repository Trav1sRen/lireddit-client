import { Flex, Icon, Text } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';
import { PostComment, useLoginStateQuery } from '../generated/graphql';

interface CommentProps {
  postComment: PostComment;
}

const Comment = ({
  postComment: {
    user: { username },
    text,
    createdAt,
    upvotes,
    commentUpdoots
  }
}: CommentProps) => {
  const [{ data }] = useLoginStateQuery();

  const userUpdoot = commentUpdoots.filter(
    updoot => updoot.user.userUuid === data?.loginState?.userUuid
  );

  return (
    <Flex p={4} shadow="md" borderWidth="1px" alignContent="flex-start" flexDir="column">
      <Flex justify="space-between" align="center">
        <Flex alignContent="flex-start" flexDir="column">
          <Text fontFamily="Futura, sans-serif" fontSize="sm">
            {username}
          </Text>
          <Text fontFamily="Futura, sans-serif" fontSize="xs">
            {`created at: ${moment(parseInt(createdAt)).fromNow()}`}
          </Text>
        </Flex>
        <Flex align="center" mr={4}>
          <Icon
            cursor="pointer"
            as={userUpdoot.length ? HiThumbUp : HiOutlineThumbUp}
            w={5}
            h={5}
            ml={2}
          />
          <Text ml={2} fontFamily="Georgia, sans-serif">
            {upvotes}
          </Text>
        </Flex>
      </Flex>
      <Text mt={4} fontSize="xl">
        {text}
      </Text>
    </Flex>
  );
};

export default Comment;
