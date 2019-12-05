$(document).ready(function(){
    
    if(window.location.hash === "#download" ){
        $('#downloadModal').modal('show');
    }
    
    $('input[name="logo"]').fileuploader();
        
    $('input[name="content"]').fileuploader();
    
    $('input[name="banner"]').fileuploader();
    
    $('input[name="image"]').fileuploader();
});




