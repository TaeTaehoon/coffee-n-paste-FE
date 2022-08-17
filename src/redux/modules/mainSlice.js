import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import thunk from "redux-thunk";

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
};

export const __getDatabySelectBrand = createAsyncThunk(
  "main/__getDatabySelectBrand",
  async (payload, thunkAPI) => {
    try {
      const requestRes = await axios.get(`${URI.BASE}api/brands`);
      console.log(requestRes);
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
      const userToken = payload.userToken;
      const requestRes = await axios.get(`${URI.BASE}api/my-post`, {
        headers: {
          Authorization: userToken,
        },
      });
      console.log(requestRes);
      return thunkAPI.fulfillWithValue(requestRes.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const __getPostFiltered = createAsyncThunk(
  "main/__getPostFiltered",
  async (payload, thunkAPI) => {
    try {
      const selectBrandId = payload.brandId;
      const selectBrandName = payload.brandName;
      const selectMenuId = payload.menuId;
      const selectMenuName = payload.menuName;
      console.log(selectBrandId, selectBrandName, selectMenuId, selectMenuName);
      // if (selectBrandId === 0) {
      //   const requestRes = await axios.get(`${URI.BASE}api/posts`);
      // } else {
      //   const requestRes = await axios.get(
      //     `${URI.BASE}api/posts?brand=${selectBrand}`
      //   );
      // }
      if (selectMenuId === undefined) {
        const requestRes = await axios.get(
          `${URI.BASE}api/posts?brand=${selectBrandName}`
        );
      } else {
        const requestRes = await axios.get(`${URI.BASE}api/posts`);
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
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
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
      // state.posts = action.payload;
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
      // state.posts = action.payload;
    },
    [__getUserPostList.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});
export const { selectBrand, selectMenu } = mainSlice.actions;
export default mainSlice.reducer;
