import { Button, Flex } from '@chakra-ui/react';
import { Form, Formik, FormikState } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import useIsAuth from '../utils/useIsAuth';

interface FormValues {
  title: string;
  text: string;
}

// Create post is not invalidating the posts cache, becos the posts is fetched on the server side
const createPost = () => {
  const { replace } = useRouter();
  const [, createPost] = useCreatePostMutation();

  useIsAuth();

  return (
    <Layout variant="regular">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async values => {
          const { error } = await createPost({ input: values });
          !error && replace('/');
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
              <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="blue">
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
