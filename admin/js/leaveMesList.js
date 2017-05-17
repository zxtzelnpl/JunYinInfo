import $ from 'jquery';

$('.pagination').on('click','li',function(e){
    var page=$(e.target).data('page');
    var form=$('#form');
    form.attr('action','/admin/leavemes/'+page);
    form.submit();

});
