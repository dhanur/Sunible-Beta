			<!-- MODAL SIGN UP-->
			<div id="modal-page-sign_up" class="modal sign_up hide fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
                        
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<div class="modal-body">
					<form class="sign_up" id="modal-page-sign_up-form">
						<input type="hidden" name="Lead_Type__c" value="Contact Request"/>
						<p style="padding:.0in .0in .0in .2in">
							We are not in your city right now, but we won’t stop working until we are.<br>
                                                        No really, we won’t stop working until we make every city Sunible!<br>                                 
							Sign up and be the first to know when we launch...
						</p>
						<p style="padding:.0in .0in .0in .2in">
							<!-- first name -->
							<span class="field_container">
								<input type="text" onFocus="_gaq.push(['_trackEvent', 'Form Fields', 'Focus', 'Sign Up First Name', 1, false]);"class="field first_name" name="first_name" placeholder="First Name" required />
								<span class="validation message"></span>
							</span>
							<!-- last name -->
							<span class="field_container">
								<input type="text" onFocus="_gaq.push(['_trackEvent', 'Form Fields', 'Focus', 'Sign Up Last Name', 1, false]);" class="field last_name" name="last_name" placeholder="Last Name" required/>
								<span class="validation message"></span>
							</span>
							<!-- email -->
							<span class="field_container">
								<input type="email" onFocus="_gaq.push(['_trackEvent', 'Form Fields', 'Focus', 'Sign Up Email', 1, false]);" class="field email" name="email" placeholder="Email" pattern='(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))' required/>
								<span class="validation message"></span>
							</span>
						</p>
						<p style="padding:.0in .0in .0in .2in">
							<!-- Levels of interest-->
							<span class="field_container">
								<label class="radio" for="sign_up-interested">
									<input type="radio" onchange="_gaq.push(['_trackEvent', 'Form Fields','Select', this.value, 1, false]);" id="sign_up-interested" name="reason" value="interested" required/>
									Possibly interested in solar, don’t know where to start
								</label>
								<label class="radio" for="sign_up-very_interested">
									<input type="radio" onchange="_gaq.push(['_trackEvent', 'Form Fields','Select', this.value, 1, false]);" id="sign_up-very_interested" name="reason" value="very interested"/>
									Definitely interested in solar, don’t know what installer to choose
								</label>
								<label class="radio" for="sign_up-curious">
									<input type="radio" onchange="_gaq.push(['_trackEvent', 'Form Fields','Select', this.value, 1, false]);" id="sign_up-curious" name="reason" value="curious"/>
									Just curious, everyone is talking about solar
								</label>
								<label class="radio" for="sign_up-lower_bill">
									<input type="radio" onchange="_gaq.push(['_trackEvent', 'Form Fields','Select', this.value, 1, false]);" id="sign_up-lower_bill" name="reason" value="lower bill"/>
									Want to reduce my power bill, but not convinced about solar
								</label>
								<label class="radio" for="sign_up-not_interested">
									<input type="radio" onchange="_gaq.push(['_trackEvent', 'Form Fields','Select', this.value, 1, false]);" id="sign_up-not_interested" name="reason" value="not interested"/>
									Solar rhymes with polar, polar bears annoy me, and so does this hippy talk
								</label>
								<span class="validation message"></span>
							</span>
						</p>
						<button type="button" onMouseover="_gaq.push(['_trackEvent', 'Buttons', 'Mouseover', 'Sign Up Submit', 1, false]);"
                                                onClick="_gaq.push(['_trackEvent', 'Buttons', 'Click', 'Sign Up Submit', 1, false]);" class="btn btn-large sign_up">Sign Me Up!</button>
						<p class="no-spam" style="padding:.0in .0in .0in .2in">(no spam ever, only launch updates)</p>
					</form>
				</div>
			</div>
			<!-- /MODAL SIGN UP-->
