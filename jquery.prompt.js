/**
 * Prompt, 
 * A Non-blocking popup!
 * @author Andrew Dodson
 * @since Jan 2012
 */
;(function($){

	$.fn.popup = function(message, callback){
	
		if(typeof(message) === 'function'){
			callback = message;
			message = this;
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

		// add `ESC` + `enter` listener
		var bind = function(e){ 
				if(e.which===27){ 
					$popup.find('button[value=cancel]').trigger('click');
				} 
				else if (e.which === 13){
					$popup.find(':submit').trigger('click');
				} 
			};

		$(document).bind('keydown', bind );
		
		// build popup
		var $popup = $('<div class="jquery_prompt"><form><input type="text" name="text" value="" style="display:none;"/>'
						+'<input type="hidden" name="confirm" value="1">'
						+'<button type="button" value="cancel" style="display:none;">Cancel</button>'
						+'<button type="submit">Ok</button>'
					+'</form></div>')
				.appendTo("body")
				.find('form')
				.prepend(message)
				.submit(function(e){
					// prevent submission
					e.preventDefault();
					// remove event listeners
					$(document).unbind('keydown', bind);
					// trigger callback
					callback.call(this, $('input[name=confirm]',this).val() == 1 ? $('input[name=text]:visible',this).val() || true : false );
					// kill this popup
					$(this).parent().remove();
				})
				.find('button[value=cancel]')
				.click(function(){
					$('input[name=confirm]', this.form).val(0);
					$(this.form).submit();
				})
				.end()
				.find('button[type=submit]')
				.trigger('focus')
				.end()
				.end();

		return $popup;
	}

	$.fn.prompt = function(message,callback){
		return $(this).popup(message,callback).find("input, button").show().end();		
	}

	$.fn.alert = function(message,callback){
		return $(this).popup(message,callback);
	}	

	$.fn.confirm = function(message,callback){
		return $(this).popup(message,callback).find("button").show().end();
	}	
	
})(jQuery);