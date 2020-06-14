function validateUserInput(){
	this.validateLogin= function(formid){
		var errors = {"email": "", "password": "", "has_error" : false};
		if($(formid).find('#email').val().trim()==''){
			errors.email = "Please enter a valid email";
			errors.has_error = true;
		}
		if($(formid).find('#password').val().trim()==''){
			errors.password = "Please enter password";
			errors.has_error = true;
		}
		return errors;
	}
}

function apiCalls(){
    const socket= io();
	const validateUserInputObj = new validateUserInput();
    this.login = function (formid) {
    	const validation = validateUserInputObj.validateLogin(formid);
    	if(validation.has_error){
              return false;
    	}
    	var formData = $(formid).serialize();
    	jQuery.ajax({
            type: 'POST',
            url: $(formid).attr('action'),
            datatype: 'json',
            data: formData, 
            beforeSend:function(){
                 
            },
            success: function (response, textStatus, request) {
                if(response.success && response.loggedin){
                	window.localStorage.setItem("login_user_name", response.username);
                	window.localStorage.setItem("is_user_loggedin", response.loggedin);
                	window.localStorage.setItem("login_user_id", response.id);
                    window.localStorage.setItem("receiver", 'anonymous');
                    //socket.emit('user_connected', {"room_id" : response.id, "user_name": response.username});
                	window.location.replace("/");
                }
            },
            error: function(error){
                   console.log(response);
            }
    })
},
this.getUsers = function () {
        jQuery.ajax({
            type: 'GET',
            url: "/site/users",
            datatype: 'json',
            beforeSend:function(){
                 
            },
            success: function (response, textStatus, request) {
                response.users.forEach(function(user){
                   window.apiCallsObj.addUserHtml(user);
                })
            },
            error: function(xhr, status, error){
                   console.log(error);
            }
    })
},
this.addUserHtml= function (user){
    const bd_color_code = window.apiCallsObj.setBgColor();
    var HTML = '<li class="list-group-item user-item" data-roomid="'+user._id+'">'+
                            '<div>'+
                                '<figure class="avatar">'+
                                    '<span style="background-color:'+bd_color_code+'" class="avatar-title rounded-circle">'+user.name.charAt(0)+'</span>'+
                                '</figure>'+
                            '</div>'+
                            '<div class="users-list-body">'+
                                '<h5 class="users-list-name">'+user.name+'</h5>'+
                                '<p>Lorem ipsum dolor sitsdc sdcsdc sdcsdcs</p>'+
                                '<div class="users-list-action action-toggle">'+
                                    '<div class="dropdown">'+
                                        '<a data-toggle="dropdown" href="#" aria-expanded="false">'+
                                            '<i class="ti-more"></i>'+
                                        '</a>'+
                                        '<div class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 5px, 0px);" x-out-of-boundaries="">'+
                                            '<a href="#" class="dropdown-item">Open</a>'+
                                            '<a href="#" data-navigation-target="contact-information" class="dropdown-item">Profile</a>'+
                                            '<a href="#" class="dropdown-item">Add to archive</a>'+
                                            '<a href="#" class="dropdown-item">Delete</a>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</li>';
    $('.users-list-group').append(HTML);
},
this.setBgColor = function (){
   var color_code  = '#';
   var characters  = 'abcdef0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < 6; i++ ) {
      color_code += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
     return color_code;
  }
}

var apiCallsObj = new apiCalls();
$(document).ready(function(){
	$('#login-btn').click(function(e)
	{
		e.preventDefault();
        window.localStorage.clear('name');
		apiCallsObj.login("#login-form");
	});
    apiCallsObj.getUsers();
});