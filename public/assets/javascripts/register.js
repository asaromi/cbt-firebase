const db = firebase.database();
const auth = firebase.auth();
const stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0};

$('a.btn-danger').on('click', function () {
    if($("input[name='agreeterms']").is(':checked')){
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        console.log(provider);
        auth.signInWithPopup(provider).then(function(result){
            var db_user = db.ref("users");
            var lastKey = 0;
            var email = result.user.email;

            db_user.orderByKey().limitToLast(1).once("child_added", function(snapshot) {
                lastKey = parseInt(snapshot.key);
                console.log("Get lastKey = "+lastKey);
                db_user.child(String(lastKey+1)).set({
                    admin : false,
                    email : email,
                }).then(function () {
                    return db_user.child(String(lastKey+1)).once("value");
                }).then(function (snapshot) {
                    sessionStorage.user = JSON.stringify(snapshot.val());
                });
            });
        });
    } 
});

$('button.btn-primary').on('click', function(){
    $(this).attr('disabled', true)
    var email = $("input[name='email']").val();
    var password = $("input[name='pwd']").val();
    var db_user = db.ref("users");
    var lastKey = 0;
    db_user.orderByKey().limitToLast(1).once("child_added", function(snapshot) {
        lastKey = parseInt(snapshot.key);
        console.log("Get lastKey = "+lastKey);
    });

    if ($("input[name='agreeterms']").is(':checked')){
        db_user.child(String(lastKey+1)).set({
            admin : true,
            email : email,
        }).then(function () {
            auth.createUserWithEmailAndPassword(email, password).then(function(){
                alert("User berhasil dibuat");
                auth.signOut();
                // window.location.href = "login.html";
            })
            .catch(function(error) {
                alert(error.message);
                $(this).attr('disabled', false)
            });
        });
    } else {
        var notice = new PNotify({
            title: 'ERROR',
            text: 'Check The Terms to Create Account',
            type: 'error',
            addclass: 'stack-bar-top',
            stack: stack_bar_top,
            width: "100%",
            nonblock: {
                nonblock: true,
                nonblock_opacity: .2
            }
        });
        $(this).attr('disabled', false)
    }
});

function register(){
    var email = $("input[name='email']").val();
    var password = $("input[name='pwd']").val();
    db_user = db.ref("users");
    

    auth.createUserWithEmailAndPassword(email, password).then(function(result) {
        db_user.child(String(lastKey+1)).set({
            admin : true,
            email : email,
        }).then(function () {
            alert("user berhasil dibuat!");
            auth.signOut();
        }); 
    }).catch(function(error) {
        alert(error.message);
    });
}