export type AuthData = {
    name: string;
    role: string;
    login: string;
};

export type AuthResponse<ResponseData = null> = {
    success: boolean;
    status_code: number;
    message: string;
    body?: ResponseData;
};

export type FormData = {
    user_login: string;
    provided_password: string;
};

export type NotificationProperties = {
    type: "success" | "info" | "warning" | "error";
    message: string;
    description: string;
};
