export const initializeRecaptcha = (renderRecaptcha) => {
    if (window.grecaptcha) {
        renderRecaptcha();
    } else {
        window.addEventListener('grecaptchaLoaded', renderRecaptcha);
    }
};

export const renderRecaptcha = (sitekey, widgetIdSetter) => {
    grecaptcha.ready(function() {
        const widgetId = grecaptcha.render("nn-invest-form__captcha", { sitekey });
        widgetIdSetter(widgetId);
    });
};

// Установим глобальную функцию для reCAPTCHA
window.grecaptchaLoaded = function() {
    window.dispatchEvent(new Event('grecaptchaLoaded'));
};