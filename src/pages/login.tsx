import React from 'react';
import NextLink from 'next/link';
import { Form, Formik, FormikState } from 'formik';
import { Button, Flex, Link } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface FormValues {
  usernameOrEmail: string;
  password: string;
}

const Login = () => {
  const {
    push,
    query: { next }
  } = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await login(values);
          if (data?.login.errors) {
            setErrors(toErrorMap(data.login.errors));
          } else if (data?.login.user) {
            await push(next ? (next as string) : '/');
          }
        }}
      >
        {({ isSubmitting }: FormikState<FormValues>) => (
          <Form>
            <Flex flexDir="column">
              <InputField
                name="usernameOrEmail"
                placeholder="username or email"
                label="Username or Email"
              />
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              <NextLink href="/forgot-password">
                <Link mt={4} color="teal">
                  Forgot the password? Click here
                </Link>
              </NextLink>
              <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">
                Login
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
