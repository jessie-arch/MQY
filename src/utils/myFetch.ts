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

  // 处理GET请求的参数
  let finalUrl = `${BASE_URL}${url}`;
  let requestBody = undefined;

  if (options.method === 'GET' && data) {
    // GET 请求：把 data 转成 URL 参数
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        params.append(key, data[key].toString());
      }
    });
    const queryString = params.toString();
    if (queryString) {
      finalUrl += `?${queryString}`;
    }
  } else if (data) {
    // 非 GET 请求或未指定method：把 data 作为 body
    requestBody = JSON.stringify(data);
  }

  const res = await fetch(finalUrl, {
    ...options,
    headers,
    body: requestBody,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Request failed: ${res.status} ${errText}`);
  }

  return res.json();
}