(function($){
	$.pageee = function(options){
		if(typeof options === "undefined"){
			options = {};
		}
		if(typeof options === "object"){
			options = $.extend({
				dragScroll  : true,
				keyScroll   : true,
				autoScroll  : false,
				pageSelector: ".pageee",
				customStyles: false,
				interval    : 3000
			}, options);
		}
		
		if(!options.customStyles){
			$("<style>                               \
				.pageee-hidden {                       \
					z-index: 0;                      \
				}                                    \
				.pageee-top {                          \
					top: -100%;                      \
				}                                    \
				.pageee-bottom {                       \
					top: 100%;                       \
				}                                    \
				.pageee-over {                         \
					z-index: 200;                    \
				}                                    \
				.pageee-shown {                        \
					z-index: 100;                    \
				}                                    \
			</style>").appendTo("head");
		}
		
		var page = 1;
		var lastPage = parseInt($(".pageee").eq(-1).data("pageee"), 10);
		var previousPage = lastPage;
		var nextPage = 2;
		$(options.pageSelector+":last").addClass("pageee-top");
		$(options.pageSelector).not(":last, :eq("+(page-1)+")").addClass("pageee-bottom");
		$(options.pageSelector).addClass("pageee-hidden").removeClass("pageee-shown");
		$("[data-pageee="+page+"]").toggleClass("pageee-shown pageee-hidden");
		var previousPageElm = $("[data-pageee="+previousPage+"]"), originalPrevTop = parseInt(previousPageElm.css("top"), 10);
		var nextPageElm = $("[data-pageee="+nextPage+"]"), originalNextTop = parseInt(nextPageElm.css("top"), 10);
		$(document).on("pageee-change", function(e, pageNum){
			$("[data-pageee="+pageNum+"]").stop().animate({top: 0});
			$("[data-pageee="+page+"]").toggleClass("pageee-shown pageee-hidden");
			$(options.pageSelector).removeClass("pageee-over pageee-top pageee-bottom");
			page = pageNum;
			previousPage = page == 1 ? lastPage: page - 1;
			nextPage = page == lastPage ? 1: page + 1;
			previousPageElm = $("[data-pageee="+previousPage+"]");
			previousPageElm.addClass("pageee-top").css("top", "-100%");
			originalPrevTop = parseInt(previousPageElm.css("top"), 10);
			nextPageElm = $("[data-pageee="+nextPage+"]");
			nextPageElm.addClass("pageee-bottom").css("top", "100%");
			originalNextTop = parseInt(nextPageElm.css("top"), 10);
			$("[data-pageee="+page+"]").toggleClass("pageee-shown pageee-hidden").removeClass("pageee-top pageee-bottom");
			clearInterval(window.__pageeeAuto);
			window.__pageeeAuto = window.setInterval(function(){
				$(document).trigger("pageee-change", nextPage);
			}, options.interval);
		});
		
		if(options.dragScroll){
			console.log("t");
			var mouseDown = false, clickY, originalClickY, prevMouseY = 0, scrollingTo = null;
			$(document).on({
				mousedown: function(e){
					mouseDown = true;
					prevMouseY = e.pageY;
					originalClickY = e.pageY;
				}, 
				mousemove: function(e){
					if(mouseDown){
						if(originalClickY < e.pageY){
							nextPageElm.removeClass("pageee-over").css("top", "100%");
							previousPageElm.addClass("pageee-over");
							if(prevMouseY < e.pageY) clickY = 3;
							else if(prevMouseY > e.pageY) clickY = -3;
							else return false;
							previousPageElm.css("top", parseInt(previousPageElm.css("top"), 10) + clickY);
							prevMouseY = e.pageY;
							scrollingTo = -1;
						} else if(e.pageY < originalClickY){
							previousPageElm.removeClass("pageee-over").css("top", "-100%");
							nextPageElm.addClass("pageee-over");
							if(prevMouseY < e.pageY) clickY = 3;
							else if(prevMouseY > e.pageY) clickY = -3;
							else return false;
							nextPageElm.css("top", parseInt(nextPageElm.css("top"), 10) + clickY);
							prevMouseY = e.pageY;
							scrollingTo = +1;
						}
					}
				},
				mouseup: function(e){
					if(mouseDown){
						mouseDown = false;
						if(scrollingTo < 0){
							if(0 - (originalPrevTop - parseInt(previousPageElm.css("top"), 10)) > 40){
								$(document).trigger("pageee-change", previousPage);
								originalClickY = 0;
								clickY = 0;
								prevMouseY = 0;
								scrollingTo = null;
							} else{
								previousPageElm.stop().animate({top: "-100%"});
							}
						} else{
							if(originalNextTop - parseInt(nextPageElm.css("top"), 10) > 40){
								$(document).trigger("pageee-change", nextPage);
								originalClickY = 0;
								clickY = 0;
								prevMouseY = 0;
								scrollingTo = null;
							} else{
								nextPageElm.stop().animate({top: "100%"});
							}
						}
					}
				}
			});
			
			$(document).on({
				touchstart: function(e){
					mouseDown = true;
					prevMouseY = e.originalEvent.touches[0].pageY;
					originalClickY = e.originalEvent.touches[0].pageY;
				}, 
				touchmove: function(e){
					if(mouseDown){
						if(originalClickY < e.originalEvent.touches[0].pageY){
							nextPageElm.removeClass("pageee-over").css("top", "100%");
							previousPageElm.addClass("pageee-over");
							if(prevMouseY < e.originalEvent.touches[0].pageY) clickY = 3;
							else if(prevMouseY > e.originalEvent.touches[0].pageY) clickY = -3;
							else return false;
							previousPageElm.css("top", parseInt(previousPageElm.css("top"), 10) + clickY);
							prevMouseY = e.originalEvent.touches[0].pageY;
							scrollingTo = -1;
						} else if(e.originalEvent.touches[0].pageY < originalClickY){
							previousPageElm.removeClass("pageee-over").css("top", "-100%");
							nextPageElm.addClass("pageee-over");
							if(prevMouseY < e.originalEvent.touches[0].pageY) clickY = 3;
							else if(prevMouseY > e.originalEvent.touches[0].pageY) clickY = -3;
							else return false;
							nextPageElm.css("top", parseInt(nextPageElm.css("top"), 10) + clickY);
							prevMouseY = e.originalEvent.touches[0].pageY;
							scrollingTo = +1;
						}
					}
				},
				touchend: function(e){
					if(mouseDown){
						mouseDown = false;
						if(scrollingTo < 0){
							if(0 - (originalPrevTop - parseInt(previousPageElm.css("top"), 10)) > 40){
								$(document).trigger("pageee-change", previousPage);
								originalClickY = 0;
								clickY = 0;
								prevMouseY = 0;
								scrollingTo = null;
							} else{
								previousPageElm.stop().animate({top: "-100%"});
							}
						} else{
							if(originalNextTop - parseInt(nextPageElm.css("top"), 10) > 40){
								$(document).trigger("pageee-change", nextPage);
								originalClickY = 0;
								clickY = 0;
								prevMouseY = 0;
								scrollingTo = null;
							} else{
								nextPageElm.stop().animate({top: "100%"});
							}
						}
					}
				}
			});
		}
		if(options.keyScroll){
			var scrollingTo = null, allowed = true;
			$(document).on({
				keydown: function(e){
					if(!allowed) return false;
					var code = e.keyCode || e.which;
					if(code == 38){
						previousPageElm.addClass("pageee-over");
						previousPageElm.stop().animate({
							top: parseInt(previousPageElm.css("top"), 10) + 40
						});
						scrollingTo = -1;
					} else if(code == 40){
						nextPageElm.addClass("pageee-over");
						nextPageElm.stop().animate({
							top: parseInt(nextPageElm.css("top"), 10) - 40
						});
						scrollingTo = 1;
					}
					allowed = false;
				},
				keyup: function(e){
					if(scrollingTo < 0){
						$(document).trigger("pageee-change", previousPage);
					} else{
						$(document).trigger("pageee-change", nextPage);
					}
					allowed = true;
				}
			});
		}
		if(options.autoScroll){
			window.__pageeeAuto = window.setInterval(function(){
				$(document).trigger("pageee-change", nextPage);
			}, options.interval);
		}
	};
}(jQuery));
