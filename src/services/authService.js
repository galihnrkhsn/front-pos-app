import axios from 'axios'

const API_URL = "http://localhost/project/pos-app/public/login"

export async function login(name, password) {
    return axios.post(`${API_URL}`,
        { 
            name, password
        },
        {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
    )
}

export function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
}

export function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}

export function logout() {
    localStorage.removeItem('user')
}

