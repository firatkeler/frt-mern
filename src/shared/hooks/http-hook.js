import {useState, useCallback, useRef, useEffect} from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true);

        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);

        try {
            const response = await fetch(url, {method, body, headers, signal: httpAbortController.signal});

            const data = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(httpRequest => httpRequest !== httpAbortController);

            if (!response.ok) {
                throw new Error(data.message);
            }

            setIsLoading(false);
            return data;
        }
        catch(error) {
            setError(error.message);
            setIsLoading(false);
            throw error;
        }
    }, []);

    const clearError = () => setError(null);

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortController => abortController.abort());
        };
    }, []);

    return {
        isLoading,
        error,
        sendRequest,
        clearError
    }
};
