import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { request } from "../../server";
import { LIMIT } from "../../constants";

const initialState = {
  education: [],
  loading: false,
  total: 0,
  isModalLoading: false,
};

export const getEducation = createAsyncThunk(
  "education/fetching",
  async ({ search, page }) => {
    try {
      const params = {
        search,
        page,
        limit: LIMIT,
      };
      const { data } = await request.get("/education", { params });
      return data;
    } catch (error) {
      message.error(error.response.data.message);
    }
  }
);

export const addEducation = createAsyncThunk(
  "education/add",
  async (values) => {
    await request.post("/education", values);
  }
);

export const deleteEducation = createAsyncThunk(
  "education/delete",
  async (id) => {
    await request.delete(`/education/${id}`);
  }
);

export const getOneEducation = createAsyncThunk("education/get", async (id) => {
  const {data, 
    data: { startDate, endDate },
  } = await request.get(`/education/${id}`);
  return {
    ...data,
    startDate: startDate.split("T")[0],
    endDate: endDate.split("T")[0],
  };
});

export const updateEducation = createAsyncThunk(
  "education/update",
  async ({ id, values }) => {
    await request.put(`/education/${id}`, values);
  }
);

const educationSlice = createSlice({
  initialState,
  name: "education",
  reducers: () => {},
  extraReducers: (builder) => {
    builder
      .addCase(getEducation.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getEducation.fulfilled,
        (state, { payload: { pagination, data } }) => {
          state.education = data;
          state.total = pagination.total;
          state.loading = false;
        }
      )
      .addCase(getEducation.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addEducation.pending, (state) => {
        state.isModalLoading = true;
      })
      .addCase(addEducation.fulfilled, (state) => {
        state.isModalLoading = false;
      });
  },
});

const { name, reducer: educationReducer } = educationSlice;

export { name as educationName, educationReducer as default };
