(function (window) {
    //默认的配置
    let defaultProperty = {
        direction: 'right',
        tipColor: 'rgba(0, 119, 169, 0.92)',
        tipFontColor: '#ffffff'
    };
    let xmzTips = {
        initTips: function(el, tipConfig) {
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
            //设置小三角的颜色
            let styleEle = document.createElement("style");
            styleEle.type = "text/css";
            styleEle.appendChild(document.createTextNode(".tool_tip_top:before {border-color: " + commonBackColor + " transparent transparent transparent}"));
            styleEle.appendChild(document.createTextNode(".tool_tip_right:before {border-color: transparent " + commonBackColor + " transparent transparent}"));
            styleEle.appendChild(document.createTextNode(".tool_tip_bottom:before {border-color: transparent transparent " + commonBackColor + " transparent}"));
            styleEle.appendChild(document.createTextNode(".tool_tip_left:before {border-color: transparent transparent transparent " + commonBackColor + "}"));
            let headEle = document.getElementsByTagName("head")[0];
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
                        tipContent.style.top = window.scrollY + currentTop + currentHeight + 7 + "px"
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

    let config = {};

    jQuery(function(){
        //通过属性直接加载tips的元素
        let autoClassName = '.xmz-tips';
        let autoSelectors = document.querySelectorAll(autoClassName);
        if (autoSelectors.length > 0) {
            Array.prototype.slice.call(autoSelectors).forEach(function (el) {
                config.content = el.getAttribute("xt");
                config.width = el.getAttribute("xt-width");
                config.tipColor = el.getAttribute("xt-color");
                config.tipFontColor = el.getAttribute("xt-font-color");
                config.direction = el.getAttribute("xt-direction");
                xmzTips.initTips(el, config);
            });
        }
    });
    //通过构造方法生成tips
    window.xmzTips = function (property){
        let selector = property.elem;
        if (selector) {
            let els = document.querySelectorAll(selector);
            config.content =
            config.direction = property.direction;
            config.width = property.width;
            config.tipColor = property.tipColor;
            config.tipFontColor = property.tipFontColor;
            config.direction = property.tipFontColor;
            Array.prototype.slice.call(els).forEach(function (el) {
                xmzTips.initTips(el, config);
            });
        }
    };
})(window);