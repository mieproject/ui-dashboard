function initScripts() {
    $('.materialboxed').materialbox();


    // Sidenav
    if ($(window).width() > 900) {
        $("#chat-sidenav").removeClass("sidenav");
    }

    // Pefectscrollbar for sidebar and chat area
    if ($(".sidebar-chat").length > 0) {
        var ps_sidebar_chat = new PerfectScrollbar(".sidebar-chat", {
            theme: "dark"
        });
    }

    // if ($(".chat-area").length > 0) {
    //    var ps_chat_area = new PerfectScrollbar(".chat-area", {
    //       theme: "dark"
    //    });
    // }

    // Close other sidenav on click of any sidenav
    $(".sidenav-trigger").on("click", function () {
        if ($(window).width() < 960) {
            $(".sidenav").sidenav("close");
            $(".app-sidebar").sidenav("close");
        }
    });



    // Toggle class of sidenav
    $("#chat-sidenav").sidenav({
        onOpenStart: function () {
            $("#sidebar-list").addClass("sidebar-show");
        },
        onCloseEnd: function () {
            $("#sidebar-list").removeClass("sidebar-show");
        }
    });

    // Favorite star click
    $(".favorite i").on("click", function () {
        $(this).toggleClass("amber-text");
    });

    // For chat sidebar on small screen
    if ($(window).width() < 900) {
        $(".app-chat .sidebar-left.sidebar-fixed").removeClass("animate fadeUp animation-fast");
        $(".app-chat .sidebar-left.sidebar-fixed .sidebar").removeClass("animate fadeUp");
    }

    // chat search filter
    $("#chat_filter").on("keyup", function () {
        $('.chat-user').css('animation', 'none')
        var value = $(this).val().toLowerCase();
        if (value != "") {
            $(".sidebar-chat .chat-list .chat-user").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
            var tbl_row = $(".chat-user:visible").length; //here tbl_test is table name

            //Check if table has row or not
            if (tbl_row == 0) {
                if (!$(".no-data-found").hasClass('show')) {
                    $(".no-data-found").addClass('show');
                }
            }
            else {
                $(".no-data-found").removeClass('show');
            }
        }
        else {
            // if search filter box is empty
            $(".sidebar-chat .chat-list .chat-user").show();
        }
    });



    // $(".chat-area").scrollTop($(".chat-area > .chats").height());
    // for rtl
    if ($("html[data-textdirection='rtl']").length > 0) {
        // Toggle class of sidenav
        $("#chat-sidenav").sidenav({
            edge: "right",
            onOpenStart: function () {
                $("#sidebar-list").addClass("sidebar-show");
            },
            onCloseEnd: function () {
                $("#sidebar-list").removeClass("sidebar-show");
            }
        });
    }
}
$(document).ready(function () {
   "use strict";

    initScripts()

});



