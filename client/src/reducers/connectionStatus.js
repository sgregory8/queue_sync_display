import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    connected: false,
};

const connectionStatusSlice = createSlice({
    name: 'connectionStatus',
    initialState,
    reducers: {
        setConnectionStatus: (state, action) => ({
            ...state,
            ...action.payload,
        }),
    },
});

export const { setConnectionStatus } = connectionStatusSlice.actions;

export default connectionStatusSlice.reducer;

export const receiveSocketConnectionStatus = socket => dispatch => {
    dispatch(setConnectionStatus({ connected: socket.connected }));

    socket
        .on('connect', () => dispatch(setConnectionStatus({ connected: true })))
        .on('disconnect', () => dispatch(setConnectionStatus({ connected: false })));
};
