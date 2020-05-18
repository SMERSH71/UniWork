const profession_component = {
    template: `
    <div id="wrap" class="mx-3 pt-3">

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
    </div>

</div>
    `,
    data: function () {
        return {
            professionList: [], // Массив профессий
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