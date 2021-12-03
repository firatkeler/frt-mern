import {useState, useEffect, useCallback} from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);

    const [currentTokenExpirationDate, setCurrentTokenExpirationDate] = useState();

    const [userId, setUserId] = useState(null);

    const login = useCallback((userId, token, expirationDate) => {
        setToken(token);

        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

        setCurrentTokenExpirationDate(tokenExpirationDate);

        setUserId(userId);

        localStorage.setItem('userData', JSON.stringify({
            userId,
            token,
            tokenExpirationDate: tokenExpirationDate.toISOString()
        }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);

        setCurrentTokenExpirationDate(null);

        setUserId(null)

        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));

        if (storedData) {
            if (storedData.token && new Date(storedData.tokenExpirationDate) > new Date()) {
                login(storedData.user, storedData.token, new Date(storedData.tokenExpirationDate));
            }
        }
    }, [login]);

    useEffect(() => {
        if (token && currentTokenExpirationDate) {
            const remainingTime = currentTokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        }
        else {
            localStorage.removeItem('userData');

            clearTimeout(logoutTimer);
        }
    }, [token, logout, currentTokenExpirationDate]);

    return {token, userId, login, logout}
};
