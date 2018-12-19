$(document).ready(function() {

$('#event_search_form').submit(function(event){
	event.preventDefault();
	var req_data = {
		search_keyword: $("#keyword_text").val(),
		category_val: $("#categories_").val(),
		distance: $("#distance_text").val(),
		from_loc: $("input[name='from_location']:checked").val(),
		custom_loc: $("#custom_location").val(),
		latitude: $("#location_lati").val(),
		longitude: $("#location_lang").val()
	};

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : "http://localhost:3000/nodejs/demo-node-app/event_search",
		data : JSON.stringify(req_data),
		dataType : 'json',
		success : function(customer) {
			$("#content_test").html("<p>" + 
				"Post Successfully! <br>" +
				"--->" + JSON.stringify(customer)+ "</p>"); 
		},
		error : function(e) {
			alert("Error!")
			console.log("ERROR: ", e);
		}
	});
});

});