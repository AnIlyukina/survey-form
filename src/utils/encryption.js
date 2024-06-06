import CryptoJS from 'crypto-js';

export const encryptWithAES = (array, sessid) => {
    if (Array.isArray(array)) {
        const passphrase = array.map(JSON.stringify).join(',');
        return CryptoJS.AES.encrypt(passphrase, String(sessid)).toString();
    }
    return '';
};