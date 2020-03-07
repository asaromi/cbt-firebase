var db = firebase.database();
var login = false;

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
    var email = getEmail();
    var password = getPassword();
    var db_user = db.ref("SBMPN/users");
    db_user.orderByChild("email").equalTo(email).once("child_added", function (snapshot) {
        var value = snapshot.val();
        console.log(value);
        if(value.password == window.btoa(password)){
            sessionStorage.id = value.id;
            sessionStorage.email = value.email;
            sessionStorage.nama = value.nama;
            if(value.status) {
                sessionStorage.status = value.status;
                alert("Anda berhasil Login \nEmail : "+ sessionStorage.email + "\nID : " + sessionStorage.id);
                location.href = "index.html";
            }
        } else {
            alert("Password yang anda masukkan salah");
        }
    });
}

function setLogin(){
    var a = setSession();

    if(a) {
        alert("Anda berhasil Login \nEmail : "+ sessionStorage.email + "\nID : " + sessionStorage.id);
        location.href = "index.html";
    } else {
        alert("Anda belum terdaftar sebagai user aktif.\n Jika sudah daftar dan masih tidak bisa login, silahkan hubungi admin.");
    }
}