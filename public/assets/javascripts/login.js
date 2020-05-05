const db = firebase.database();
var login = false;
const stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0};

function thisDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + mm + dd + "001";
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
    $('')
    var email = getEmail();
    var password = getPassword();
    var db_user = db.ref("SBMPN/users");
    db_user.orderByChild("email").equalTo(email).once("child_added", function (snapshot) {
        if(snapshot.exists()){
            var value = snapshot.val();
            console.log(value);
            if(value.password == window.btoa(password)){
                sessionStorage.id = value.id;
                sessionStorage.email = value.email;
                sessionStorage.nama = value.nama;
                if(value.status) {
                    sessionStorage.status = value.status;
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