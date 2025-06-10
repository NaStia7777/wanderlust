import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { IAuthResponse } from '../../models/auth';

export const saveTokens = (auth: IAuthResponse) => {
    const accessExpiration = new Date();
    accessExpiration.setTime(accessExpiration.getTime() + import.meta.env.VITE_ACCESS_EXP * 60 * 1000);
    Cookies.set('accessToken', auth.accessToken, { expires: accessExpiration });

    const refreshExpiration = new Date();
    refreshExpiration.setTime(refreshExpiration.getTime() + import.meta.env.VITE_REFRESH_EXP * 60 * 1000);
    Cookies.set('role', auth.role, { expires: refreshExpiration });
    Cookies.set('refreshToken', auth.refreshToken, { expires: refreshExpiration });
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        role: Cookies.get('role'),
        isLogged: Cookies.get('refreshToken') != undefined,
    },
    reducers: {
        setTokens: (state, action: PayloadAction<IAuthResponse>) => {
            saveTokens(action.payload);
            state.role = action.payload.role;
            state.isLogged = true;
        },
        clearTokens: (state) => {
            state.isLogged = false;
            Cookies.remove('role');
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
        }
    },
});

export const { setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;