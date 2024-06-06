window.mouseCoordinates = [];
window.touchCoordinates = [];
window.clickCoordinates = [];
window.keyPresses = [];


function debounce(func, wait, immediate = true) {
    let timeout;
    return function() {
        let context = this, args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function updateMouseCoordinates(event) {
    let x = event.clientX;
    let y = event.clientY;

    window.mouseCoordinates.push({x: x, y: y});

    if (window.mouseCoordinates.length > 100) {
        window.mouseCoordinates.shift();
    }
}

function trackFingerMovement(event) {
    const touches = event.touches;

    for (let i = 0; i < touches.length; i++) {
        // Получаем координаты X и Y каждого касания
        const x = touches[i].clientX;
        const y = touches[i].clientY;

        window.touchCoordinates.push({x, y});

        if (touchCoordinates.length > 100) {
            window.touchCoordinates.shift();
        }
    }
}

function updateClickCoordinates(event) {
    let x = event.clientX;
    let y = event.clientY;

    window.clickCoordinates.push({x: x, y: y});

    if (window.clickCoordinates.length > 100) {
        window.clickCoordinates.shift();
    }
}

function onKeyPress (event) {
    window.keyPresses.push(event.key);

    if (window.keyPresses.length > 100) {
        window.keyPresses.shift();
    }
}


// Добавление обработчика события мыши
document.addEventListener('mousemove', debounce(updateMouseCoordinates, 10));
document.body.addEventListener('touchmove', debounce(trackFingerMovement, 10));
document.body.addEventListener('click', updateClickCoordinates);
window.addEventListener('keydown', onKeyPress);