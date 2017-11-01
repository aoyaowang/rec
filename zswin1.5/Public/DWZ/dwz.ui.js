function initEnv() {
	$("body").append(DWZ.frag["dwzFrag"]);
	//dwz.core.js中已经集成了判断类型的方法

	if ( useIEversion()== 6 ) {
		
		
		try {
			document.execCommand("BackgroundImageCache", false, true);
		}catch(e){}
	}
	//清理浏览器内存,只对IE起效
	if (userBrowser()=='IE') {
		
		window.setInterval("CollectGarbage();", 10000);
	}

	$(window).resize(function(){
		initLayout();
		$(this).trigger(DWZ.eventType.resizeGrid);
	});

	var ajaxbg = $("#background,#progressBar");
	ajaxbg.hide();
	$(document).ajaxStart(function(){
		ajaxbg.show();
	}).ajaxStop(function(){
		ajaxbg.hide();
	});
	
	$("#leftside").jBar({minW:200, maxW:700});
	
	if ($.taskBar) $.taskBar.init();
	navTab.init();
	
	if ($.fn.navMenu) $("#navMenu").navMenu();
		
	setTimeout(function(){
		initLayout();
		initUI();
		
		// navTab styles
		
	
	}, 10);

}
function initLayout(){
	var iContentW = $(window).width() - (DWZ.ui.sbar ? $("#sidebar").width() + 10 : 34) - 5;
	var iContentH = $(window).height() - $("#header").height() - 34;

	$("#container").width(iContentW-7);
	$("#container .tabsPageContent").height(iContentH - 34-5).find("[layoutH]").layoutH();
	$("#sidebar").height($(window).height()-45);
	
	$("#taskbar").css({top: "-7px", width:$(window).width()});
}

