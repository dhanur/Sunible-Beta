/*
	Dashboard scripts
*/

function Dashboard(options){
	// options:
	// - container: required if source or zip are set
	// - source : already fetched json used to construct the table. 
	// - table : already constructed table that needs to be converted to DataTable
	// - zip : used to fetch source from Back-End
	// REQUIRED options description:
	// if table is specified, we don't need source and zip
	// if source is specified, we don't need table and zip
	// if table and source are not specified, zip is required

	if (options == undefined)
	{
		showMessage('Dashboard(): Options object is required parameter.');
		return;
	};
	var self = this;
	if (options.table != undefined && options.table.length > 0)
	{ // if existed table is specified, DataTable is applied to it
		self.applyDataTable(options.table);
	}
	else
	{ // no existed table, so we check the source set
		if (options.zip == undefined)
		{ // we check zip code
			showMessage('Dashboard(): If you do not have "table" parameters specified "zip" is required');
			return;
		}

		if (options.source == undefined)
		{ // we check source
			showMessage('Dashboard(): If you do not have "table" parameters specified "source" is required');
			return;
		}

		if (options.container == undefined)
		{ // we check container code
			showMessage('Dashboard(): For dynamically constructed grid "container" is required option');
			return;
		}

		if (options.container.length == 0)
		{ // we check container code
			showMessage('Dashboard(): Container you specified was not found');
			return;
		}

		if (options.callback == undefined && typeof options.callback != 'function')
		{
			options.callback = function(){};
		}

		var newDashboard = {
			zip: options.zip,
			container: options.container,
			source: options.source,
			callback: options.callback
		};
		
		return self.construct(newDashboard);
	}
};

