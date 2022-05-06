import {
  Cache,
  cacheExchange,
  ResolveInfo,
  Resolver,
  Variables
} from '@urql/exchange-graphcache';
import { NextUrqlClientConfig } from 'next-urql';
import Router from 'next/router';
import { dedupExchange, Exchange, fetchExchange, stringifyVariables } from 'urql';
import { pipe, tap } from 'wonka';
import {
  ChangePasswordMutation,
  CommentPostMutation,
  CommentPostMutationVariables,
  CreatePostMutation,
  DeletePostMutation,
  DeletePostMutationVariables,
  LoginMutation,
  LoginStateDocument,
  LoginStateQuery,
  LogoutMutation,
  Post,
  PostComment,
  PostCommentFragmentDoc,
  PostFragmentDoc,
  PostQueryVariables,
  RegisterMutation,
  UpdatePostMutation,
  UpdatePostMutationVariables,
  User,
  VoteCommentMutation,
  VoteCommentMutationVariables,
  VoteMutation,
  VoteMutationVariables
} from '../generated/graphql';
import { isServer } from './isServer';

const cursorPagination = (): Resolver => {
  return (_parent, args: Variables, cache: Cache, info: ResolveInfo) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);

    // Get the cached query using query name
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;

    if (size === 0) {
      // No cached query found
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(args)})`;
    const inCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      'paginatedPosts'
    );
    // Set `partial = true` in order not to cover the old cache
    info.partial = !inCache;

    const results: string[] = [];
    let hasMore = true;

    fieldInfos.forEach(({ fieldKey }) => {
      results.push(
        ...(cache.resolve(
          cache.resolve(entityKey, fieldKey) as string,
          'paginatedPosts'
        ) as string[])
      );

      const resolvedHasMore = cache.resolve(
        cache.resolve(entityKey, fieldKey) as string,
        'hasMore'
      ) as boolean;

      if (!resolvedHasMore) {
        hasMore = false;
      }
    });

    return {
      __typename: 'PaginatedPosts',
      paginatedPosts: results,
      hasMore
    };
  };
};

const errorExchange: Exchange =
  ({ forward }) =>
  ops$ =>
    pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes('not authenticated')) {
          Router.push('/login');
        }
      })
    );

const invalidatePostsCache = (cache: Cache) => {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter(info => info.fieldName === 'posts');

  fieldInfos.forEach(fi => cache.invalidate('Query', 'posts', fi.arguments || {}));
};

export const createUrqlClient: NextUrqlClientConfig = (ssrExchange, ctx) => ({
  url: 'http://localhost:7070/graphql',
  fetchOptions: {
    credentials: 'include' as RequestCredentials,
    headers: isServer()
      ? // Manually add SSR cookie into request header
        ({ cookie: ctx?.req?.headers.cookie } as HeadersInit)
      : undefined
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      /***
       * 1. This is to enable normalized cache instead of default document cache
       * 2. If response contains `id` and `__typename__`, urql will filter the cache with such creteria and auto-update it
       **/

      keys: {
        PaginatedPosts: () => null,
        Post: data => (data as Post).postUuid,
        User: data => (data as User).userUuid,
        PostComment: data => (data as PostComment).postCommentUuid,
        Updoot: () => null,
        CommentUpdoot: () => null
      },
      resolvers: {
        // Client resolvers, run when query is executed
        Query: {
          posts: cursorPagination()
        }
      },
      updates: {
        Mutation: {
          // User mutations
          login({ login: { user } }: LoginMutation, _, cache) {
            if (user) {
              cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, () => ({
                loginState: user
              }));
              invalidatePostsCache(cache);
            }
          },

          register({ register: { user } }: RegisterMutation, _, cache) {
            user &&
              cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, () => ({
                loginState: user
              }));
          },

          changePassword({ changePassword: { user } }: ChangePasswordMutation, _, cache) {
            user &&
              cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, () => ({
                loginState: user
              }));
          },

          logout({ logout }: LogoutMutation, _, cache) {
            logout &&
              cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, () => ({
                loginState: null
              }));
          },

          // Post mutations
          createPost({ createPost }: CreatePostMutation, _, cache) {
            createPost && invalidatePostsCache(cache);
          },

          updatePost(
            { updatePost }: UpdatePostMutation,
            { postUuid }: UpdatePostMutationVariables,
            cache
          ) {
            updatePost && cache.invalidate({ __typename: 'Post', postUuid });
          },

          deletePost(
            { deletePost }: DeletePostMutation,
            { postUuid }: DeletePostMutationVariables,
            cache
          ) {
            if (deletePost) {
              cache.invalidate({ __typename: 'Post', postUuid });
              invalidatePostsCache(cache);
            }
          },

          vote(
            { vote }: VoteMutation,
            { postUuid, value }: VoteMutationVariables,
            cache
          ) {
            const postFragment = cache.readFragment(PostFragmentDoc, {
              postUuid
            } as Post);

            if (postFragment && vote) {
              const status = postFragment.updootStatus;
              const realVal = value > 0 ? 1 : -1;

              if (status !== 0) {
                const isCancel = status === realVal;

                if (isCancel) {
                  postFragment.updootStatus = 0;
                  value > 0 ? (postFragment.upvotes -= 1) : (postFragment.downvotes -= 1);
                } else {
                  postFragment.updootStatus = realVal;

                  if (value > 0) {
                    postFragment.upvotes += 1;
                    postFragment.downvotes -= 1;
                  } else {
                    postFragment.upvotes -= 1;
                    postFragment.downvotes += 1;
                  }
                }
              } else {
                postFragment.updootStatus = realVal;
                value > 0 ? (postFragment.upvotes += 1) : (postFragment.downvotes += 1);
              }

              cache.writeFragment(PostFragmentDoc, postFragment);
            }
          },

          // Comment mutations
          commentPost(
            { commentPost }: CommentPostMutation,
            { postUuid }: CommentPostMutationVariables,
            cache
          ) {
            commentPost &&
              cache.invalidate('Query', 'post', { postUuid } as PostQueryVariables);
          },

          voteComment(
            { voteComment }: VoteCommentMutation,
            { postCommentUuid }: VoteCommentMutationVariables,
            cache
          ) {
            const commentFragment = cache.readFragment(PostCommentFragmentDoc, {
              postCommentUuid
            } as PostComment);

            if (commentFragment && voteComment) {
              const status = commentFragment.commentUpdootStatus;

              if (status !== 0) {
                commentFragment.commentUpdootStatus = 0;
                commentFragment.upvotes -= 1;
              } else {
                commentFragment.commentUpdootStatus = 1;
                commentFragment.upvotes += 1;
              }

              cache.writeFragment(PostCommentFragmentDoc, commentFragment);
            }
          }
        }
      }
    }),
    errorExchange,
    ssrExchange,
    fetchExchange
  ]
});
