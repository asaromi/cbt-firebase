const db = firebase.database();
const auth = firebase.auth();
var login = false;
const stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0};

$('a.btn-danger').on('click', function () {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function (result) {
        db.ref("users").orderByChild("email").equalTo(result.user.email).once("child_added").then(function (snapshot) {
            localStorage.user = JSON.stringify(snapshot.val());
        });
    });
});

if($("input[name='rememberme']").is(':checked')){
    auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
}

function user() {
    db.ref("users").once("value", function(snapshot){
        console.log(snapshot.toJSON());
    });
}

function thisDate() {
    var today = new Date();
    var DD = String(today.getUTCDate()).padStart(2, '0');
    var MM = String(today.getUTCMonth() + 1).padStart(2, '0'); //January is 0!
    var YYYY = today.getUTCFullYear();
    
    var hh = today.getUTCHours();
    var mm = today.getUTCMinutes();
    var ss = today.getUTCSeconds();

    today = YYYY + "-" + MM + "-" + DD;
    return today;
}

function getEmail() {
    var email = $("input[name='email']").val();
    return email;
}

function getPassword() {
    var password = $("input[name='password']").val();
    return password;
}

function signIn(){
    auth.signInWithEmailAndPassword(getEmail(), getPassword()).catch(function(error) {
        console.log('user not found');
    });
}

function register() {
    var lastKey;
    var today = parseInt(thisDate());
    var db_user = db.ref("SBMPN/users");
    db_user.orderByKey().limitToLast(1).on("child_added", function(snapshot) {
        lastKey = parseInt(snapshot.key);
    });

    if(today > lastKey){
        lastKey = today;
    } else {
        lastKey = lastKey + 1;
    }

    var password = window.btoa("login");

    db_user.child(String(lastKey)).set({
        id : String(lastKey),
        nama : "Ke-6",
        email : "hikarihsan@gmail.com",
        password : password
    });
}

function setSession() {
    var email = getEmail();
    var password = getPassword();
    var db_user = db.ref("SBMPN/users");
    db_user.orderByChild("email").equalTo(email).once("child_added", function (snapshot) {
        if(snapshot.exists()){
            var value = snapshot.val();
            console.log(value);
            if(value.password == window.btoa(password)){
                localStorage.id = value.id;
                localStorage.email = value.email;
                localStorage.nama = value.nama;
                if(value.status) {
                    localStorage.status = value.status;
                    location.href = "index.html";
                } else {
                    alert("Email yang Anda masukkan belum terverifikasi. Silahkan hubungi Admin");
                }
            } else {
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
            }
        } else {
            console.log("anjer");
            alert("Email yang Anda masukkan belum terdaftar");
        }
    });
}