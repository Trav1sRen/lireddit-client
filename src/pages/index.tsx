import Navbar from '../components/navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <Navbar />
      {data ? data.posts.map(({ id, title }) => <div key={id}>{title}</div>) : 'null'}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index); // This urql client will be applied to the child components as well (such as Navbar)
