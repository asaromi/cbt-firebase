let id;

$('.page-soal').on('click', function(){
    var total = $('.page-soal').length;
    id = this.innerHTML-1;
    changeSoal(id, total);
});

$('.next').on('click', function(){
    var total = $('.page-soal').length;
    id = (($('.page-soal.active').html() < total-1)?$('.page-soal.active').html() : total-1);
    changeSoal(id, total);
});

$('.previous').on('click', function(){
    var total = $('.page-soal').length;
    var active = Number($('.page-soal.active').html())-1;
    id = ((active > 1)? active-1 : 0);
    changeSoal(id, total);
});

function changeSoal(id, total) {
    $('.page-soal').parent().find('.active').removeClass('active');
    $('.page-soal').eq(id).addClass('active');
    $('.tab-content').find('.active').removeClass('active');
    $('.tab-pane').eq(id).addClass('active');
    $('.wizard-steps li.active').removeClass('active');
    $('.wizard-steps li').eq(id).addClass('active');
    console.log(id+" "+total);
    $('.progress-striped .progress-bar').css('width',((Number(id)+1)/total*100)+'%');
    checkId(id);
}

function checkId() {
    switch (id) {
        case 0:
            console.log("switch id = "+id);
            $('.previous').addClass('disabled');
            if($('.next').hasClass('hidden')){
                $('.finish').addClass('hidden');
                $('.next').removeClass('hidden');
            }
            break;
        
        case 3:
            console.log("switch id = "+id);
            $('.previous').removeClass('disabled');
            $('.next').addClass('hidden');
            $('.finish').removeClass('hidden');
            break;
    
        default:
            console.log("switch id = "+id);
            $('.previous').removeClass('disabled');
            if($('.next').hasClass('hidden')) {
                $('.finish').addClass('hidden');
                $('.next').removeClass('hidden')
            }
            break;
    }    
}