Dashboard.prototype = {
	construct: function(newDashboard)
	{
		var self = this;
		// counter
		var $counter = $('#dashboard-header-number_of_providers_found');
		$counter.text(newDashboard.source.length);
		// data Table
		var $table = self.compose.dashboard(newDashboard);
		//self.setRatingSorting();
		self.applyDataTable($table);
		var $gridWrapper = $table.closest('.dataTables_wrapper');
		//$gridWrapper.addClass('nano_used');
		// dynamically inserted tooltips should be initialized
		var $tooltips = $gridWrapper.find('.question_mark');
		initTooltips($tooltips);
		// dynamically inserted checkboxes should be initialized
		var $checkboxesAndRadios = $gridWrapper.find('.checkbox, .radio');
		initCustomCheckboxAndRadio($checkboxesAndRadios);
		self.insertToContainer($gridWrapper, newDashboard.container);

		if ($gridWrapper.hasClass('no_scroll'))
		{
			$gridWrapper.find('th.rating.sorting_asc').click();
		}
		else if ($gridWrapper.hasClass('nano_used'))
		{
			// re-init the nanoScroll 'cause page was inserted dynamically
			var $nanoScrollWrapper = $table.closest('.nano');
			addNiceScroll($nanoScrollWrapper, { flash: true });
			$gridWrapper.find('.dataTables_scrollHeadInner th.rating.sorting_asc').click();
		}

		newDashboard.callback();
		return $table;
	},
	compose: {
		dashboard: function(newDashboard)
		{
			//console.log(json);
			var self = this;
			var $table =  self.table(newDashboard.zip);
			var $tbody = $table.find('tbody');
			self.rows(newDashboard.source, $tbody);
			return $table;
		},
		table: function(zip)
		{
			return $('' +
				'<table class="providers list grid" id="dashboard-grid-providers-list-' + zip + '">' +
					'<thead>' +
						'<tr>' +
							'<th class="checkboxes">' +
								'<span class="text">Select</span>' +
							'</th>' +
							'<th class="name">' +
								'<span class="text">Solar Providers</span>' +
								'<span class="question_mark light" data-toggle="tooltip" data-placement="bottom" title="These providers have installed solar in at least one home every month in your County recently.">?</span>' + 
							'</th>' +
							'<th class="cost">' +
								'<span class="text">Price Category</span>' +
								'<span class="question_mark light" data-toggle="tooltip" data-placement="bottom" title="Based on the average cost of systems installed in your County, Value = Bottom 33%, Standard = Middle 33% Premium = Top 33%. Please read FAQ #3 for a more detailed explanation.">?</span>' + 
							'</th>' +
							'<th class="avg_cost">' +
								'<span class="text">$/watt</span>' +
								'<span class="question_mark light" data-toggle="tooltip" data-placement="bottom" title="Average Cost">?</span>' + 
							'</th>' +
							'<th class="number_of_homes_installed">' +
								'<span class="text">Homes Installed</span>' +
								'<span class="question_mark light" data-toggle="tooltip" data-placement="bottom" title="Homes in your County that have gone solar with each provider since 2006.">?</span>' +
							'</th>' +
							'<th class="rating">' +
								'<img src="../images/yelp_logo_100x50.png" alt=""/>' +
								'<span class="text">Rating</span>' +
							'</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody></tbody>' +
				'</table>').data('zip', zip);
		},
		rows: function(jsonRows, $tbody)
		{
			if (jsonRows == undefined) return;
			var $row;
			var self = this;
			for (var i = 0; i < jsonRows.length; i++) {
				$row = self.row(jsonRows[i]);
				$tbody.append($row);
			};
			return $tbody;
		},
		row: function(jsonRow)
		{
			//	row json example
			//	{
			//		"avg_cost": "3.62",
			//		"id": "12",
			//		"name": "Nova West Solar",
			//		"logo": "NovaWestSolar.jpg",
			//		"pricing": "Value",
			//		"total_installs": "222",
			//		"yelp_rating": "5",
			//		"yelp_review_count": "55"
			//	}
			if (jsonRow == undefined) return;
			// provider logo
			var logoImg = '';
			if (jsonRow.logo != undefined && jsonRow.logo != ''){
				logoImg = '<img src="assets/images/installerlogo/' + jsonRow.logo + '"/>';
			}

			// pricing
			var tdPricing = '';
			switch(jsonRow.pricing)
			{
				case 'Value':
				case 'Standard':
				case 'Premium':
					tdPricing = '' + 
						'<td class="cost ' + jsonRow.pricing.toLowerCase() + '">' + 
							'<span class="badge">' + jsonRow.pricing + '</span>' +
						'</td>';
					break;
				default:
					tdPricing = '' +
						'<td class="cost no-data">n/a</td>';
			}

			// rating
			var spanRating = '';
			var normalizedRatingStarsSymbols = '';
			var normalizedRatingStarsSymbolsLength;
			var spanRatingStarsClass;
			var yelpReviewCount = '';
			if (jsonRow.yelp_rating.indexOf('-') != -1)
			{ // no rating
				spanRating = '<span class="rating_stars no-rating"> </span>';
			}
			else
			{
				normalizedRatingStarsSymbolsLength = parseFloat(jsonRow.yelp_rating) * 2;
				for (var i = 0; i < normalizedRatingStarsSymbolsLength; i++) {
					normalizedRatingStarsSymbols += '*';
				};
				spanRatingStarsClass = 'has-' + jsonRow.yelp_rating.replace('.', '_');
				spanRating = '<span class="rating_stars ' + spanRatingStarsClass + '">' + normalizedRatingStarsSymbols + '</span>';
			}

			if (jsonRow.yelp_review_count != '-')
			{
				if (jsonRow.yelp_review_count == '1')
				{
					yelpReviewCount = '<span class="yelp_review_count">(' + jsonRow.yelp_review_count + ' review)</span>';
				}
				else
				{
					yelpReviewCount = '<span class="yelp_review_count">(' + jsonRow.yelp_review_count + ' reviews)</span>';	
				}
			}

			var rowHtml = '' +
				'<tr id="provider-' + jsonRow.id + '" class="provider row">' +
					'<td class="checkboxes">' +
						'<label class="checkbox" for="provider-' + jsonRow.id + '-checkbox">' +
							'<input type="checkbox" value="" id="provider-' + jsonRow.id + '-checkbox"/>' +
						'</label>' +
					'</td>' +
					'<td class="name">' + jsonRow.name + logoImg + '</td>' +
					tdPricing +
					'<td class="avg_cost">' + jsonRow.avg_cost + '</td>' +
					'<td class="number_of_homes_installed">' + jsonRow.total_installs + '</td>' +
					'<td class="rating">' + 
						spanRating  +
						yelpReviewCount +
					'</td>' +
				'</tr>';

			return $(rowHtml).data('source', jsonRow);
		}
	},
	applyDataTable: function($table)
	{
		return createGrid($table, {
			//bPaginate: true,
			//sPaginationType: "full_numbers",
			//bLengthChange: true,
			//bFilter: true,
			//bInfo: true,
			//
			// scrolling options
			//sScrollY: '300px',
			//bNanoScroll: true,
			//bStretchedVerticallyToContainer: true,
			//bScrollCollapse: true,
			// /scrolling options
			bSort: true,
			bPaginate: false,
			aaSorting: [
				[ 5, "asc" ]
			],
			aoColumns: [
				null,
				{ "asSorting": [ "asc", "desc" ] }, // providers
				{ "asSorting": [ "asc", "desc" ] }, // pricing
				{ "asSorting": [ "asc", "desc" ] }, // $/watt
				{ "asSorting": [ "desc", "asc" ] }, // homes installed
				{ "asSorting": [ "desc", "asc" ] }  // rating
			],
			aoColumnDefs: [
				{ "bSortable": false, "aTargets": [0] },
				{ "bSortable": true,  "aTargets": [0] },
				{ "bSortable": true,  "aTargets": [0] },
				{ "bSortable": true,  "aTargets": [0] },
				{ "bSortable": true,  "aTargets": [0] },
				{ "bSortable": true,  "aTargets": [0] }
			],
			fnDrawCallback: function(oSettings){
				var $checkboxes = $(this).find('td.checkboxes input[type=checkbox]');
				if ($checkboxes.length > 0){
					bindDashboardCheckboxesOnChange($checkboxes);
				}
			}
		});
	},
	insertToContainer: function($grid, $container){
		$container.empty();
		$container.append($grid);
	},
	setRatingSorting: function(){
		$.fn.dataTableExt.afnSortData['dom-rating'] = function  ( oSettings, iColumn )
		{
			var aData = [];
			$('td:eq(' + iColumn + ') .rating_stars', oSettings.oApi._fnGetTrNodes(oSettings)).each(function () {
				aData.push( $(this).text() );
			});
			return aData;
		}
	}
}

