import { useRouter } from 'next/router';
import { useLoginStateQuery } from '../generated/graphql';
import useAsyncEffect from './useAsyncEffect';

const useIsAuth = () => {
  const router = useRouter();
  const [{ data, fetching }] = useLoginStateQuery();

  useAsyncEffect(async () => {
    if (!fetching && !data?.loginState) {
      await router.replace(`/login?next=${router.pathname}`);
    }
  }, [router, data, fetching]);
};

export default useIsAuth;
