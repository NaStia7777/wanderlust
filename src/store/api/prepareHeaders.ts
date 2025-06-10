import axios from "axios";
import Cookies from "js-cookie";
import { IAuthResponse } from "../../models/auth";
import { saveTokens } from "../slices/auth";

export default async function prepareHeaders(headers: Headers): Promise<Headers> {
    let accessToken = Cookies.get('accessToken');
    let refreshToken = Cookies.get('refreshToken');

    if (!accessToken && refreshToken) {
        await axios.post(import.meta.env.VITE_BASE_URL + '/auth/refresh/', {
            refreshToken: refreshToken
        })
            .then((response) => {
                let auth = response.data as IAuthResponse;
                saveTokens(auth);
                accessToken = auth.accessToken;
            })
            .catch(() => {
            });
    }
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
}