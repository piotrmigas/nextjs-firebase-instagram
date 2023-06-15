import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';

type InitialState = {
  posts: Post[];
  searchTerm: string;
  results: Post[];
};

const initialState: InitialState = {
  posts: [],
  searchTerm: '',
  results: [],
};

export const slice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    getPosts: (state, action) => {
      state.posts = action.payload.map((post: any) => ({
        id: post.id,
        username: post?.data().username,
        profileImg: post.data().profileImg,
        image: post.data().image,
        caption: post.data().caption,
      }));
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    filterPosts: (state, action) => {
      state.results = state.posts.filter(({ caption }: Post) =>
        caption.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
  },
});

export const { getPosts, filterPosts, setSearchTerm } = slice.actions;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectSearchTerm = (state: RootState) => state.post.searchTerm;
export const selectResults = (state: RootState) => state.post.results;

export default slice.reducer;
