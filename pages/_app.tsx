import React from 'react';
import { AppProps } from 'next/app';
import Provider from '../config/Provider';
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Head>
        <link rel="icon" href="https://i.pinimg.com/564x/4f/35/74/4f3574ffb2f5af4c5e2fec5b278f5930.jpg" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
