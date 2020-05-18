const usettings_component = {
    template: `
<div class="mx-3">

<div class="card mt-3">
      <div class="card-header">
        Настройки
      </div>
      <div class="card-body py-0">
        <div class="form-group">
        <label for="formGroupExampleInput2">Имя</label>
        <input type="text" class="form-control" id="formGroupExampleInput2" v-model="usettings.name">
        </div>
        <div class="form-group">
        <label for="formGroupExampleInput3">Фамилия</label>
        <input type="text" class="form-control" id="formGroupExampleInput3" v-model="usettings.surname">
        </div>
        <div class="form-group">
        <label for="formGroupExampleInput4">Отчество</label>
        <input type="text" class="form-control" id="formGroupExampleInput4" v-model="usettings.patronymic">
        </div>
        <div class="form-group">
        <label for="formGroupExampleInput5">Организация</label>
        <input type="text" class="form-control" id="formGroupExampleInput5" v-model="usettings.organization">
        </div>
        <div class="form-group">
        <label for="formGroupExampleInput6">Должность</label>
        <input type="text" class="form-control" id="formGroupExampleInput6" v-model="usettings.position">
        </div>
        <div class="form-group">
        <label for="formGroupExampleInput7">Старый пароль</label>
        <input type="password" class="form-control" id="formGroupExampleInput7" v-model="usettings.oldpassword">
        </div>
        <div class="form-group">
        <label for="formGroupExampleInput8">Новый пароль</label>
        <input type="password" class="form-control" id="formGroupExampleInput8" v-model="usettings.newpassword">
        </div>
        <div class="form-group">
        <label for="formGroupExampleInput9">Повторите новый пароль</label>
        <input type="password" class="form-control" id="formGroupExampleInput9" v-model="usettings.testpassword">
        </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-success btn-icon" @click="save">
            <span class="icon"><i class="fa fa-save fa-fw" aria-hidden="true"></i></span>Сохранить
            </button>
        </div>
  </div>

</div>
    `,
    data: function () {
        return {
            usettings: {}
        }
    },
    methods: {
        save: function () {
            fetch("./api/user", {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.usettings)
            })
                .then(response => response.json())
                .then(result => {
                    this.usettings = result.data
                    this.$root.userName = result.data.name + " " + result.data.surname
                    this.$root.showMessage('Данные обновлены', result.error)
                })
                .catch(function (error) {
                    console.log('Request failed', error);
                });
        },
        get: function () {
            fetch("./api/user", {
                method: 'get',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.usettings = result.data
                    } else {
                        this.$root.showMessage(result.data, result.error)
                    }
                })
                .catch(function (error) {
                    console.log('Request failed', error);
                });
        }
    },
    mounted() {
        this.get()
    }
}