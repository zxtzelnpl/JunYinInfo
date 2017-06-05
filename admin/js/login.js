$('#submit').click(function (e) {
    e.preventDefault();
    let name = $('#signInName').val();
    let password = $('#signInPassword').val();
    $.ajax({
        url: '/user/signin'
        , method: 'POST'
        , data: {
            name
            , password
        }
        , success: function (data) {
            if (data.state == 'success') {
                // location.href = '/admin/login';
                alert('登录成功')
            }
            else {
                alert(data.err)
            }
        }
        , error: function (err) {
            alert(err)
        }
    })
});
