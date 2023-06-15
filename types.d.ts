declare module 'next-auth/react';

type Story = {
  id: string;
  username: string;
  avatar: string;
};

type Suggestion = {
  id: string;
  username: string;
  avatar: string;
  company: string;
};

type Post = {
  id: string;
  username: string;
  profileImg: string;
  image: string;
  caption: string;
};

type Emoji = {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
  aliases: string[];
};
