import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useLoginStateQuery } from '../generated/graphql';

const useIsAuth = () => {
  const router = useRouter();
  const [{ data, fetching }] = useLoginStateQuery();

  useEffect(() => {
    if (!fetching && !data?.loginState) {
      router.replace(`/login?next=${router.asPath}`);
    }
  }, [router, data, fetching]);
};

export default useIsAuth;
