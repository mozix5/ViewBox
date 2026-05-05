import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { POST } from "../../../utils/api";

const userToken = localStorage.getItem("userToken")
  ? JSON.parse(localStorage.getItem("userToken"))
  : null;

const InitialState = {
  user: {},
  userToken,
  loading: false,
  isAuthenticated: false,
  error: "",
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ body }, { rejectWithValue }) => {
    try {
      const response = await POST("users/login", { body });
      localStorage.setItem("userToken", JSON.stringify(response.token));
      localStorage.setItem("user", JSON.stringify(response.user));
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ body }, { rejectWithValue }) => {
    try {
      const response = await POST("users/signup", { body });
      localStorage.setItem("userToken", JSON.stringify(response.token));
      localStorage.setItem("user", JSON.stringify(response.user));
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", () => {
  localStorage.removeItem("userToken");
});

const authSlice = createSlice({
  name: "auth",
  initialState: InitialState,
  reducers: {
    validate: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.userToken = payload.token;
        state.isAuthenticated = true;
        state.error = "";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown Error";
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signup.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.userToken = payload.token;
        state.isAuthenticated = true;
        state.error = "";
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown Error";
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.userToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { validate } = authSlice.actions;
export default authSlice.reducer;
