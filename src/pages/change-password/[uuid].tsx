import React, { useState } from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Form, Formik, FormikState } from 'formik';
import InputField from '../../components/InputField';
import { Button, Link } from '@chakra-ui/react';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import AlertBox from '../../components/AlertBox';

interface FormValues {
  newPassword: string;
}

const ChangePassword = () => {
  const [unexpectedErr, setUnexpectedErr] = useState(false);
  const [tokenErr, setTokenErr] = useState('');
  const [, changePassword] = useChangePasswordMutation();
  const {
    replace,
    query: { uuid }
  } = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const { data, error } = await changePassword({
            uuid: uuid as string,
            ...values
          });
          if (!error) {
            if (data?.changePassword.errors) {
              const errorMap = toErrorMap(data.changePassword.errors);
              'token' in errorMap ? setTokenErr(errorMap.token) : setErrors(errorMap);
            } else if (data?.changePassword.user) {
              await replace('/'); // User won't be able to navigate back
            }
          } else {
            setUnexpectedErr(true);
          }
        }}
      >
        {({ isSubmitting }: FormikState<FormValues>) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="password"
              type="password"
              label="Input the new password"
            />
            {tokenErr && (
              <AlertBox
                type="error"
                title={tokenErr}
                desc={
                  <NextLink href="/forgot-password">
                    <Link color="teal">Regain the change password link</Link>
                  </NextLink>
                }
                closeBinding={() => setTokenErr('')}
              />
            )}
            {unexpectedErr && (
              <AlertBox
                type="error"
                title="Unexpected Error"
                desc="Please check the network and try again later"
                closeBinding={() => setUnexpectedErr(false)}
              />
            )}
            <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal">
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
