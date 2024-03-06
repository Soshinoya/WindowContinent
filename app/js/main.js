const checkingCorrectPhoneNumber = value => {
    if (
        value.startsWith('+7') &&
        value.split('').map(item => !!(+item) ? item : item === '0' ? item : NaN).filter(item => !Number.isNaN(item)).length === 11
    ) {
        return true
    } else {
        return false
    }
}

const checkingCorrectCode = async value => true

let notificationTimeout;
let progress;

const toggleProgressBar = boo => {
    let progressStartValue = 100,
        progressEndValue = 0,
        speed = 50;

    if (boo) {
        const circularProgress = document.querySelector(".confirmation__holder .circular-progress")

        progress = setInterval(() => {
            progressStartValue--;

            circularProgress.style.background = `conic-gradient(#F9326D ${progressStartValue * 3.6}deg, #ededed 0deg)`

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

    toggleProgressBar(false)

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
        toggleProgressBar(true)
    }
}

const renderPhoneConfirmation = () => {
    const numberConfirmationTemplate = document.getElementById('number-confirmation')
    const template = document.importNode(numberConfirmationTemplate.content, true)
    const numberConfirmation = template.querySelector('.number-confirmation')
    document.querySelector('main.main').insertAdjacentElement('afterbegin', numberConfirmation)

    // Маска для ввода номера телефона
    const phoneInput = document.querySelector('.number-confirmation-form__input')
    const maskOptions = { mask: '+{7} (000) 000-00-00' }

    phoneInput.addEventListener('input', e => {
        const inputValue = e.target.value
        if (inputValue.startsWith('8')) {
            e.target.value = '+7' + inputValue.slice(1)
        }
    })

    IMask(phoneInput, maskOptions)

    // Проверка правильности заполнения номера телефона
    const phoneInputForm = document.querySelector('.number-confirmation-form')

    phoneInput.addEventListener('input', e => {
        if (checkingCorrectPhoneNumber(e.target.value)) {
            phoneInput.classList.add('input--correct')
        } else {
            phoneInput.classList.remove('input--correct')
        }
    })

    phoneInputForm.addEventListener('submit', e => {
        e.preventDefault()
        if (checkingCorrectPhoneNumber(phoneInput.value)) {
            document.querySelectorAll('main.main section').forEach(section => section.remove())
            renderCodeConfirmation()
        } else {
            toggleAuthError(true, 'Вероятно, в номере ошибка, повторите ввод')
        }
    })

    const linkCodeAlreadyExist = document.querySelector('#code-already-exist')
    linkCodeAlreadyExist.addEventListener('click', e => {
        e.preventDefault()
        document.querySelectorAll('main.main section').forEach(section => section.remove())
        renderCodeConfirmation()
    })
}

renderPhoneConfirmation()

const renderCodeConfirmation = () => {
    const codeConfirmationTemplate = document.getElementById('code-confirmation')
    const template = document.importNode(codeConfirmationTemplate.content, true)
    const codeConfirmation = template.querySelector('.code-confirmation')
    document.querySelector('main.main').insertAdjacentElement('afterbegin', codeConfirmation)

    // Проверка полученного кода
    const codeConfirmationForm = document.querySelector('.code-confirmation-form')
    const codeConfirmationFormInputs = document.querySelectorAll('.code-confirmation-form__input')

    const getCode = () => Array.from(codeConfirmationFormInputs).reduce((accum, curr) => accum + curr?.value, '')

    codeConfirmationFormInputs.forEach((codeInput, key) => codeInput.addEventListener('input', e => {
        // Получаем текущее значение в поле ввода
        let value = e.target.value;
        // Заменяем все символы, кроме цифр, на пустую строку
        value = value.replace(/\D/g, '');
        // Обновляем значение в поле ввода
        e.target.value = value;

        e.target.value.length > 1 && (e.target.value = e.target.value.slice(0, 1))
        codeConfirmationFormInputs.forEach(input => input.classList.toggle('input--correct', getCode().length === 4))
        e.target.value.length === 1 && codeConfirmationFormInputs[key + 1]?.focus()
    }))

    codeConfirmationFormInputs[0].focus()

    const linkEnterAnotherPhone = document.querySelector('#link-enter-another-phone')
    linkEnterAnotherPhone.addEventListener('click', e => {
        e.preventDefault()
        document.querySelectorAll('main.main section').forEach(section => section.remove())
        renderPhoneConfirmation()
    })

    codeConfirmationForm.addEventListener('submit', async e => {
        e.preventDefault()

        if (getCode().length === 4) {
            if (await checkingCorrectCode(+getCode())) {
                document.querySelectorAll('main.main section').forEach(section => section.remove())
                renderNetworkAvailable()
                return
            }
        }

        toggleAuthError(true, 'Вероятно, в коде ошибка, повторите ввод')
    })
}

const renderNetworkAvailable = () => {
    clearTimeout(notificationTimeout)
    const networkAvailableTemplate = document.getElementById('network-available')
    const template = document.importNode(networkAvailableTemplate.content, true)
    const networkAvailable = template.querySelector('.network-available')
    document.querySelector('main.main').insertAdjacentElement('afterbegin', networkAvailable)
}