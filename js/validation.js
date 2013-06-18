/*
	all validation goes here
*/

var validation = {
	init: {
		form: {
			getInstallersByZipCode: function($form){
				$form.validate({
					rules: {
						zipcode: {
							required: true,
							maxlength: 10,
							pattern: '^\\d{5}(?:[-\\s]\\d{4})?$'
						}
					},
					messages: {
						zipcode: {
							pattern: 'Invalid Zip Code format'
						}
					},
					errorPlacement: function(error, element){
						var $msgContainer = element.closest('.field_container').find('.validation.message');
						$msgContainer.html(error);
					}
				});
			},
			registration: function($form){
				$form.validate({
					rules: {
						first_name: { required: true },
						last_name:  { required: true },
						street: { required: true },
						city: { required: true },
						phone: {
							required: true,
							maxlength: 14,
							pattern: '^[(]{0,1}[0-9]{3}[)]{0,1}[-\\s\\.]{0,1}[0-9]{3}[-\\s\\.]{0,1}[0-9]{4}$'
						},
						email: {
							required: true,
							pattern: '^(([^<>()[\\]\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
						},
						Utility_Bill__c: {
							required: true,
							number: true
						},
						terms_of_service: {
							required: true
						}
					},
					messages: {
						first_name: {
							required: 'Required field'
						},
						last_name: {
							required: 'Required field'
						},
						street: {
							required: 'Required field'
						},
						city: {
							required: 'Required field'
						},
						phone: {
							required: 'Required field',
							pattern: ''
						},
						email: {
							required: 'Required field',
							pattern: 'Invalid format'
						},
						Utility_Bill__c: {
							required: 'Required field',
							number: 'Sorry, only numbers allowed'
						},
						terms_of_service: {
							required: 'Required field'
						}
					},
					errorPlacement: function(error, element){
						var $msgContainer = element.closest('.field_container').find('.validation.message');
						$msgContainer.html(error);
					}
				});
			},
			signup: function($form){
				$form.validate({
					rules: {
						first_name: { required: true },
						last_name:  { required: true },
						email: {
							required: true,
							pattern: '^(([^<>()[\\]\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
						},
						level_of_interest: { required: true }
					},
					messages: {
						first_name: {
							required: 'Required field'
						},
						last_name: {
							required: 'Required field'
						},
						email: {
							required: 'Required field',
							pattern: 'Invalid format'
						},
						level_of_interest: {
							required: 'Required field'
						}
					},
					errorPlacement: function(error, element){
						var $msgContainer = element.closest('.field_container').find('.validation.message');
						$msgContainer.html(error);
					}
				});
			},
			contact_us: function($form){
				$form.validate({
					rules: {
						name: { required: true },
						email: {
							required: true,
							pattern: '^(([^<>()[\\]\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
						},
						contact_reason: {
							required: true
						},
						comments: {
							required: true,
							maxlength: 500
						}
					},
					messages: {
						name: {
							required: 'Required field'
						},
						email: {
							required: 'Required field',
							pattern: 'Invalid format'
						},
						contact_reason: {
							required: 'Required field'
						},
						comments: {
							required: 'Required field',
							maxlength: '500 symbols maximum'
						}
					},
					errorPlacement: function(error, element){
						var $msgContainer = element.closest('.field_container').find('.validation.message');
						$msgContainer.html(error);
					}
				});
			}
		},
		field: {}
	}
}