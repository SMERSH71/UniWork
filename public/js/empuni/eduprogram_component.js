const eduprogram_component = {
    template: `
<div id="wrap" class="mx-3 pt-3">
<!-- Modal -->
<div class="modal fade" id="eduprogramModal" tabindex="-1" role="dialog"
    aria-labelledby="eduprogramModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="eduprogramModal">Учебная программа</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times</span>
                </button>
            </div>
            <div class="modal-body">
              <p class="card-text my-1"><b>Название:</b>
                  <input type="text" maxlength="128" class="form-control m-0" v-model="eduprogram.name">
              </p>
              <p class="card-text my-1"><b>Код:</b>
                  <input type="text" maxlength="8" class="form-control m-0" v-model="eduprogram.code">
              </p>
              <p class="card-text my-1"><b>Уровень:</b>
                  <input type="text" maxlength="64" class="form-control m-0" v-model="eduprogram.level">
              </p>
              <p class="card-text my-1"><b>Обучающиеся:</b>
                  <input type="number" maxlength="64" class="form-control m-0" v-model="eduprogram.students">
              </p>
              <p class="card-text my-1"><b>Аккредитация:</b>
                  <input type="text" maxlength="16" class="form-control m-0" v-model="eduprogram.date_end">
              </p>
              <p class="card-text my-1"><b>Язык:</b>
                  <input type="text" maxlength="32" class="form-control m-0" v-model="eduprogram.language">
              </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                <button type="button" class="btn btn-primary" @click="make(eduprogram.id)">{{isAdd?'Добавить':'Изменить'}}</button>
            </div>
        </div>
    </div>
</div>

<div class="input-group mb-3">
<div class="input-group-prepend">
  <span class="input-group-text" id="search-addon">
  <i class="fa fa-search fa-fw" aria-hidden="true"></i></span>
</div>
<input type="text" class="form-control" v-model="searchString" @input="searching" placeholder="Название учебной программы" aria-label="Название учебной программы" aria-describedby="search-addon">
</div>

<div class="card card-data mt-3" v-for="ep in eduprogramList">
      <h5 class="card-header">
        {{ep.name}}
      </h5>
      <div class="card-body py-0">
      <p class="card-text my-1"><b>Код:</b> {{ep.code}}</p>
      <p class="card-text my-1"><b>Уровень:</b> {{ep.level}}</p>
      <p class="card-text my-1"><b>Обучающиеся:</b> {{ep.students}}</p>
      <p class="card-text my-1"><b>Аккредитация:</b> {{ep.date_end}}</p>
      <p class="card-text my-1"><b>Язык:</b> {{ep.language}}</p>
      </div>
      <div class="card-footer">
          <button class="btn btn-warning btn-sm" @click="showInput(ep.id)">
              <i class="fa fa-pencil fa-fw" aria-hidden="true"></i>
          </button>
          <button class="btn btn-danger btn-sm" @click="remove(ep.id)">
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
            eduprogramList: [], // Массив профессий
            eduprogram: {},     // Объект професии
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
                this.eduprogramList = []
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
            fetch("./api/eduprograms/search?text=" + this.searchString, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.eduprogramList = result.data
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
            let _eduprogram = this.eduprogramList.find(p => p.id == id)
            if (_eduprogram == undefined) {
                // add
                this.isAdd = true
                this.eduprogram = {}
            } else {
                // update
                this.isAdd = false
                this.eduprogram = JSON.parse(JSON.stringify(_eduprogram))
                //this.eduprogram.date_end = Date(this.eduprogram.date_end)
            }
            $('#eduprogramModal').modal('show')
        },
        // Выполнить операцию из окна ввода
        make: function (id) {
            /*this.eduprogram.date_end = this.eduprogram.date_end.toString()
            console.log(this.eduprogram.date_end)*/
            if (this.isAdd) {
                this.create()
            } else {
                this.update(id)
            }
        },
        // Добавить
        create: function () {
            fetch("./api/eduprograms", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.eduprogram)
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.eduprogram.id = result.data
                        this.eduprogramList.push(JSON.parse(JSON.stringify(this.eduprogram)))
                        this.eduprogramList.sort(this.sort)
                        $('#eduprogramModal').modal('hide')
                        this.$root.showMessage("Учебная программа добавлена", false)
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
            fetch("./api/eduprograms/" + id, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.eduprogram)
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        let _eduprogram = this.eduprogramList.find(u => u.id == id)
                        let eduprogramIndex = this.eduprogramList.indexOf(_eduprogram)
                        Vue.set(this.eduprogramList, eduprogramIndex, result.data)                        
                        $('#eduprogramModal').modal('hide')
                        this.$root.showMessage("Учебная программа обновлена", false)
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
            fetch("./api/eduprograms/" + id, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        let _eduprogram = this.eduprogramList.find(u => u.id == id)
                        let eduprogramIndex = this.eduprogramList.indexOf(_eduprogram)
                        this.eduprogramList.splice(eduprogramIndex, 1)
                        this.$root.showMessage("Учебная программа удалена", false)
                    } else {
                        this.$root.showMessage(result.data, result.error);
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error)
                })
        },
        // Получить часть
        get: function () {
            if (this.searchString == '')
                fetch("./api/eduprograms?item=" + this.nextItem, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(result => {
                        if (!result.error) {
                            let d = []
                            for (var o of result.data) {
                                if (!this.eduprogramList.find(u => u.id == o.id))
                                    d.push(o)
                            }
                            if (d.length) {
                                this.eduprogramList = this.eduprogramList.concat(d)
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
        this.get()
    }
}