import { SSRExchange } from 'next-urql';
import { dedupExchange, Exchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import {
  ChangePasswordMutation,
  CreatePostMutation,
  LoginMutation,
  LoginStateDocument,
  LoginStateQuery,
  LogoutMutation,
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
  RegisterMutation
} from '../generated/graphql';
import { pipe, tap } from 'wonka';
import Router from 'next/router';

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

export const createUrqlClient = (ssrExchange: SSRExchange) => ({
  url: 'http://localhost:7000/graphql',
  fetchOptions: { credentials: 'include' as RequestCredentials },
  exchanges: [
    dedupExchange,
    cacheExchange({
      // This is to enable normalized cache instead of default document cache
      updates: {
        Mutation: {
          // User mutations
          login({ login: { user } }: LoginMutation, _args, cache) {
            cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, prevData =>
              user ? { loginState: user } : prevData
            );
          },

          register({ register: { user } }: RegisterMutation, _args, cache) {
            cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, prevData =>
              user ? { loginState: user } : prevData
            );
          },

          changePassword(
            { changePassword: { user } }: ChangePasswordMutation,
            _args,
            cache
          ) {
            cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, prevData =>
              user ? { loginState: user } : prevData
            );
          },

          logout({ logout }: LogoutMutation, _args, cache) {
            cache.updateQuery<LoginStateQuery>({ query: LoginStateDocument }, prevData =>
              logout ? { loginState: null } : prevData
            );
          },

          // Post mutations
          createPost({ createPost }: CreatePostMutation, _args, cache) {
            cache.updateQuery<PostsQuery, PostsQueryVariables>(
              { query: PostsDocument, variables: { limit: 10 } },
              prevData =>
                createPost ? { posts: [createPost, ...prevData!.posts] } : prevData
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
