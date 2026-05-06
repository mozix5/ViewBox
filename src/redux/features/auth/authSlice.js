import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../../services/userService";

const userToken = localStorage.getItem("userToken")
  ? JSON.parse(localStorage.getItem("userToken"))
  : null;

const InitialState = {
  user: JSON.parse(localStorage.getItem("user")) || {},
  userToken,
  loading: false,
  isAuthenticated: !!userToken,
  error: "",
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ body }, { rejectWithValue }) => {
    try {
      const { data } = await userService.login(body);
      localStorage.setItem("userToken", JSON.stringify(data.token));
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ body }, { rejectWithValue }) => {
    try {
      const { data } = await userService.signup(body);
      localStorage.setItem("userToken", JSON.stringify(data.token));
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
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
