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

function checkRagu() {
    var current = $('.page-soal').parent().find('.active');
    if ($("input[name='ragu#1']").is(":checked")) {
        current.removeClass('btn-secondary');
        current.addClass('btn-warning');
    } else {
        current.removeClass('btn-warning');
        current.addClass('btn-secondary');
    }
}

function changeSoal(id, total) {
    var before = $('.page-soal').parent().find('.active');
    before.removeClass('active');

    if (!$("input[name='jawaban#"+before.html()+"']:checked").val()) {
        before.removeClass('btn-secondary');
        before.addClass('btn-warning');
    } else {
        before.removeClass('btn-warning');
        before.addClass('btn-secondary');
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
    $('.progress-striped .progress-bar').html(((Number(id)+1)/total*100)+'%');
    $('#judul-soal').html("#"+(Number(id)+1));
    $('#isi-soal').html("Soal #"+(Number(id)+1)+" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a adipiscing lectus. Aenean fermentum mauris erat, quis accumsan eros facilisis sed. Nullam convallis arcu nec imperdiet pharetra. Suspendisse sed pharetra orci. Integer elementum augue sed dui sollicitudin, eu molestie leo rutrum. Vestibulum sit amet ullamcorper nunc.");
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