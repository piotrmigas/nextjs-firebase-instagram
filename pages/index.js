import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Feed from "../components/Feed";
import Modal from "../components/Modal";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Instagram photos and videos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Modal open={open} setOpen={setOpen} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Header setOpen={setOpen} />
        <Feed />
      </motion.div>
    </>
  );
}
