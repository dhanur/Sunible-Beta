function checkPhone (obj) {
	str = obj.value.replace(/[^0-9]+?/g, '');
	switch (str.length)
	{
		case 0:
			alert('Please enter numbers only.');
			obj.select();
			return;
		case 7:
			str = str.substr(0,3)+"-"+str.substr(3,4);
			break;
		case 10:
			str = "("+str.substr(0,3)+") "+str.substr(3,3)+"-"+str.substr(6,4);
			break;
		default:
			alert('Please enter a 7 digit phone number (with area code, if applicable).');
			obj.select();
			return;
	}
	obj.value = str;
}

function isIe10()
{
	return navigator.appVersion.indexOf('MSIE 10') > -1;
}

function targetIe10()
{
	$('body').addClass('ie-10');
}

function isSafari()
{
	return (navigator.appVersion.indexOf('Safari') > -1 && navigator.appVersion.indexOf('Chrome') == -1);
}

function targetSafari()
{
	$('body').addClass('safari');
}

function ie8FixFooter()
{
	$(window).resize(function(){
		setTimeout(function () {
			var $pagesContainer = $('.pages');
			$pagesContainer.toggleClass('ie8-footer-fix');
		}, 500);
	});
}

function showMessage(messageText)
{
	// TODO: some cool popup fits here
	alert(messageText);
}

function initTooltips($elements)
{
	$elements.tooltip();
}

function initPlaceholders($elements){
	$elements.placeholder();
}

function initCustomCheckboxAndRadio($elements)
{
	$elements.prepend("<span class='icon'></span><span class='icon-to-fade'></span>");
	$elements.click(function(){
		setupLabel();
	});
	//setupLabel();
}

function addNiceScroll($element, options)
{
	if (options == undefined) options = {};
	$element.nanoScroller(options);
}

function transformToCustomSelect($elements, fireEvent)
{
	if ($elements == undefined) return;
	if ($elements.length == 0) return;
	if (fireEvent == undefined) fireEvent = true;

	var $wrapper, $select, $customSelect, $customSelectPopup;
	var customSelectsList = [];
	for (var i = 0; i < $elements.length; i++) {
		$select = $($elements[i]);
		$wrapper = $('<span class="custom_select_wrapper"></span>');
		$wrapper.insertBefore($select);
		$wrapper.append($select);
		$select.dropkick({
			change: function(value, label)
			{
				var regularSelect = {
					obj: $(this),
					value: value,
					label: label,
					fireEvent: fireEvent
				};
				selectSameValueInRegularSelect(regularSelect);
			}
		});
		$customSelect = $wrapper.find('.dk_container');
		customSelectsList.push($customSelect);
		$customSelectPopup = $customSelect.find('.dk_options');
		$customSelectPopup.css('width', $customSelect.width() + 'px');
		$wrapper = null;
	};
	return customSelectsList;
}

function selectSameValueInRegularSelect(regularSelect)
{
	if (regularSelect == undefined) return;
	var $options = regularSelect.obj.find('option');
	var selectedValue = regularSelect.value;
	var $currentOption, currentOptionValue;
	$options.removeAttr('selected');
	for (var i = 0; i < $options.length; i++)
	{
		$currentOption = $($options[i]);
		currentOptionValue = $currentOption.val();
		if (selectedValue == currentOptionValue)
		{
			$currentOption.attr('selected', 'selected');
			if (regularSelect.fireEvent)
			{
				fireEvent($currentOption[0],'change');
			}
			break;
		}
	}
}

function autoHideCustomSelects(){
	var $selects = $('.custom_select_wrapper').find('.dk_container');
	var $popups = $selects.find('.dk_options');
	bindHideOnFocusOut($selects, $popups, 2000, function(){
		$selects.removeClass('dk_open');
	});
}

function fireEvent(element,event)
{
    if (document.createEventObject)
    {
    	// dispatch for IE
    	var evt = document.createEventObject();
    	return element.fireEvent('on'+event,evt)
    }
    else 
    {
    	// dispatch for firefox + others
    	var evt = document.createEvent("HTMLEvents");
    	evt.initEvent(event, true, true ); // event type,bubbling,cancelable
    	return !element.dispatchEvent(evt);
    }
}

function phoneNumberAutoFormat($fieldPhone, format)
{
	// options:
	// - $fieldPhone : phone fields that should have predicture. jQuery obj
	// - format : format string
	if ($fieldPhone == undefined) return;
	if ($fieldPhone.length == 0) return;
	if (format == undefined) format = '(???)???-????'; // ? is used for any symbol
	/*$fieldPhone.keyup(function(e){
		var $field = $(this);
		var value = $field.val();
		var valueLength = value.length;
		var symbolEntered = value.charAt(valueLength-1);
		var symbolFormat = format.charAt(valueLength-1);
		if (symbolFormat != '?' && symbolEntered != symbolFormat){
			value = value.substr(0, valueLength-1);
			value += symbolFormat + symbolEntered;
			$field.val(value);
		}
	});*/
	$fieldPhone.focusout(function(e){
		var symbolEntered, symbolFormat;
		var formattedValue = '';
		var formattedValueIndex = 0;
		var $field = $(this);
		var value = $field.val();
		var pattern = /\(\d{3}\)\d{3}-\d{4}/;
		var valid = pattern.test(value);
		if (!valid)
		{
			for (var i = 0; i < value.length; i++) {
				symbolEntered = value.charAt(i);
				symbolFormat = format.charAt(formattedValueIndex);
				if (symbolFormat != '?' && symbolEntered != symbolFormat)
				{
					formattedValue += symbolFormat;
					formattedValueIndex++;
				}
				formattedValue += symbolEntered;
				formattedValueIndex++;
			};

			$field.val(formattedValue);
		}
	});
}

