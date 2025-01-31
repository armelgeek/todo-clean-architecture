import { AxiosRequestConfig } from 'axios';

export namespace Params {
  type DefaultParams = {
    path: string;
    token?: string;
    signal?: AbortSignal;
    params?: Record<string, string | number>;
    headers?: AxiosRequestConfig['headers'];
  };
  export type Get = DefaultParams;

  export type Post<T> = DefaultParams & {
    payload: T;
  };

  export type Put<T> = DefaultParams & {
    payload: T;
  };

  export type Delete = DefaultParams;
}
