import { SSRExchange } from 'next-urql';
import { dedupExchange, Exchange, fetchExchange, stringifyVariables } from 'urql';
import {
  Cache,
  cacheExchange,
  ResolveInfo,
  Resolver,
  Variables
} from '@urql/exchange-graphcache';
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

export const createUrqlClient = (ssrExchange: SSRExchange) => ({
  url: 'http://localhost:7070/graphql',
  fetchOptions: { credentials: 'include' as RequestCredentials },
  exchanges: [
    dedupExchange,
    cacheExchange({
      // This is to enable normalized cache instead of default document cache
      keys: {
        PaginatedPosts: () => null // Becos PaginatedPosts is embedded on parent key directly
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
                createPost
                  ? {
                      posts: {
                        paginatedPosts: [createPost, ...prevData!.posts.paginatedPosts],
                        hasMore: prevData!.posts.hasMore,
                        __typename: 'PaginatedPosts'
                      }
                    }
                  : prevData
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
