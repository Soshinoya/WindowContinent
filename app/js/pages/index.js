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

const numberConfirmation = document.querySelector('.number-confirmation')

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
        // Переход на страницу подтверждения кода (codeConfirmation.html)
        window.location.href = 'code-confirmation.html'
    } else {
        toggleAuthError(true, 'Вероятно, в номере ошибка, повторите ввод')
    }
})

const linkCodeAlreadyExist = document.querySelector('#code-already-exist')
linkCodeAlreadyExist.addEventListener('click', e => {
    e.preventDefault()
    // Переход на страницу подтверждения кода (codeConfirmation.html)
    window.location.href = 'code-confirmation.html'
})