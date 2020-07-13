import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useContext, useState } from 'react';
import styled from 'styled-components';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

import CardSection from 'components/CardSection';
import { UserContext } from '../../../providers/UserProvider';

export default function PaymentForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { userToken, comission } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.token);
  console.log('TOKEN', token);

  const checkClientSecretExist = async () => {
    const res = await fetch('/api/v1/payment/card', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });

    console.log('res', res);

    if (res.ok) {
      const data = await res.json();
      const { clientSecret = '' } = data;
      return clientSecret;
    } else {
      return '';
    }
  };

  const getStripeSecret = async () => {
    const res = await fetch('/api/v1/payment/card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        commission: comission,
      }),
    });

    const data = await res.json();
    const { clientSecret = '' } = data;
    console.log('NEW clientSecret CREATED', clientSecret);
    return clientSecret;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let clientSecret = await checkClientSecretExist();
    console.log('clientSecret ON CHECK', clientSecret);

    if (clientSecret === '') {
      console.log('clientSecret is ""', clientSecret);
      clientSecret = await getStripeSecret();
      console.log('clientSecret ON GET', clientSecret);
    }

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen',
        },
      },
    });

    if (result.error) {
      // Display result.error.message in your UI.
      console.log('ERROR!');
      console.log(result.error.message);
    } else {
      // The setup has succeeded. Display a success message and send
      // result.setupIntent.payment_method to your server to save the
      // card to a Customer
      console.log('SUCCESS!');
      console.log(result.setupIntent.payment_method);

      router.push('/brand/sign-up/dashboard');
    }
  };

  return (
    <Container>
      <LogoContainer>
        <img src='/images/matchjet-logo.png' alt='giftjet logo' />
      </LogoContainer>
      <Form onSubmit={handleSubmit}>
        <FormTitle>Add Payment</FormTitle>
        <CardSection loading={loading} />
        <button disabled={!stripe}>Confirm</button>
        <Footer>
          <Text> By signing up, I agree to Mocchi</Text>
          <PrivacyPollicy>Terms of Service and Privacy Policy.</PrivacyPollicy>
        </Footer>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 21px;
  align-items: center;
  color: #1e2e4f;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-left: 40px;
  margin-bottom: 95px;
`;


const CardDetails = styled.div`
  display: flex;
  justify-content: space-between;
  width: 415px;

  Input {
    width: 185px;
    font-size: 18px;
    line-height: 22px;
    font-weight: normal;
    font-family: 'Montserrat', sans-serif;
  }
`;

const Form = styled.form`
  margin: 0;
  width: 670px;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.09);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 50px;

  button {
    padding: 14px 63px;
    font-family: 'Noto Sans TC', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 26px;
    box-sizing: border-box;
    border-radius: 60px;
    background: #fc5185;
    color: #fff;
    width: 420px;
    text-align: center;
    margin-bottom: 40px;
    border: none;
    outline: none;
    cursor: pointer;

    &:hover {
      background: #3cbc79;
    }
  }
`;

const FormTitle = styled.h2`
  color: #1e2e4f;
  font-family: 'Noto Sans TC', sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 33px;
  margin: 0 0 50px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.p`
  font-family: 'Noto Sans TC', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  text-align: center;
  font-family: 'Noto Sans TC', sans-serif;
  margin: 0 0 3px;
`;

const PrivacyPollicy = styled.a`
  font-family: 'Noto Sans TC', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  text-align: center;
  font-family: 'Noto Sans TC', sans-serif;
  margin: 0;
  color: #fc5185;
`;
