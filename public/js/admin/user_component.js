const user_component = {
    template: `
<div id="wrap" class="mt-3 mx-3">
  <!-- Modal -->
  <div class="modal fade" id="userModal" tabindex="-1" role="dialog"
      aria-labelledby="userModal" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="userModal">Пользователь</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body">
              <!--
                <p class="card-text my-1"><b>Имя:</b>
                    <input type="text" class="form-control m-0"
                        v-bind:class="{'is-valid': user.name!='' & user.name!=undefined}"
                        v-model="user.name">
                </p>
                <p class="card-text my-1"><b>Фамилия:</b>
                    <input type="text" class="form-control m-0"
                        v-bind:class="{'is-valid': user.surname!='' & user.surname!=undefined}"
                        v-model="user.surname">
                </p>
                <p class="card-text my-1"><b>Отчество:</b>
                    <input type="text" class="form-control m-0"
                        v-bind:class="{'is-valid': user.patronymic!='' & user.patronymic!=undefined}"
                        v-model="user.patronymic">
                </p>
                  <p class="card-text my-1"><b>Организация:</b>
                      <input type="text" class="form-control m-0"
                          v-bind:class="{'is-valid': user.organization!='' & user.organization!=undefined}"
                          v-model="user.organization">
                  </p>
                  <p class="card-text my-1"><b>Должность:</b>
                      <input type="text" class="form-control m-0"
                          v-bind:class="{'is-valid': user.position!='' & user.position!=undefined}"
                          v-model="user.position">
                  </p>
                  <p class="card-text my-1"><b>Роль:</b>
                      <input type="text" class="form-control m-0"
                          v-bind:class="{'is-valid': user.role!='' & user.role!=undefined}"
                          v-model="user.role">
                  </p>-->
                  
                    <p class="card-text"><b>Роль пользователя:</b>
                        <select class="form-control mt-2" id="selectRole" v-model="user.role">
                            <option v-for="(r, index) in roleList" v-bind:value="index">{{r}}</option>
                        </select>
                    </p>
                    
                    <p class="card-text" v-if="user.role==2"><b>Университет:</b>
                        <select class="form-control mt-2" id="selectRole" v-model="user.university">
                            <option v-for="(u, index) in universityList" v-bind:value="u.id">{{u.full_name}}</option>
                        </select>
                    </p>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                  <button type="button" class="btn btn-primary" @click="setUserData()">Изменить</button>
              </div>
          </div>
      </div>
  </div>

  <div class="input-group my-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="search-addon">
    <i class="fa fa-search fa-fw" aria-hidden="true"></i></span>
  </div>
  <input type="text" class="form-control" v-model="searchString" :disabled="accessRequests" @input="searching" placeholder="Фамилия пользователя" aria-label="Фамилия пользователя" aria-describedby="search-addon">
  <div class="input-group-append">
  <button class="btn btn-outline-secondary" type="button" v-bind:class="{active: accessRequests}" :disabled="searchString != ''" @click="accessRequests = !accessRequests">Заявки</button>
  </div>
  </div>

  <div class="card card-data mt-3" v-for="u in userList">
      <h5 class="card-header">
          {{fio(u.login)}}
      </h5>
      <div class="card-body py-0">
          <p class="card-text my-1"><b>Email:</b> {{u.login}}</p>
          <p class="card-text my-1"><b>Организация:</b> {{u.organization}}</p>
          <p class="card-text my-1"><b>Должность:</b> {{u.position}}</p>
          <p class="card-text my-1"><b>Роль:</b> {{roleList[u.role]}}</p>
          <p class="card-text my-1" v-if="u.role == 2"><b>Университет:</b> {{u.full_name}}</p>
      </div>
      <div class="card-footer">
          <div v-if="!accessRequests">
              <button class="btn btn-warning btn-sm" title="Изменить" @click="showInput(u.login)">
                  <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>
              </button>
              <button class="btn btn-danger btn-sm" title="Сбросить пароль" @click="showInput(u.login)" v-if="!accessRequests">
                  <i class="fa fa-sign-out fa-fw" aria-hidden="true"></i>
              </button>
          </div>
          <div v-if="accessRequests">
              <button class="btn btn-success btn-sm" title="Принять" @click="showInput(u.login)">
                  <i class="fa fa-user-plus fa-fw" aria-hidden="true"></i>
              </button>
              <button class="btn btn-danger btn-sm" title="Отклонить" @click="rejectRequest(u.login)" v-if="accessRequests">
                  <i class="fa fa-user-times fa-fw" aria-hidden="true"></i>
              </button>
          </div>
      </div>
  </div>

</div>
    `,
    data: function () {
        return {
            userList: [],                   // Список пользователей
            user: {},                       // Объект пользователя
            roleList: [
                'Нет',
                'Администратор',
                'Работник университета',
                'Работник ЦЗН',
                'Работник предприятия'],    // Список ролей
            universityList: [],             // Список университетов
            nextItem: 0,                    // Указатель блока данных
            searchString: '',               // Строка для поиска
            accessRequests: false,          // Указатель вывода списка запросов
            timerId: undefined,             // Таймер для ввода в поле поиска
        }
    },
    watch: {
        accessRequests: function () {
            this.nextItem = 0
            this.userList = []
            this.get()
        }
    },
    methods: {
        fio: function (login) {
            let _user = this.userList.find(u => u.login == login);
            return `${_user.surname} ${_user.name} ${_user.patronymic}`
        },

        searching: function (e) {
            //console.log(e.target.value)
            if (this.searchString == '') {
                this.nextItem = 0
                this.userList = []
                return this.get()
            } else {
                if (typeof this.timerId != undefined) {
                    clearTimeout(this.timerId)
                }
                this.timerId = setTimeout(this.search, 1000)
            }
        },
        // Поиск
        search: function () {
            fetch("./api/users/search?text=" + this.searchString, {
                method: 'get',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.userList = result.data
                    } else {
                        this.$root.showMessage(result.data, result.error);
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Открыть окно ввода
        showInput: function (login) {
            let _user = this.userList.find(p => p.login == login)
            this.user = JSON.parse(JSON.stringify(_user))
            $('#userModal').modal('show')
        },
        // Изменить роль пользователя
        setUserData: function () {
            if (this.user.role == 2 && !this.user.university) {
                return this.$root.showMessage('Укажите университет', false)
            }
            fetch("./api/users/" + this.user.login, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'role': this.user.role, 'university': this.user.university })
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        let _user = this.userList.find(u => u.login == this.user.login)
                        let userIndex = this.userList.indexOf(_user)

                        if (this.user.role == 0 || this.accessRequests) {
                            this.userList.splice(userIndex, 1)
                        }
                        else {
                            if (this.user.role == 2 && this.user.university) {
                                let uni = this.universityList.find(u => u.id == this.user.university).full_name
                                this.user.full_name = uni
                            }
                            else {
                                delete this.user.university
                                delete this.user.full_name
                            }
                            Vue.set(this.userList, userIndex, this.user)
                        }
                        $('#userModal').modal('hide')
                        this.$root.showMessage('Данные изменены', false)

                        if (this.userList.length) {
                            this.$root.getRequestCount()
                        }
                        else {
                            this.accessRequests = false
                            this.$root.requestCount = 0
                        }
                    } else {
                        $('#userModal').modal('hide')
                        this.$root.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Получить часть
        get: function () {
            if (this.searchString == '')
                fetch("./api/users?item=" + this.nextItem + "&access=" + this.accessRequests, {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(response => response.json())
                    .then(result => {
                        if (!result.error) {
                            let d = []
                            for (var o of result.data) {
                                if (!this.userList.find(u => u.login == o.login))
                                    d.push(o)
                            }
                            if (d.length) {
                                this.userList = this.userList.concat(d)
                                this.nextItem++
                            }
                        } else {
                            this.$root.showMessage(result.data, result.error);
                        }
                    })
                    .catch(function (error) {
                        console.log('Request failed', error)
                    })
        },
        // Получить список университетов
        getUniverList: function () {
            if (this.searchString == '')
                fetch("./api/universities/list", {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(response => response.json())
                    .then(result => {
                        if (!result.error) {
                            this.universityList = result.data
                        } else {
                            this.$root.showMessage(result.data, result.error)
                        }
                    })
                    .catch(function (error) {
                        console.log('Request failed', error)
                    })
        },
        // Отклонение заявки пользователя
        rejectRequest: function (login) {
            fetch("./api/users/" + login, {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        let _user = this.userList.find(u => u.login == login)
                        let userIndex = this.userList.indexOf(_user)

                        this.userList.splice(userIndex, 1)
                        if(this.userList == 0) 
                            this.accessRequests = false

                        this.$root.showMessage('Заявка удалена', false)
                    } else {
                        this.$root.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Сортировка
        sort: function (prev, next) {
            if (prev.name.toLowerCase() < next.name.toLowerCase()) return -1
            if (prev.name.toLowerCase() < next.name.toLowerCase()) return 1
        }
    },
    mounted() {
        let wel = document.getElementById('wrap').parentNode
        wel.addEventListener('scroll', e => {
            if (wel.scrollTop + wel.clientHeight >= wel.scrollHeight) {
                this.get()
            }
        })

        if ((+this.$root.requestCount)) {
            this.accessRequests = true
        }
        else {
            this.get()
        }
        this.getUniverList()
    }
}