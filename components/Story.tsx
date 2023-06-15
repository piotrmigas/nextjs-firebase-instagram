type Props = {
  avatar: string;
  username: string;
};

export default function Story({ avatar, username }: Props) {
  return (
    <div>
      <img
        src={avatar}
        alt=''
        className='h-14 w-14 rounded-full p-[2px] border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out'
      />
      <p className='text-xs w-14 truncate text-center'>{username}</p>
    </div>
  );
}
