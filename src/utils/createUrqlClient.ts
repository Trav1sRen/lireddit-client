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
      tap(async ({ error }) => {
        if (error?.message.includes('not authenticated')) {
          await Router.replace('/login');
        }
      })
    );

const readLoginUserFromCache = (cache: Cache) =>
  cache.readQuery<LoginStateQuery>({
    query: LoginStateDocument
  })?.loginState;

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
        PaginatedPosts: () => null, // Becos PaginatedPosts is embedded on parent key directly
        PostComment: () => null,
        Updoot: () => null,
        User: () => null // The `User` object which is embedded on `PostComment`
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
            user &&
              cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, () => ({
                loginState: user
              }));
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
            if (createPost) {
              const allFields = cache.inspectFields('Query');
              const fieldInfos = allFields.filter(info => info.fieldName === 'posts');

              fieldInfos.forEach(fi =>
                cache.invalidate('Query', 'posts', fi.arguments || {})
              );
            }
          },

          vote(
            { vote }: VoteMutation,
            { postUuid, value }: VoteMutationVariables,
            cache
          ) {
            const loginUser = readLoginUserFromCache(cache);
            const postFragment = cache.readFragment(PostFragmentDoc, {
              postUuid
            } as Post);

            if (loginUser && postFragment && vote) {
              const userUuid = loginUser.userUuid;

              const userUpdootIdx = postFragment.updoots.findIndex(
                ({ user }) => user.userUuid === userUuid
              );

              const realVal = value > 0 ? 1 : -1;
              if (userUpdootIdx > 0) {
                const isCancel = postFragment.updoots[userUpdootIdx].vote === realVal;

                if (isCancel) {
                  postFragment.updoots.splice(userUpdootIdx, 1);
                  value > 0 ? (postFragment.upvotes -= 1) : (postFragment.downvotes -= 1);
                } else {
                  postFragment.updoots[userUpdootIdx].vote = realVal;

                  if (value > 0) {
                    postFragment.upvotes += 1;
                    postFragment.downvotes -= 1;
                  } else {
                    postFragment.upvotes -= 1;
                    postFragment.downvotes += 1;
                  }
                }
              } else {
                postFragment.updoots.push({
                  __typename: 'Updoot',
                  vote: realVal,
                  user: loginUser as User
                });

                value > 0 ? (postFragment.upvotes += 1) : (postFragment.downvotes += 1);
              }

              cache.writeFragment(PostFragmentDoc, {
                postUuid,
                updoots: postFragment.updoots,
                upvotes: postFragment.upvotes,
                downvotes: postFragment.downvotes
              } as Post);
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
            const loginUser = readLoginUserFromCache(cache);
            const commentFragment = cache.readFragment(PostCommentFragmentDoc, {
              postCommentUuid
            } as PostComment);

            if (loginUser && commentFragment && voteComment) {
              const userUpdootIdx = commentFragment.commentUpdoots.findIndex(
                ({ user }) => user.userUuid === loginUser.userUuid
              );

              if (userUpdootIdx > 0) {
                commentFragment.commentUpdoots.splice(userUpdootIdx, 1);
                commentFragment.upvotes -= 1;
              } else {
                commentFragment.commentUpdoots.push({
                  __typename: 'CommentUpdoot',
                  user: loginUser as User
                });
                commentFragment.upvotes += 1;
              }

              cache.writeFragment(PostCommentFragmentDoc, {
                postCommentUuid,
                commentUpdoots: commentFragment.commentUpdoots,
                upvotes: commentFragment.upvotes
              } as PostComment);
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
