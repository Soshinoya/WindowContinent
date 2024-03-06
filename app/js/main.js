const checkingCorrectCode = async value => true

let notificationTimeout;

const toggleProgressBar = config => {
    let progress;
    let progressStartValue = 100,
        progressEndValue = 0,
        speed = config.speed;

    if (config.visible) {
        const circularProgress = document.querySelector(config.selector)

        progress = setInterval(() => {
            progressStartValue--;

            circularProgress.style.background = `conic-gradient(${config.color} ${progressStartValue * 3.6}deg, #ededed 0deg)`

            if (progressStartValue === progressEndValue) {
                clearInterval(progress)
            }
        }, speed)
    } else {
        progressStartValue = 0
        clearInterval(progress)
    }
}

const createNotification = message => {
    const errorTemplate = document.getElementById('notification--error')
    const template = document.importNode(errorTemplate.content, true)
    const notification = template.querySelector('.notification')
    notification.querySelector('.notification__message').textContent = message
    return notification
}

const toggleAuthError = (isError, notificationMsg) => {
    clearTimeout(notificationTimeout)
    notificationTimeout = setTimeout(() => toggleAuthError(false, notificationMsg), 5000)

    toggleProgressBar({
        visible: false,
        selector: '.confirmation__holder .circular-progress',
        speed: 50,
        color: '#F9326D'
    })

    document.querySelectorAll('.confirmation-form .input').forEach(input => input?.classList?.toggle('input--error', isError))
    document.querySelector('.confirmation__holder')?.classList?.toggle('confirmation__holder--error', isError)
    document.querySelector('.confirmation-form__text')?.classList?.toggle('confirmation-form__text--hidden', isError)

    const existingNotification = document.querySelector('.confirmation__holder .notification')
    if (existingNotification) {
        existingNotification.remove()
    }

    if (isError) {
        const notification = createNotification(notificationMsg)
        document.querySelector('.confirmation-form').insertAdjacentElement('beforebegin', notification)
        notification.querySelector('.notification__icon').addEventListener('click', () => toggleAuthError(false, notificationMsg))
        toggleProgressBar({
            visible: true,
            selector: '.confirmation__holder .circular-progress',
            speed: 50,
            color: '#F9326D'
        })
    }
}