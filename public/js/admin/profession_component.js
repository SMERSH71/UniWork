const profession_component = {
    template: `
    <div id="wrap" class="mx-3 pt-3">
    <!-- Modal -->
    <div class="modal fade" id="professionModal" tabindex="-1" role="dialog"
            aria-labelledby="professionModal" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                            <div class="modal-header">
                                    <h5 class="modal-title" id="professionModal">Профессия</h5>
                                    <button type="button" class="close" data-dismiss="modal"
                                            aria-label="Close">
                                            <span aria-hidden="true">&times</span>
                                    </button>
                            </div>
                            <div class="modal-body">
                                    <p class="card-text my-1"><b>Название:</b>
                                            <input type="text" maxlength="256" class="form-control m-0" v-model="profession.name">
                                    </p>
                                    <p class="card-text my-1"><b>Код:</b>
                                            <input type="number" maxlength="5" class="form-control m-0" v-model="profession.kod">
                                    </p>
                                    <p class="card-text my-1"><b>КЧ:</b>
                                            <input type="number" maxlength="1" class="form-control m-0" v-model="profession.kch">
                                    </p>
                                    <p class="card-text my-1"><b>Тарифные разряды:</b>
                                            <input type="text" maxlength="16" class="form-control m-0" v-model="profession.tarif">
                                    </p>
                                    <p class="card-text my-1"><b>ЕТКС:</b>
                                            <input type="number" maxlength="2" class="form-control m-0" v-model="profession.etkc">
                                    </p>
                                    <p class="card-text my-1"><b>ОКЗ:</b>
                                            <input type="number" maxlength="4" class="form-control m-0" v-model="profession.okz">
                                    </p>
                            </div>
                            <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary"
                                            data-dismiss="modal">Отменить</button>
                                    <button type="button" class="btn btn-primary"
                                            @click="make(profession.id)">{{isAdd?'Добавить':'Изменить'}}</button>
                            </div>
                    </div>
            </div>
    </div>

    <div class="input-group mb-3">
            <div class="input-group-prepend">
                    <span class="input-group-text" id="search-addon">
                            <i class="fa fa-search fa-fw" aria-hidden="true"></i></span>
            </div>
            <input type="text" class="form-control" v-model="searchString" @input="searching"
                    placeholder="Название профессии" aria-label="Название профессии"
                    aria-describedby="search-addon">
    </div>

    <div class="card card-data mt-3" v-for="p in professionList">
            <h5 class="card-header">
                    {{p.name}}
            </h5>
            <div class="card-body py-0">
                    <p class="card-text my-1"><b>Код:</b> {{p.kod}}</p>
                    <p class="card-text my-1"><b>КЧ:</b> {{p.kch}}</p>
                    <p class="card-text my-1"><b>Тарифные разряды:</b> {{p.tarif}}</p>
                    <p class="card-text my-1"><b>ЕТКС:</b> {{p.etkc}}</p>
                    <p class="card-text my-1"><b>ОКЗ:</b> {{p.okz}}</p>
            </div>
            <div class="card-footer">
                    <button class="btn btn-warning btn-sm" @click="showInput(p.id)">
                            <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" @click="remove(p.id)">
                            <i class="fa fa-trash-o fa-fw" aria-hidden="true"></i>
                    </button>
            </div>
    </div>

    <button type="button" class="btn btn-success btn-circle btn-float shadow" @click="showInput()">
            <i class="fa fa-plus fa-lg fa-fw" aria-hidden="true"></i>
    </button>

</div>
    `,
    data: function () {
        return {
            professionList: [], // Массив профессий
            profession: {},     // Объект професии
            nextItem: 0,        // Указатель блока данных
            searchString: '',   // Строка для поиска
            isAdd: false,       // Флаг добавления
            timerId: undefined  // Таймер для ввода в поле поиска
        }
    },
    methods: {
        searching: function (e) {
            //console.log(e.target.value)
            if (this.searchString == '') {
                this.nextItem = 0
                this.professionList = []
                return this.get()
            }else{
                if(typeof this.timerId != undefined){
                    clearTimeout(this.timerId)
                }
                this.timerId = setTimeout(this.search, 1000)
            }
        },
        // Поиск
        search: function () {
            fetch("./api/professions/search?text=" + this.searchString, {
                method: 'get',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.professionList = result.data
                    } else {
                        this.$root.showMessage(result.data, result.error);
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Открыть окно ввода
        showInput: function (id) {
            let _profession = this.professionList.find(p => p.id == id)
            if (_profession == undefined) {
                // add
                this.isAdd = true
                this.profession = {}
            } else {
                // update
                this.isAdd = false
                this.profession = JSON.parse(JSON.stringify(_profession))
            }
            $('#professionModal').modal('show')
        },
        // Выполнить операцию из окна ввода
        make: function (id) {
            if (this.isAdd) {
                this.create()
            } else {
                this.update(id)
            }
        },
        // Добавить
        create: function () {
            fetch("./api/professions", {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.profession)
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.profession.id = result.data
                        this.professionList.push(JSON.parse(JSON.stringify(this.profession)))
                        this.professionList.sort(this.sort)
                        $('#professionModal').modal('hide')
                        this.$root.showMessage("Профессия добавлена", false)
                    } else {
                        this.$root.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Обновить
        update: function (id) {
            fetch("./api/professions/" + id, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.profession)
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        let _profession = this.professionList.find(u => u.id == id)
                        let professionIndex = this.professionList.indexOf(_profession)
                        Vue.set(this.professionList, professionIndex, result.data)
                        $('#professionModal').modal('hide')
                        this.$root.showMessage("Профессия обновлена", false)
                    } else {
                        this.$root.showMessage(result.data, result.error);
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Удалить
        remove: function (id) {
            fetch("./api/professions/" + id, {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        let _profession = this.professionList.find(u => u.id == id)
                        let professionIndex = this.professionList.indexOf(_profession)
                        this.professionList.splice(professionIndex, 1)
                        this.$root.showMessage("Профессия удалена", false)
                    } else {
                        this.$root.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Получить часть
        get: function() {
            if (this.searchString == '')
                fetch("./api/professions?item=" + this.nextItem, {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(response => response.json())
                    .then(result => {
                        if (!result.error) {
                            let d = []
                            for (var o of result.data) {
                                if (!this.professionList.find(u => u.id == o.id))
                                    d.push(o)
                            }
                            if (d.length) {
                                this.professionList = this.professionList.concat(d)
                                this.nextItem++
                            }
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
            if ( prev.name.toLowerCase() < next.name.toLowerCase() ) return -1
            if ( prev.name.toLowerCase() < next.name.toLowerCase() ) return 1
        }
    },
    mounted() {
        // При прокрутке до конца страницы еще будут подгружены данные
        let wel = document.getElementById('wrap').parentNode
        wel.addEventListener('scroll', e => {
            if (wel.scrollTop + wel.clientHeight >= wel.scrollHeight) {
                this.get()
            }
        })
        this.get()
    }
}