import { Button } from '@chakra-ui/react';
import { Form, Formik, FormikState } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import AlertBox from '../components/AlertBox';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgetPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface FormValues {
  email: string;
}

const forgotPassword = () => {
  const [, forgetPassword] = useForgetPasswordMutation();
  const [mailSent, setMailSent] = useState(false);
  const [unexpectedErr, setUnexpectedErr] = useState(false);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await forgetPassword(values);
          if (!data) {
            setUnexpectedErr(true);
          } else {
            data.forgetPassword
              ? setMailSent(true)
              : setErrors({ email: 'Email not exists' });
          }
        }}
      >
        {({ isSubmitting }: FormikState<FormValues>) => (
          <Form>
            <InputField
              name="email"
              placeholder="email"
              label="Input the email address of your account"
            />
            {unexpectedErr && (
              <AlertBox
                type="error"
                title="Unexpected Error"
                desc="Please check the network and try again later"
                closeBinding={() => setUnexpectedErr(false)}
              />
            )}
            <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="blue">
              Proceed
            </Button>
          </Form>
        )}
      </Formik>
      {mailSent && (
        <AlertBox
          type="success"
          title="Mail sent!"
          desc="Open the link in sent mail to proceed"
          closeBinding={() => setMailSent(false)}
        />
      )}
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(forgotPassword);
