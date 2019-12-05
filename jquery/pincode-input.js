/* =========================================================
 * bootstrap-pincode-input.js
 *
 * =========================================================
 * Created by Ferry Kranenburg
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

;(function ( jQuery, window, document, undefined ) {

	"use strict";


		// Create the defaults once
		var pluginName = "pincodeInput";
		var defaults = {
		    	inputs:4,									    // 4 input boxes = code of 4 digits long
		    	hidedigits:true,								// hide digits
		    	keydown : function(e){},
		        complete : function(value, e, errorElement){// callback when all inputs are filled in (keyup event)
		    		//value = the entered code
		    		//e = last keyup event
		    		//errorElement = error span next to to this, fill with html e.g. : jQuery(errorElement).html("Code not correct");
		    	}
		    };

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.settings = jQuery.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		// Avoid Plugin.prototype conflicts
		jQuery.extend(Plugin.prototype, {
				init: function () {
					this.buildInputBoxes();
					
				},
		        updateOriginalInput:function(){
		        	var newValue = "";
		        	jQuery('.pincode-input-text',this._container).each(function( index, value ) {
		        		newValue += jQuery(value).val().toString();
		        	});
		        	jQuery(this.element).val(newValue);
		        },
		        check: function(){
		        	var isComplete = true;
		        	var code = "";
		        	jQuery('.pincode-input-text',this._container).each(function( index, value ) {
		        		code += jQuery(value).val().toString();
		        		if(!jQuery(value).val()){
		        			isComplete = false;
		        		}
		        	});

		        	if(this._isTouchDevice()){
		        		// check if single input has it all
		        		if(code.length == this.settings.inputs){
		        			return true;
		        		}
		        	}else{
		        		return isComplete;
		        	}


		        },
				buildInputBoxes: function () {
					this._container = jQuery('<div />').addClass('pincode-input-container');

					var currentValue = [];
					// If we do not hide digits, we need to include the current value of the input box
					// This will only work if the current value is not longer than the number of input boxes.
					if( this.settings.hidedigits == false && jQuery(this.element).val() !=""){
						currentValue = jQuery(this.element).val().split("");
					}

					// make sure this is the first password field here
					if(this.settings.hidedigits){
							this._pwcontainer = jQuery('<div />').css("display", "none").appendTo(this._container);
							this._pwfield = jQuery('<input>').attr({'type':'password','pattern': "[0-9]*", 'inputmode':"numeric",'id':'preventautofill','autocomplete':'off'}).appendTo(this._pwcontainer);
					}

					if(this._isTouchDevice()){
						// set main class
						jQuery(this._container).addClass("touch");
						
						// For touch devices we build a html table directly under the pincode textbox. The textbox will become transparent
						// This table is used for styling only, it will display how many 'digits' the user should fill in.
						// With CSS letter-spacing we try to put every digit visually insize each table cell.
						
						var wrapper = jQuery('<div />').addClass('touchwrapper touch'+this.settings.inputs).appendTo(this._container);
						var input = jQuery('<input>').attr({'type':'tel','pattern': "[0-9]*", 'inputmode':"numeric",'maxlength':this.settings.inputs,'autocomplete':'off'}).addClass('form-control pincode-input-text').appendTo(wrapper);
		        		
						var touchtable = jQuery('<table>').addClass('touchtable').appendTo(wrapper);
						var row = jQuery('<tr/>').appendTo(touchtable);
						// create touch background elements (for showing user how many digits must be entered)
						for (var i = 0; i <  this.settings.inputs; i++) {
							if(i == (this.settings.inputs-1)){
								jQuery('<td/>').addClass('last').appendTo(row);
							}else{
								jQuery('<td/>').appendTo(row);
							}							
						}						
						if(this.settings.hidedigits){
							// hide digits
		        			input.attr('type','tel');
		        		}else{
							// show digits, also include default value
							input.val(currentValue[i]);
						}

		        		// add events
		        		this._addEventsToInput(input);

					}else{
						// for desktop mode we build one input for each digit
			        	for (var i = 0; i <  this.settings.inputs; i++) {

			        		var input = jQuery('<input>').attr({'type':'tel','maxlength':"1",'autocomplete':'off','placeholder':'.'}).addClass('form-control pincode-input-text').appendTo(this._container);
			        		if(this.settings.hidedigits){
										// hide digits
			        			input.attr('type','password');
			        		}else{
								// show digits, also include default value
								input.val(currentValue[i]);
							}

			        		if(i==0){
			        			input.addClass('first');
			        		}else if(i==(this.settings.inputs-1)){
			        			input.addClass('last');
			        		}else{
			        			input.addClass('mid');
			        		}

			        		// add events
			        		this._addEventsToInput(input);
			        	}
					}


		        	// error box
		        	this._error = jQuery('<div />').addClass('text-danger pincode-input-error').appendTo(this._container);

		        	//hide original element and place this before it
		        	jQuery(this.element).css( "display", "none" );
		            this._container.insertBefore(this.element);
				},
				enable:function(){
					 jQuery('.pincode-input-text',this._container).each(function( index, value ) {
								jQuery(value).prop('disabled', false);
					});
				},
				disable:function(){
					 jQuery('.pincode-input-text',this._container).each(function( index, value ) {
								jQuery(value).prop('disabled', true);
					});
				},
				focus:function(){
					jQuery('.pincode-input-text',this._container).first().select().focus();
				},
				clear:function(){
					 jQuery('.pincode-input-text',this._container).each(function( index, value ) {
		         		jQuery(value).val("");
		         	});
		         	this.updateOriginalInput();
				},
				_isTouchDevice:function(){
					// I know, sniffing is a really bad idea, but it works 99% of the times
					if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
					 	return true;
					}
				},
				_addEventsToInput:function(input){

	        		input.on('focus',function(e){
	        			 this.select();  //automatically select current value
	        		});

	        		input.on('keydown', jQuery.proxy(function(e){
							if(this._pwfield){
								// Because we need to prevent password saving by browser
								// remove the value here and change the type!
								// we do this every time the user types
								jQuery(this._pwfield).attr({'type':'text'});
								jQuery(this._pwfield).val("");
							}

							// prevent more input for touch device (we can't limit it)
							if(this._isTouchDevice()){
								if(e.keyCode  == 8 || e.keyCode  == 46){
									// do nothing on backspace and delete
									
								}else{
									if(jQuery(this.element).val().length == this.settings.inputs){
										e.preventDefault();
									    e.stopPropagation();
									}
								}
						
							}

						 this.settings.keydown(e);
		            },this));

	        		input.on('keyup', jQuery.proxy(function(e){
			        	// after every keystroke we check if all inputs have a value, if yes we call complete callback
	        			if(!this._isTouchDevice()){
		        			// on backspace or delete go to previous input box
		        			if(e.keyCode  == 8 || e.keyCode  == 46){
		        				// goto previous
		        				jQuery(e.currentTarget).prev().select();
		    					jQuery(e.currentTarget).prev().focus();
		        			}else{
		        				if(jQuery(e.currentTarget).val()!=""){
		            				jQuery(e.currentTarget).next().select();
		        					jQuery(e.currentTarget).next().focus();
		        				}
		        			}
	        			}
	        			
						// update original input box
	        			this.updateOriginalInput();

	        			if(this.check()){
	        				this.settings.complete(jQuery(this.element).val(), e, this._error);
	        			}
	        			
	        			// prevent more input for touch device (we can't limit it)
						if(this._isTouchDevice()){
							if(e.keyCode  == 8 || e.keyCode  == 46){
								// do nothing on backspace and delete								
							}else{
								if(jQuery(this.element).val().length == this.settings.inputs){
								    jQuery(e.currentTarget).blur();
								}
							}
					
						}
	        			
			        },this));
				}


		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		jQuery.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !jQuery.data( this, "plugin_" + pluginName ) ) {
								jQuery.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
