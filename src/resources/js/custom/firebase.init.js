var firebaseConfig = {
    apiKey: "",
    authDomain: "a-b-c.firebaseapp.com",
    databaseURL: "https://a-v-a6e09.firebaseio.com",
    projectId: "a-b-a6e09",
    storageBucket: "a-b-a6e09.appspot.com",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore(app);
firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

firebase.firestore().enablePersistence()
    .catch(function (err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });

// if auth()->user =  admin
let adminList = db
    // .ref('admin/admin/users');
    .collection('admin')
    .doc('admin')
    .collection("users");

let salonList = db.collection('admin')
    .doc('admin')
    .collection("users")
// .get();

let dbMsgs = db.collection('messages')


adminList
    .onSnapshot({includeMetadataChanges: true}, function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === "added") {

                $.getJSON('https://www.hermosaapp.com' + '/api/user/' + change.doc.data().id, function (data) {
                    add_contact(data)
                })


            }
            //
            // var source = snapshot.metadata.fromCache ? "local cache" : "server";
            // console.log("Data came from " + source);
        });
    });

// seen msg
function  seen(element){
    console.log(element)
}


function get_lastMsg(contactDiv){
    let chatGroupId = contactDiv.attr('data-u-id') + '-'+myId+'s'
    let lastMsg = dbMsgs
        .doc(chatGroupId)
        .collection(chatGroupId)
        .orderBy("timestamp",'desc').limit(1)

    lastMsg.onSnapshot({includeMetadataChanges: true}, function (snapshot) {
        snapshot.docChanges().forEach(function (c) {
            if (c.type === 'added') {
                // console.log('fu')
                handle_lastMsg(c.doc.data(),contactDiv);
            }
        })
    });
}

function submitChat(_this) {

    let container = $(_this).parent().parent()
    let $userdata = container.attr('data-user-data');
    let $user = JSON.parse(decodeURIComponent($userdata));

    let msgInput = $(_this).find('input.message');
    let roomId = container.attr('data-u-id') + '-'+myId+'s';
    let time = String(Date.now())

    if (strip(msgInput.val()) !== '') {
        try {
            db.collection('messages').doc(roomId).collection(roomId)
                .doc(time).set({
                content: String((msgInput.val())),
                idTo: String($user.id),
                isRead: false,
                idFrom: myId,
                timestamp: time,
                type: 0,
            });
        } catch (error) {
            this.errorMessage = 'Error - ' + error.message
        }
    }
    msgInput.val('')
}

$(document).on('submit',".chat-form",function () {
    submitChat(this)
});
//
// $('body').on('click','.enter_chat_btn',function () {
//     enterChat(this)
// });


// IF USER LIST CLICK
$('.chat-list').on('click', 'div.chat-user', function () {
    $('.chat-user').removeClass('active');
    $(this).addClass('active');


    // init chat box
    let $user = JSON.parse(decodeURIComponent($(this).attr('data-user-data')));
    var user_avatar = $user.type === 'USER'? '/images/avatar/girl-1.png':'/images/avatar/girl-2.png';


    //generate chat area
    var tmpArea = $('#tmpArea').clone(),
        chat_area_id = 'chat_area_' + $user.id,
        uType = $user.type === 'USER' ? 'u' : 's';

    if (!$('#chat_area_' + $user.id).length) {
        $('#tmpArea').after(tmpArea).show()
            .addClass('chat_area_user')
            .attr('id', chat_area_id)
            .attr('data-u-id', $user.id + uType)
            .attr('data-user-data', encodeURIComponent(JSON.stringify($user)));
    }
    let thisChatArea = $('#' + chat_area_id)

    // init chat area
    $('.chat_area_user').hide();
    $('.chats').html('');
    thisChatArea.show();
    $('#' + chat_area_id + ' .message').focus();


    // console.log($user)
    // -- int user info
    $('#' + chat_area_id + ' ._user_image').attr('src',user_avatar)
    $('#' + chat_area_id + ' ._user_name').text($user.name)
    $('#' + chat_area_id + ' ._user_desc').text($user.package ? $user.package.name : 'CLASSIC')


    let $user_id = $(this).attr('data-u-id');
    // if auth()->user =  admin

    let chatGroupId = $user_id + '-'+myId+'s'
    var msgs = dbMsgs
        .doc(chatGroupId)
        .collection(chatGroupId);
    msgs.onSnapshot({includeMetadataChanges: true}, function (snapshot) {
        let finish = 0;
        snapshot.docChanges().forEach(function (change) {
            if (change.type === "added") {
                enter_chat_firebase(change.doc.data(),chat_area_id)
                finish++;
            }

            if (change.doc.data().isRead == true){
                $(`#read_${change.doc.data().timestamp}`).show()
            }

            // scroll done after all done
            if(finish === (snapshot.docChanges()).length){
                get_lastMsg($('#' + 'contact_'+$user.id))

                if ($('#' + chat_area_id).css('display') === 'block') {
                    $('#' + chat_area_id + " .chat-area").scrollTop($('#' + chat_area_id + " .chat-area > .chats").height());
                    initScripts();
                }
            }
        })
    })



});
