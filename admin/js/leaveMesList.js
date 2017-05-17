import $ from 'jquery';

$('.pagination').on('click','li',function(e){
    var page=$(e.target).data('page');

});
