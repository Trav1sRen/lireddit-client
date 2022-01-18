import React from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Form, Formik, FormikState } from 'formik';
import { Button, Flex } from '@chakra-ui/react';
import InputField from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import useIsAuth from '../utils/useIsAuth';

interface FormValues {
  title: string;
  text: string;
}

// Create post is not invalidating the posts cache, becos the posts is fetched on the server side
const createPost = () => {
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();

  useIsAuth();

  return (
    <Layout variant="regular">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async values => {
          const { error } = await createPost({ input: values });
          !error && (await router.push('/'));
        }}
      >
        {({ isSubmitting }: FormikState<FormValues>) => (
          <Form>
            <Flex flexDir="column">
              <InputField name="title" placeholder="title" label="Title" />
              <InputField
                name="text"
                placeholder="text..."
                label="Body"
                textarea
                height={250}
              />
              <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">
                Create the post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(createPost);
