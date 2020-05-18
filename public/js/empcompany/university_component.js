const university_component = {
    template: `
<div id="wrap" class="mt-2 mx-3">

    <div class="card card-data mt-3" v-for="u in universityList">
        <h5 class="card-header">
            {{u.full_name}}
        </h5>
        <div class="card-body py-0">
            <p class="card-text my-1"><b>Сокращение:</b> {{u.short_name}}</a></p>
            <p class="card-text my-1"><b>Адрес:</b> <a :href="u.url">{{u.url}}</a></p>
            <p class="card-text my-1"><b>Последнее обновление:</b> {{u.last_update?u.last_update.split('T')[0].split('-').reverse().join('.'):''}}
                <button class="btn btn-primary btn-sm d-none" @click="refresh(u.id)">
                    <i class="fa fa-refresh fa-fw" v-bind:class="{'fa-spin': u.last_update==''}" aria-hidden="true"></i>
                </button>
            </p>
        </div>
        <div class="card-footer">
            <a :href="'./empcompany/universities/' + u.id + '/eduprograms'" title="Учебные программы университета">Учебные программы университета</a>
        </div>
    </div>

</div>
      `,
    data: function () {
        return {
            universityList: [], // Список университетов
            nextItem: 0,        // Указатель блока данных
        }
    },
    methods: {
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
                            o.url = o.url.split('/').splice(0, 3).join('/') // Сокращаем url университета
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