import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../redux/postSlice";
import { db } from "../firebase";
import Post from "./Post";

const Posts = () => {
  const { posts, searchTerm, results } = useSelector((state) => state.post);

  const dispatch = useDispatch();

  useEffect(
    () =>
      onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (snap) => {
        dispatch(getPosts(snap.docs));
      }),
    [db]
  );

  if (!posts.length) return <p className="p-5 text-center">Loading...</p>;

  return (
    <div>
      {(searchTerm ? results : posts).map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Posts;
