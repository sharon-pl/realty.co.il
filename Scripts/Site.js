//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

(function($) {

var SITE = {};

$(document).ready(function()
{
	// Bind Tabs
	$("#Tabs li").each(function() {
		$(this).click(function() {
			SITE.Tabs($(this).prop("id"));
		});
	});
	
	// Bind Forms
	$("#Form").submit(function(event) { SITE.Form_Contact(event) });
});

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//**********************************************************
//  SITE >> Tabs
// PARAM >> String | Type
//**********************************************************
SITE.Tabs = function(Type)
{	
	// Reset Tabs & Sections
	$("#Tabs li").each(function(){ $(this).removeClass("Active") });
	$(".Section").each(function(){ $(this).hide() });
	
	// Set Tab
	$("#" + Type).addClass("Active");
	$("#" + Type.replace("Tab-", '')).show().focus();
};

//**********************************************************
//  SITE >> Form_Contact
// PARAM >> event
//**********************************************************
SITE.Form_Contact = function(event)
{
	// Prevent In-Flight Re-Post
	if (SITE.Request) SITE.Request.abort();

	// Prevent Form Post
	event.preventDefault();

	// Get Form Data
	var $Form     = $("#Form");
	var $Fields   = $Form.find("input, select, button, textarea");
	var Data      = $Form.serialize();
	var Error_Msg = '';
	var Error_Fld = '';

	// Get Form Values
	var Name    = $("#Form-Name"   ).val().trim();
	var EMail   = $("#Form-EMail"  ).val().trim();
	var Phone   = $("#Form-Phone"  ).val().trim();
	var Offer   = $("#Form-Offer"  ).val().trim();
	var Message = $("#Form-Message").val().trim();
	
	// Get Required Form Fields
	var Req_Name    = $("#Form-Name"   ).prop("required");
	var Req_EMail   = $("#Form-EMail"  ).prop("required");
	var Req_Phone   = $("#Form-Phone"  ).prop("required");
	var Req_Offer   = $("#Form-Offer"  ).prop("required");
	var Req_Message = $("#Form-Message").prop("required");

	// Validate Fields
	if (Req_Name && Name === '')
	{
		Error_Msg = "Please enter your name.";
		Error_Fld = "Name";
	}
	else if (Req_EMail && EMail === '')
	{
		Error_Msg = "Please enter your e-mail address.";
		Error_Fld = "EMail";
	}
	else if (Req_Phone && Phone === '')
	{
		Error_Msg = "Please enter your phone number.";
		Error_Fld = "Phone";
	}
	else if (Req_Offer && Offer === '')
	{
		Error_Msg = "Please enter an offer / bid.";
		Error_Fld = "Offer";
	}
	else if (Req_Message && Message === '')
	{
		Error_Msg = "Please enter a message.";
		Error_Fld = "Message";
	}

	// Handle Errors
	if (Error_Msg !== '')
	{
		$("#Form-Status").prop("class", "Error").html(Error_Msg).fadeIn(400);
		$("#Form-" + Error_Fld).focus();
		event.preventDefault();
		return false;
	}

	// Reset Status
	$("#Form-Status").hide().prop("class", '').html('');

	// Set Button
	$("#Form-Submit").hide();
	$("#Form-Sending").show();

	// Disable Fields
	$Fields.prop("disabled", true);

	// Setup AJAX Call
	SITE.Request = $.ajax({
		url: $("#Form").prop("action"),
		type: "post",
		dataType: "json",
		data: Data
	});

	// Process Result
	SITE.Request.done(function (Response, Text_Status, jqXHR)
	{
		var Type    = Response.type;
		var Message = Response.message;
		$("#Form-Status").prop("class", Type).html(Message).fadeIn(400);

		// Reset Form
		if (Type === "Success")
		{
			$("#Form-Name, #Form-EMail, #Form-Phone, #Form-Offer, #Form-Message").val('');
			$("#recaptcha_response_field").val('');
			$("#recaptcha_reload_btn").click();
			
			setTimeout(function(){ $("#Form-Status").hide() }, 7000);
		}
	});

	// Process Error
	SITE.Request.fail(function (jqXHR, Text_Status, Error)
	{
		Error_Msg = "Form Request Failed: " + Text_Status + " / " + Error;
		$("#Form-Status").prop("class", "Error").html(Error_Msg).fadeIn(400);
	});

	// Re-Enable Fields
	SITE.Request.always(function()
	{
		$("#Form-Submit").show();
		$("#Form-Sending").hide();
		$Fields.prop("disabled", false);
	});
};

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

})(jQuery);