import { getToken } from "./token";
 const BASE_URL = "http://8.156.84.50:9090"; 
// const BASE_URL = "http://127.0.0.1:4523/m1/7881239-7631110-default"; 
interface FetchOptions extends RequestInit {
  url: string;
  data?: any;          // body数据
  useToken?: boolean;  // 是否需要带token
   headers?: Record<string, string>;
  }


export async function request<T>({ url, data, useToken = false, ...options }: FetchOptions): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  
  // 如果需要token
  if (useToken) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch( `${BASE_URL}${url}`, {
    ...options,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText);
  }

  return res.json();
}