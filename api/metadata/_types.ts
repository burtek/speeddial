import type { ServerResponse } from 'node:http';


export enum HttpStatusCodes {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    INTERNAL_SERVER_ERROR = 500
}

export interface RequestData {
    url?: string;
}

export type TypedVercelResponse<T> = ServerResponse & {
    send: (body: unknown) => TypedVercelResponse<T>;
    json: (jsonBody: T) => TypedVercelResponse<T>;
    status: (statusCode: number) => TypedVercelResponse<T>;
    redirect: (statusOrUrl: string | number, url?: string) => TypedVercelResponse<T>;
};

export const enum ImageFetchError {
    BAD_URL = 'Malformed url',
    NO_IMAGE = 'Image not found'
}

export type ImageResponseData = {
    backgroundColor?: string;
    imageUrl: string;
    themeColor?: string;
    canonicalURL?: string;
    resolvedURL: string;
    title: string;
} | { error: string };
