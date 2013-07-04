
<!-- REGISTRATION -->
<div class="page registration" id="page-registration"
	data-page="registration">

	<h1>
		Registration <small data-toggle="tooltip" data-placement="top"
			title="We use this information to get in touch with you if we have questions. And your providers use this information to make a pre-quote assessment. All providers listed on Sunible are bound by our Privacy Policy.">(Why
			do we collect this information?)</small>
	</h1>
	<form id="page-registration-form-register" class="registration_form"
		name="registration_form" action="">
		<p>
			My name is
			<!-- first name -->
			<span class="field_container"> <input type="text"
				onFocus="_gaq.push(['_trackEvent', 'Form Fields', 'Focus', 'Registration First Name', 1, false]);"
				class="field first_name" name="first_name" placeholder="First Name"
				required /> <span class="validation message"></span>
			</span>
			<!-- last name -->
			<span class="field_container"> <input type="text"
				onFocus="_gaq.push(['_trackEvent', 'Form Fields', 'Focus', 'Registration Last Name', 1, false]);"
				class="field last_name" name="last_name" placeholder="Last Name"
				required /> <span class="validation message"></span>
			</span>, call me
			<!-- nickname -->
			<span class="field_container"> <input type="text"
				onFocus="_gaq.push(['_trackEvent', 'Form Fields', 'Focus', 'Registration Nick Name', 1, false]);"
				class="field nickname" name="nick_name" placeholder="Nickname" /> <span
				class="validation message"></span>
			</span> <br /> I live at
			<!-- street address -->
			<span class="field_container"> <input type="text"
				onFocus="_gaq.push(['_trackEvent', 'Form Fields', 'Focus', 'Registration Street', 1, false]);"
				class="field street_address" name="street"
				placeholder="Street Address" required /> <span
				class="validation message"></span>
			</span>
			<!-- city -->
			<span class="field_container"> <input type="text"
				onFocus="_gaq.push(['_trackEvent', 'Form Fields', 'Focus', 'Registration City', 1, false]);"
				class="field city" name="city" placeholder="City" required /> <span
				class="validation message"></span>
			</span> ( I
			<!-- property type -->
			<span class="field_container"> <select
				onChange="_gaq.push(['_trackEvent', 'Form Fields', 'Change', 'Registration Own-Rent', 1, false]);"
				class="field property_type" name="Own_Rent__c"
				id="registration-select-appartment-property-type">
					<option selected="selected">own</option>
					<option>rent</option>
			</select> <span class="validation message"></span>
			</span> my place) <br /> You can reach me on<span></span>
			<!-- phone number -->
			<span class="field_container"> <input type="text"
				onFocus="_gaq.push(['_trackEvent', 'Form Fields', 'Focus', 'Registration Phone', 1, false]);"
				style="width: 150px" name="phone" placeholder="Phone Number"
				onchange="checkPhone(this)"
				pattern="^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$"
				required /> <span class="validation message"></span>
			</span> and
			<!-- email -->
			<span class="field_container"> <input type="email"
				onFocus="_gaq.push(['_trackEvent', 'Form Fields', 'Focus', 'Registration Email', 1, false]);"
				class="field email" name="email" placeholder="Email"
				pattern='(([^&lt;&gt;()[\]\\.,;:\s@\"]+(\.[^&lt;&gt;()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))'
				required /> <span class="validation message"></span>
			</span> <br /> I pay about
			<!-- cost per month -->
			<span class="field_container"> <input type="text"
				onFocus="_gaq.push(['_trackEvent', 'Form Fields', 'Focus', 'Registration Utility Bill', 1, false]);"
				class="field cost_per_month" name="Utility_Bill__c"
				placeholder="$/month" min="0" required /> <span
				class="validation message"></span>
			</span> in electricity bills, but wait, that will change when I go
			solar <img src="/images/smile.png" class="icon smile" alt="" /> <br />
			<!-- Terms of Service-->
			<span class="field_container"> <label class="checkbox"
				for="registration-checkbox-terms_of_service"> <input type="checkbox"
					onMouseover="_gaq.push(['_trackEvent', 'Form Fields', 'Mouseover', 'Registration I Agree', 1, false]);"
					onClick="_gaq.push(['_trackEvent', 'Form Fields', 'Check', 'Registration I Agree', 1, false]);"
					id="registration-checkbox-terms_of_service" name="terms_of_service"
					required />
			</label> I have read and agree to Sunible's <a href="#"
				onMouseover="_gaq.push(['_trackEvent', 'Links', 'Mouseover', 'Registration Terms of Service', 1, false]);"
				onClick="_gaq.push(['_trackEvent', 'Links', 'Click', 'Registration Terms of Service', 1, false]);"
				class="launcher open terms_of_service">Terms of Service</a> &amp; <a
				href="#"
				onMouseover="_gaq.push(['_trackEvent', 'Links', 'Mouseover', 'Registration Privacy Policy', 1, false]);"
				onClick="_gaq.push(['_trackEvent', 'Links', 'Click', 'Registration Privacy Policy', 1, false]);"
				class="launcher open privacy_policy">Privacy Policy</a> <span
				class="validation message"></span>
			</span>
		</p>

		<button type="button"
			onMouseover="_gaq.push(['_trackEvent', 'Buttons', 'Mouseover', 'Registration Submit', 1, false]);"
			onClick="_gaq.push(['_trackEvent', 'Buttons', 'Click', 'Registration Submit', 1, false]);"
			class="btn btn-large send_registration"
			id="registration-submit_registration_info">Go</button>

	</form>
</div>
<!-- /REGISTRATION -->
