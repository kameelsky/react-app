"use client";

import Button from "@app/lib/components/Button";
import LayoutOverlay from "@app/lib/components/LayoutOverlay";
import { sessionAuth } from "@app/lib/serverActions/authentication";
import { PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notification } from "antd";
import CryptoJS from "crypto-js";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";

export default function LoginForm() {
    const [visible, setVisible] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const openNotification = (
        type: "success" | "info" | "warning" | "error",
        message: string,
        description: string | ReactNode,
        duration: number = 10,
        pauseOnHover: boolean = true,
        showProgress: boolean = false
    ): void => {
        notificationApi.open({
            type: type,
            message: message,
            description: description,
            placement: "top",
            onClose: () => {
                if (type === "success") router.push("/home");
                else setVisible(false);
            },
            duration: duration, // seconds
            pauseOnHover: pauseOnHover,
            showProgress: showProgress,
        });
    };

    const form = useForm({
        mode: "controlled",
        initialValues: {
            user_login: "",
            provided_password: "",
        },

        validate: {
            user_login: (value) => {
                if (value.length === 0) return "Provide your login.";
                else if (value.length !== 4) {
                    return "Login must have 4 letters";
                } else return null;
            },
            provided_password: (value) => (value.length === 0 ? "Provide your password." : null),
        },
    });

    useEffect(() => {
        if (searchParams.get("msg") === "login required") openNotification("info", "Login required", "You need to login first.");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (formData: typeof form.values) => {
        setVisible(true);
        const responseData = await sessionAuth({ ...formData, provided_password: CryptoJS.MD5(formData.provided_password).toString() });
        openNotification(
            responseData.success ? "success" : "error",
            responseData.success ? "Login Successful" : `Login Failed. Code: ${responseData.status_code}`,
            responseData.success ? (
                <>
                    Welcome back <strong>{responseData.body?.name}</strong>!<br /> Logged in with <strong>{responseData.body?.role}</strong> privileges.
                </>
            ) : (
                responseData.message
            ),
            responseData.success ? 2.5 : 5,
            true,
            responseData.success ? true : false
        );
    };

    return (
        <LayoutOverlay visible={visible}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                {notificationContextHolder}
                <TextInput ref={inputRef} label="Login" withAsterisk key={form.key("user_login")} {...form.getInputProps("user_login")} />
                <PasswordInput label="Password" className="mt-3" withAsterisk key={form.key("provided_password")} {...form.getInputProps("provided_password")} />
                <Button color="black" fullWidth className="mt-10" type="submit">
                    Log in
                </Button>
            </form>
        </LayoutOverlay>
    );
}