// Add message to chat
function enter_chat_firebase(source,chat_area_id) {
    let another  = (source.idFrom === myId ? false : true);
    let dir = another ? '':'chat-right';

    // var user_avatar  = data.type === 'USER'? '/images/avatar/girl-1.png':'/images/avatar/girl-2.png';
    let avatar = another ? '/images/avatar/girl-1.png' : app_logo;
    let message = strip(source.content);

    // console.log('#'+chat_area_id,source)
    if (source.type === 1) {
        message = `<a href="${source.content}" target="_blank"><img class="" src="${(source.content)}"></a>`;
    }else if (source.type === 2){
        message = '';
        JSON.parse(source.content).forEach(function (img,index){
                message += `<span class="col s4 img_cont border-danger border-1"><a href="${img}" target="_blank"><img class="col s4"  alt="image" src="${img}"></span></a>`;
        });
    }
    if ($('#'+ chat_area_id + ' #'+chat_area_id +'_'+ source.timestamp).length === 0){
        if (message !== "") {
            var html = '<div class="chat-text '+ chat_area_id + 'msg' +'" id="'+ chat_area_id +'_'+ source.timestamp +'">' + "<p>"+
                `<span style="display: none" id="read_${source.timestamp}" class='seen'>&#10003;</span>`
                + (message) +
                `<span class="msg_time   font-size-small" style=" display: block; font-size: 10px !important; " id="">${moment(source.timestamp,'x').format('h:mm a')}</span> `+
                "</p>"
                + "</div>";

            if ($('#'+chat_area_id+" .chat:last-child .chat-body").length === 0){
                let $first = `<div class="chat ${dir}">
                      <div class="chat-avatar">
                        <a class="avatar">
                          <img src="${avatar}" class="circle" alt="avatar" />
                        </a>
                      </div>
                      <div class="chat-body">

                      </div>
                    </div>`
                $('#'+chat_area_id+" .chat-area > .chats").append($first);
            }
            if (another === true && !($(".chat:last-child").hasClass('chat-right'))) {
                $('#'+chat_area_id+" .chat:last-child .chat-body").append(html);
            }else if (another !== true && ($(".chat:last-child").hasClass('chat-right'))){
                $('#'+chat_area_id+" .chat:last-child .chat-body").append(html);
            } else  {
                // console.log('3')
                var container =  `<div class="chat ${dir}">
                      <div class="chat-avatar">
                        <a class="avatar">
                          <img src="${avatar}" class="circle" alt="avatar" />
                        </a>
                      </div>
                      <div class="chat-body">
                        ${html}
                      </div>
                    </div>`;
                $('#'+chat_area_id+" .chat-area > .chats").append(container);
            }

            if ($('#' + chat_area_id).css('display') === 'block') {
                if (source.idFrom === myId) {
                    $('#' + chat_area_id + " .message").val("");
                }
                $('#'+ chat_area_id + " .chat-area").scrollTop($('#' + chat_area_id + " .chat-area > .chats").height());
            }else {
                $(" .info-section").append(`<span class="badge badge pill red">1</span>`)
            }

        }
    }
}




// Add Contact to chat
function handle_lastMsg(data,contactDiv){

    let $userdata = contactDiv.attr('data-user-data');
    let $user = JSON.parse(decodeURIComponent($userdata));
    // console.log($user.name)
    // console.log(moment(data.timestamp))
    contactDiv.addClass('time_edit')
   contactDiv.find('.time').html(`<span>${moment(data.timestamp, "x").calendar()}</span>`);
   contactDiv.find('.info-text').html(data.type == 0 ? `<span>${data.idFrom === myId ? '': ''} ${data.content}</span>`: `<span><i class="material-icons">image</i></span>`);
}

function add_contact(data) {
    var uType = data.type === 'USER'? 'u':'s';
    var user_avatar = data.type === 'USER'? '/images/avatar/girl-1.png':'/images/avatar/girl-2.png';
    var html = `<div class="chat-user animate fadeUp delay-1" id="contact_${data.id}" data-user-data='${encodeURIComponent(JSON.stringify(data))}' data-u-id="${data.id}${uType}">
                            <div class="user-section">
                              <div class="row valign-wrapper">
                                <div class="col s2 media-image online pr-0">
                                  <img src="${ user_avatar }" alt="" class="circle z-depth-2 responsive-img">
                                </div>
                                <div class="col s10">
                                  <p class="m-0 blue-grey-text text-darken-4 font-weight-700">${data.name}</p>
                                  <p class="m-0 info-text">${data.type}</p>
                                </div>
                              </div>
                            </div>
                            <div class="info-section">
                              <div class="star-timing">
                                <div class="time">
                                  <span></span>
                                </div>
                              </div>

                            </div>
                          </div>`;

        $(".chat-list-users").append(html);
        // $(".chat-list").scrollTop($(".chat-area > .chats").height());
}

$(window).on("resize", function () {
   if ($(window).width() > 899) {
      $("#chat-sidenav").removeClass("sidenav");
   }

   if ($(window).width() < 900) {
      $("#chat-sidenav").addClass("sidenav");
   }
});
//---------------------------------------------------------------------------------//

$('body').on('DOMSubtreeModified', '.chat-list', function(){
    get_lastMsg($('.chat-user:not(.time_edit)').last())
});
