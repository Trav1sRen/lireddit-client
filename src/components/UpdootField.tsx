import { Flex, Icon, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
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
  post: { postUuid, upvotes, downvotes, updootStatus },
  iconWidth = 5,
  iconHeight = 5,
  numberSize = 'md'
}: UpdootFieldProps) => {
  const [, vote] = useVoteMutation();
  const { push, asPath } = useRouter();
  const [{ data, fetching: fetchingLoginState }] = useLoginStateQuery();

  const isUserLogin = () => !fetchingLoginState && data?.loginState;

  return (
    <Flex align="center">
      <Text ml={2} fontSize={numberSize} fontFamily="Georgia, sans-serif">
        {upvotes}
      </Text>
      <Icon
        cursor="pointer"
        as={updootStatus === 1 ? HiThumbUp : HiOutlineThumbUp}
        w={iconWidth}
        h={iconHeight}
        ml={2}
        onClick={() =>
          isUserLogin() ? vote({ postUuid, value: 1 }) : push(`/login?next=${asPath}`)
        }
      />
      <Text ml={6} fontSize={numberSize} fontFamily="Georgia, sans-serif">
        {downvotes}
      </Text>
      <Icon
        cursor="pointer"
        as={updootStatus === -1 ? HiThumbDown : HiOutlineThumbDown}
        w={iconWidth}
        h={iconHeight}
        ml={2}
        onClick={() =>
          isUserLogin() ? vote({ postUuid, value: -1 }) : push(`/login?next=${asPath}`)
        }
      />
    </Flex>
  );
};

export default UpdootField;
