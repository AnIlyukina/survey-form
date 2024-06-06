import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL === 'production'
    ? `${window.location.origin}`
    : import.meta.env.VITE_API_BASE_URL

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});


// Функция для обработки ошибок
const handleApiError = (error) => {
    if (error.response) {
        // Сервер ответил статусом, отличным от 2xx
        console.error('Server Error:', error.response.data);
    } else if (error.request) {
        // Запрос был сделан, но ответа не было
        console.error('Network Error:', error.request);
    } else {
        // Что-то произошло при настройке запроса
        console.error('Error:', error.message);
    }
    throw error;
};


export { api, handleApiError };