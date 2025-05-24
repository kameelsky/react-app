import axios, { type AxiosInstance } from "axios";

const PRODUCTION = process.env.PRODUCTION;
const PRODUCTION_SERVER = process.env.PRODUCTION_SERVER;

let baseURL: string;
if (PRODUCTION == "True") baseURL = `http://${PRODUCTION_SERVER}:9003`;
else baseURL = "http://localhost:9003";

export const api: AxiosInstance = axios.create({
    baseURL,
});
