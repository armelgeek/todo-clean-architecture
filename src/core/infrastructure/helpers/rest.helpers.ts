import axios, { AxiosResponse } from 'axios';
import { Params } from '../types/rest.types';
import { config } from '../config';

export const http = axios.create({
	baseURL: config.apiUrl,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	},
});

http.interceptors.request.use(request => {
	const data = JSON.stringify(request.data, null, 2);
	console.log(`[!] ${request.method?.toUpperCase()} ${request.url}`);
	console.log(`Body=${data}`);

	//const token = getToken();
	//if (token) {
	//  request.headers.Authorization = `Bearer ${token.accessToken}`;
	//}

	return request;
  });

  http.interceptors.response.use(
	(config: AxiosResponse) => config,
	async (error: Error) => {
	  return Promise.reject(new Error(getErrorData(error)));
	},
  );
function getHeaders(token?: string) {
	let header: Record<string, string> = {};
	// handle authorization
	if (token) {
	  header.Authorization = `Bearer ${token}`;
	}

	return header;
  }
export function getErrorData(error: any): string {
	if (axios.isAxiosError(error)) {
		if (error.response) {
			return error.response.data?.message || 'An error occurred';
		} else if (error.request) {

			return 'No response received from the server';
		}
	}
	return error.message || 'An unknown error occurred';
}

export async function get<R>(params: Params.Get): Promise<R> {
	const { path, token, signal, headers = {} } = params;
	const response = await http.get<R>(path, {
	  headers: { ...getHeaders(token), ...headers },
	  params: params.params,
	  signal,
	});
	return response.data;
  }

  export async function post<R, P>(params: Params.Post<P>): Promise<R> {
	const { path, token, signal, headers = {}, payload } = params;
	const response = await http.post<R, AxiosResponse<R>, P>(path, payload, {
	  headers: { ...getHeaders(token), ...headers },
	  signal,
	});
	return response.data;
  }

  export async function put<R, P>(params: Params.Put<P>): Promise<R> {
	const { path, token, signal, headers = {}, payload } = params;
	const response = await http.put(path, payload, {
	  headers: { ...getHeaders(token), ...headers },
	  signal,
	});
	return response.data;
  }

  export async function remove<R>(params: Params.Delete): Promise<R> {
	const { path, token, signal, headers = {} } = params;
	const res = await http.delete(path, {
	  headers: { ...getHeaders(token), ...headers },
	  signal,
	});
	return res.data;
  }


  /**
   * export async function login(payload: LoginPayload) {
  return await post<LoginResponse, LoginPayload>({
    path: 'authentification/sign-in',
    payload,
  });
}
  */