function bindDashboardCheckboxesOnChange($checkboxes)
{
	$checkboxes.each(function(){
		var $checkbox = $(this);
		if (!$checkbox.hasClass('select_binded')){
			$checkbox.addClass('select_binded');
			$checkbox.change(function(){
				var $row = $(this).closest('tr');
				selectDashboardProvider($row);
			});
		}
	});
}

function incrementSelectedProvidersCounter($counter)
{
	var counterValue = parseInt($counter.text());
	counterValue = counterValue + 1 + '';
	$counter.text(counterValue);
	if (counterValue > 0)
	{
		var $registerButton = $counter.closest('.number_of_selected.providers').find('.open_registration_page');
		$registerButton.removeAttr('disabled');
	}
}

function descrementSelectedProvidersCounter($counter)
{
	var counterValue = parseInt($counter.text());
	counterValue = counterValue - 1 + '';
	$counter.text(counterValue);
	if (counterValue == 0)
	{
		resetDashboardCounter($counter);
	}
}

function resetDashboardCounter($counter)
{
	var $registerButton = $counter.closest('.number_of_selected.providers').find('.open_registration_page');
	$registerButton.attr('disabled', '');
	$counter.text('0');
}

function selectDashboardProvider($row)
{
	var $counter = $('#dashboard-block-number_of_providers_selected');
	var $selectedProviders = $row.closest('.providers.list').find('.provider.selected');
	if ($selectedProviders.length < 21){
		$row.toggleClass('selected');
		if ($row.hasClass('selected')){
			incrementSelectedProvidersCounter($counter);
		}
		else {
			descrementSelectedProvidersCounter($counter);
		}
	}
}

function selectProviderRow($row)
{
	// we simply toggle class
	$row.toggleClass('selected');
}