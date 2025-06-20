export interface IAuthResponse {
    accessToken: string,
    refreshToken: string,
    role: string,
}

export interface ILoginRequest {
    email: string,
    password: string,
}

export interface IRegisterRequest {
    name: string,
    email: string,
    password: string,
    role: string,
}