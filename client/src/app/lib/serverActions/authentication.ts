"use server";

import { decryptJWT, encryptJWT } from "@app/lib/encryption";
import { api } from "@app/lib/fetching";
import logger from "@app/lib/logger";
import { AuthResponse, AuthData, FormData } from "@app/lib/data/types";
import { cookies } from "next/headers";

export async function sessionAuth(formData: FormData, developer: boolean = false): Promise<AuthResponse<AuthData | null>> {
    let data: AuthResponse<AuthData | null>;
    if (!developer) {
        data = await api
            .post("/auth/user-validate", formData)
            .then((response) => {
                const successResponse: AuthResponse = {
                    success: true,
                    status_code: response.status,
                    message: "Logged in",
                };
                return { ...successResponse, body: { ...response.data } } as AuthResponse<AuthData>;
            })
            .catch((error) => {
                return {
                    success: false,
                    status_code: error.response?.status || 500,
                    message: error.response?.data.detail || "Server API not responding.",
                } as AuthResponse;
            });
    } else {
        data = {
            success: true,
            status_code: 200,
            message: "Logged in in developer mode.",
            body: { name: "Developer", role: "admin", login: "DEVE" },
        };
    }

    if (data.success) {
        const token = await encryptJWT(data.body as AuthData);
        const cookieStorage = await cookies();

        const hours = 1; // hours
        const cookieLifeSpan = hours * 3_600; // seconds
        // const cookieLifeSpan = 10; // seconds
        const expires = new Date(Date.now() + cookieLifeSpan * 1000); // current date + miliseconds

        cookieStorage.set("session", token, {
            secure: false,
            httpOnly: true,
            expires: expires,
        });

        logger.info(`${data.body?.name}(${data.body?.login}) logged in as ${data.body?.role}.`);
    }

    return data;
}
export async function sessionDeauth(): Promise<void> {
    const cookieStorage = await cookies();
    const token = cookieStorage.get("session")?.value || "";
    const payload = await decryptJWT(token);
    cookieStorage.delete("session");
    logger.info(`${payload?.name}(${payload?.login}) logged out.`);
}
