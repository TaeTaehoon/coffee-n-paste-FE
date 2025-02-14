import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URI = {
  BASE: process.env.REACT_APP_BASE_URI,
};

const initialState = {
  comments: [],
  newComment: {},
  isLoading: false,
  err: null,
};

export const __getCommentsByPostId = createAsyncThunk(
  "comment/__getCommentsByPostId",
  async (payload, thunkAPI) => {
    try {
      const requestRes = await axios.get(
        `${URI.BASE}api/comment?post-id=${payload}`
      );
      console.log(requestRes);
      return thunkAPI.fulfillWithValue(requestRes.data.comments);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const __postComment = createAsyncThunk(
  "comment/__postComment",
  async (payload, thunkAPI) => {
    try {
      const targetPostId = payload.postId;
      const userToken = localStorage.getItem("userToken");
      const commentBody = payload.commentBody;
      const requestRes = await axios.post(
        `${URI.BASE}api/comment?post-id=${targetPostId}`,
        {
          commentContent: commentBody,
        },
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      return thunkAPI.fulfillWithValue(requestRes.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const __updateMyComment = createAsyncThunk(
  "comment/__updateMyComment",
  async (payload, thunkAPI) => {
    try {
      const targetCommentId = payload.commentId;
      const updatedCommentBody = payload.newCommentBody;
      const userToken = localStorage.getItem("userToken");
      console.log(targetCommentId, updatedCommentBody, userToken);
      const requestRes = await axios.put(
        `${URI.BASE}api/comment/${targetCommentId}`,
        {
          commentContent: updatedCommentBody,
        },
        {
          headers: {
            Authorization: userToken,
          },
        }
      );

      return thunkAPI.fulfillWithValue(requestRes.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const __deleteMyComment = createAsyncThunk(
  "comment/__deleteMyComment",
  async (payload, thunkAPI) => {
    try {
      const userToken = localStorage.getItem("userToken");

      const requestRes = await axios.delete(
        `${URI.BASE}api/comment/${payload}`,
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      return thunkAPI.fulfillWithValue(requestRes.data.msg.split(" ").at(-1));
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const commentSlice = createSlice({
  name: "commentSlice",
  initialState,
  reducers: {},
  extraReducers: {
    //post별 달려있는 댓글 확인
    [__getCommentsByPostId.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__getCommentsByPostId.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.comments = action.payload;
    },
    [__getCommentsByPostId.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
    //post에 댓글 등록
    [__postComment.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__postComment.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.comments.push(action.payload);
    },
    [__postComment.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
    //본인이 작성한 댓글 수정
    [__updateMyComment.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__updateMyComment.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.comments = state.comments.map((comment) =>
        comment.commentId === action.payload.commentId
          ? action.payload
          : comment
      );
    },
    [__updateMyComment.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
    //본인이 작성한 댓글 삭제
    [__deleteMyComment.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__deleteMyComment.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.comments = state.comments.filter(
        (comment) => comment.commentId !== parseInt(action.payload)
      );
    },
    [__deleteMyComment.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
  },
});

export default commentSlice.reducer;
