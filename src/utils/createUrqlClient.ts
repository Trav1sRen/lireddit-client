import { SSRExchange } from 'next-urql';
import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import {
  LoginStateDocument,
  LoginStateQuery,
  LogoutMutation
} from '../generated/graphql';

export const createUrqlClient = (ssrExchange: SSRExchange) => ({
  url: 'http://localhost:7000/graphql',
  fetchOptions: { credentials: 'include' as RequestCredentials },
  /***
   * Conclusion:
   * If GraphQL response data is `null`,
   * the request won't be cached at all,
   * and the cache cannot be manually updated as no cache stored.
   */
  exchanges: [
    dedupExchange,
    cacheExchange({
      // This is to enable normalized cache instead of default document cache
      updates: {
        Mutation: {
          logout({ logout }: LogoutMutation, _args, cache) {
            cache.updateQuery<LoginStateQuery>(
              { query: LoginStateDocument },
              prevData => {
                if (logout) {
                  return { loginState: null };
                } else {
                  return prevData;
                }
              }
            );
          }
        }
      }
    }),
    ssrExchange,
    fetchExchange
  ]
});
