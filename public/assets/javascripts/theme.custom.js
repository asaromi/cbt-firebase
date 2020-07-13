/* Add here all your JS customizations */
const db = firebase.database();
const auth = firebase.auth();
const stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0};
const pwd = window.location.pathname;

var users;

    auth.onAuthStateChanged(function(user) {
        if(user){
            if(!user.displayName && sessionStorage.name){
                console.log("Berhasil masuk sini");
                user.updateProfile({
                    displayName : sessionStorage.name,
                }).then(function(){
                    user.sendEmailVerification().then(function(){
                        alert("Silahkan verifikasi akun melalui email dan konfirmasi ke wa.me/...");
                        auth.signOut();
                    }).catch(function(error){
                        alert(error.message);
                    });;
                }).catch(function(error){
                    alert(error.message);
                });
            }

            else {
                if(JSON.parse(sessionStorage.user)["admin"]) {
                    $('.profile-info').find('.role').html("admin");
                } else {
                    $('.nav-main').find('.admin').css('display', 'none');
                }

                console.log("Gagal Masuk sini");
                
                if(pwd !== '/users.html' && pwd !== "/quiz.html")
                    $('#preloader').attr('hidden',true);

                $('.profile-info').find('.name').html(user.displayName);
                $('.profile-info').attr('data-lock-name', user.displayName);
                $('.profile-info').attr('data-lock-email', user.email);

                $('.profile-user').find('.name').html(user.displayName);
                $('.profile-user').find('.email').html(user.email);

                $('figure.profile-picture img').attr('alt', user.displayName);
                $('figure.profile-picture img').attr('src', '/assets/images/!logged-user.jpg');
            }
            
        } else{
            console.log('no user');
            window.location.href = "login.html";
        }
    });

/* FOR admin.html */
if(pwd == "/users.html"){
    db.ref('users').orderByKey().on('value', function(shot){
        users = snapshotToArray(shot);
        if(users){
            $('#myTable').DataTable({
                data : users,
                bDestroy : true,
                columns : [
                { title : "Id" },
                { title : "Name" },
                { title : "Email" },
                { title : "Verif" },
                { title : "Action", width : "28%" },
                ],
                columnDefs : [
                { className: "text-center", targets: [0,3,4] },
                ]
            })
            $('#preloader').attr('hidden', true);
        }

        $('td').find('.btn-success').on('click', function(){
            console.log("klik verifikasi user");
            var btn = $(this);
            btn.attr('disabled', true);
            var id = btn.attr('user');
            db.ref("users").child(id).update({
                verified : true,
            }).then( function(){ alert('User sudah terverifikasi');} )
            .catch(function(error){ alert(error.message) });
        });

        $('td').find('.btn-danger').on('click', function(){
            console.log("klik matikan user");
            var btn = $(this);
            btn.attr('disabled', true);
            var id = btn.attr('user');
            db.ref("users").child(id).update({
                verified : false,
            }).then( function(){ alert('User sudah terverifikasi');} )
            .catch(function(error){ alert(error.message) });
        });

        $('td').find('.btn-primary').on('click', function(){
            console.log("klik jadikan admin");
            var btn = $(this);
            btn.attr('disabled', true);
            var id = btn.attr('user');
            db.ref("users").child(id).update({
                verified : true,
            }).then( function(){ alert('Role Admin telah ditambahkan pada User');} )
            .catch(function(error){ alert(error.message) });
        });

        $('td').find('.btn-danger').on('click', function(){
            console.log("klik matikan admin");
            var btn = $(this);
            btn.attr('disabled', true);
            var id = btn.attr('user');
            db.ref("users").child(id).update({
                verified : false,
            }).then( function(){ alert('Role Admin telah dihapus dari User');} )
            .catch(function(error){ alert(error.message) });
        });
    });

    if(!sessionStorage.user){
        window.location.href = "/404.html";
    } else {
        var user = JSON.parse(sessionStorage.user);
        console.log(user["admin"]);
        if(!user["admin"])
            window.location.href = "/404.html";
    }
}

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = [];
        item.push(childSnapshot.key);
        item.push(childSnapshot.val()["name"]);
        item.push(childSnapshot.val()["email"]);
        var action;
        if(!childSnapshot.val()["verified"]){
            item.push('<td class="verified text-center"><i class="fa fa-times" style="color : #d2322d"></i></td>');
            action = '<td class="text-center"><button user="'+childSnapshot.key+'" class="btn btn-success"><i class="fa fa-check"></i> Aktifkan</button>';
        } else{
            item.push('<td class="verified text-center"><i class="fa fa-check" style="color : #47a447"></i></td>');
            action = '<td class="text-center"><button user="'+childSnapshot.key+'" class="btn btn-danger"><i class="fa fa-times"></i> Matikan</button>';
        }

        if(!childSnapshot.val()["admin"])
            action = action+' <button user="'+childSnapshot.key+'" class="btn btn-primary"><i class="fa fa-key"></i> Jadikan Admin</button></td>';
        else
            action = action+' <button user="'+childSnapshot.key+'" class="btn btn-warning"><i class="fa fa-key"></i> Matikan Admin</button></td>';

        item.push(action);

        returnArr.push(item);
    });

    return returnArr;
};
    

function getEmail() {
    var email = $("input[type='email']").val();
    return email;
}

function getPassword() {
    var password = $("input[name='password']").val();
    return password;
}

function signOut() {
    sessionStorage.clear();
    auth.signOut().then(function() {
        var notice = new PNotify({
			title: 'SUCCESS',
			text: 'Logout Berhasil. Tunggu sebentar...',
			type: 'success',
			addclass: 'stack-bar-top',
			stack: stack_bar_top,
			width: "100%"
        });
        sessionStorage.clear();
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
            text: error.message,
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

// function check() {
//     auth.languageCode = 'id';
//     var email = getEmail();
//     var actionCodeSettings = {
//         url : 'https://asaromi-dev.web.app/?email='+email,
//         handleCodeInApp : true,
//     }

//     auth.sendSignInLinkToEmail(email, actionCodeSettings).then(function(){
//         alert('Verification Link has been sent to your email');
//     });
// }