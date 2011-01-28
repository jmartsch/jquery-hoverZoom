(function($) {
/**
* hoverZoom // jQuery 1.4+
* demoURL https://github.com/jmar/jquery-hoverZoom
*
* @author    Jens Martsch <jmartsch@gmail.com>
* Copyright 2010 by Jens Martsch
* Licensed under the MIT license:
* http://creativecommons.org/licenses/MIT/
*
**/


/**
* hoverIntent r5 // 2007.03.27 // jQuery 1.1.2+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
*
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne <brian@cherne.net>
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY;};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev]);}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev]);};var handleHover=function(e){var p=(e.type=="mouseover"?e.fromElement:e.toElement)||e.relatedTarget;while(p&&p!=this){try{p=p.parentNode;}catch(e){p=this;}}if(p==this){return false;}var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);}if(e.type=="mouseover"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob);},cfg.timeout);}}};return this.mouseover(handleHover).mouseout(handleHover);};})(jQuery);

    jQuery.extend(jQuery.easing, {
	easeOutBack: function (x, t, b, c, d, s) {
	    if (s == undefined) s = 1.70158;
	    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	}
    });

    var log = function(message,type){
	    if (typeof console != "undefined" && typeof console.debug != "undefined" && opts.debug === true) {
		if (!type) console.log(message);
		else if (type == 'info') console.info(message);
	    } else {
	    //alert(s)
	    }
	}

    var methods = {
	init: function(options){
	    var largeImg = false, caption;

	    var defaults = {
		speedView: 200,
		speedRemove: 400,
		altAnim: true,
		speedCaption: 400,
		debug: false,
		ajaxLoader : 'ajax-loader.gif',
		width: 600,
		height: 400,
		easing: 'easeOutQuint',
		captionHeight: 32,
		breathingSize: 0,
		hoverIntent: true
	    };
	    opts = $.extend(defaults, options);
		    log('Options','info');
		    log('speedView: ' + opts.speedView);
		    log('speedRemove: ' + opts.speedRemove);
		    log('altAnim: ' + opts.altAnim);
		    log('speedCaption: ' + opts.speedCaption);

	    return this.each( function(){
                var original = $(this);
		// unabhängig von UL bleiben. soll auch bei einzelbildern funktionieren
		// dazu muss allerdings ein link vorhanden sein.
		//original.closest('li').css({width: original.width()+'px',height: original.height()+'px'});


		// Save original attributes in data object
		original.data('originalWidth',original.width());
		original.data('originalHeight',original.height());
		original.data('originalLeft',original.position().left);
		original.data('originalTop',original.position().top);

		// if the zoomContainer doesn´t exist yet, then create it
                if (!original.parent().parent().hasClass('zoomContainer')){
		    var zoomContainer = original.parent().wrap('<div class="zoomContainer" />');
		    var trigger = original.clone().appendTo(zoomContainer.parent().parent()).addClass('trigger');
		    zoomContainer.css('width',original.data('originalWidth')+'px');
		    zoomContainer.css('height', original.data('originalHeight')+'px');
		    zoomContainer = original.parent().parent();
		    original.addClass('original');
                }

		var alt = original.attr('alt');
		var caption = zoomContainer.find('.gallerycaption');
		if (caption.length == 0) caption = $('<div class="gallerycaption">' + alt + '</div>').appendTo(zoomContainer);
		// remove alt attribute for both images because IE displays ugly tooltips
		original.attr('alt','');
		trigger.attr('alt','');

		// save the original src of the thumbnail
		original.data('image', original.attr('src'));

		// Das ganze kann man auch ohne die if Abfrage mit einem Shorthand machen
		// (typeof $.fn.hoverIntent == "function") ? true : false;
		if (typeof $.fn.hoverIntent == "function" && opts.hoverIntent == true){
		    trigger.css({'z-index':'110','opacity':'0'}).hoverIntent(function() {
			//if (opts.debug == true) window.console.group(original);
			//if (typeof console != "undefined" && typeof console.debug != "undefined") window.console.clear();
			log('mouseenter on: '+original.attr('src'),'info');
			original.data('zoomedOut',false);
			$.fn.hoverZoom('loadImage',original,trigger,zoomContainer);

		    }, function() {
			log('mouseleave on: '+original.attr('src'),'info');
			$.fn.hoverZoom('zoomOut',original,trigger,zoomContainer);
			//if (opts.debug == true) window.console.groupEnd()
		    }).click(function(e){e.preventDefault();return false;});
		}
		else{
		    trigger.css({'z-index':'110','opacity':'0'}).hover(function() {
			//if (typeof console != "undefined" && typeof console.debug != "undefined") window.console.clear();
			log('mouseenter on: '+original.attr('src'),'info');
			$.fn.hoverZoom('loadImage',original,trigger,zoomContainer);
		    }, function() {
			log('mouseleave'+original.attr('src'),'info');
			$.fn.hoverZoom('zoomOut',original,trigger,zoomContainer);
		    }).click(function(e){e.preventDefault();return false;});
		}
            });


	},

	loadImage: function(original,trigger,zoomContainer){
	    log('function loadImage()','info');
	    if (original.parent('a').attr('href') && original.data('isLoaded') != true){

		original.largeImgSrc = original.parent('a').attr('href');
		log('largeImg that should be loaded: '+original.largeImgSrc);

		loading = $('<img src="'+opts.ajaxLoader+'" class="loading" />').insertAfter(original);

		loading.css({'left': (original.width() / 2 - loading.width() / 2) +'px', 'top': (original.width() / 2 - loading.width() / 2)})

		$('<img />').load(function(){
		    log('ready loading image: '+this.src);
			original.next('.loading').remove();
			original.data('isLoaded', true);
			original.data('loadedWidth', this.width);
			original.data('loadedHeight', this.height);
			// keep original dimensions when changing the src
			original.css({
			    width: original.data('originalWidth'),
			    height: original.data('originalHeight')
			});

			if (original.data('zoomedOut') != true) {
			    original.attr('src', original.largeImgSrc);
			    $.fn.hoverZoom('startZoom',original,trigger,zoomContainer);
			}
		}).attr('src', original.largeImgSrc);
	    }
	    else{
		log('Image already in cache.');
		original.attr('src', original.largeImgSrc);
		$.fn.hoverZoom('startZoom',original,trigger,zoomContainer);
	    }
	},
	startZoom: function(original,trigger,zoomContainer){

	    log('function startZoom()','info');
	    var width, height;
	    zoomContainer.addClass('zoomed');
	    if (width == undefined) width = original.data('loadedWidth');
	    if (height == undefined) height = original.data('loadedHeight');
	    caption = zoomContainer.find('.gallerycaption');
	    var dimensions = $.fn.hoverZoom('getDimensions',caption,zoomContainer,width,height);
	    log('returned dimensions: '+dimensions);

	    original.data('marginTop',0);
	    original.data('marginLeft',0);

            triggerPos = trigger.offset();
	    original.data('marginLeft', - triggerPos.left);
	    original.data('marginTop', - triggerPos.top);

	    // set z-index of parental element
	    // because IE 6-7 create a new stacking context on positioned elements
	    // see (bug in IE 6-7) http://therealcrisp.xs4all.nl/meuk/IE-zindexbug.html
	    if (original.closest('li').css('z-index') == 0) {
		original.closest('li').css({'z-index': '100'});
	    };

	    $.fn.hoverZoom('centerImage', original,zoomContainer,dimensions[2],dimensions[3]);

	    zoomContainer.css({'z-index': '100'}).stop(true,false).animate({
		top: original.data('itemTop'),
		left: original.data('itemLeft'),
		width: dimensions[0]  +'px',
		height: dimensions[1] + 'px',
		marginTop: original.data('marginTop') + 'px',
		marginLeft: original.data('marginLeft') + 'px'
	    }, opts.speedView+20,opts.easing, function(){
		//log('zoomcontainer width: '+zoomContainer.outerWidth());
	    });

	    original.css({'z-index': '105'}).stop(true,false).animate({
		width: dimensions[0] +'px',
		height: dimensions[1] + 'px'
	    }, opts.speedView,opts.easing,function(){
		if(caption.text() != '' && opts.altAnim == true) $.fn.hoverZoom('animateCaption',zoomContainer,dimensions);
	    });
	},
	animateCaption: function(zoomContainer,dimensions){
	    var captionpos;
	    if (opts.altAnim == true && caption != undefined) {
		log('function animatecaption()','info');
                caption = zoomContainer.find('.gallerycaption');
		captionHeight = caption.outerHeight();
		var paddingTop = caption.css('paddingTop');
		paddingTop = paddingTop.replace('px','');
		captionpos = dimensions[1] - captionHeight;
		caption.css({
		    'top': captionpos + 'px',
		    'z-index' : '101',
		    'width' : '100%'
		}).css('display','block');
		newcaptionpos = captionHeight;
		zoomContainer.animate({'height': '+='+newcaptionpos+'px'},opts.speedCaption,opts.easing);
		caption.animate({'top': '+='+newcaptionpos+'px'},opts.speedCaption,opts.easing);
            }
	},
	getViewport: function(){
	    log('function getViewport()','info');
	    $('body').data('viewport',[$(window).width(), $(window).height(), $(document).scrollLeft(), $(document).scrollTop() ]);
	    return [$(window).width(), $(window).height(), $(document).scrollLeft(), $(document).scrollTop() ];
	},
        centerImage: function(original,zoomContainer,width,height){
            // calculate left and top position of the zoomed image
	    log('function centerImage()','info');
	    var viewport = $('body').data('viewport');

	    original.data('itemLeft', width > viewport[0] ? viewport[2] : (viewport[2] + Math.round((viewport[0] - width) / 2)));
	    original.data('itemTop', height > viewport[1] ? viewport[3] : (viewport[3] + Math.round((viewport[1] - height) / 2)));
	    log('itemLeft: ' + original.data('itemLeft'));
	    log('itemTop: ' + original.data('itemTop'));
        },
	getDimensions: function(caption,zoomContainer,width,height){
	    log('function getDimensions()','info');

	    var viewport = $.fn.hoverZoom('getViewport');

	    // Wenn viewport 545 x 370 ist, dann passt es überhaupt nicht
	    //viewport = [545,370];

            // get the border width and height of the container
	    var bw = zoomContainer.outerWidth() - zoomContainer.width();
	    var bh = zoomContainer.outerHeight() - zoomContainer.height();


	    var imageProportion = width / height;
	    var winProportion = viewport[0] / viewport[1];


	    // Check if a caption exists
	    // and assign it´s height
	    var tt = caption.text()
	    var captionAdd = 0;

	    if(tt == '')  var captionHeight = 0;
	    else{
		var captionHeight = caption.outerHeight();
		var captionAdd = bh/2;
	    }

	    if (imageProportion > winProportion) {
		// calculate max width based on page width
		var maxWidth = viewport[0] - bw * 2 - opts.breathingSize * 2;
		var maxHeight = Math.round(maxWidth / imageProportion);
		log('calculate max width based on page width');
	    } else {
		// calculate max height base on page height
		var maxHeight = viewport[1] - captionHeight - bh - captionAdd;
		var maxWidth = Math.round(maxHeight * imageProportion);
		log('calculate max height based on page height');
	    }

	    // Wenn Bild größer ist als Viewport
	    if (width > maxWidth || height > maxHeight) {
	      width = maxWidth;
	      height = maxHeight;
	    }

	    log('Viewport: ' + viewport);
	    log('maxWidth: ' + maxWidth + ', maxHeight: '+maxHeight);
	    finalHeight = (height + bh + captionHeight + captionAdd + opts.breathingSize * 2);
	    finalWidth = (width + bw + opts.breathingSize * 2);
	    log('final width and height of the container: ' + finalWidth +',' + finalHeight);

	    return [width,height,finalWidth,finalHeight];
	},
	zoomOut: function(original,trigger,zoomContainer){
	    log('function zoomOut','info');

	    // restore thumbnail src
	    original.attr('src',original.data('image'));

	    // Remove the loading indicator
	    original.next('.loading').remove();

	    // Remove the caption
	    zoomContainer.find('.gallerycaption').css('display','none');

	    if (zoomContainer.hasClass('zoomed')) zoomContainer.css({'z-index': '0'}).removeClass("zoomed").stop(true,false).animate({
		marginTop: '0',
		marginLeft: '0',
		top: original.data('originalTop'),
		left: original.data('originalLeft'),
		width: original.data('originalWidth'),
		height: original.data('originalHeight')
	    }, opts.speedRemove,opts.easing,function(){
		//original.fadeIn('slow');
		//original.get(0).src = originalSrc;
		// reset z-index of parental li (fix for IE 6-7)
		if (original.closest('li').css('z-index') == 100) {
		    original.closest('li').css({'z-index': '0'});
		};
	    });

	    original.css({'z-index': '0'}).stop(true,false).animate({
		marginTop: '0',
		marginLeft: '0',
		top: original.data('originalTop'),
		left: original.data('originalLeft'),
		width: original.data('originalWidth'),
		height: original.data('originalHeight')
	    }, opts.speedRemove,opts.easing,function(){
		// reset z-index of parental li (fix for IE 6-7)
		//log(original.closest('li'));
		if (original.closest('li').css('z-index') == 100) {
		    original.closest('li').css({'z-index': '0'});
		};
	    });

	    original.data('zoomedOut',true);
	}
    };

    $.fn.hoverZoom = function(method) {
	if ( methods[method] ) {
	    return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
	    return methods.init.apply( this, arguments );
	} else {
	    $.error( 'Method ' +  method + ' does not exist on jQuery.zoomer' );
	}
    }
})(jQuery);