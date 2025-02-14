import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URI = {
  BASE: process.env.REACT_APP_BASE_URI,
};

const initialState = {
  brands: [
    {
      brandId: 0,
      brandImg:
        "https://images.unsplash.com/photo-1660663374499-9cbf2415ffb9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
      brandName: "전체",
      menus: [],
    },
  ],
  currBrand: {
    brandName: "전체",
    brandId: 0,
  },
  currMenu: {
    menuName: "",
    menuId: 0,
  },
  isLoading: false,
  err: null,
  posts: [],
  myPosts: [],
  post: {},
};

export const __getDatabySelectBrand = createAsyncThunk(
  "main/__getDatabySelectBrand",
  async (payload, thunkAPI) => {
    try {
      const requestRes = await axios.get(`${URI.BASE}api/brands`);
      return thunkAPI.fulfillWithValue(requestRes.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const __getUserPostList = createAsyncThunk(
  "main/__getUserPostList",
  async (payload, thunkAPI) => {
    try {
      const userToken = payload;
      console.log(userToken);
      const requestRes = await axios.get(`${URI.BASE}api/my-post`, {
        headers: {
          Authorization: userToken,
        },
      });
      return thunkAPI.fulfillWithValue(requestRes.data.content);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const __getPostFiltered = createAsyncThunk(
  "main/__getPostFiltered",
  async (payload, thunkAPI) => {
    try {
      const selectBrandName = payload.brandName;
      const selectMenuName = payload.menuName;

      if (selectMenuName === undefined) {
        const requestRes = await axios.get(
          `${URI.BASE}api/post?brand=${selectBrandName}`
        );
        return thunkAPI.fulfillWithValue(requestRes.data.content);
      } else {
        const requestRes = await axios.get(
          `${URI.BASE}api/post?brand=${selectBrandName}&menu=${selectMenuName}`
        );
        return thunkAPI.fulfillWithValue(requestRes.data.content);
        //selectMenu에 따라 필터링해서 post들을 갖고올 예정 쿼리 나오면 작업 마무리하기
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ::: 메인 게시글 리스트 출력
export const __getPostAll = createAsyncThunk(
  "main/__getPostAll",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.get(`${URI.BASE}api/posts`);
      return thunkAPI.fulfillWithValue(response.data.content);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ::: 게시글 상세페이지 출력
export const __getPostDetail = createAsyncThunk(
  "main/__getPostDetail",
  async (postId, thunkAPI) => {
    try {
      const getDetailResponse = await axios.get(
        `${URI.BASE}api/post/${postId}`
      );
      return thunkAPI.fulfillWithValue(getDetailResponse.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ::: 게시글 수정하기
export const __updateMyPost = createAsyncThunk(
  "main/__updateMyPost",
  async (payload, thunkAPI) => {
    try {
      const userToken = localStorage.getItem("userToken");
      const postUpdateResponse = await axios.put(
        `${URI.BASE}api/post/${payload.postId}`,
        {
          content: payload.content,
          postImg: payload.postImg,
        },
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      console.log("postUpdateResponse :::", postUpdateResponse.data);
      return thunkAPI.fulfillWithValue(postUpdateResponse.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const __deleteMyPost = createAsyncThunk(
  "main/__deleteMyPost",
  async (payload, thunkAPI) => {
    try {
      console.log("~~~~~~deleteID~!!!!!", payload);
      const userToken = localStorage.getItem("userToken");
      const requestRes = await axios.delete(`${URI.BASE}api/post/${payload}`, {
        headers: {
          Authorization: userToken,
        },
      });
      console.log(requestRes);
      return thunkAPI.fulfillWithValue(payload);
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const mainSlice = createSlice({
  name: "mainSlice",
  initialState,
  reducers: {
    selectBrand: (state, action) => {
      state.currBrand = state.brands[action.payload];
    },
    selectMenu: (state, action) => {
      state.currMenu.menuId = action.payload.id;
      state.currMenu.menuName = action.payload.innerText;
    },
  },
  extraReducers: {
    [__getDatabySelectBrand.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__getDatabySelectBrand.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.brands.push(...action.payload);
    },
    [__getDatabySelectBrand.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },

    // 전체 게시글 불러오기
    [__getPostAll.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__getPostAll.fulfilled]: (state, action) => {
      state.isLoading = false;

      state.posts = action.payload;
    },
    [__getPostAll.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // brand, menu에 따른 게시글 불러오기
    [__getPostFiltered.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__getPostFiltered.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
    },
    [__getPostFiltered.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    //로그인한 유저의 특정정보만 불러오기
    [__getUserPostList.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__getUserPostList.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.myPosts = action.payload;
    },
    [__getUserPostList.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // 특정 게시글 상세 불러오기
    [__getPostDetail.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__getPostDetail.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.post = action.payload;
    },
    [__getPostDetail.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // // ::: 본인이 작성한 게시글 수정
    [__updateMyPost.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__updateMyPost.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.post = action.payload;
    },
    [__updateMyPost.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // ::: 본인이 작성한 게시글 삭제
    [__deleteMyPost.pending]: (state, action) => {
      state.isLoading = true;
    },
    [__deleteMyPost.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.posts = state.posts.filter(
        (post) => post.postId !== action.payload
      );
    },
    [__deleteMyPost.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});
export const { selectBrand, selectMenu } = mainSlice.actions;
export default mainSlice.reducer;
