const settings_component = {
  template: `
<div class="mx-3">

<div class="card mt-3 shadow">
      <div class="card-header">
        Настройки
      </div>
      <div class="card-body py-0">
      </div>
      <div class="card-footer">
            <button class="btn btn-success btn-icon">
            <span class="icon"><i class="fa fa-save fa-fw" aria-hidden="true"></i></span>Сохранить
            </button>
      </div>
  </div>

</div>
    `,
  data: function () {
      return {
          message: ''
      }
  },
  methods: {
      
  },
  mounted() {
      /*fetch(url + "/api/user", {
          method: 'get',
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      })
          .then(response => response.json())
          .then(result => {
              if (!result.error) {
                  this.userList = result.data;
              } else {
                  message = result.data;
              }
          })
          .catch(function (error) {
              console.log('Request failed', error);
          });*/
  }
}