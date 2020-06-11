/* Add here all your JS customizations */
const db = firebase.database();
const auth = firebase.auth();
const stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0};
const pwd = window.location.pathname;

if (pwd == "/home.html" || pwd == "/soal.html") {
    auth.onAuthStateChanged(function (user) {
        if(user){
            console.log(user);
            $('.profile-info').find('.name').html(user.displayName);
            
            if(JSON.parse(localStorage.user)["admin"])
                $('.profile-info').find('.role').html("admin");

            $('.profile-info').attr('data-lock-name',user.displayName);
            $('.profile-info').attr('data-lock-email',user.email);
            $('figure.profile-picture img').attr('alt', user.displayName);
            $('.preloader').attr('hidden',true);
            console.log(user.photoURL);
            if (user.photoURL) {
                $('figure.profile-picture img').attr('src', user.photoURL);
            }
        } else{
            console.log('no user');
            window.location.href = "login.html";
        }
    });
}

if(pwd == "/500.html"){
    var user = JSON.parse(localStorage.user);
    console.log(user["admin"]);
    if(!user["admin"])
        window.location.href = "/404.html";
}

function getEmail() {
    var email = $("input[type='email']").val();
    return email;
}

function getPassword() {
    var password = $("input[name='password']").val();
    return password;
}

function signOut() {
    auth.signOut().then(function() {
        var notice = new PNotify({
			title: 'SUCCESS',
			text: 'Logout Berhasil. Tunggu sebentar...',
			type: 'success',
			addclass: 'stack-bar-top',
			stack: stack_bar_top,
			width: "100%"
        });
        localStorage.clear();
        window.location.href = "login.html";
    }).catch(function(error) {
        var notice = new PNotify({
            title: 'ERROR',
            text: 'Logout Gagal',
            type: 'error',
            addclass: 'stack-bar-top',
            stack: stack_bar_top,
            width: "100%",
            nonblock: {
                nonblock: true,
                nonblock_opacity: .2
            }
        });
    });
}

function resetPassword() {
    auth.languageCode = 'id';
    auth.sendPasswordResetEmail(getEmail()).then(function() {
        var notice = new PNotify({
			title: 'SUCCESS',
			text: 'Reset Password sudah terkirim. Silahkan cek Emali Anda!',
			type: 'success',
			addclass: 'stack-bar-top',
			stack: stack_bar_top,
			width: "100%"
        });
    }).catch(function(error) {
        var notice = new PNotify({
            title: 'ERROR',
            text: 'Email ',
            type: 'error',
            addclass: 'stack-bar-top',
            stack: stack_bar_top,
            width: "100%",
            nonblock: {
                nonblock: true,
                nonblock_opacity: .2
            }
        });
    });
    // window.location.href = "login.html"
}