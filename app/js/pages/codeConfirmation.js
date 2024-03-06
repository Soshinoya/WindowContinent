
const codeConfirmation = document.querySelector('.code-confirmation')

// Проверка полученного кода
const codeConfirmationForm = document.querySelector('.code-confirmation-form')
const codeConfirmationFormInputs = document.querySelectorAll('.code-confirmation-form__input')

// Other
const resendCodeBtn = document.querySelector('#resend-code')

let resendTimeout;

const resendCodeRender = () => {
    resendCodeBtn.classList.add('link--disabled')
    toggleProgressBar({
        visible: true,
        selector: '#resend-code .circular-progress',
        speed: 300,
        color: '#222'
    })
    resendTimeout = setTimeout(() => {
        resendCodeBtn.classList.remove('link--disabled')
    }, 30000)
}

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
    // Переход на страницу ввода номера телефона (checkPhone.html)
    window.location.href = 'index.html'
})

codeConfirmationForm.addEventListener('submit', async e => {
    e.preventDefault()

    if (getCode().length === 4) {
        if (await checkingCorrectCode(+getCode())) {
            // Переход на страницу "Доступ разрешён" (accessAllowed.html)
            window.location.href = 'access-allowed.html'
            return
        }
    }

    toggleAuthError(true, 'Вероятно, в коде ошибка, повторите ввод')
})

resendCodeBtn.addEventListener('click', e => {
    e.preventDefault()

    if (!resendCodeBtn.classList.contains('link--disabled')) {
        resendCodeRender()
    }
})