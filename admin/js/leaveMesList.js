import $ from 'jquery';

$('.finish').on('click', function (e) {
    var id = $(e.target).data('id');
    $.ajax({
        type: 'GET',
        url: '/admin/user/finish',
        data: {
            id: id
        },
        success: function (data) {
            if (data.state == 'success') {
                $(e.target).parent().html('<a>已经完成</a>')
            } else {
                alert('连接错误请稍后再试')
            }
        },
        error: function (err) {
            alert('连接错误请稍后再试')
        }
    })
});

$('#excel').on('click', function (e) {
    e.preventDefault();
    var url = $(e.target).attr('href');
    var timeStart = $('#timeStart').val();
    var timeEnd = $('#timeEnd').val();
    url += '?start=' + timeStart + '&end=' + timeEnd;
    window.location.href = url;
});
