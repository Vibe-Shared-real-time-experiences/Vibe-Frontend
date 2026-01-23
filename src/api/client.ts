import axios from "axios";

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// REQUEST INTERCEPTOR 
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token && !config.url?.includes("/auth/refresh")) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
let isRefreshing = false;
let failedRequestQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedRequestQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedRequestQueue = [];
};

axiosClient.interceptors.response.use(
    (response) => response, // Return response immediately if successful
    async (error) => {
        const originalRequest = error.config;

        // When 401 error occurs & not retry yet
        if (error.response?.status === 401 && !originalRequest._retry) {

            // 1. Queue this request if someone is refreshing the token
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedRequestQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(axiosClient(originalRequest));
                        },
                        reject: (err: any) => {
                            reject(err);
                        },
                    });
                });
            }

            // 2. Lock to refresh token
            originalRequest._retry = true;
            isRefreshing = true;

            // 3. Refresh token
            try {
                const refreshToken = localStorage.getItem('refresh_token');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/auth/refresh`, {
                    refreshToken: refreshToken
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem('access_token', accessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refresh_token', newRefreshToken);
                }

                // 3. Update header with new token
                axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // 4. Process queued requests
                processQueue(null, accessToken);

                return axiosClient(originalRequest);
            } catch (refreshError) {
                // 5. Refresh failed (Token expired or revoked) -> Logout
                processQueue(refreshError, null);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                // Redirect to login page (Use window.location to force reload for clean state)
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;