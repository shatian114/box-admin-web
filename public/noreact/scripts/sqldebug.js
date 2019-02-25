var app = new Vue({
  el: '#app',
  data: {
    SERVER_ADDR: '/common',
    list: [],
    token: localStorage.getItem('token'),
    queryOption: {
      option: '',
    },
    page: 1,
    len: 10,
    total: 0,
  },
  methods: {
    pageChange: function(page) {
      this.page = page;
      this.doQuery();
    },
    pagesizeChange: function(pagesize) {
      this.len = len;
      this.doQuery();
    },
    doQuery: function() {
      $.ajax({
        url: this.SERVER_ADDR + '/api/query/querySqlDebugList',
        method: 'POST',
        // contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: {
          queryMap: JSON.stringify(this.queryOption),
          len: this.len,
          page: this.page,
        },
        headers: {
          token: this.token,
        },
        context: this,
        success: function(res) {
          if (res && res.list && res.list.length) {
            for (var item of res.list) {
              item.showSql = false;
            }
            this.list = res.list;
            this.total = res.totalitem;
          } else {
            this.list = [];
            this.total = 0;
          }
        },
      });
    },
    exceute: function(item) {
      var index = layer.load(1, {
        content: '执行中',
      });
      $.ajax({
        url: this.SERVER_ADDR + '/api/sqldebug/excute',
        method: 'POST',
        dataType: 'json',
        data: {
          id: item.log_id,
        },
        headers: {
          token: this.token,
        },
        context: this,
        success: function(res) {
          item.result = res.data;
          //在这里面输入任何合法的js语句
          layer.close(index);
          layer.open({
            type: 1,
            shadeClose: true,
            area: ['600px', '480px'],
            title: 'SQL执行结果',
            shade: 0.1,
            maxmin: true,
            anim: 1,
            content: '<div class="sql-panel"><div class="sql">' + item.fsql +'</div><div id="jsonview" ></div></div>',
            success: function(layero, index) {
              if ($('#jsonview')) {
                $('#jsonview').JSONView(res.data);
              }
            },
          });
        },
      });
    },
  },
  created: function() {
    this.doQuery();
  },
});
