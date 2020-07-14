const db_set = firebase.database().ref('setting');
const store = firebase.storage().ref();

var file;
var str;
var ref;
var lastKey = 0;
var imageTitle = false;
var chooseImage = false;
var tipe = "radiogroup";
var imageURL;
var name;
var judul;
var correct;
var pilihan = [];
var linkAnswer = [];
var id;
var selector;

firebase.database().ref('dummy-soal').orderByKey().limitToLast(1).once("child_added", function(snapshot) {
    lastKey = parseInt(snapshot.key);
    name = "soal-"+String(lastKey+2);
    var a = $('textarea').prop('placeholder')+name;
    $('textarea').prop('placeholder', a);
    console.log("Get lastKey = "+lastKey);
}).catch(function(error){
	name = "soal-"+String(lastKey+2);
    var a = $('textarea').prop('placeholder')+name;
    $('textarea').prop('placeholder', a);
    console.log("Get lastKey = "+lastKey);
});

db_set.orderByKey().on('value', function (shot) {
    var setting = shot.val();
    // console.log('disini lagi ngambil data setting');
    $('tbody.log-viewer tr:eq(0)').find('td:eq(1)').html(setting.tanggal);
    $('tbody.log-viewer tr:eq(1)').find('td:eq(1)').html(setting.timer);

    $('#preloader').attr('hidden',true);
});

$('a.btn-info').on('click', function(){
	var timer = $('input[name="timer"]');
	var tanggal = $('input[name="tanggal"]');
	if(tanggal.val() && timer.val())
		db_set.update({ tanggal : tanggal.val(), timer : timer.val() }).then( function(){ alert("Tanggal dan Timer berhasil diedit") } );
	else if(tanggal)
		db_set.update({ tanggal : tanggal.val()}).then( function(){ alert("Tanggal berhasil diedit") } )
	else
		db_set.update({ timer : timer.val() }).then( function(){ alert("Tanggal berhasil diedit") } )
	tanggal.val("");
	timer.val("");
})

$(document).ready(function() {
	$('#imageTitle').prop('checked', false);
	$('input[type="file"]').val("");
	$('input[type="text"]').val("");
	$('input[type="number"]').val("");
	$('input[type="checkbox"]').val("");
	$('input[name="tipe-jawaban"]:eq(0)').prop('checked', true);
    //set initial state.
    $('#imageTitle').change(function() {
        if(this.checked) {
            $(this).prop("checked");
            $('#form-upload').attr("hidden", false);
            imageTitle = true;
        } else {
            $('#form-upload').attr("hidden", true);
            imageTitle = false;
        }
    });
});

function readURL(input, selector) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function(e) {
			$(selector).attr('src', e.target.result);
			console.log('cek. masuk tambah src');
		}

		reader.readAsDataURL(input.files[0]); // convert to base64 string
	}
}

$("#image").change(function() {
	console.log('cek. masuk change. ini ada name : '+name);
	selector = "imagePreview";
	console.log("#"+selector);
	readURL(this, "#"+selector);

	file = this.files[0];
	str = file.type.split("/");

	ref = store.child("soal/"+name+"."+str[1]);
	ref.getDownloadURL().then(function(url) {
		ref.delete().then(function(){
			upload(file, ref);
		});
	}).catch(function(error){
		upload(file, ref);
	});
});

$(".imageChoices").change(function(){
	id = $(this).attr('choices');
	uploadJawaban(this, id);
});

function uploadJawaban(input, id) {
	console.log('cek. masuk change. ini ada name : '+name);
	selector = "imageChoices"+id;
	console.log("#"+selector);
	readURL(input, "#"+selector);

	file = input.files[0];
	str = file.type.split("/");

	ref = store.child("jawaban/"+name+"_"+id+"."+str[1]);
	ref.getDownloadURL().then(function(url) {
		ref.delete().then(function(){
			upload(file, ref);
		});
	}).catch(function(error){
		upload(file, ref);
	});
}

function upload(file){
	ref.put(file).then(function(snapshot) {
		ref.getDownloadURL().then(function(url){
			// upload soal
			if(selector === "imagePreview"){
				imageURL = url;
				console.log(imageURL);
			}

			//upload jawaban
			else {
				if(linkAnswer[id-1]){
					linkAnswer.splice(id-1,1);
				}
				var x = { value: id, text: "!["+selector+"]("+url+")" }
				linkAnswer.push(x);
				console.log(linkAnswer);
			}
		}).catch(function(error){
			console.log(error.message);
		});
	}).catch(function(error){
		console.log(error.message);
	});
}

$('#buat-soal').on('click', function(){
	judul = $('textarea[name="title"]').val();
	
	if(tipe==="radiogroup"){
		for (var i = 0; i < ($('#jawaban1 input[type="text"]').length); i++) {
			var text = $('#pilihan-'+(i+1)).val();
			var anu = {
				text : text,
				value : (i+1)
			}
			console.log(anu);
			pilihan.push(anu);
		}
	} else {
		pilihan = linkAnswer;
	}

	if(imageTitle)
		judul += "<br>!["+name+"]("+imageURL+")";

	firebase.database().ref('dummy-soal').child(String(lastKey+1)).set({
        name: name,
        title: judul,
        choices: pilihan,
        correctAnswer: correct,
        type: "radiogroup",
        choicesOrder: "random",
    }).then(function(){
    	var k = "name: "+name;
    	k += "\ntitle: "+judul;
    	k += "\nchoices: "+pilihan;
    	k += "\ncorrectAnswer: "+correct;
    	k += "\ntype: "+tipe;
    	console.log(k);
    	alert('Soal sudah dibuat, untuk melihat preview nya silahkan ke halaman Pengerjaan Soal');
    	location.reload();
	}).catch(function(error){
		console.log(error.message);
	});
});

$('input[name="tipe-jawaban"]').change(function(){
    if($('input[name="tipe-jawaban"]:checked').val() === "0"){
    	chooseImage = false;
    	tipe = "radiogroup";
    	console.log("type : "+tipe);
    	$('#jawaban2').attr('hidden', true);
    	$('#jawaban1').attr('hidden', false);
    } else{
    	chooseImage = true;
    	tipe = "imagepicker";
    	console.log("type : "+tipe);
    	$('#jawaban1').attr('hidden', true);
    	$('#jawaban2').attr('hidden', false);
    }
});

$('input[name="correct"]').change(function() {
	correct = $('input[name="correct"]:checked').val();
	if(tipe==="imagepicker"){
		if(linkAnswer.length < 5){
			alert('selesaikan upload pilihan ganda dulu');
		}
		for (var i = 0; i < linkAnswer.length; i++) {
			console.log("value: "+(i+1)+"\nimageLink "+linkAnswer[i]);
		}
	}
	// judul = $('textarea[name="title"]').val();
	// for (var i = 0; i < ($('#jawaban1 input[type="text"]').length); i++) {
	// 	var text = $('#pilihan-'+(i+1)).val();
	// 	var anu = {
	// 		text : text,
	// 		value : (i+1)
	// 	}
	// 	console.log(anu);
	// 	pilihan.push(anu);
	// }
	// if(imageTitle)
	// 	judul += " !["+name+"]("+imageURL+")";
	// console.log(judul);
});