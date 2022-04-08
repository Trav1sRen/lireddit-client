import { Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp
} from 'react-icons/hi';
import { Post, useLoginStateQuery, useVoteMutation } from '../generated/graphql';

interface UpdootFieldProps {
  post: Post;
  iconWidth?: number;
  iconHeight?: number;
  numberSize?: string;
}

const UpdootField = ({
  post,
  iconWidth = 5,
  iconHeight = 5,
  numberSize = 'md'
}: UpdootFieldProps) => {
  const [{ data }] = useLoginStateQuery();
  const [, vote] = useVoteMutation();
  const { postUuid, upvotes, downvotes, updoots } = post;

  const userUpdoot = updoots.filter(
    updoot => updoot.user.userUuid === data?.loginState?.userUuid
  );

  return (
    <Flex align="center">
      <Text ml={2} fontSize={numberSize} fontFamily="Georgia, sans-serif">
        {upvotes}
      </Text>
      <Icon
        cursor="pointer"
        as={userUpdoot.length && userUpdoot[0].vote === 1 ? HiThumbUp : HiOutlineThumbUp}
        w={iconWidth}
        h={iconHeight}
        ml={2}
        onClick={async () => await vote({ postUuid, value: 1 })}
      />
      <Text ml={6} fontSize={numberSize} fontFamily="Georgia, sans-serif">
        {downvotes}
      </Text>
      <Icon
        cursor="pointer"
        as={
          userUpdoot.length && userUpdoot[0].vote === -1
            ? HiThumbDown
            : HiOutlineThumbDown
        }
        w={iconWidth}
        h={iconHeight}
        ml={2}
        onClick={async () => await vote({ postUuid, value: -1 })}
      />
    </Flex>
  );
};

export default UpdootField;
