/* jQuery jqEasyCharCounter plugin
 * Examples and documentation at: http://www.jqeasy.com/
 * Version: 1.0 (05/07/2010)
 * No license. Use it however you want. Just keep this notice included.
 * Requires: jQuery v1.3+
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
(function($) {

$.fn.extend({
    jqEasyCounter: function(givenOptions) {
        return this.each(function() {
            var $this = $(this),
                options = $.extend({
                    maxChars: 140,
					maxCharsWarning: 130,
					msgFontSize: '100%',
					msgFontColor: '#000',
					msgFontFamily: 'inherit',
					msgTextAlign: 'right',
					msgWarningColor: '#F00',
					msgAppendMethod: 'insertAfter'
                }, givenOptions);
	
			if(options.maxChars <= 0) return;
			// create counter element
			var jqEasyCounterMsg = $("<div class=\"jqEasyCounterMsg\">&nbsp;</div>");
			var jqEasyCounterMsgStyle = {
				'font-size' : options.msgFontSize,
				'font-family' : options.msgFontFamily,
				'color' : options.msgFontColor,
				'text-align' : options.msgTextAlign,
				'width' : '100%',
				'opacity' : 0
			};
			jqEasyCounterMsg.css(jqEasyCounterMsgStyle);
			// append counter element to DOM
			if (options.target) {
                jqEasyCounterMsg.appendTo($(options.target));
                $(options.target).show();
            }
            else {
			    jqEasyCounterMsg[options.msgAppendMethod]($this);
            }
			
			// bind events to this element
			$this
				.bind('keydown keyup keypress focus',function() {
                    // allow chance for other events to modify value first
                    // e.g., hint plugins that clear the value on focus
                    setTimeout(doCount, 1);
                });
			function doCount(){
				var val = $this.val(),
					length = val.length;
				
				if(length >= options.maxChars) {
					val = val.substring(0, options.maxChars); 				
				}
				
				if(length > options.maxChars){
					// keep scroll bar position
					var originalScrollTopPosition = $this.scrollTop();
					$this.val(val.substring(0, options.maxChars));
					$this.scrollTop(originalScrollTopPosition);
				}
				
				if(length >= options.maxCharsWarning){
					jqEasyCounterMsg.css({"color" : options.msgWarningColor});
				}else {
					jqEasyCounterMsg.css({"color" : options.msgFontColor});
				}
				
				jqEasyCounterMsg.html(options.maxChars - $this.val().length);
                jqEasyCounterMsg.stop().fadeTo( 'fast', 1);
			}
        });
    }
});

})(jQuery);