function initUI(_box){
	var $p = $(_box || document);
	
	
	//tab切换的时候也会影响checkbox
	   $('.btn-close,.close').click(function(){
			
			
			var classbacktype=$(this).closest('.pageForm').attr('callback');
			
			if(classbacktype == 'dialogAjaxDone'){
				navTab.reload('');
			}
			//
			//临时添加，点击关闭按钮时刷新右侧局部页面，否则全选无效

			
			});
	

	//tables
	$("table.j-table", $p).jTable();
	


	//auto bind tabs
	$("div.tabs", $p).each(function(){
		var $this = $(this);
		var options = {};
		options.currentIndex = $this.attr("currentIndex") || 0;
		options.eventType = $this.attr("eventType") || "click";
		$this.tabs(options);
	});


	
	if ($.fn.uploadify) {
		$(":file[uploaderOption]", $p).each(function(){
			var $this = $(this);
			var options = {
				fileObjName: $this.attr("name") || "file",
				auto: true,
				multi: true,
				onUploadError: uploadifyError
			};
			
			var uploaderOption = DWZ.jsonEval($this.attr("uploaderOption"));
			$.extend(options, uploaderOption);

			DWZ.debug("uploaderOption: "+DWZ.obj2str(uploaderOption));
			
			$this.uploadify(options);
		});
	}
	
	// init styles
	$("input[type=text], input[type=password], textarea", $p).addClass("textInput").focusClass("focus");

	$("input[readonly], textarea[readonly]", $p).addClass("readonly");
	$("input[disabled=true], textarea[disabled=true]", $p).addClass("disabled");

	$("input[type=text]", $p).not("div.tabs input[type=text]", $p).filter("[alt]").inputAlert();

	//Grid ToolBar
	$("div.panelBar li, div.panelBar", $p).hoverClass("hover");

	//Button
	$("div.button", $p).hoverClass("buttonHover");
	$("div.buttonActive", $p).hoverClass("buttonActiveHover");
	
	//tabsPageHeader
	$("div.tabsHeader li, div.tabsPageHeader li, div.accordionHeader, div.accordion", $p).hoverClass("hover");




		// navTab
		$("a[target=navTab]", $p).each(function(){
			$(this).click(function(event){
				
				var $this = $(this);
				var title = $this.attr("title") || $this.text();
				var tabid = $this.attr("rel") || "_blank";
				var fresh = eval($this.attr("fresh") || "true");
				var external = eval($this.attr("external") || "false");
				var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
				DWZ.debug(url);
				if (!url.isFinishedTm()) {
					alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
					return false;
				}
				navTab.openTab(tabid, url,{title:title, fresh:fresh, external:external});

				event.preventDefault();
			});
		});
	
		//dialogs
		$("a[target=dialog]", $p).each(function(){
			$(this).click(function(event){
				var $this = $(this);
				var title = $this.attr("title") || $this.text();
				var rel = $this.attr("rel") || "_blank";
				var options = {};
				var w = $this.attr("width");
				var h = $this.attr("height");
				if (w) options.width = w;
				if (h) options.height = h;
				options.max = eval($this.attr("max") || "false");
				options.mask = eval($this.attr("mask") || "false");
				options.maxable = eval($this.attr("maxable") || "true");
				options.minable = eval($this.attr("minable") || "true");
				options.fresh = eval($this.attr("fresh") || "true");
				options.resizable = eval($this.attr("resizable") || "true");
				options.drawable = eval($this.attr("drawable") || "true");
				options.close = eval($this.attr("close") || "");
				options.param = $this.attr("param") || "";

				var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
				DWZ.debug(url);
				if (!url.isFinishedTm()) {
					alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
					return false;
				}
				$.pdialog.open(url, rel, title, options);
				
				return false;
			});
		});
		
	
		
		$("a[target=ajax]", $p).each(function(){
			$(this).click(function(event){
				var $this = $(this);
				var rel = $this.attr("rel");
				if (rel) {
					var $rel = $("#"+rel);
					$rel.loadUrl($this.attr("href"), {}, function(){
						$rel.find("[layoutH]").layoutH();
					});
				}

				event.preventDefault();
			});
		});
	

	$('#homeindex').click(function(){
		
		navTab._switchTab(0);
		
	});
	
	
	
	
	$("div.pagination-box", $p).each(function(){
		var $this = $(this);
		$this.pagination({
			targetType:$this.attr("targetType"),
			rel:$this.attr("rel"),
			totalCount:$this.attr("totalCount"),
			numPerPage:$this.attr("numPerPage"),
			pageNumShown:$this.attr("pageNumShown"),
			currentPage:$this.attr("currentPage")
		});
	});

	

	// dwz.ajax.js
	if ($.fn.ajaxTodo) $("a[target=ajaxTodo]", $p).ajaxTodo();
	if ($.fn.dwzExport) $("a[target=dwzExport]", $p).dwzExport();

	if ($.fn.lookup) $("a[lookupGroup]", $p).lookup();
	if ($.fn.multLookup) $("[multLookup]:button", $p).multLookup();
	if ($.fn.suggest) $("input[suggestFields]", $p).suggest();
	if ($.fn.itemDetail) $("table.itemDetail", $p).itemDetail();
	if ($.fn.selectedTodo) $("a[target=selectedTodo]", $p).selectedTodo();
	if ($.fn.pagerForm) $("form[rel=pagerForm]", $p).pagerForm({parentBox:$p});
    if ($.fn.checkedExport) $("a[target=checkedExport]", $p).checkedExport(); //选中导出
    if ($.fn.checkedAjaxTodo) $("a[target=checkedAjaxTodo]", $p).checkedAjaxTodo(); //选中项ajaxPost
	// 执行第三方jQuery插件【 第三方jQuery插件注册：DWZ.regPlugins.push(function($p){}); 】
	$.each(DWZ.regPlugins, function(index, fn){
		fn($p);
	});
	//show more Search
	 $('.j-showMoreSearch', $p).each(function() {
	        var $this = $(this);
	        var rel   = $this.attr('rel');
	        if (!rel) rel = new Date().getTime();
	        rel = 'moreSearch_'+ rel;
	        var $more = $p.find('.moreSearch');
	        $this.click(function() {
	            if ($more.length == 0) return;
	            if ($more.is(':visible')) {
	                $this.html('<i class="icon-double-angle-down"></i>');
	                $('body').data(rel, false);
	            } else {
	            	
	            	
	            	
	                $this.html('<i class="icon-double-angle-up"></i>');
	                $('body').data(rel, true);
	            }
	            $more.fadeToggle('slow', 'linear');
	        });
	        if ($('body').data(rel)) {
	            $more.fadeIn();
	            $this.html('<i class="icon-double-angle-up"></i>');
	        }
	    });
		$('#sidebar .sub-menu > a').click(function () {
	        var o = $(this).offset();
	       
	        diff = 250 - o.top;
	        
	        
	        if(diff>0){

	            $("#sidebar").scrollTo("-="+Math.abs(diff),500);
	        
	        }else{
	        	 $("#sidebar").scrollTo("+="+Math.abs(diff),500);
	            
	        	
	        }
	           
	    });

		$("#sidebar").niceScroll({styler:"fb",cursorcolor:"#ccc", cursorwidth: '4', cursorborderradius: '', background: '#404040', spacebarenabled:false, cursorborder: ''});
    $('select.selectpicker', $p).selectpicker();
    //i-check
    $('.j-icheck').iCheck({
    	
        checkboxClass: 'icheckbox_minimal-purple',
        radioClass: 'iradio_minimal-purple',
        increaseArea: '20%' // optional
    });
    $(':checkbox.checkboxCtrl', $p).on('ifChanged', function(event) {
    	
        var checked = event.target.checked == true ? 'check' : 'uncheck';
        var group = $(this).attr('group');
        $(":checkbox[name='"+ group +"']", $p).iCheck(checked);
    });
    $('textarea.autosize', $p).autosize();
    //根据input[text|password]、textarea的size或cols属性固定宽度(以适应不同浏览器)
    $(':text, :password, textarea', $p).each(function() {
        var $this = $(this);
        var $itemDetail = $this.closest('table.itemDetail');
        if (!$itemDetail.length) {
            var size = $this.attr('size') || $this.attr('cols');
            if (!size) return;
            var width = size * 10;
            if (width) $this.css('width', width);
        }
    });
    $('.form-group', $p).each(function() {
        var $this = $(this);
        var size = $this.attr('size');
        if (!size) return;
        var width = size * 10;
        if (width) $this.css('width', width);
        
    });
    
    //validate form
    $("form.form-validate", $p).each(function() {
        var $this       = $(this);
        var overflowDIV = $this.attr('overflowDIV') || '.pageFormContent';
        var callback    = $this.attr('callback') || DWZ.ajaxDone;
     
        if (callback) 
            callback = str2Func(callback);
        
        $this.validationEngine({
            isOverflown: true,
            overflowDIV: overflowDIV,
            promptPosition: 'bottomRight',
            onValidationComplete: function(form, valid) {
        	
                if (valid) {
                    return validateCallback(form, callback);
                } else {
                    return false;
                };
            }
        });
    });
    
    //form添加noEnter属性，禁止文本框回车提交
    $('form[noEnter]', $p).each(function() {
        $(':text', $(this)).keypress(function(e) {
            var key = e.which;
             if(key == 13)
                return false;
        });
    });
    //编辑/只读表格
    $('table.itemDetail tbody', $p).each(function() {
        var $tbody = $(this);
        function _doEdit($tr, $edit) {
            $tr.attr('isreadonly', '').find('.form-control').each(function() {
                var $this = $(this);
                $this.removeClass('readonly').prop('readonly', false);
                if ($this.hasClass('date') && _datePicker) _datePicker($this);
            });
            $tr.find('.zs-lookup, .uploadify', $tr).show();
            $tr.find('button.selectpicker').prop('disabled', false);//.selectpicker('refresh');
            $edit && $edit.text('完成');
        }
        function _doRead($tr, $edit) {
            $tr.attr('isreadonly', true).find('.form-control').addClass('readonly').prop('readonly', true).css('cursor', 'text');
            $tr.find('.j-lookup, .uploadify').hide();
            $tr.find('button.selectpicker').prop('disabled', true);//.selectpicker('refresh');
            $tr.find('input.date').off('click');
            $edit && $edit.text('编辑');
        }
        $tbody.find('tr.readonly').each(function() {
            _doRead($(this));
        });
        $tbody.find('.j-edit').click(function() {
            var $this = $(this);
            var $tr   = $this.closest('tr');
            $tr.attr('isreadonly') ? _doEdit($tr, $this) : _doRead($tr, $this);
        });
        $tbody.on('dblclick', 'tr.readonly', function() {
            var $this = $(this);
            var $edit = $this.find('.j-edit');
            $this.attr('isreadonly') ? _doEdit($this, $edit) : _doRead($this, $edit);
        });
    });
  //编辑器
    $('textarea.j-content', $p).each(function() {
        var editor = $(this);
            pasteType       = editor.attr('pasteType'),
            uploadJson      = editor.attr('uploadJson'),
            fileManagerJson = editor.attr('fileManagerJson'),
            items           = editor.attr('items'),
            minHeight       = editor.attr('minHeight') || 260,
            autoHeight      = editor.attr('autoHeight'),
            afterUpload     = editor.attr('afterUpload') || null,
            afterSelectFile = editor.attr('afterSelectFile') || null;
           
        if (items) {
            items = items.split(',');
        } else {
            items = KindEditor.options.items;
        }
        if (afterUpload) {
            afterUpload = str2Func(afterUpload);
        }
        if (afterSelectFile) {
            afterSelectFile = str2Func(afterSelectFile);
        }
        
        if (autoHeight && autoHeight != 'true') autoHeight = false;
        var htmlTags = {
            font : [/*'color', 'size', 'face', '.background-color'*/],
            span : ['.color', '.background-color', '.font-size', '.font-family'
                    /*'.color', '.background-color', '.font-size', '.font-family', '.background',
                    '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'*/
            ],
            div : ['.margin', '.padding', '.text-align'
                    /*'align', '.border', '.margin', '.padding', '.text-align', '.color',
                    '.background-color', '.font-size', '.font-family', '.font-weight', '.background',
                    '.font-style', '.text-decoration', '.vertical-align', '.margin-left'*/
            ],
            table: ['align', 'width'
                    /*'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
                    '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
                    '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
                    '.width', '.height', '.border-collapse'*/
            ],
            'td,th': ['align', 'valign', 'width', 'height', 'colspan', 'rowspan'
                    /*'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
                    '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
                    '.font-style', '.text-decoration', '.vertical-align', '.background', '.border'*/
            ],
            a : ['href', 'target', 'name'],
            embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
            img : ['src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
            'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
                'class', 'align', '.text-align', '.color', /*'.background-color', '.font-size', '.font-family', '.background',*/
                '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
            ],
            pre : ['class'],
            hr : ['class', '.page-break-after'],
            'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del' : []
        }
        KindEditor.create(editor, {
            pasteType                : pasteType,
            minHeight                : minHeight,
            autoHeightMode           : autoHeight,
            items                    : items,
            uploadJson               : uploadJson,
            fileManagerJson          : fileManagerJson,
            allowFileManager         : true,
            fillDescAfterUploadImage : false,
            afterUpload              : afterUpload,
            afterSelectFile          : afterSelectFile,
            htmlTags                 : htmlTags,
            cssPath                  : _PUBLIC_+'DWZ/editor-content.css',
            afterBlur                : function() {this.sync();}
        });
    });
    //dragsort
    if ($.fn.dragsort) {
        $('.zs-dragsort', $p).each(function() {
            var $this = $(this);
            var selector    = $this.data('selector') || 'div',
                exclude     = $this.data('exclude') || 'input, textarea',
                dragend     = $this.data('dragend'),
                dragBetween = $this.data('between') || false,
                placeholder = $this.data('placeholder'),
                s_container = $this.data('scrollcontainer') || window,
                otherBox    = $this.data('otherbox') || null;
            if (placeholder) {
                placeholder = $(placeholder).html();
            } else {
                placeholder = '<li class="placeHolder"><div></div></li>';
            }
            if (dragend) {
                dragend = str2Func(dragend) || function() {};
            } else {
                dragend = function() {};
            }
            if (s_container && s_container != window) {
                s_container = $this.closest(s_container);
                if (!s_container.length) s_container = window;
            }
            var $dragBox = $this;
            if (otherBox && $(otherBox).length) $dragBox = $this.add(otherBox);
            $dragBox.dragsort({
                dragSelector        : selector, // 需要拖动的子元素选择器
                dragSelectorExclude : exclude,  // 需要排除的可拖动元素
                dragEnd             : dragend,  // 拖动结束回调
                dragBetween         : dragBetween,  // 是否允许在多个容器间互相拖拽
                placeHolderTemplate : placeholder,  // 拖动时[目的地]的占位模板
                scrollContainer     : s_container
            });
        });
    }
    
    //bootstrap - tooltips
    $('.zs-date', $p).each(function() {
        var $this = $(this);
        var dateformat   = $this.data('date-format') || "yyyy-mm-dd";
        var autoclose   = $this.data('autoclose') || true;
        var todayBtn   = $this.data('todayBtn') || true;
        var pickerPosition   = $this.data('pickerPosition') || "bottom-left";
        $this.datetimepicker({
        	format: dateformat,
        	autoclose: autoclose,
            todayBtn: todayBtn,
            pickerPosition: pickerPosition});
    });
    $('.zs-tooltip', $p).each(function() {
        var $this = $(this);
        var html      = $this.data('html') || false;
        var placement = $this.data('placement') || 'auto';
        var content   = $this.data('content') || $($this.data('el-content')).html() || $this.attr('title') || false;
        $this.tooltip({html:html, placement:placement, title:content, container:'body'});
    });
    //bootstrap - popover
    $('.zs-popover', $p).each(function() {
        var $this = $(this);
        var html      = $this.data('html') || false;
        var content   = $this.data('content') || $($this.data('el-content')).html() || false;
        var placement = $this.data('placement') || 'auto';
        var trigger   = $this.data('trigger') || 'click';
        $this.popover({html:html, placement:placement, content:content, trigger:trigger});
    });
    
  //bootstrap - tags
    if ($.fn.tags) {
        $(".tags-control", $p).each(function() {
            var $this = $(this);
            
            var url   = $this.data('url'),
                type  = $this.data('type') || 'GET',
                param = $this.data('parametername') || 'tagName',
                max   = $this.data('max') || 0,
                clear = $this.data('clearnotfound') || false;
            $this.tags({
                url: url,
                type: type,
                parameterName: param,   // 生成的<input type='hidden' />的name属性
                max: max,              // 允许的最大标签个数(0=不限)
                clearNotFound: clear   // 是否清除未查找到的输入字符
            });
        });
    }
    
  
}


