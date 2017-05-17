import $ from 'jquery'

const socket = io();
let trs = $('[class^=item-id]');

$('.del').click(function (e) {

    let target = $(e.target);
    let id = target.data('id');
    let tr = $('.item-id-' + id);

    if(tr.find('.change').html()==='禁用'){
        alert('先将用户禁用才能删除');
        return;
    }

    $.ajax({
        type: 'DELETE',
        url: '/admin/user/delete?id=' + id
    })
        .done(function (results) {
            if (results.state === 'success') {
                if (tr.length > 0) {
                    tr.remove()
                }
            }
        })
});

$('.change').click(function (e) {
    let target = $(e.target);
    let id = target.data('id');
    let word=target.html();
    if(word==='禁用'){
        if(confirm('确认是否'+word)){
            $.ajax({
                type: 'GET',
                url: '/admin/user/forbidden?id=' + id
            })
                .done(function (results) {
                    if (results.state === 'success') {
                        if (results.forbidden) {
                            target.removeClass('btn-warning').addClass('btn-success').html('解禁');
                        } else {
                            target.removeClass('btn-success').addClass('btn-warning').html('禁用');
                        }
                    }
                })
        }
    }else{
        $.ajax({
            type: 'GET',
            url: '/admin/user/forbidden?id=' + id
        })
            .done(function (results) {
                if (results.state === 'success') {
                    if (results.forbidden) {
                        target.removeClass('btn-warning').addClass('btn-success').html('解禁');
                    } else {
                        target.removeClass('btn-success').addClass('btn-warning').html('禁用');
                    }
                }
            })
    }
});

socket.on('usersAdd', function (id) {
    let queryClass = ".item-id-" + id;
    $(queryClass).children().eq(10).html('在线');
});

socket.on('usersMinus', function (id) {
    let queryClass = ".item-id-" + id;
    $(queryClass).children().eq(10).html('离线');
});
