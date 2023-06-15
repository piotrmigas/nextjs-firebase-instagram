import { useState, useEffect, useRef, MouseEvent } from 'react';
import { useSession } from 'next-auth/react';
import {
  ChatIcon,
  HeartIcon,
  PaperAirplaneIcon,
  EmojiHappyIcon,
  DotsHorizontalIcon,
  BookmarkIcon,
} from '@heroicons/react/outline';
import { HeartIcon as HearIconSolid, CheckIcon, XIcon } from '@heroicons/react/solid';
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from '@firebase/firestore';
import Moment from 'react-moment';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { db } from '../firebase';
import PostModal from './PostModal';

type Props = {
  id: string;
  username: string;
  profileImg: string;
  image: string;
  caption: string;
};

export default function Post({ id, username, profileImg, image, caption }: Props) {
  const { data: session } = useSession();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(caption);

  useEffect(() => setHasLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1), [likes]);

  useEffect(
    () =>
      onSnapshot(query(collection(db, 'posts', id, 'comments'), orderBy('timestamp', 'desc')), (snap) =>
        setComments(snap.docs)
      ),
    [db, id]
  );

  useEffect(() => onSnapshot(query(collection(db, 'posts', id, 'likes')), (snap) => setLikes(snap.docs)), [db, id]);

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid));
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.username,
      });
    }
  };

  const sendComment = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const commentToSend = comment;
    setComment('');
    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  const handleEmoji = (emoji: Emoji) => {
    if (editing) {
      setEditedCaption(editedCaption + emoji.native);
    } else {
      setComment(comment + emoji.native);
    }
    setEmojiPicker(false);
  };

  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editRef && editRef.current && editing === true) {
      editRef.current.focus();
    }
  }, [editing, editRef]);

  const editCaption = async () => {
    await updateDoc(doc(db, 'posts', id), {
      caption: editedCaption,
    });
    setEditing(false);
  };

  return (
    <div className='bg-white my-7 border rounded-sm'>
      <div className='flex items-center p-5'>
        <img src={profileImg} alt='' className='h-12 w-12 object-contain border p-1 mr-3 rounded-full' />
        <p className='flex-1 font-bold'>{username}</p>
        <DotsHorizontalIcon className='h-5 cursor-pointer' onClick={() => setOpen(true)} />
      </div>
      <img src={image} alt='' className='object-cover w-full' />
      {session && (
        <div className='flex justify-between px-4 pt-4'>
          <div className='flex space-x-4'>
            {hasLiked ? (
              <HearIconSolid className='btn text-red-500' onClick={likePost} />
            ) : (
              <HeartIcon className='btn' onClick={likePost} />
            )}
            <ChatIcon className='btn' />
            <PaperAirplaneIcon className='btn' />
          </div>
          <BookmarkIcon className='btn' />
        </div>
      )}
      <div className='p-5'>
        {likes.length > 0 && <p className='font-bold mb-1'>{likes.length} likes</p>}
        <div className='flex items-center'>
          <div className='font-bold mr-2'>{username}</div>
          {editing ? (
            <div className='flex items-center w-full'>
              <input
                type='text'
                ref={editRef}
                value={editedCaption}
                className='border-none focus:ring-0 p-0 mr-1 w-full'
                onChange={(e) => setEditedCaption(e.target.value)}
              />
              <CheckIcon className='btn text-green-500 h-5 mr-1' onClick={editCaption} />
              <XIcon className='btn text-red-500 h-5' onClick={() => setEditing(false)} />
            </div>
          ) : (
            <p className='truncate'>{caption}</p>
          )}
        </div>
      </div>
      {comments.length > 0 && (
        <div className='ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
          {comments.map((comment) => (
            <div key={comment.id} className='flex items-center space-x-2 mb-3'>
              <img src={comment.data().userImage} alt='' className='h-7 rounded-full' />
              <p className='text-sm flex-1'>
                <span className='font-bold'>{comment.data().username} </span>
                {comment.data().comment}
              </p>
              <Moment fromNow className='pr-5 text-xs'>
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}
      {session && (
        <form className='flex items-center p-4'>
          <EmojiHappyIcon className='h-7 cursor-pointer' onClick={() => setEmojiPicker(!emojiPicker)} />
          <input
            placeholder='Add a comment...'
            type='text'
            className='border-none flex-1 focus:ring-0 outline-none'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type='submit'
            disabled={!comment.trim()}
            onClick={sendComment}
            className='font-semibold text-blue-400'
          >
            Post
          </button>
        </form>
      )}
      <div className='relative'>
        {emojiPicker && (
          <Picker
            data={data}
            onEmojiSelect={(emoji: Emoji) => handleEmoji(emoji)}
            showPreview={false}
            style={{ position: 'absolute' }}
            showSkinTones={false}
          />
        )}
      </div>
      <PostModal setEditing={setEditing} open={open} setOpen={setOpen} id={id} username={username} />
    </div>
  );
}
