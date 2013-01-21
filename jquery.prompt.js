//
// Prompt
// A Non-blocking popup!
// @author Andrew Dodson
// @since Jan 2012
//
;(function($){

	var ignorelist = [];
	try{ignorelist = JSON.parse(localStorage.getItem('prompt.bugme')) || [];}catch(e){}
	if(!ignorelist instanceof Array){
		ignorelist = [];
	}


	$.fn.popup = function(message, callback, bugme ){
	
		if(typeof(callback) === 'boolean'){
			bugme = callback;
		}
		
		if(typeof(message) === 'function'){
			callback = message;
			message = null;
		}
		
		if(typeof(message) === 'string'){
			// wrap message
			message = $("<p>"+message+"</p>").get(0);
		}
		
		message = message || this;
		
		// cancel if open already, return an empty jQuery object
		if($('.jquery_prompt').length){return $();}

		// define callback
		callback = callback || function(p){return !!p;};
		
		// in the ignore list?
		var hash = $(message).text();
		if(bugme && "indexOf" in ignorelist && ignorelist.indexOf(hash)>-1){
			callback(bugme);
			return $();
		}

		// add `ESC` + `enter` listener
		var bind = function(e){
				if(e.which===27){
					$popup.find('form').trigger('reset');
				}
				else if (e.which === 13){
					$popup.find('form').trigger('submit');
				}
			};

		$(document).bind('keydown', bind );
		
		// build popup
		var $popup = $('<iframe class="jquery_prompt" allowtransparency=true frameborder="0" scrolling="auto" marginheight="0" marginwidth="0"></iframe><div class="jquery_prompt plugin"><form>'
						+'<div class="footer">'
						+'<input type="text" name="text" value="" style="display:none;"/>'
						+'<button type="reset" style="display:none;">Cancel</button>'
						+'<button type="submit" name="submit" value="1">Ok</button>'
						+'<br/><input name="bugme" id="bugme" type="checkbox" value="1" checked="checked" style="display:none;">'
						+'<label for="bugme" style="display:none;">keep asking me</label>'
						+'</div>'
					+'</form></div>')
				.prependTo("body")
				.find('form')
				.prepend(message)
				.submit(function(e){
					
					// trigger callback
					e.response = $('button[name=submit]',this).val() == 1 ? $('input[name=text]:visible',this).val() || true : false;

					try{
						callback.call(this, e);
					}
					catch(e){
						e.preventDefault();
						throw e;
					}

					if(!e.isDefaultPrevented()){
						// remove event listeners
						$(document).unbind('keydown', bind);

						// dont submit the form.
						e.preventDefault();
						// prevent the system from popping these messages again
						if(!$('input[name=bugme]',this).is(':checked')){
							ignorelist.push(hash);
							try{localStorage.setItem('prompt.bugme',JSON.stringify(ignorelist));}catch(e){}
						}
						// kill this popup
						$(this).parent().add($(this).parent().siblings('.jquery_prompt')).remove();
					}
					else{
						// reinstate the submit button if it was reset
						$('button[name=submit]', this).val('1');
					}
				})
				.bind('reset', function(){
					$('button[name=submit]', this).val(0);
					$(this).submit();
				})
				.find('button[type=submit]')
				.trigger('focus')
				.end()
				.end();
		
		// Let the user cancel these messages
		if(bugme){
			$popup.find('input[name=bugme], input[name=bugme] + label').show();
		}

		return $popup;
	};

	$.fn.prompt = function(message,callback,bugme){
		return $(this).popup(message,callback,bugme).find("input[name=text], button").show().end();
	};

	$.fn.alert = function(message,callback,bugme){
		return $(this).popup(message,callback,bugme);
	};

	$.fn.confirm = function(message,callback,bugme){
		return $(this).popup(message,callback,bugme).find("button").show().end();
	};
	
})(jQuery);