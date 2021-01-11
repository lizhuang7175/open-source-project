(function (window) {
    //默认的配置
    let defaultProperty = {
        direction: 'right',
        tipColor: 'rgba(0, 119, 169, 0.92)',
        tipFontColor: '#ffffff'
    };
    let xmzTips = {
        initTips: function(el, xmzTipId, tipConfig) {
            let tipContent = document.createElement("div"),
                commonBackColor = tipConfig.tipColor ? tipConfig.tipColor : defaultProperty.tipColor;   //背景颜色
            tipConfig = tipConfig || {};
            //一些非必填属性,如果未设置则赋值默认值
            tipConfig.direction = tipConfig.direction || defaultProperty.direction; //方向
            if (tipConfig.width && typeof tipConfig.width === 'number') {   //给提示框设置宽度
                tipContent.style.width = tipConfig.width + "px";
            }
            tipContent.style.color = tipConfig.tipFontColor ? tipConfig.tipFontColor : defaultProperty.tipFontColor;    //文字颜色
            tipContent.style.backgroundColor = commonBackColor;
            //设置小三角（伪类）
            tipContent.setAttribute("xmz-tip-id", xmzTipId);
            let styleEle = document.createElement("style"),
                headEle = document.getElementsByTagName("head")[0],
                beforeCssCode;
            styleEle.type = "text/css";
            switch (tipConfig.direction) {
                case "top":
                    //小三角样式（css伪类）
                    beforeCssCode = "[xmz-tip-id=" + xmzTipId +"]:before {border-color: " + commonBackColor + " transparent transparent transparent}";
                    break;
                case "right":
                    beforeCssCode = "[xmz-tip-id=" + xmzTipId +"]:before {border-color: transparent " + commonBackColor + " transparent transparent}";
                    break;
                case "bottom":
                    beforeCssCode = "[xmz-tip-id=" + xmzTipId +"]:before {border-color: transparent transparent " + commonBackColor + " transparent}";
                    break;
                case "left":
                    beforeCssCode = "[xmz-tip-id=" + xmzTipId +"]:before {border-color: transparent transparent transparent " + commonBackColor + "}";
            }

            styleEle.appendChild(document.createTextNode(beforeCssCode));
            headEle.appendChild(styleEle);

            el.addEventListener("mouseenter", function () {
                let boundingClientRect = el.getBoundingClientRect(),
                    currentLeft = boundingClientRect.left,
                    currentTop = boundingClientRect.top,
                    currentWidth = el.offsetWidth,
                    currentHeight = el.offsetHeight;

                xmzTips.tipContentSetter(tipContent, tipConfig.content, tipConfig.direction);
                let tipContentWidth = tipContent.offsetWidth,
                    tipContentHeight = tipContent.offsetHeight;
                switch (tipConfig.direction) {
                    case "top":
                        //提示窗定位
                        tipContent.style.left = currentLeft + currentWidth / 2 - tipContentWidth / 2 + "px";
                        tipContent.style.top = window.scrollY + currentTop - tipContentHeight - 7 + "px";
                        break;
                    case "left":
                        tipContent.style.left = currentLeft - tipContentWidth - 7 + "px";
                        tipContent.style.top = window.scrollY + currentTop + currentHeight / 2 - tipContentHeight / 2 + "px";
                        break;
                    case "right":
                        tipContent.style.left = currentLeft + currentWidth + 7 + "px";
                        tipContent.style.top = window.scrollY + currentTop + currentHeight / 2 - tipContentHeight / 2 + "px";
                        break;
                    case "bottom":
                        tipContent.style.left = currentLeft + currentWidth / 2 - tipContentWidth / 2 + "px";
                        tipContent.style.top = window.scrollY + currentTop + currentHeight + 7 + "px";
                }

            }, false);
            xmzTips.deleteTipContent(el);
        },

        deleteTipContent: function (el) {
            el.addEventListener("mouseleave", function () {
                let oldTipContent = document.querySelector(".tool_tip");
                if (oldTipContent) {
                    document.body.removeChild(oldTipContent);
                }
            }, false)
        },

        tipContentSetter: function (tipContent, context, direction) {
            tipContent.innerHTML = context;
            tipContent.className = "tool_tip tool_tip_" + direction;
            document.body.appendChild(tipContent);
        }
    };

    jQuery(function(){
        //通过属性直接加载tips的元素
        let autoClassName = '.xmz-tips';
        let autoSelectors = document.querySelectorAll(autoClassName);
        if (autoSelectors && autoSelectors.length > 0) {
            Array.prototype.slice.call(autoSelectors).forEach(function (el, index) {
                //创建tip弹窗的唯一标识
                let xmzTipId = "xmz-tips-" + index,
                config = {};
                config.content = el.getAttribute("xt");
                config.width = el.getAttribute("xt-width");
                config.tipColor = el.getAttribute("xt-color");
                config.tipFontColor = el.getAttribute("xt-font-color");
                config.direction = el.getAttribute("xt-direction");
                //初始化tip弹窗
                xmzTips.initTips(el, xmzTipId, config);
            });
        }
    });

    //通过构造方法生成tips
    window.xmzTips = function (property){
        let selector = property.elem;
        if (selector) {
            let els = document.querySelectorAll(selector);
            if (els && els.length > 0) {
                let config = {};
                config.content = property.content;
                config.direction = property.direction;
                config.width = property.width;
                config.tipColor = property.tipColor;
                config.tipFontColor = property.tipFontColor;
                Array.prototype.slice.call(els).forEach(function (el, index) {
                    //创建tip弹窗的唯一标识
                    let selectorValue = selector.substring(1),
                    xmzTipId = selectorValue + "-tips-" + index;
                    //初始化tip弹窗
                    xmzTips.initTips(el, xmzTipId, config);
                });
            }
        }
    };
})(window);