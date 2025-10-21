import { BASE_API_URL } from '../config/constants'

async function fetchPOSTLogin(username, password, rememberMe) {
    const response = await fetch(`${BASE_API_URL}/auth/web/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            rememberMe,
        }),
        credentials: 'include',
    })

    return response.json();
}

async function fetchGETRememberMe() {
    const response = await fetch(`${BASE_API_URL}/auth/web/remember-me`, {
        method: 'GET',
        credentials: 'include',
    })

    return response.json();
}

async function fetchGETVerifySession() {
    const response = await fetch(`${BASE_API_URL}/auth/web/verify-session`, {
        method: 'GET',
        credentials: 'include',
    })

    return response.json();
}

export default {
    fetchPOSTLogin,
    fetchGETRememberMe,
    fetchGETVerifySession,
}