import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, selectPosts, selectResults, selectSearchTerm } from '../redux/postSlice';
import { db } from '../firebase';
import Post from './Post';

export default function Posts() {
  const posts = useSelector(selectPosts);
  const searchTerm = useSelector(selectSearchTerm);
  const results = useSelector(selectResults);

  const dispatch = useDispatch();

  useEffect(
    () =>
      onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), (snap) => {
        dispatch(getPosts(snap.docs));
      }),
    [dispatch]
  );

  if (!posts.length) return <p className='p-5 text-center'>Loading...</p>;

  return (
    <div>
      {(searchTerm ? results : posts).map((post: Post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
}
