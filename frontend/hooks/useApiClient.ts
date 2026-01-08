import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { getAuthToken } from '@/utils/googleDrive';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // FastAPI Backend URL
});

export const useApiClient = () => {
    const { googleAccessToken } = useAuth();

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(async (config) => {
            // 1. Firebase ID Token (for Identity/Auth)
            const token = await getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // 2. Google Drive Access Token (for Drive API operations)
            // Stored in AuthContext (and SessionStorage)
            if (googleAccessToken) {
                // Using a custom header for the Drive Token to distinguish from Auth Bearer
                // OR we can rely on Backend to treat Bearer as ID token.
                // PRD Step 7 Prompt 2: "authenticate using the user's forwarded token"
                // PRD Step 5 API Contract: "Auth Header: Authorization: Bearer <Firebase_ID_Token>"
                // So we add Drive token separately.
                config.headers['X-Google-Drive-Token'] = googleAccessToken;
            }

            // 3. AI Keys (BYOK)
            // Stored in localStorage: docscholar_keys = { gemini: "", groq: "" }
            try {
                const storedKeys = localStorage.getItem('aiper_keys');
                if (storedKeys) {
                    const keys = JSON.parse(storedKeys);
                    if (keys.gemini) {
                        config.headers['X-Gemini-Key'] = keys.gemini;
                    }
                    if (keys.groq) {
                        config.headers['X-Groq-Key'] = keys.groq;
                    }
                }
            } catch (e) {
                console.error("Error reading API keys", e);
            }

            return config;
        });

        return () => {
            api.interceptors.request.eject(requestInterceptor);
        };
    }, [googleAccessToken]);

    return api;
};
