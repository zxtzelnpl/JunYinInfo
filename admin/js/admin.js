import $ from 'jquery';

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
                location.href = '/admin/login';
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

$('#signOut_ls_999').click(function (e) {
    e.preventDefault();
    $.ajax({
        url: '/user/signout'
        , method: 'GET'
        , success: function (data) {
            console.log(data);
            location.href = '/admin/login';
        }
        , error: function (err) {
            alert(err)
        }
    })
});
