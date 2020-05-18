const url = "http://localhost:3000"

// маршруты, сопотавленные с компонентами
const routes = [
    {
        path: '/empcompany',
        component: { template: '<router-view></router-view>' },
        children: [,
            {// Настройки учетной записи
                path: 'usettings',
                component: usettings_component
            },
            {// Список профессий
                path: 'profession',
                component: profession_component
            },
            {// Список должностей
                path: 'position',
                component: position_component
            },
            {// Информация об университете
                path: 'university',
                component: university_component
            },
            {// Список учебных программ
                path: 'eduprogram',
                component: eduprogram_component
            },
            {// Список учебных программ
                path: 'universities/:id/eduprograms',
                component: eduprogram_component
            }
        ]
    }
];
// создаем объект маршрутизатора
const router = new VueRouter({
    mode: 'history',
    routes: routes
});

Vue.component('data-preloader',{
    template:`<div class="progress">
    <div class="progress-bar progress-bar-striped progress-bar-animated bg-dark" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
    </div>`
});

const app = new Vue({
    router: router,
    data: {
        showMenu: false,
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
            fetch("./logout", {
                method: 'post',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        window.location.reload()
                    } else {
                        this.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },

        showMessage: function (text, err){
            this.message.text = text
            this.message.err = err
            this.pause(5000).then(()=>{this.message = {text:'', err:true}})
        },

        get: function(){
            fetch("./api/user", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
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
        this.get()
    }
}).$mount("#app");

window.onload = () => { var elem = document.getElementById('pageLoading'); elem.parentNode.removeChild(elem) }