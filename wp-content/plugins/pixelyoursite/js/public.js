jQuery(document).ready(function($){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');regularEvents();customCodeEvents();$(".ajax_add_to_cart").click(function(e){var attr=$(this).attr('data-pys-event-id');if(typeof attr=='undefined'||typeof pys_woo_ajax_events=='undefined'){return;}evaluateEventByID(attr.toString(),pys_woo_ajax_events);});$('.edd-add-to-cart').click(function(){try{var classes=$.grep(this.className.split(" "),function(element,index){return element.indexOf('pys-event-id-')===0;});if(typeof classes=='undefined'||classes.length==0){return;}var regexp=/pys-event-id-(.*)/;var event_id=regexp.exec(classes[0]);if(event_id==null){return;}evaluateEventByID(event_id[1],pys_edd_ajax_events);}catch(e){console.log(e);}});function regularEvents(){if(typeof pys_events=='undefined'){return;}for(var i=0;i<pys_events.length;i++){var eventData=pys_events[i];if(eventData.hasOwnProperty('delay')==false||eventData.delay==0){fbq(eventData.type,eventData.name,eventData.params);}else{setTimeout(function(type,name,params){fbq(type,name,params);},eventData.delay*1000,eventData.type,eventData.name,eventData.params);}}}function customCodeEvents(){if(typeof pys_customEvents=='undefined'){return;}$.each(pys_customEvents,function(index,code){eval(code);});}function evaluateEventByID(eventID,events){if(typeof events=='undefined'||events.length==0){return;}if(events.hasOwnProperty(eventID)==false){return;}var eventData=events[eventID];if(eventData.hasOwnProperty('custom')){eval(eventData.custom);}else{fbq(eventData.type,eventData.name,eventData.params);}}});