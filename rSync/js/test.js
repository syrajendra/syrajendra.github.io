
"use strict";

var g_test_count = 0;

function load_test_drive(cloud_name, parent) {
	var quota_heading = prepare_quota_heading('Test', '1024', '4096');
	create_navigation_list(cloud_name, quota_heading, parent);
 	var folder_div 	= document.getElementById('folder_' + cloud_name);
 	//console.log(folder_div);
 	var folder_name	= "test-folder";
 	var file_name   = "test-filename";
 	var loop;
 	for (loop = 0; loop < 4; loop++) {
 		var new_div = folder_div;
 		folder_name = folder_name + loop;
 		file_name 	= file_name + loop;
		var target_id 	= get_collapse_unique_target_id(cloud_name, folder_name, g_test_count);
		create_icon(folder_name, target_id, new_div);
		create_radio_button(folder_name, 'radio_btn', 'margin-left:0.1cm;', new_div);
		create_div(target_id, "collapse", "", 'margin-left:1cm;', new_div);
		var parent_id = document.getElementById(target_id);
		create_radio_button(file_name, 'radio_btn', 'margin-left:0.1cm;', parent_id);
		new_div = parent_id;
	}
}