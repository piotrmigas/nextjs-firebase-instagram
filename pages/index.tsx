import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Feed from '../components/Feed';
import AddPostModal from '../components/AddPostModal';

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='bg-gray-50 h-screen overflow-y-scroll scrollbar-hide'
    >
      <Head>
        <title>Instagram photos and videos</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header setOpen={setOpen} />
      <Feed />
      <AddPostModal open={open} setOpen={setOpen} />
    </motion.div>
  );
}
