			<!-- DASHBOARD -->
			<div class="page dashboard" id="page-dashboard" data-page="dashboard">                        
				<section class="providers number_of_selected">
					<div class="block">
						<p>
							You have selected<br/>
							<span class="counter selected providers number" id="dashboard-block-number_of_providers_selected">0</span>
							<br/>
							installers
						</p>
						<p class="max_length message">20 installers max</p>
					</div>
					<button type="button" 
						onMouseover="_gaq.push(['_trackEvent', 'Buttons', 'Mouseover', 'Dashboard Submit']);" 
						onClick="_gaq.push(['_trackEvent', 'Buttons', 'Click', 'Dashboard Submit']);" 
						class="btn open_registration_page" id="dashboard-open_registration_page">Request Quotes</button>
				</section>
				<section class="providers container">
					<header>
						<h1>Select installers you’d like to get quotes from</h1>
						<p>(click columns to sort by Pricing, Homes Installed or Yelp Rating)</p>
					</header>
					<div class="table container"></div>
				</section>
			</div>
			<!-- /DASHBOARD -->
