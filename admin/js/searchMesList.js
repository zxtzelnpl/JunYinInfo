import $ from 'jquery';

$('.pagination').on('click','li',function(e){
    var page=$(e.target).data('page');
    var form=$('#form');
    var url=form.attr('action').slice(0,-1);
    form.attr('action',url+page);
    form.submit();

});
