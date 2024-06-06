export const checkValidByType = (type, value) => {
    if (type === 'INN') {
        return String(value).length === 10 || String(value).length === 12 ? '' : 'Введите корректный ИНН'
    }
    if (type === 'PHONE') {
        let pattern1 = /^8\d{10}$/;
        let pattern2 = /^\+7\d{10}$/;
        return pattern1.test(value) || pattern2.test(value) ? "" : "Введите телефон в формате +7хххххххххх или 8хххххххххх";
    }

    if (type === 'EMAIL') {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isValid = re.test(String(value).toLowerCase());
        return !isValid ? 'Введите корректный email' : ''
    }
}