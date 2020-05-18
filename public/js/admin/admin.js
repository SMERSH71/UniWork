// Маршруты, сопотавленные с компонентами
const routes = [
    {
        path: '/admin',
        component: { template: '<router-view></router-view>' },
        children: [,
            {// Настройки учетной записи
                path: 'usettings',
                component: usettings_component
            },
            {// Список пользователей системы
                path: 'users',
                component: user_component
            },
            {// Список университетов
                path: 'university',
                component: university_component
            },
            {// Список профессий
                path: 'profession',
                component: profession_component
            },
            {// Список должностей
                path: 'position',
                component: position_component
            },
            {// Настройки системы
                path: 'settings',
                component: settings_component
            }
        ]
    }
];
// создаем объект маршрутизатора
const router = new VueRouter({
    mode: 'history',
    routes: routes
});

const app = new Vue({
    router: router,
    data: {
        showMenu: false,
        requestCount: 0,
        userName: '',
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

        logout: function () {

        },
        // Отобразить сообщение
        showMessage: function (text, err){
            this.message.text = text
            this.message.err = err
            this.pause(5000).then(()=>{this.message = {text:'', err:true}})
        },
        // Количество запросов
        getRequestCount: function(){
            fetch("./api/users/request", {
                method: 'get',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.requestCount = result.data
                    } else {
                        this.showMessage(result.data, result.error);
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Получить имя и фамилию пользователя 
        get: function(){
            fetch("./api/user", {
                method: 'get',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.userName = result.data.name + " " + result.data.surname
                    } else {
                        this.showMessage(result.data, result.error);
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        }
    },
    mounted() {
        //this.get()
        setInterval(()=>{ this.getRequestCount() }, 60000)
        this.getRequestCount()
    }
}).$mount("#app");

window.onload = () => { var elem = document.getElementById('pageLoading'); elem.parentNode.removeChild(elem) }