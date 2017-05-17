import $ from 'jquery';
let pic=document.getElementById('pic');
let img=document.getElementById('img');
let reader=new FileReader();
reader.onload=function(e){
    console.log(e);
    img.src=e.target.result;
};
pic.onchange=function(e){
    console.log(e);
    console.log(e.target.files);
    reader.readAsDataURL(e.target.files[0]);
    // img.src=e.target.value;
};

// let reader=new FileReader();
// reader.onload=function(e){
//     console.log(e)
// };
