"use strict";

var g_cloud_name = '';
var gdrive_count = 0;
var g_parent = '';

function toggle_init () {
	$(".glyphicon-minus, .glyphicon-plus").on('click', function(event) {
	    $(this).toggleClass("glyphicon-minus glyphicon-plus");
	});
}

/* Function  for testing purpose */
//function list_contents() {
//	var list = [
//		{'title' : 'One', 'mimeType' : 'application/vnd.google-apps.folder', 'id' : '1'},
//		{'title' : 'Two', 'mimeType' : 'application/vnd.google-apps.folder', 'id' : '2'},
//		{'title' : 'Three', 'mimeType' : 'application/vnd.google-apps.file', 'id' : '3'},
//		{'title' : 'Four', 'mimeType' : 'application/vnd.google-apps.folder', 'id' : '4'}
//	];
//	handle_google_drive_file_list(list);
//}

function handle_quota_result(resp) {
	var quota_heading = prepare_quota_heading(resp.name, resp.quotaBytesUsed, resp.quotaBytesTotal);
	create_navigation_list(g_cloud_name, quota_heading, g_parent);
 	var folder_div = document.getElementById('folder_' + g_cloud_name);
 	//console.log(folder_div);
 	list_google_drive_contents('root', folder_div);
 	toggle_init();
}

function handle_google_drive_auth_result(resp) {
	if (resp && !resp.error) {
 		console.log("rSync: Authorization complete !!!")
 	} else {
 		console.log("rSync: Calling authorization popup !!!")
 		authorize_google_drive(false);
 	}

 	gapi.client.load('drive', 'v2', function() {
	 	var request = gapi.client.drive.about.get();
	  		request.execute(handle_quota_result);
  	});
}

function authorize_google_drive(immediate) {
	var user_id = '';
	gapi.auth.authorize({
		  	client_id: '452679277122-t5tn997lkq97paovbm67ltgi4p9l9s4d.apps.googleusercontent.com',
		  	scope: [
					  	'https://www.googleapis.com/auth/drive.install',
					  	'https://www.googleapis.com/auth/drive',
					  	'openid'
		  			],
		  	user_id: user_id,
		  	immediate: immediate
		},
	handle_google_drive_auth_result);
}

function load_google_drive(cloud_name, parent) {
	g_cloud_name = cloud_name;
	g_parent = parent;
	gapi.load('auth:client,drive-realtime,drive-share', function() {
		authorize_google_drive(true); // without pop up
	});
}

function handle_google_drive_file_list(list, parent) {
	if(list.length) {
		for (var i=0;i<list.length;i++) {
			console.log(list[i].title);
			//console.log(list[i].mimeType);
			//console.log(list[i].id);
			if("Google Buzz" == list[i].title)	continue;
			if("application/vnd.google-apps.folder" == list[i].mimeType) {
				gdrive_count++;
				var target_id = get_collapse_unique_target_id(g_cloud_name, list[i].title, gdrive_count);
				create_icon(list[i].title, target_id, parent);
				create_radio_button(list[i].title, 'radio_btn', 'margin-left:0.1cm;', parent);
				create_div(target_id, "collapse", "", 'margin-left:1cm;', parent);
				var parent_id = document.getElementById(target_id);
				list_google_drive_contents(list[i].id, parent_id);
			} else {
				create_radio_button(list[i].title, 'radio_btn', 'margin-left:0.5cm;', parent);
			}
		}
	} else {
		create_text('Empty folder !!!', parent);
	}
}

function list_google_drive_contents(id, parent) {
	gapi.client.load('drive', 'v2', function() {
		function read_files(page_token, list) {
			var request = gapi.client.drive.files.list(page_token);
			console.log(page_token);
			request.execute(function(resp) {
				if(resp.items) {
					list 	= list.concat(resp.items);
				}
				if(resp.nextPageToken) {
					page_token.pageToken = resp.nextPageToken;
					read_files(page_token, list);
				} else {
					handle_google_drive_file_list(list, parent);
				}
			});
		}
		var query = "'" + id + "' in parents";
		read_files({'q' : query, 'orderBy' : 'title'}, []);
	});
}