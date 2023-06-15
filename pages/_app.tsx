import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}
