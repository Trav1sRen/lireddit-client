import { Flex, Icon, Text } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';
import { PostComment, useVoteCommentMutation } from '../generated/graphql';

interface CommentProps {
  postComment: PostComment;
}

const Comment = ({
  postComment: {
    postCommentUuid,
    user: { username },
    text,
    createdAt,
    upvotes,
    commentUpdootStatus
  }
}: CommentProps) => {
  const [, voteComment] = useVoteCommentMutation();

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
            as={commentUpdootStatus === 1 ? HiThumbUp : HiOutlineThumbUp}
            w={5}
            h={5}
            ml={2}
            onClick={() => voteComment({ postCommentUuid })}
          />
          <Text ml={2} fontFamily="Georgia, sans-serif">
            {upvotes}
          </Text>
        </Flex>
      </Flex>
      <Text mt={4} fontSize="xl" whiteSpace="pre-line">
        {text}
      </Text>
    </Flex>
  );
};

export default Comment;