function redrawGridWithNewPageSize(t, row_count)
{
	//Lifted more or less right out of the DataTables source
	var oSettings = t.fnSettings();

	oSettings._iDisplayLength = parseInt(row_count, 10);
	t._fnCalculateEnd( oSettings );

	/* If we have space to show extra rows (backing up from the end point - then do so */
	if ( oSettings.fnDisplayEnd() == oSettings.fnRecordsDisplay() )
	{
		oSettings._iDisplayStart = oSettings.fnDisplayEnd() - oSettings._iDisplayLength;
		if ( oSettings._iDisplayStart < 0 )
		{
			oSettings._iDisplayStart = 0;
		}
	}

	if ( oSettings._iDisplayLength == -1 )
	{
		oSettings._iDisplayStart = 0;
	}

	t.fnDraw( oSettings );

	return t;
}

function bindHideOnFocusOut($hoveredElement, $elementToHide, delay, callback)
{
	if (delay == undefined) delay = 'slow';
	var closeTimer;
	$hoveredElement.mouseleave(function(){
		if($elementToHide.length > 0){
			closeTimer = setTimeout(function () {
				$elementToHide.hide();
				if (typeof(callback) == 'function')
					callback();
			}, delay);
		}
	});

	$hoveredElement.mouseenter(function(){
		clearTimeout(closeTimer);
	});
}

function createGrid($table, options)
{
	// process options
	if (options == undefined) options = {};
	if (options.bPaginate == undefined) options.bPaginate = false;
	if (options.bLengthChange == undefined) options.bLengthChange = false;
	if (options.bFilter == undefined) options.bFilter = false;
	if (options.bSort == undefined) options.bSort = false;
	if (options.bInfo == undefined) options.bInfo = false;
	if (options.bAutoWidth == undefined) options.bAutoWidth = false;
	if (options.bStretchedVerticallyToContainer == undefined) options.bStretchedVerticallyToContainer = false;
	if (options.bNanoScroll == undefined) options.bNanoScroll = false;

	var $grid = $table.dataTable(options);
	var $gridWrapper = $grid.closest('.dataTables_wrapper');

	if (options.bStretchedVerticallyToContainer)
	{
		$gridWrapper.addClass('stretched_vertically nano_used');
	}
	else
	{
		$gridWrapper.addClass('no_scroll');
	}

	if (options.sScrollY != undefined && options.bNanoScroll)
	{
		// nano
		var $nanoScrollWrapper = $grid.closest('.dataTables_scrollBody');
		$nanoScrollWrapper.addClass('nano');
		// content
		var $nanoScrollContent = $('<div class="content"></div>');
		$nanoScrollContent.append($grid);
		$nanoScrollWrapper.append($nanoScrollContent);
		addNiceScroll($nanoScrollWrapper, { flash: true });
	}
	else
	{
		var $gridContentWrapper = $('<div class="content"></div>');
		$gridContentWrapper.append($grid);
		$gridWrapper.append($gridContentWrapper);
	}

	if (options.bPaginate == true)
	{
		var $pageSizeSelect = $table.closest('.dataTables_wrapper').find('.dataTables_length select');
		var fireEvent = false;
		transformToCustomSelect($pageSizeSelect, fireEvent);
		bindGridPageSizeChange($grid, $pageSizeSelect);
	}

	return $grid;
}

function bindGridPageSizeChange($grid, $pageSizeSelect)
{ 
	var $pseudoSelectOptions = $pageSizeSelect.closest('.dataTables_length').find('.dk_options_inner a');
	$pseudoSelectOptions.click(function(){
		var size = $(this).text();
		redrawGridWithNewPageSize($grid, size);
	});
}

function getFormFields($form)
{
	var i;
	var fields = {};
	// inputs
	var $inputs = $form.find('input');
	var $input;
	for (i = 0; i < $inputs.length; i++)
	{
		$input = $($inputs[i]);
		if ($input.attr('type').toLowerCase() == 'radio')
		{
			if (!$input.is(':checked'))
			{
				continue;
			}
		}
		fields[$input.attr('name')] = $input.val();
	};

	// selects
	var $options = $form.find('option');
	var $option;
	var $select;
	for (var i = 0; i < $options.length; i++)
	{
		$option = $($options[i]);
		if ($option.attr('selected') == 'selected')
		{
			$select = $option.closest('select');
			fields[$select.attr('name')] = $option.val();
		}
	};

	// textareas
	var $textareas = $form.find('textarea');
	var $textarea;
	for (i = 0; i < $textareas.length; i++)
	{
		$textarea = $($textareas[i]);
		fields[$textarea.attr('name')] = $textarea.val();
	};

	return fields;
}