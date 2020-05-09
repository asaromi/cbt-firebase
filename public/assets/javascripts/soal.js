let id;

$(document).ready(function () {
    var current = $('.page-soal.active').attr('page');
    var total = $('.page-soal').length;
    console.log(current);
    $('.progress-striped .progress-bar').html(Math.round((Number(current))/total*100)+'%');
});

$('.page-soal').on('click', function(){
    var total = $('.page-soal').length;
    id = Number($(this).attr('page')) - 1;
    changeSoal(id, total);
});

$('.next').on('click', function(){
    var total = $('.page-soal').length;
    var active = Number($('.page-soal.active').attr('page'));
    id = ((active < total-1)? active : total-1);
    changeSoal(id, total);
});

$('.previous').on('click', function(){
    var total = $('.page-soal').length;
    var active = Number($('.page-soal.active').attr('page'))-1;
    id = ((active > 1)? active-1 : 0);
    changeSoal(id, total);
});

$('.finish')

function checkRagu() {
    var current = $('.page-soal').parent().find('.active');
    if ($("input[name='ragu#1']").is(":checked")) {
        current.html('<i class="fa fa-flag"></i>');
    } else {
        current.html(current.attr("page"));
    }
}

function changeSoal(id, total) {
    var before = $('.page-soal').parent().find('.active');
    before.removeClass('active');

    if ($("input[name='jawaban#"+before.attr('page')+"']:checked").val()) {
        before.removeClass('btn-secondary');
        before.addClass('btn-success');
    }

    var progress = $('.page-soal.btn-secondary').length/total*100;
    console.log(progress);

    $('.page-soal').eq(id).addClass('active');
    $('.tab-content').find('.active').removeClass('active');
    $('.tab-pane').eq(id).addClass('active');
    $('.wizard-steps li.active').removeClass('active');
    $('.wizard-steps li').eq(id).addClass('active');
    console.log(id+" "+total);
    $('.progress-striped .progress-bar').css('width',((Number(id)+1)/total*100)+'%');
    $('.progress-striped .progress-bar').html(Math.round((Number(id)+1)/total*100)+'%');
    $('#judul-soal').html("#"+(Number(id)+1));
    $('#isi-soal').html("Soal #"+(Number(id)+1)+" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a adipiscing lectus. Aenean fermentum mauris erat, quis accumsan eros facilisis sed. Nullam convallis arcu nec imperdiet pharetra. Suspendisse sed pharetra orci. Integer elementum augue sed dui sollicitudin, eu molestie leo rutrum. Vestibulum sit amet ullamcorper nunc.");
    checkId(id);
}

function checkId() {
    var total = Number($('.page-soal').length);
    switch (id) {
        case 0:
            console.log("switch id = "+id);
            $('.previous').addClass('disabled');
            if($('.next').hasClass('hidden')){
                $('.finish').addClass('hidden');
                $('.next').removeClass('hidden');
            }
            break;
        
        case total-1:
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