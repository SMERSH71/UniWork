const university_component = {
    template: `
<div id="wrap" class="mt-2 mx-3">
    <!-- Modal -->
    <div class="modal fade" id="universityModal" tabindex="-1" role="dialog"
        aria-labelledby="universityModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="universityModal">Университет</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="card-text my-1"><b>Полное название:</b>
                        <input type="text" class="form-control m-0"
                            v-bind:class="{'is-valid': university.full_name!='' & university.full_name!=undefined}"
                            v-model="university.full_name">
                    </p>
                    <p class="card-text my-1"><b>Сокращение:</b>
                        <input type="text" class="form-control m-0"
                            v-bind:class="{'is-valid': university.short_name!='' & university.short_name!=undefined}"
                            v-model="university.short_name">
                    </p>
                    <p class="card-text my-1"><b>Адрес:</b>
                        <input type="url" class="form-control m-0" v-bind:class="{'is-valid': university.url!='' & university.url!=undefined}" v-model="university.url">
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                    <button type="button" class="btn btn-primary" @click="make(university.id)">{{university.id == undefined?'Добавить':'Сохранить'}}</button>
                </div>
            </div>
        </div>
    </div>

    <div class="card card-data mt-3" v-for="u in universityList">
        <h5 class="card-header">
            {{u.full_name}}
        </h5>
        <div class="card-body py-0">
            <p class="card-text my-1"><b>Сокращение:</b> {{u.short_name}}</p>
            <p class="card-text my-1"><b>Адрес:</b> <a :href="u.url">{{u.url}}</a></p>
            <p class="card-text my-1"><b>Последнее обновление:</b> {{u.last_update?u.last_update.split('T')[0].split('-').reverse().join('.'):''}}
                <button class="btn btn-primary btn-sm d-none" @click="refresh(u.id)">
                    <i class="fa fa-refresh fa-fw" v-bind:class="{'fa-spin': u.last_update==''}" aria-hidden="true"></i>
                </button></p>
        </div>
        <div class="card-footer">
            <div>
                <button class="btn btn-warning btn-sm" @click="showInput(u.id)">
                    <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>
                </button>
                <button class="btn btn-danger btn-sm" @click="remove(u.id)">
                    <i class="fa fa-trash-o fa-fw" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>

    <button type="button" class="btn btn-success btn-circle btn-float shadow" @click="showInput()">
        <i class="fa fa-plus fa-lg fa-fw" aria-hidden="true"></i>
    </button>
</div>
      `,
    data: function () {
        return {
            universityList: [], // Список университетов
            university: {},     // Объект университета
            nextItem: 0,        // Указатель блока данных
        }
    },
    methods: {
        showInput: function (id) {
            let uni = this.universityList.find(u => u.id == id)
            if (uni == undefined) {
                // add
                this.university = {}
            } else {
                // update
                this.university = JSON.parse(JSON.stringify(uni))
            }
            $('#universityModal').modal('show')
        },
        make: function (id) {
            if (id == undefined) {
                this.create()
            } else {
                this.update(id)
            }
        },
        // Добавить университет
        create: function (){
            // add
            fetch("./api/universities", {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.university)
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.university.id = result.data
                        this.university.last_update = undefined
                        this.universityList.push(JSON.parse(JSON.stringify(this.university)))
                        $('#universityModal').modal('hide')
                        this.$root.showMessage("Университет добавлен", false)
                    } else {
                        this.$root.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Обновить данные университета
        update: function (id){
            // update
            fetch("./api/universities/" + id, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.university)
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        let uni = this.universityList.find(u => u.id == id)
                        let universityIndex = this.universityList.indexOf(uni)
                        Vue.set(this.universityList, universityIndex, result.data)
                        $('#universityModal').modal('hide')
                        this.$root.showMessage("Университет обновлен", false)
                    } else {
                        this.$root.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Удалить университет
        remove: function (id) {
            // delete
            fetch("./api/universities/" + id, {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        let uni = this.universityList.find(u => u.id == id)
                        let universityIndex = this.universityList.indexOf(uni)
                        this.universityList.splice(universityIndex, 1)
                        this.$root.showMessage("Университет удален", false)
                    } else {
                        this.$root.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Обновить учебные программы университета
        /*refresh: function (id) {
            let uni = this.universityList.find(u => u.id == id)
            let universityIndex = this.universityList.indexOf(uni)
            this.universityList[universityIndex].last_update = ''
            fetch(url + "/api/universities/refresh/" + id, {
                method: 'get',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.universityList[universityIndex].last_update = result.data
                        this.$root.showMessage("Данные обновлены", result.error)
                    } else {
                        this.universityList[universityIndex].last_update = NaN
                        this.$root.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },*/
        // Получить часть университетов
        get: function () {
            fetch("./api/universities?item=" + this.nextItem, {
                method: 'get',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        let d = []
                        for (var o of result.data) {
                            if (!this.universityList.find(u => u.id == o.id))
                                d.push(o)
                        }
                        if (d.length) {
                            this.universityList = this.universityList.concat(d)
                            this.nextItem++
                        }
                    } else {
                        this.$root.showMessage(result.data, result.error);
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error);
                });
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