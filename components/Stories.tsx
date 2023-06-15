import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { useSession } from 'next-auth/react';
import Story from './Story';

export default function Stories() {
  const { data: session } = useSession();
  const [suggestions, setSuggestions] = useState<Story[]>([]);

  useEffect(() => {
    const createSuggestions = () => ({
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      avatar: faker.image.avatarLegacy(),
    });

    setSuggestions(
      faker.helpers.multiple(createSuggestions, {
        count: 20,
      })
    );
  }, []);

  return (
    <div className='scrollbar-thin scrollbar-thumb-black flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll'>
      {session && <Story avatar={session?.user?.image!} username={session?.user?.username} />}
      {suggestions.map((profile) => (
        <Story key={profile.id} {...profile} />
      ))}
    </div>
  );
}
