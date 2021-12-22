import React from 'react';
import { Form, Formik, FormikState } from 'formik';
import { Button } from '@chakra-ui/react';
import Wrapper from '../components/wrapper';
import InputField from '../components/inputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface FormValues {
  username: string;
  password: string;
}

const Login = () => {
  const route = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await login({ input: values });
          if (data?.login.errors) {
            setErrors(toErrorMap(data.login.errors));
          } else if (data?.login.user) {
            await route.push('/');
          }
        }}
      >
        {({ isSubmitting }: FormikState<FormValues>) => (
          <Form>
            <InputField name="username" placeholder="username" label="Username" />
            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            />
            <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
