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
            $('.profile-info').attr('data-lock-name',user.displayName);
            $('.profile-info').attr('data-lock-email',user.email);
            document.getElementById("preloader").style.visibility = 'hidden';
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
			text: 'Anda Sudah Keluar',
			type: 'success',
			addclass: 'stack-bar-top',
			stack: stack_bar_top,
			width: "100%"
        });
        window.location.href = "login.html";
    }).catch(function(error) {
        var notice = new PNotify({
            title: 'ERROR',
            text: 'Password yang anda masukkan salah.',
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