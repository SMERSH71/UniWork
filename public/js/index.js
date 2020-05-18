const app = new Vue({
    data: {
        log: { login: '123@123', password: '12345' },
        user: {},
        state: true,
        errPass: {
            p1: '',
            p2: ''
        },
        message: {
            text: '',
            err: true
        }
    },
    methods: {
        // Таймер
        pause: function (ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        login: function () {
            if(this.log == '{}') return this.showMessage("Заполните поля", result.error)
            fetch("./login", {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.log)
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        document.location.href += result.data
                    } else {
                        this.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        checkPass: function () {
            var regexp = /[а-яё]/ig
            if (this.user.password) {
                if(regexp.test(this.user.password))
                this.errPass.p1 = 'Смените раскладку клавиатуры.'
                else
                this.errPass.p1 = ''
            }
            else {
                this.errPass.p1 = ''
            }
            
            if (this.user.password2) {
                if(regexp.test(this.user.password2))
                this.errPass.p2 = 'Смените раскладку клавиатуры.'
                else
                this.errPass.p2 = ''
                if(this.user.password != this.user.password2){
                    this.errPass.p2 = 'Пароли не совпадают'
                }
            }
            else {
                this.errPass.p2 = ''
            }
        },
        registration: function () {
            if(this.errPass.p1 != '' || this.errPass.p2 != '') return this.showMessage("Пароль не указан", result.error)
            if(this.user.password != this.user.password2) return this.showMessage("Пароли не совпадают", result.error)
            delete this.user.password2
            if(this.user == '{}') return this.showMessage("Заполните поля", result.error)
            fetch("./api/user", {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.user)
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.showMessage("Ваша заявка будет рассмотрена в ближайшее время", false)
                    } else {
                        this.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        showMessage: function (text, err) {
            this.message.text = text
            this.message.err = err
            this.pause(5000).then(() => { this.message = { text: '', err: true } })
        }
    }
}).$mount("#app");