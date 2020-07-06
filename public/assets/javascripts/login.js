const db = firebase.database();
const auth = firebase.auth();
var login = false;
const stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0};

$('a.btn-danger').on('click', function () {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function (result) {
        db.ref("users").orderByChild("email").equalTo(result.user.email).once("child_added").then(function (snapshot) {
            sessionStorage.user = JSON.stringify(snapshot.val());
        });
    });
});

if($("input[name='rememberme']").is(':checked')){
    auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
} else {
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
}

function getEmail() {
    var email = $("input[name='email']").val();
    return email;
}

function getPassword() {
    var password = $("input[name='password']").val();
    return password;
}

$('button.btn-primary').on('click', function (){
    db.ref("users").orderByChild("email").equalTo(getEmail()).once("child_added").then(function (snapshot) {
        sessionStorage.user = JSON.stringify(snapshot.val());
        auth.signInWithEmailAndPassword(getEmail(), getPassword()).then(function (result) {
            console.log(result.user);
            if(!result.user.emailVerified){
                alert("User belum terverifikasi. Silahkan hubungi admin ke wa.me/....");
                auth.signOut();
            } else {
                window.location.href = "home.html";
            }
        })
        .catch(function(error) {
            alert(error.message);
        });
    });
});

function check(){
    db.ref("users").orderByChild("email").equalTo(getEmail()).once("child_added").then(function (snapshot) {
        console.log(snapshot.val());
        console.log(snapshot.val()["admin"]);
    }).catch(function(error){
        alert(error.message);
    });
}