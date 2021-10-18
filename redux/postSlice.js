import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "posts",
  initialState: { posts: [], searchTerm: "", results: [] },
  reducers: {
    getPosts: (state, action) => {
      state.posts = action.payload.map((post) => ({
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
      state.results = state.posts.filter(({ caption }) => caption.toLowerCase().includes(action.payload.toLowerCase()));
    },
  },
});

export const { getPosts, filterPosts, setSearchTerm } = slice.actions;

export default slice.reducer;
