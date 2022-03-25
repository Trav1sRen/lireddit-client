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
  PostDocument,
  PostQuery,
  PostQueryVariables,
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
  RegisterMutation,
  Updoot,
  VoteCommentMutation,
  VoteCommentMutationVariables,
  VoteMutation,
  VoteMutationVariables,
  VoteResponse
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
          login({ login: { user } }: LoginMutation, _args, cache) {
            cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, data =>
              user ? { loginState: user } : data
            );
          },

          register({ register: { user } }: RegisterMutation, _args, cache) {
            cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, data =>
              user ? { loginState: user } : data
            );
          },

          changePassword(
            { changePassword: { user } }: ChangePasswordMutation,
            _args,
            cache
          ) {
            cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, data =>
              user ? { loginState: user } : data
            );
          },

          logout({ logout }: LogoutMutation, _args, cache) {
            cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, data =>
              logout ? { loginState: null } : data
            );
          },

          // Post mutations
          createPost({ createPost }: CreatePostMutation, _args, cache) {
            cache.updateQuery<PostsQuery, PostsQueryVariables>(
              { query: PostsDocument, variables: { limit: 10 } },
              data => {
                if (data) {
                  if (createPost) {
                    return {
                      posts: {
                        paginatedPosts: [createPost, ...data.posts.paginatedPosts],
                        hasMore: data.posts.hasMore,
                        __typename: 'PaginatedPosts'
                      }
                    };
                  } else {
                    return data;
                  }
                } else {
                  return null;
                }
              }
            );
          },

          vote({ vote }: VoteMutation, { postId }: VoteMutationVariables, cache) {
            const updatePostUpdoot = (post: Post, vote: VoteResponse) => {
              const userUpdootIdx = post.updoots.findIndex(
                updoot =>
                  updoot.user.id ===
                  cache.readQuery<LoginStateQuery>({ query: LoginStateDocument })
                    ?.loginState?.id
              );

              const {
                vote: voteVal,
                post: { creator, upvotes, downvotes }
              } = vote;

              post.upvotes = upvotes;
              post.downvotes = downvotes;

              if (voteVal === 0) {
                userUpdootIdx > -1 && post.updoots.splice(userUpdootIdx, 1);
              } else {
                userUpdootIdx > -1
                  ? (post.updoots[userUpdootIdx].vote = voteVal)
                  : post.updoots.push({
                      vote: voteVal,
                      user: creator,
                      __typename: 'Updoot'
                    } as Updoot);
              }
            };

            cache.updateQuery<PostsQuery, PostsQueryVariables>(
              { query: PostsDocument, variables: { limit: 10 } },
              data => {
                if (data) {
                  const posts = data.posts.paginatedPosts;

                  if (vote) {
                    const idx = posts.findIndex(post => post.id === postId);
                    updatePostUpdoot(posts[idx] as Post, vote as VoteResponse);
                  }

                  return data;
                } else {
                  return null;
                }
              }
            );

            cache.updateQuery<PostQuery, PostQueryVariables>(
              {
                query: PostDocument,
                variables: { id: postId }
              },
              data => {
                if (data?.post) {
                  const post = data.post;

                  if (vote) {
                    updatePostUpdoot(post as Post, vote as VoteResponse);
                  }

                  return data;
                } else {
                  return null;
                }
              }
            );
          },

          // Comment mutations
          commentPost(
            { commentPost }: CommentPostMutation,
            { postId }: CommentPostMutationVariables,
            cache
          ) {
            commentPost &&
              cache.updateQuery<PostQuery, PostQueryVariables>(
                {
                  query: PostDocument,
                  variables: { id: postId }
                },
                data => {
                  if (data?.post) {
                    data.post.postComments.push(commentPost);
                    data.post.comments += 1;

                    return data;
                  } else {
                    return null;
                  }
                }
              );
          },

          voteComment(
            { voteComment }: VoteCommentMutation,
            { postCommentUuid }: VoteCommentMutationVariables,
            cache
          ) {
            voteComment &&
              cache.updateQuery<PostQuery, PostQueryVariables>(
                { query: PostDocument, variables: { id: voteComment.postId } },
                data => {
                  if (data?.post) {
                    const commentIdx = data.post.postComments.findIndex(
                      comment => comment.postCommentUuid === postCommentUuid
                    );

                    return data;
                  } else {
                    return null;
                  }
                }
              );
          }
        }
      }
    }),
    errorExchange,
    ssrExchange,
    fetchExchange
  ]
});
