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
                        <input type="text" maxlength="256" class="form-control m-0" v-model="uni.full_name">
                    </p>
                    <p class="card-text my-1"><b>Сокращение:</b>
                        <input type="text" maxlength="16" class="form-control m-0" v-model="uni.short_name">
                    </p>
                    <p class="card-text my-1"><b>URL:</b>
                        <input type="url" maxlength="256" class="form-control m-0" v-model="uni.url">
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                    <button type="button" class="btn btn-primary" @click="update()">Сохранить</button>
                </div>
            </div>
        </div>
    </div>

    <div class="card card-data mt-3">
        <h5 class="card-header">
            {{university.full_name}}
        </h5>
        <div class="card-body py-0">
            <p class="card-text my-1"><b>Сокращение:</b> {{university.short_name}} </p>
            <p class="card-text my-1"><b>Адрес:</b> <a :href="university.url">{{university.url}}</a></p>
            <p class="card-text my-1"><b>Последнее обновление:</b> {{university.last_update?university.last_update.split('T')[0].split('-').reverse().join('.'):''}}
                <button class="btn btn-primary btn-sm" @click="refresh(university.id)" title="Обновить учебные программы">
                    <i class="fa fa-refresh fa-fw" v-bind:class="{'fa-spin': university.last_update==''}" aria-hidden="true"></i>
                </button>
            </p>
        </div>
        <div class="card-footer">
            <div>
                <button class="btn btn-warning btn-sm" @click="showInput()" title="Изменить">
                    <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>

</div>
      `,
    data: function () {
        return {
            university: {},     // Объект университета
            uni: {}
        }
    },
    methods: {
        showInput: function () {
            this.uni = JSON.parse(JSON.stringify(this.university))
            $('#universityModal').modal('show')
        },
        // Обновить данные университета
        update: function () {
            fetch("./api/university", {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.uni)
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.university = result.data
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
        // Обновить учебные программы университета
        refresh: function () {
            this.university.last_update = ''
            fetch("./api/university/refresh", {
                method: 'get',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.university.last_update = result.data
                        this.$root.showMessage("Данные обновлены", result.error)
                    } else {
                        this.university.last_update = undefined
                        this.$root.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Получить университет
        get: function () {
            fetch("./api/university", {
                method: 'get',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.university = result.data
                    } else {
                        this.$root.showMessage(result.data, result.error);
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error);
                })
        }
    },
    mounted() {
        this.get()
    }
}