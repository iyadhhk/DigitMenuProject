import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrder = createAsyncThunk(
  'order/create-order',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/order/create-order', formData.data);
      formData.history.push('/');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateOrder = createAsyncThunk(
  'order/update-order',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/order/update-order', formData.data);
      formData.history.push('/');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getOrderById = createAsyncThunk(
  'order/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/order/get-client-order/${id}`);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getAllOrders = createAsyncThunk(
  'order/getAll',
  async (restId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/order/get-order/${restId}`);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const checkoutOrder = createAsyncThunk(
  'order/checkout-order',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.put('/order/checkout-order', orderId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const cancelOrder = createAsyncThunk(
  'order/cancel-order',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put('/order/cancel-order', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const confirmCancelOrder = createAsyncThunk(
  'order/confirm-cancel',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put('/order/confirm-cancel', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const refuseCancelOrder = createAsyncThunk(
  'order/refuse-cancel',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put('/order/refuse-cancel', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const editPreOrder = createAsyncThunk(
  'order/edit-preorder',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put('/order/edit-preorder', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const confirmEditPreOrder = createAsyncThunk(
  'order/confirm-edit-preorder',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put('/order/confirm-edit-preorder', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState: {
    preOrder: [],
    order: null,
    orderStatus: {
      create: 'idle',
      edit: 'idle',
      getOne: 'idle',
      getAll: 'idle',
      checkout: 'idle',
      cancel: 'idle',
      confirmCancel: 'idle',
      refuseCancel: 'idle',
      editPreOrder: 'idle',
      confirmEditPreOrder: 'idle',
    },
    orderErrors: {
      create: null,
      edit: null,
      getOne: null,
      getAll: null,
      checkout: null,
      cancel: null,
      confirmCancel: null,
      refuseCancel: null,
      editPreOrder: null,
      confirmEditPreOrder: null,
    },
    orders: null,
  },
  reducers: {
    addToOrder: (state, action) => {
      const { name, price, createdAt } = action.payload;
      let itemIndex = state.preOrder.findIndex((item) => item.name === name);
      let newList = [...state.preOrder];
      if (itemIndex === -1) {
        return {
          ...state,
          preOrder: [...state.preOrder, { name, price, quantity: 1, createdAt }],
        };
      } else {
        newList[itemIndex] = {
          ...newList[itemIndex],
          quantity: newList[itemIndex].quantity + 1,
          price: Number(newList[itemIndex].price) + Number(price),
          createdAt,
        };
        return { ...state, preOrder: newList };
      }
    },
    removeFromOrder: (state, action) => {
      const { name, price, createdAt } = action.payload;
      let itemIndex = state.preOrder.findIndex((item) => item.name === name);
      let newList = [...state.preOrder];
      newList[itemIndex] = {
        ...newList[itemIndex],
        quantity: newList[itemIndex].quantity - 1,
        price: Number(newList[itemIndex].price) - Number(price),
        createdAt,
      };

      if (newList[itemIndex].quantity === 0) newList.splice(itemIndex, 1);
      return { ...state, preOrder: newList };
    },
    addComment: (state, action) => {
      const { name, comment } = action.payload;
      let itemIndex = state.preOrder.findIndex((item) => item.name === name);
      let newList = [...state.preOrder];
      newList[itemIndex] = { ...newList[itemIndex], comment };
      return { ...state, preOrder: newList };
    },
    deletePreOrder: (state) => {
      return { ...state, preOrder: [] };
    },
  },
  extraReducers: {
    [createOrder.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, create: 'loading' },
      };
    },
    [createOrder.fulfilled]: (state, action) => {
      localStorage.removeItem('token');
      localStorage.removeItem('restId');
      localStorage.removeItem('tableNumber');
      localStorage.setItem('id', action.payload.id);
      return {
        ...state,
        order: action.payload,
        orderStatus: { ...state.orderStatus, create: 'succeded' },
        orderErrors: { ...state.orderErrors, create: null },
      };
    },
    [createOrder.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, create: 'failed' },

        orderErrors: { ...state.orderErrors, create: action.payload },
      };
    },
    [updateOrder.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, edit: 'loading' },
      };
    },
    [updateOrder.fulfilled]: (state, action) => {
      localStorage.removeItem('token');
      localStorage.removeItem('restId');
      localStorage.removeItem('tableNumber');
      return {
        ...state,
        order: action.payload,
        orderStatus: { ...state.orderStatus, edit: 'succeded' },
        orderErrors: { ...state.orderErrors, edit: null },
      };
    },
    [updateOrder.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, edit: 'failed' },
        orderErrors: { ...state.orderErrors, edit: action.payload },
      };
    },
    [getOrderById.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, getOne: 'loading' },
      };
    },
    [getOrderById.fulfilled]: (state, action) => {
      return {
        ...state,
        order: action.payload,
        orderStatus: { ...state.orderStatus, getOne: 'succeded' },
        orderErrors: { ...state.orderErrors, getOne: null },
      };
    },
    [getOrderById.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, getOne: 'failed' },
        orderErrors: { ...state.orderErrors, getOne: action.payload },
      };
    },
    [getAllOrders.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, getAll: 'loading' },
      };
    },
    [getAllOrders.fulfilled]: (state, action) => {
      return {
        ...state,
        orders: action.payload,
        orderStatus: { ...state.orderStatus, getAll: 'succeded' },
        orderErrors: { ...state.orderErrors, getAll: null },
      };
    },
    [getAllOrders.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, getAll: 'failed' },
        orderErrors: { ...state.orderErrors, getAll: action.payload },
      };
    },
    [checkoutOrder.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, checkout: 'loading' },
      };
    },
    [checkoutOrder.fulfilled]: (state, action) => {
      return {
        ...state,
        order: action.payload,
        orderStatus: { ...state.orderStatus, checkout: 'succeded' },
        orderErrors: { ...state.orderErrors, checkout: null },
      };
    },
    [checkoutOrder.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, checkout: 'failed' },
        orderErrors: { ...state.orderErrors, checkout: action.payload },
      };
    },

    [cancelOrder.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, cancel: 'loading' },
      };
    },
    [cancelOrder.fulfilled]: (state, action) => {
      return {
        ...state,
        order: action.payload,
        orderStatus: { ...state.orderStatus, cancel: 'succeded' },
        orderErrors: { ...state.orderErrors, cancel: null },
      };
    },
    [cancelOrder.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, cancel: 'failed' },
        orderErrors: { ...state.orderErrors, cancel: action.payload },
      };
    },

    [confirmCancelOrder.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, confirmCancel: 'loading' },
      };
    },
    [confirmCancelOrder.fulfilled]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, confirmCancel: 'succeded' },
        orderErrors: { ...state.orderErrors, confirmCancel: null },
      };
    },
    [confirmCancelOrder.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, confirmCancel: 'failed' },
        orderErrors: { ...state.orderErrors, confirmCancel: action.payload },
      };
    },

    [refuseCancelOrder.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, refuseCancel: 'loading' },
      };
    },
    [refuseCancelOrder.fulfilled]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, refuseCancel: 'succeded' },
        orderErrors: { ...state.orderErrors, refuseCancel: null },
      };
    },
    [refuseCancelOrder.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, refuseCancel: 'failed' },
        orderErrors: { ...state.orderErrors, refuseCancel: action.payload },
      };
    },

    [editPreOrder.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, editPreOrder: 'loading' },
      };
    },
    [editPreOrder.fulfilled]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, editPreOrder: 'succeded' },
        orderErrors: { ...state.orderErrors, editPreOrder: null },
      };
    },
    [editPreOrder.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, editPreOrder: 'failed' },
        orderErrors: { ...state.orderErrors, editPreOrder: action.payload },
      };
    },

    [confirmEditPreOrder.pending]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, confirmEditPreOrder: 'loading' },
      };
    },
    [confirmEditPreOrder.fulfilled]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, confirmEditPreOrder: 'succeded' },
        orderErrors: { ...state.orderErrors, confirmEditPreOrder: null },
      };
    },
    [confirmEditPreOrder.rejected]: (state, action) => {
      return {
        ...state,
        orderStatus: { ...state.orderStatus, confirmEditPreOrder: 'failed' },
        orderErrors: {
          ...state.orderErrors,
          confirmEditPreOrder: action.payload,
        },
      };
    },
  },
});

export const {
  addToOrder,
  removeFromOrder,
  addComment,
  deletePreOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
