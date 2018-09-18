/*
 * jQuery Taconite plugin - A port of the Taconite framework by Ryan Asleson and
 *     Nathaniel T. Schutta: http://taconite.sourceforge.net/
 *
 * Examples and documentation at: http://malsup.com/jquery/taconite/
 * Copyright (c) 2007-2009 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Thanks to Kenton Simpson for contributing many good ideas!
 *
 * $Id: jquery.taconite.js 2457 2007-07-23 02:43:46Z malsup $
 * @version: 3.07  09-SEP-2009
 * @requires jQuery v1.2.6 or later
 */

(function($) {

$.taconite = function(xml) { processDoc(xml); };

$.taconite.debug = 0;  // set to true to enable debug logging to Firebug
$.taconite.version = '3.07';
$.taconite.defaults = {
    cdataWrap: 'div'
};

// add 'replace' and 'replaceContent' plugins (conditionally)
if (typeof $.fn.replace == 'undefined')
    $.fn.replace = function(a) { return this.after(a).remove(); };
if (typeof $.fn.replaceContent == 'undefined')
    $.fn.replaceContent = function(a) { return this.empty().append(a); };

$.expr[':'].taconiteTag = function(a) { return a.taconiteTag === 1; };

$.taconite._httpData = $.httpData; // original jQuery httpData function

// replace jQuery's httpData method
$.httpData = $.taconite.detect = function(xhr, type) {
    var ct = xhr.getResponseHeader('content-type');
    if ($.taconite.debug) {
        log('[AJAX response] content-type: ', ct, ';  status: ', xhr.status, ' ', xhr.statusText, ';  has responseXML: ', xhr.responseXML != null);
        log('type: ' + type);
        log('responseXML: ' + xhr.responseXML);
    }
    var data = $.taconite._httpData(xhr, type); // call original method
    if (data && data.documentElement) {
		$.taconite(data);
    }
    else { 
        log('jQuery core httpData returned: ' + data);
        log('httpData: response is not XML (or not "valid" XML)');
    }
    return data;
};

// allow auto-detection to be enabled/disabled on-demand
$.taconite.enableAutoDetection = function(b) {
    $.httpData = b ? $.taconite.detect : $.taconite._httpData;
};

var logCount = 0;
function log() {
    if (!$.taconite.debug || !window.console || !window.console.log) return;
    if (!logCount++)
        log('Plugin Version: ' + $.taconite.version);
    window.console.log('[taconite] ' + [].join.call(arguments,''));
};

function processDoc(xml) { 
    var status = true, ex;
    try {
		if (typeof xml == 'string')
			xml = convert(xml);
		if (!xml) {
			log('$.taconite invoked without valid document; nothing to process');
			return false;
		}
		
		var root = xml.documentElement.tagName;
		log('XML document root: ', root);
		
		var taconiteDoc = $('taconite', xml)[0];
			
		if (!taconiteDoc) {
			log('document does not contain <taconite> element; nothing to process');
			return false;
		}
		
		$.event.trigger('taconite-begin-notify', [taconiteDoc]);
        status = go(taconiteDoc); 
    } catch(e) {
        status = ex = e;
    }
    $.event.trigger('taconite-complete-notify', [xml, !!status, status === true ? null : status]);
    if (ex) throw ex;
};

// convert string to xml document
function convert(s) {
	var doc;
	log('attempting string to document conversion');
	try {
		if (window.DOMParser) {
			var parser = new DOMParser();
			doc = parser.parseFromString(s, 'text/xml');
		}
		else {
			doc = $("<xml>")[0];
			doc.async = 'false';
			doc.loadXML(s);
		}
	}
	catch(e) {
		if (window.console && window.console.error)
			window.console.error('[taconite] ERROR parsing XML string for conversion: ' + e);
		throw e;
	}
	var ok = doc && doc.documentElement && doc.documentElement.tagName != 'parsererror';
	log('conversion ', ok ? 'successful!' : 'FAILED');
	return doc;
};


function go(xml) {
    var trimHash = { wrap: 1 };

    try {
        var t = new Date().getTime();
        // process the document
        process(xml.childNodes);
        $.taconite.lastTime = (new Date().getTime()) - t;
        log('time to process response: ' + $.taconite.lastTime + 'ms');
    } catch(e) {
        if (window.console && window.console.error)
            window.console.error('[taconite] ERROR processing document: ' + e);
        throw e;
    }
    return true;
    
// process the taconite commands    
    function process(commands) {
        var doPostProcess = 0;
        for(var i=0; i < commands.length; i++) {
            if (commands[i].nodeType != 1)
                continue; // commands are elements
            var cmdNode = commands[i], cmd = cmdNode.tagName;
            if (cmd == 'eval') {
                var js = (cmdNode.firstChild ? cmdNode.firstChild.nodeValue : null);
                log('invoking "eval" command: ', js);
                if (js) $.globalEval(js);
                continue;
            }
            var q = cmdNode.getAttribute('select');
            var jq = $(q);
            if (!jq[0]) {
                log('No matching targets for selector: ', q);
                continue;
            }
            var cdataWrap = cmdNode.getAttribute('cdataWrap') || $.taconite.defaults.cdataWrap;

            var a = [];
            if (cmdNode.childNodes.length > 0) {
                doPostProcess = 1;
                for (var j=0,els=[]; j < cmdNode.childNodes.length; j++)
                    els[j] = createNode(cmdNode.childNodes[j]);
                a.push(trimHash[cmd] ? cleanse(els) : els);
            }

            // remain backward compat with pre 2.0.9 versions
            var n = cmdNode.getAttribute('name');
            var v = cmdNode.getAttribute('value');
            if (n !== null) a.push(n);
            if (v !== null) a.push(v);

            // @since: 2.0.9: support arg1, arg2, arg3...
            for (var j=1; true; j++) {
                v = cmdNode.getAttribute('arg'+j);
                if (v === null)
                    break;
                a.push(v);
            }

            if ($.taconite.debug) {
                var arg = els ? '...' : a.join(',');
                log("invoking command: $('", q, "').", cmd, '('+ arg +')');
            }
            jq[cmd].apply(jq,a);
        }
        // apply dynamic fixes
        if (doPostProcess) 
            postProcess();
    
        function postProcess() {
            if ($.browser.mozilla) return; 
            // post processing fixes go here; currently there is only one:
            // fix1: opera, IE6, Safari/Win don't maintain selected options in all cases (thanks to Karel Fučík for this!)
            $('select:taconiteTag').each(function() {
                var sel = this;
                $('option:taconiteTag', this).each(function() {
                    this.setAttribute('selected','selected');
                    this.taconiteTag = null;
                    if (sel.type == 'select-one') {
                        var idx = $('option',sel).index(this);
                        sel.selectedIndex = idx;
                    }
                });
                this.taconiteTag = null;
            });
        };
        
        function cleanse(els) {
            for (var i=0, a=[]; i < els.length; i++)
                if (els[i].nodeType == 1) a.push(els[i]);
            return a;
        };
        
        function createNode(node) {
            var type = node.nodeType;
            if (type == 1) return createElement(node);
            if (type == 3) return fixTextNode(node.nodeValue);
            if (type == 4) return handleCDATA(node.nodeValue);
            return null;
        };
        
        function handleCDATA(s) {
            var el = document.createElement(cdataWrap);
            el.innerHTML = s;
            
            // remove wrapper node if possible
            var $el = $(el), $ch = $el.children();
            if ($ch.size() == 1)
                return $ch[0];
            return el;
        };
        
        function fixTextNode(s) {
            if ($.browser.msie) s = s.replace(/\n/g, '\r').replace(/\s+/g, ' ');
            return document.createTextNode(s);
        };
        
        function createElement(node) {
            var e, tag = node.tagName.toLowerCase();
            // some elements in IE need to be created with attrs inline
            if ($.browser.msie) {
                var type = node.getAttribute('type');
                if (tag == 'table' || type == 'radio' || type == 'checkbox' || tag == 'button' || 
                    (tag == 'select' && node.getAttribute('multiple'))) {
                    e = document.createElement('<' + tag + ' ' + copyAttrs(null, node, true) + '>');
                }
            }
            if (!e) {
                e = document.createElement(tag);
                // copyAttrs(e, node, tag == 'option' && $.browser.safari);
                copyAttrs(e, node);
            }
            
            // IE fix; colspan must be explicitly set
            if ($.browser.msie && tag == 'td') {
                var colspan = node.getAttribute('colspan');
                if (colspan) e.colSpan = parseInt(colspan);
            }

            // IE fix; script tag not allowed to have children
            if($.browser.msie && !e.canHaveChildren) {
                if(node.childNodes.length > 0)
                    e.text = node.text;
            }
            else {
                for(var i=0, max=node.childNodes.length; i < max; i++) {
                    var child = createNode (node.childNodes[i]);
                    if(child) e.appendChild(child);
                }
            }
            if (! $.browser.mozilla) {
                if (tag == 'select' || (tag == 'option' && node.getAttribute('selected')))
                    e.taconiteTag = 1;
            }
            return e;
        };
        
        function copyAttrs(dest, src, inline) {
            for (var i=0, attr=''; i < src.attributes.length; i++) {
                var a = src.attributes[i], n = $.trim(a.name), v = $.trim(a.value);
                if (inline) attr += (n + '="' + v + '" ');
                else if (n == 'style') { // IE workaround
                    dest.style.cssText = v;
                    dest.setAttribute(n, v);
                }
                else $.attr(dest, n, v);
            }
            return attr;
        };
    };
};

})(jQuery);
