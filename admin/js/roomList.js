import $ from 'jquery';

$('.del').click(function(e){
    let target = $(e.target);
    let id = target.data('id');
    let tr = $('.item-id-'+ id);

    $.ajax({
        type:'DELETE',
        url:'/admin/room/delete?_id=' + id
    })
        .done(function(results){
            if(results.state ==='success'){
                if(tr.length>0){
                    tr.remove()
                }
            }
        })
});
