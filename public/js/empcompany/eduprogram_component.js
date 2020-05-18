const eduprogram_component = {
    template: `
<div id="wrap" class="mx-3 pt-3">

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
  </div>

</div>
    `,
    data: function () {
        return {
            eduprogramList: [], // Массив профессий
            nextItem: 0,        // Указатель блока данных
            searchString: '',   // Строка для поиска
            timerId: undefined  // Таймер для ввода в поле поиска
        }
    },
    methods: {
        searching: function (e) {
            //console.log(e.target.value)
            if (this.searchString == '') {
                this.nextItem = 0
                this.eduprogramList = []
                return this.getEdu()
            } else {
                if (typeof this.timerId != undefined) {
                    clearTimeout(this.timerId)
                }
                this.timerId = setTimeout(this.search, 1000)
            }
        },
        // Поиск
        search: function () {
            let university = ''
            if(this.$route.params.id) {
                university = '&university=' + this.$route.params.id
            }
            fetch("./api/eduprograms/search?text=" + this.searchString + university, {
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
        // Получить часть
        getEdu: function () {
            if (this.searchString != '') return
            
            if(this.$route.params.id){
                this.getId()
            }
            else{
                this.get()
            }
        },        
        get: function () {
            if (this.searchString != '') return
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
        getId: function () {
            if (this.searchString != '') return
                fetch("./api/universities/" + this.$route.params.id + "/eduprograms?item=" + this.nextItem, {
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
                this.getEdu()
            }
        })
        this.getEdu()
    }
}