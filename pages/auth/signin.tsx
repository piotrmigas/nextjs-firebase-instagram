import { getProviders, signIn as signIntoProvider } from 'next-auth/react';
import Header from '../../components/Header';
import { GoogleProfile } from 'next-auth/providers/google';

type Props = {
  providers: GoogleProfile;
};

export default function SignIn({ providers }: Props) {
  return (
    <>
      <Header />
      <div className='flex flex-col items-center justify-center min-h-screen py-2 -mt-28 px-14 text-center'>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2880px-Instagram_logo.svg.png'
          alt=''
          className='w-80'
        />
        <div className='mt-5'>
          {Object.values(providers).map(({ name, id }) => (
            <div key={name}>
              <button
                className='bg-blue-500 rounded-lg text-white p-3'
                onClick={() => signIntoProvider(id, { callbackUrl: '/' })}
              >
                Sign in with {name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
