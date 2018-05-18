/**
 * Created by PC on 2018/2/1.
 */
var browser = {
    os: function () {
        var u = navigator.userAgent;
        return {// 操作系统
            linux: !!u.match(/\(X11;( U;)? Linux/i), // Linux
            windows: !!u.match(/Windows/i), // Windows
            android: !!u.match(/Android/i), // Android
            iOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // iOS
        };
    }(),
    device: function () {
        var u = navigator.userAgent;
        return {// 设备
            mobile: !!u.match(/AppleWebKit/i), // mobile
            iPhone: !!u.match(/iPhone/i), // iPhone
            iPad: !!u.match(/iPad/i), // iPad
        };
    }(),
    supplier: function () {
        var u = navigator.userAgent;
        return {// 浏览器类型
            qq: !!u.match(/QQ\/\d+/i), // QQ
            wechat: !!u.match(/MicroMessenger/i), // WeChat
            weixin: u.match(/MicroMessenger/i) == 'MicroMessenger',
            ios: u.indexOf('_JFiOS') > -1,
            android: u.indexOf('_jfAndroid') > -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        };

    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),

    androidVersion: function () {//判断安卓版本
        var userAgent = navigator.userAgent;
        var index = userAgent.indexOf("Android")
        if (index >= 0) {
            return parseFloat(userAgent.slice(index + 8));

        }
    }(),

    IosVersion:function () {//ios版本
        var str= navigator.userAgent.toLowerCase();
        var ver=str.match(/cpu iphone os (.*?) like mac os/);
        if(!ver){

            return -1;

        }else{

            return ver[1].replace(/_/g,".");
        }
    }()
    //browser.supplier.wechat
};

var windowBanEvent = {

    bundling: function () {

        var _self = this;
        //$(window).bind('click touchstart touchmove touchend ', _self.Canceling);//绑定禁止事件

        var allEvent = ['click', 'touchstart', 'touchmove', 'touchend'];

        for (var i = 0; i < allEvent.length; i++) {

            document.body.addEventListener(allEvent[i], _self.Canceling, false);

            addEventListener(allEvent[i], _self.Canceling, false)

        }

    },

    unbundling: function () {

        var _self = this;

        var allEvent = ['click', 'touchstart', 'touchmove', 'touchend'];

        for (var i = 0; i < allEvent.length; i++) {

            document.body.removeEventListener(allEvent[i], _self.Canceling, false);

            removeEventListener(allEvent[i], _self.Canceling, false)

        }

        //$(window).unbind('click touchstart touchmove touchend ', _self.Canceling);//解除绑定事件


    },

    Canceling: function (evt) {

        var evt = evt || window.event; //阻止事件

        if (evt.preventDefault) {

            evt.preventDefault();

            evt.stopPropagation();

        }
        else {

            evt.returnValue = false;

            evt.cancelBubble = true;

        }

    }

};




/*loading的三种动画*/
/*var loadInnerHtml={

    'node':{

        'loadingSuccess':'<div class="loading_box"><div class="success_animation"><div class="success_animation_circle"></div><div class="success_animation_cloud"></div><div class="success_animation_line2"></div><div class="success_animation_line3"></div><div class="success_animation_right"></div><div class="m-box"><div class="m-duigou"></div></div><div class="success_animation_text showtext"></div></div></div>',

        'loading':'<div class="loading_box"><div class="jd_loading"><div class="loading_box jdshop_alignment_center"><div class="ball1"></div><div class="ball2"></div><div class="ball3"></div></div><div class="loading_animation_text showtext"></div></div></div>',

        'loadingFail':'<div class="loading_box"><div class="fail_animation"><div class="fail_animation_circle"></div><div class="fail_animation_cloud"></div><div class="fail_animation_line2"></div><div class="fail_animation_line3"></div><div class="fail_animation_wrong"></div><div class="fail_animation_text showtext"></div></div></div>'

    }
};*/


/*删除地址弹框*/

var jfShowTips = {

    //弱提示toast出现的方法
    //谯丹
    //2017.1.17
    toastShow: function (details) {

        var _this = this;

        if(!details){//如果details未输入，则防止报错

            details={};

        }

        var thisText = details.text || 'null';

        var thisInnerHtml = '<span>' + thisText.toString().replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;') + '</span>';//插入元素的主题内容

        _this.toastRemove();//插入元素前，先删除一次，防止多次添加

        var className='';


        if(browser.os.iOS){//如果当前是IOS系统

            var thisActiveEle=document.activeElement;//当前获取焦点的元素

            if(thisActiveEle.tagName=='INPUT') {//如果当前元素是input

                var thisActiveEleType=thisActiveEle.getAttribute('type');//获取当前元素的type属性

                var inputType=['checkbox','radio','button','image','range','reset','submit','week'];//定义type类型不会发生变化的数组

                if(inputType.indexOf(thisActiveEleType)==-1){//如果当前type类型不存在，则添加Class

                    className='tip_input';
                }

            }

        }

        var thisAddToast = this.addNode('div', thisInnerHtml, 'tip_toast',className);//添加元素

        setTimeout(function () {//延迟2s后，自动删除

            _this.remove(thisAddToast)

        }, 2000);

    },

    //弱提示toast删除的方法
    //谯丹
    //2017.1.17
    toastRemove: function () {

        if (document.getElementById('tip_toast')) {//删除之前，先判断当前元素是否存在

            this.remove(document.getElementById('tip_toast'))

        }

    },

    //loading方法
    //陈羽翔
    //2017.2.3
    loadingShow:function (details) {

        var _this=this;

        if(!details){//为空时初始化数据
            details={};
        }

        windowBanEvent.bundling();//页面禁止事件

        _this.loadingRemove();//先删除页面上loading元素

        var thisText = details.text || 'LOADING..';//显示文字

        var thisNode=details.thisNode||0;//传入动画html

        var otherClass=details.thisClass|| false;//loading添加特殊class,成功失败不需要添加为false

        var thisInnerHtml=thisNode;

        var thisBg = _this.addLoadingBg('tip_loading_bg');

        /*在背景上加禁止浏览器默认事件*/
        document.getElementById('tip_loading_bg').addEventListener('touchmove',windowBanEvent.Canceling);

        var thisAddELe=_this.addNode('div',thisInnerHtml,'tip_loading',otherClass);//增加节点

        document.getElementsByClassName('showtext')[0].innerHTML=_this.changeString(thisText);

        document.activeElement.blur();//页面控件失焦

        thisAddELe.focus();//loading元素获得焦点

    },

    addLoadingBg:function (thisId) {

        var _this=this;

        _this.removeBg();

        return _this.addNode('div','',thisId,'tip_loading_bg');//增加节点

    },

    //loading删除方法
    //陈羽翔
    //2017.2.3
    loadingRemove:function () {//卸载loading

        var _this=this;

        if (document.getElementById('tip_loading')) {//删除之前，先判断当前元素是否存在

            windowBanEvent.unbundling();//解绑页面禁止事件

            _this.remove(document.getElementById('tip_loading'));//删除该元素


        }
        _this.removeBg('tip_loading_bg');


    },
    //新建元素的方法
    addNode: function (tag, innerHtml, id, className) {

        var obj = document.createElement(tag);

        if (id) {

            obj.id = id;

        }

        if(className){

            obj.className=className

        }

        obj.innerHTML = innerHtml;

        document.body.appendChild(obj);

        return obj;


    },

    dialogShow:function (details) {

        if(!details){//如果details未输入，则防止报错
            details={};
        }

        var mainText = details.mainText || 'null';

        var minText = details.minText || null;

        var hasCheck = details.noCheck|| false;

        var hasCancel = details.noCancel || false;

        var checkFn = details.checkFn || null;

        var checkBtnText=details.checkBtnText ||'确认';

        var cancleBtnText=details.cancleBtnText ||'取消';

        var thisUrl=details.thisUrl||'javascript:';

        var _this=this;

        var thisBg=_this.addBg('dialog_bg');

        var thisInnerHtml='<div class="text_dialog_container"><div class="text_big">'+mainText+'</div>';

        if(minText){

            thisInnerHtml+='<div class="text_small">'+minText+'</div>'

        }

        thisInnerHtml+='<div class="dialog_button">';

        if(!hasCheck){

            thisInnerHtml+='<a class="dialog_check red" href='+thisUrl+'>'+checkBtnText+'</a>'

        }

        if(!hasCancel){

            thisInnerHtml+='<a class="dialog_cancel gray" href="javascript:">'+cancleBtnText+'</a>'

        }

        thisInnerHtml+='</div></div>';

        var thisAddDialog = _this.addNode('div', thisInnerHtml, 'tip_dialog');//添加元素

        if(thisAddDialog.getElementsByClassName('dialog_cancel')[0]) {

            thisAddDialog.getElementsByClassName('dialog_cancel')[0].addEventListener('click', _this.dialogRemove.bind(_this), false);

        }

        thisBg.addEventListener('click',_this.dialogRemove.bind(_this),false);

        thisBg.addEventListener('touchmove',windowBanEvent.Canceling,false);

        if(checkFn) {

            thisAddDialog.getElementsByClassName('dialog_check')[0].addEventListener('click',checkFn,false);

        }


    },

    dialogRemove:function () {

        var _this=this;

        var thisDialogEle= document.getElementById('tip_dialog');

        _this.remove(thisDialogEle);//删除该元素


        var thisBgEle=document.getElementById('dialog_bg');

        _this.removeBg('dialog_bg');//删除背景

    },

    //增加背景
    //陈羽翔
    //2017.2.4
    addBg:function (thisId) {

        var _this=this;

        _this.removeBg();

        return _this.addNode('div','',thisId,'tip_bg');//增加节点

    },

    removeBg:function (thisId) {

        if(document.getElementById(thisId)){

            document.getElementById(thisId).click();

            this.remove(document.getElementById(thisId));

        }

    },

    //自动删除的方法
    remove: function (_element) {

        var _parentElement = _element.parentNode;//找到父元素，然后删除

        if (_parentElement) {

            _parentElement.removeChild(_element);

        }

    },

    //批量增加平滑过渡后监听方法
    transitionEndFn:function (thisEle,myFn) {

        thisEle.addEventListener("webkitTransitionEnd", myFn);

        thisEle.addEventListener("transitionend", myFn);

    },

    settimeoutFn:function(myFn){

        setTimeout(myFn,500);

    },

    //转义字符串
    changeString:function(node){

        var _this=this;

        var thisInsertHtml=node.toString().replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');

        return thisInsertHtml
    }

};





/**
 * Created by ZHUANGYI on 2017/6/22.
 */
var jfOrderTab = {

    switchTab: function () {

        var navTab = document.getElementById('orderTab').getElementsByClassName('tab');

        var orderList = document.getElementsByClassName('shop_order_list');

        for (var i = 0; i < navTab.length; i++) {

            navTab[i].index = i;

            navTab[i].addEventListener('click', function () {

                for (var j = 0; j < navTab.length; j++) {

                    orderList[j].className = orderList[j].className.replace(' show', '');

                }
                orderList[this.index].className += ' show'
            })
        }
    },


/*---------点击切换class---------*/


    clickTabChange: function (fatherEle, changeClass, className) {


        var allEle = fatherEle.getElementsByClassName(className);


        for (var i = 0; i < allEle.length; i++) {

            allEle[i].addEventListener('click', function () {

                fatherEle.getElementsByClassName(changeClass)[0].className = fatherEle.getElementsByClassName(changeClass)[0].className.replace(changeClass, '');

                this.className += ' ' + changeClass;

                var allEle = document.getElementById('search_prompt').getElementsByClassName('jd_drop_down');

                console.log("打印")

            }, false);

        }


    },


};

var jfProductDetails = {


    //------ 安卓系统滑动到一定位置固定tab

    slidePositionTab: function () {


        if (!browser.os.iOS) {  //判断机型

            var thisNavTab = document.getElementById('NavTab');

            var thisNavTabEmpty = document.getElementById('NavTabEmpty');


            function scrcoll() {

                if (thisNavTabEmpty.getBoundingClientRect().top <= 0) { //元素到页面顶端的位置

                    thisNavTab.style.position = 'fixed';

                    thisNavTab.style.top = '45px';

                    thisNavTab.style.zIndex = '100'

                }

                else {

                    thisNavTab.style.cssText = "";

                }
            }

            scrcoll();
        }

    },

    //------点击切换class

    clickTabChange: function (fatherEle, changeClass, className) {


        var allEle = fatherEle.getElementsByClassName(className);


        for (var i = 0; i < allEle.length; i++) {

            allEle[i].addEventListener('click', function () {

                fatherEle.getElementsByClassName(changeClass)[0].className = fatherEle.getElementsByClassName(changeClass)[0].className.replace(changeClass, '');

                this.className += ' ' + changeClass;

            }, false);

        }


    },



    //------tab点击切换页面

    tabScrollChange: function () {

        window.addEventListener('scroll', function () {


            var thisNavTab = document.getElementById('NavTab');

            var topTabHeigt = document.getElementsByClassName('product_nav_contain')[0];

            var a = thisNavTab.offsetHeight + topTabHeigt.offsetHeight;

            var parameterBlockDis = document.getElementsByClassName('product_images_parameter')[0];                         //参数规格到页面顶部的距离

            var serviceBlockDis = document.getElementsByClassName('product_images_service')[0];                             //售后到页面顶部的距离


            var imgBlockDis = document.getElementsByClassName('product_images')[0];


            if (imgBlockDis.getBoundingClientRect().top > thisNavTab.offsetHeight) {                                       //超出部分大于45 = 商品


                slideTabChoose(document.getElementsByClassName('content')[0], 'nav_tab', 0);

            }

            else if (imgBlockDis.getBoundingClientRect().top <= thisNavTab.offsetHeight) {                                //img模块小于等于45 = 图文


                slideTabChoose(document.getElementsByClassName('content')[0], 'nav_tab', 1);


                function titleTabChange() {                                                                                //图文&参数&售后切换


                    if (serviceBlockDis.getBoundingClientRect().top - a <= 0) {                                             //参数模块到页面顶部的距离 a为两个导航的和


                        slideTabChoose(document.getElementById('NavTab'), 'tab', 2);

                    }
                    else if (parameterBlockDis.getBoundingClientRect().top - a <= 0) {


                        slideTabChoose(document.getElementById('NavTab'), 'tab', 1);

                    }
                    else {

                        slideTabChoose(document.getElementById('NavTab'), 'tab', 0);
                    }
                }

                titleTabChange();

            }
            function slideTabChoose(element, childClassName, num) {                                                    //选择切换tab

                if (element.getElementsByClassName('choose_tab')[0]) {


                    element.getElementsByClassName('choose_tab')[0].className = element.getElementsByClassName('choose_tab')[0].className.replace('choose_tab', '');

                }

                element.getElementsByClassName(childClassName)[num].className += ' choose_tab';

            }


        });


    },




    //------弹出框点穿问题 0904更新
    clickThrough:function (fatherEle,hasScrollEle) {

        var thisScrollEle = document.getElementById(fatherEle).getElementsByClassName(hasScrollEle);

        //var thisVolum = document.getElementById('product_prompt_buy').getElementsByClassName('sku_volume_purchased')[0];

        var popTop = document.getElementsByClassName('pop_top')[0];

        var thisAddress = document.getElementById('jd_address_select').getElementsByClassName('top_address')[0];

        var startY, endY, distance;//开始距离、移动距离

        /*        for (var i=0;i<thisScrollEle.length;i++){

                    if(thisScrollEle[i].clientHeight < thisScrollEle[i].offsetHeight-4){

                        thisScrollEle[i].addEventListener('touchstart', touchStartEle, false);

                        thisScrollEle[i].addEventListener('touchmove', reachEdge, false);

                    }

                    else {

                        thisScrollEle[i].addEventListener('touchmove,touchstart',windowBanEvent.Canceling,false);
                    }

                }*/
        for(var i=0;i<thisScrollEle.length;i++){



            thisScrollEle[i].addEventListener('touchstart', touchStartEle, false);

            thisScrollEle[i].addEventListener('touchmove', reachEdge, false);

        }




        if(thisAddress){

            thisAddress.addEventListener('touchmove,touchstart',windowBanEvent.Canceling,false);

        }

        popTop.addEventListener('touchmove',windowBanEvent.Canceling,false);

        //thisScrollEle.addEventListener('touchmove', reachEdge, false);


        function touchStartEle(e) {

            //touchstart 获取位置startY

            startY = e.touches[0].pageY;

        }


        function reachEdge(event) {

            var _this = this;

            var eleScrollHeight = _this.scrollTop;//获取滚动条的位置 206

            var eleHeight = _this.scrollHeight;//元素实际高度 506

            var containerHeight = _this.offsetHeight;//容器高度 300


            //touchmove 获取位置 endY

            endY = event.touches[0].pageY;

            //两者之减的距离用来判断是向上活动还是向下滑动
            distance = startY - endY;

            //此时touchmove的值等于touchstart的值 循环
            endY = startY;


            //滚动条到达底部

            if (Math.abs(parseFloat(eleHeight) - parseFloat(eleScrollHeight + containerHeight)) <= 2) {


                //如果距离为正数 则向上滑动是 禁止浏览器事件

                if (distance > 0) {

                    event.preventDefault();


                }


            }

            else if (Math.abs(parseFloat(eleScrollHeight)) == 0) {

                //如果距离为负数 则向下滑动

                if (distance < 0) {

                    event.preventDefault();

                }


            }

        }


    },








};






/* --------------下拉框----------------*/


var showDown={

    //食品
    showFood:function () {



        var clickMent=document.getElementById('food');

        clickMent.addEventListener('click',function () {



            var hideDiv=document.getElementsByClassName('food')[0];



            if (hideDiv.className.indexOf('show_table')<0) {

                showDown.closeFn();//关闭所有的弹出框

                hideDiv.className = 'jd_drop_down_content food show_table';

            }

            else {

                showDown.closeFn();//关闭所有的弹出框

            }



        },false)

    },

    //家电
    showElec:function () {



        var clickMent=document.getElementById('electrical');

        clickMent.addEventListener('click',function () {



            var hideDiv=document.getElementsByClassName('electrical')[0];

            if (hideDiv.className.indexOf('show_table')<1) {

                showDown.closeFn();//关闭所有的弹出框

                hideDiv.className = 'jd_drop_down_content electrical show_table';

            }

            else {

                showDown.closeFn();//关闭所有的弹出框

            }

        },false)

    },


    //母婴
    showMother:function () {



        var clickMent=document.getElementById('mother');

        clickMent.addEventListener('click',function () {



            var hideDiv=document.getElementsByClassName('mother')[0];

            if (hideDiv.className.indexOf('show_table')<1) {

                showDown.closeFn();//关闭所有的弹出框

                hideDiv.className = 'jd_drop_down_content mother show_table';

            }

            else {

                showDown.closeFn();//关闭所有的弹出框

            }

        },false)

    },



    //家居用品
    showHousewear:function () {



        var clickMent=document.getElementById('housewear');

        clickMent.addEventListener('click',function () {



            var hideDiv=document.getElementsByClassName('housewear')[0];

            if (hideDiv.className.indexOf('show_table')<1) {

                showDown.closeFn();//关闭所有的弹出框

                hideDiv.className = 'jd_drop_down_content housewear show_table';

            }

            else {

                showDown.closeFn();//关闭所有的弹出框

            }

        },false)

    },



    //酒水
    showWine:function () {



        var clickMent=document.getElementById('wine');

        clickMent.addEventListener('click',function () {



            var hideDiv=document.getElementsByClassName('wine')[0];

            if (hideDiv.className.indexOf('show_table')<1) {

                showDown.closeFn();//关闭所有的弹出框

                hideDiv.className = 'jd_drop_down_content wine show_table';

            }

            else {

                showDown.closeFn();//关闭所有的弹出框

            }

        },false)

    },





    //关闭所有，只留一个
    closeFn:function () {



        if(document.getElementById('search_prompt').getElementsByClassName('show_table').length) {
            console.log('test')

            document.getElementById('search_prompt').getElementsByClassName('show_table')[0].className = document.getElementById('search_prompt').getElementsByClassName('show_table')[0].className.replace('show_table', '')
        }
    },



    hideThis:function () {

        var thisLable=document.getElementsByClassName('hideclear');

        for (var i=0;i<thisLable.length;i++) {

            thisLable[i].addEventListener('click',function () {

                showDown.closeFn();//关闭所有的弹出框

            },false)

        }

    }







}

var jfDropDown = function (details) {

    if(!details){

        details ={}

    }

    this.details = details;

    var thisEle = document.getElementById(this.details.ele);


    //var thisfatherEle = this.details.fatherId || 0;

    var thishasScrollEle = this.details.scrollClassname || 0;

    thisEle.getElementsByClassName('jd_drop_down_bg')[0].addEventListener('click', clickEven.bind(this), false);

    function clickEven() {

        this.hide();

    }

    if(thishasScrollEle){

        clickThought(thishasScrollEle);

    }


    function clickThought(thishasScrollEle) {


        var thisScrollEle = thisEle.getElementsByClassName(thishasScrollEle)[0];



        var startY, endY, distance;//开始距离、移动距离

        thisScrollEle.addEventListener('touchstart', touchStartEle, false);

        thisScrollEle.addEventListener('touchmove', reachEdge, false);


        //thisScrollEle.addEventListener('touchmove', reachEdge, false);


        function touchStartEle(e) {

            //touchstart 获取位置startY

            startY = e.touches[0].pageY;

        }


        function reachEdge(event) {

            var _this = this;

            var eleScrollHeight = _this.scrollTop;//获取滚动条的位置 206

            var eleHeight = _this.scrollHeight;//元素实际高度 506

            var containerHeight = _this.offsetHeight;//容器高度 300


            //touchmove 获取位置 endY

            endY = event.touches[0].pageY;

            //两者之减的距离用来判断是向上活动还是向下滑动
            distance = startY - endY;

            //此时touchmove的值等于touchstart的值 循环
            endY = startY;


            //滚动条到达底部

            if (Math.abs(parseFloat(eleHeight) - parseFloat(eleScrollHeight + containerHeight)) <= 2) {


                //如果距离为正数 则向上滑动是 禁止浏览器事件

                if (distance > 0) {

                    event.preventDefault();


                }


            }

            else if (Math.abs(parseFloat(eleScrollHeight)) == 0) {

                //如果距离为负数 则向下滑动

                if (distance < 0) {

                    event.preventDefault();

                }


            }

        }


    }


    /*this.ban=function (e) {

     window.event? window.event.cancelBubble = true : e.stopPropagation();//阻止冒泡

     };*/

    if(thisEle.getElementsByClassName('jd_drop_down_bg')[0]) {

        addEvent(thisEle.getElementsByClassName('jd_drop_down_bg')[0]);


    }


    function addEvent(ele) {

        var allEvent=['touchstart','touchmove','touchend'];

        for(var i=0;i<allEvent.length;i++) {

            ele.addEventListener(allEvent[i],eventBan,false)

        }

    }

    function eventBan(e) {

        // window.event? window.event.cancelBubble = true : e.stopPropagation();

        //if(browser.os.iOS) {

        window.event ? window.event.returnValue = false : e.preventDefault();

        //}
    }

};

jfDropDown.prototype.show = function (details) {


    if(details){

        details.fn();

    }

    //var thisScrollEle = this.details.thisScrollEle || 0;//含有滚动条元素的classname


    /*
        if(this.details.thisScrollEle){//如果有值 则执行

            clickThrough(thisScrollEle);
        }
    */


    /* this.ban();*/
    /*document.body.addEventListener('touchmove', this.ban, true);*/


    var thisEle = document.getElementById(this.details.ele);

    thisEle.style.display = 'block';

    setTimeout(function () {

        if (thisEle.className.indexOf('show') == -1) {

            thisEle.className += ' show'

        }

    }, 1);




    document.getElementsByClassName('jd_drop_down_bg')[0].addEventListener('touchmove',windowBanEvent.Canceling);//给阴影绑定禁止事件

    //解决弹框点击穿透问题-0831






};

jfDropDown.prototype.hide = function (details) {

    if(details){

        details.fn();

    }

    var thisEle = document.getElementById(this.details.ele);


    /*document.body.removeEventListener('touchmove', this.ban, true);*/

    if (thisEle.className.indexOf('show') > -1) {

        transitionMove(thisEle);

        thisEle.className = thisEle.className.replace(' show', '')

    }

    windowBanEvent.unbundling();//解绑页面禁止事件



    function transitionMove(ele) {

        // Safari 3.1 到 6.0 代码
        ele.addEventListener("webkitTransitionEnd", MFunction);
        // 标准语法
        ele.addEventListener("transitionend", MFunction);

        function MFunction() {

            ele.style.display = 'none';
            // Safari 3.1 到 6.0 代码
            ele.removeEventListener("webkitTransitionEnd", MFunction);
            // 标准语法
            ele.removeEventListener("transitionend", MFunction);


        }


    }


};
var addClass= {

    //价格
    priceClass:function () {

        $(document).ready(function(){



            $(".price").click(function () {

                $(".show").removeClass("show");

                $(this).addClass("show");

            })


        });

    }

}
var jdShoppingCart = {



    //复选框单选
    checkBoxChoose:function(obj) {

        var allCheckBox = document.getElementsByClassName('select_key');

        for (var i = 0; i < allCheckBox.length; i++) {


            if (allCheckBox[i] == obj && obj.checked) {

                allCheckBox[i].checked = true;

            } else {

                allCheckBox[i].checked = false;
            }
        }

    }


};

/**
 * Created by Administrator on 2017/6/7.
 */
var shoppingCart = {

    changeX:1,

    changeY:1,
    /*加载方法*/
    xhr: function (details) {

        var _this = this;

        var api = details.api || 0;

        var type = details.type || 'get';

        var xhr = function () {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            } else {
                return new ActiveObject('Micrsorf.XMLHttp');
            }
        }();

        xhr.onreadystatechange = function () {
            switch (xhr.readyState) {
                case 0 :
                    // console.log(0, '未初始化....');
                    break;
                case 1 :
                    /*console.log(1, '请求参数已准备，尚未发送请求...');*/
                    break;
                case 2 :
                    /*console.log(2, '已经发送请求,尚未接收响应');*/
                    break;
                case 3 :
                    /*console.log(3, '正在接受部分响应.....');*/
                    break;
                case 4 :
                    /*console.log(4, '响应全部接受完毕');*/
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {

                        _this.fn(xhr.responseText,details)

                    }

                    else {

                        console.log('读取失败');

                    }
                    break;
            }
        };

        xhr.open(type, api);

        xhr.send(null);

    },

    run: function (details) {



        this.xhr(details);

        this.changeClass(details)

    },

    //切换样式名称
    changeClass: function () {

        var allEle = document.getElementById('jd_address_select');

        var firstEle = allEle.getElementsByClassName('top_address')[0].getElementsByTagName('div');

        if(allEle.getElementsByClassName('show')[0]){

            clearClass(1)
        }

        firstEle[0].innerHTML='请选择';

        if(firstEle[0].className.indexOf('show')==-1) {

            firstEle[0].className = 'show';

        }

        if(allEle.getElementsByClassName('address')[0].className.indexOf('show')==-1) {

            allEle.getElementsByClassName('address')[0].className += ' show';

        }

        if(this.changeX) {

            for (var i = 0; i < firstEle.length; i++) {

                firstEle[i].addEventListener('click', clickEle, false)

            }

            this.changeX=0;

        }

        function clickEle() {

            clearClass(2);

            for (var j = 0; j < firstEle.length; j++) {

                if (this == firstEle[j]) {

                    break

                }

            }

            this.className = 'show';

            allEle.getElementsByClassName('address')[j].className += ' show';


        }

        function clearClass(num) {

            for (var i = 0; i < num; i++) {

                allEle.getElementsByClassName('show')[0].className = allEle.getElementsByClassName('show')[0].className.replace('show', '');

            }

        }

    },

    /*渲染地址列表*/
    fn: function (thisJson,details) {

        var thisWrightHtml = details.targetDom;

        var thisFn = details.fn;

        var ele = document.getElementById('jd_address_select');

        var data = JSON.parse(thisJson).data;

        var tabCity = ele.getElementsByClassName('top_address')[0].getElementsByTagName('div');

        for(var i=1;i<tabCity.length;i++){

            tabCity[i].innerHTML=""

        }

        addLi(ele.getElementsByClassName('address')[0], data);

        function addLi(faEle, allData) {

            var thisDomH = '<p data-li="';

            var thisDomM = '">';

            var thisDomB = '</p>';

            var writeDom = '';


            for (var i = 0; i < allData.length; i++) {

                writeDom += thisDomH + i + thisDomM + allData[i].name + thisDomB

            }

            faEle.innerHTML = writeDom;

            var allP = faEle.getElementsByTagName('p');

            for (var j = 0; j < allP.length; j++) {

                allP[j].addEventListener('click', clickFn, false)

            }

        }

        /*每个元素点击事件*/
        function clickFn() {

            if (this.parentNode.getElementsByClassName('p_show')[0]) {

                this.parentNode.getElementsByClassName('p_show')[0].removeAttribute('class');

            }

            this.className = 'p_show'

        }


        var allTab = ele.getElementsByClassName('address');

        if(this.changeY) {

        for (var i = 0; i < allTab.length; i++) {

            allTab[i].addEventListener('click', fatherEleClick)

        }

            this.changeY=0;

        }

        var allCityPoint = [];

        var thisCityAll = [];

        //chooseAdressId=[];

        /*每个父切换元素*/
        function fatherEleClick(evt) {

            if (this.className.indexOf('show') > -1) {

                for (var j = 0; j < allTab.length; j++) {

                    if (this == allTab[j]) {

                        break

                    }

                }

                /*渲染下一个列表*/

                var thisNum = evt.target.getAttribute('data-li');

                allCityPoint[j] = thisNum;

                allCityPoint=allCityPoint.slice(0,j+1);

                var thisData = data;

                var thisCity;

                for (var z = 0; z <= j; z++) {

                    thisCity = thisData[allCityPoint[z]];

                    thisData = thisCity.child;

                    if(!thisData)break

                }



                /*修改tab*/

                var tabCity = ele.getElementsByClassName('top_address')[0].getElementsByTagName('div');

                thisCityAll[j] = thisCity.name;

                thisCityAll=thisCityAll.slice(0,j+1);

                tabCity[j].innerHTML = thisCity.name;

                tabCity[j].removeAttribute('class');


                if (thisData) {

                    tabCity[j + 1].innerHTML = '请选择';

                    tabCity[j + 1].className = 'show';

                    allTab[j + 1].className += ' show';

                    this.className = this.className.replace(' show', '');

                    addLi(allTab[j + 1], thisData);

                }

                else {

                    var thisInnerHtml='';

                    for (var x = 0; x < thisCityAll.length; x++) {

                        thisInnerHtml += thisCityAll[x];

                        if(x!=thisCityAll.length-1) {

                            thisInnerHtml += '，'

                        }



                    }

                    thisWrightHtml.innerHTML=thisInnerHtml;


                    chooseAdressId=(function(){


                        var allNum=[];

                        var thisData=data;


                        for(var i=0;i<allCityPoint.length;i++) {

                            allNum[i]=thisData[allCityPoint[i]].id;

                            thisData=thisData[allCityPoint[i]].child;

                        }

                        return allNum;

                        //地址数据data;


                    })();


                    setTimeout(function () {

                        thisFn();




                    },300)



                }
                //切换tab


            }

        }

    },





};



/**
 * Created by ZHUANGYI on 2017/11/29.
 */
var addressChoose = {

    //页面进入后tab切换自锁
    o:1,

    //父页面监听事件
    i:1,

    //初始化渲染
    z:1,

    run: function (details) {

        var _this=this;

        //初始化数据
        var thisPointCity,thisId,thisWrightHtml,thisFn,thisCityAll=[],thisCityId=[];

        //初始化id
        var thisStartId = details.startId;

        //初始化Name
        var thisStartName = details.startName;

        //是否需要初始化选择
        var isChoosen=thisStartId && thisStartName && thisStartName.length == thisStartName.length;

        //是否有值
        if(isChoosen){

            //数据代入前面的address
            thisCityAll=thisStartName;

            thisCityId=thisStartId;
        }

        //tab切换自锁
            if(_this.o){

                //异步加载
                xhr(details,0,1,0);
                //tab切换
                changeClass();

                _this.o = 0;

            }

        //切换样式名称
        function changeClass() {

            var allEle = document.getElementById('jd_address_select');

            var firstEle = allEle.getElementsByClassName('top_address')[0].getElementsByTagName('div');

            if(allEle.getElementsByClassName('show')[0]){

                clearClass(1)
            }

            firstEle[0].innerHTML='请选择';

            if(firstEle[0].className.indexOf('show')==-1) {

                firstEle[0].className = 'show';

            }

            if(allEle.getElementsByClassName('address')[0].className.indexOf('show')==-1) {

                allEle.getElementsByClassName('address')[0].className += ' show';

            }



                for (var i = 0; i < firstEle.length; i++) {

                    firstEle[i].addEventListener('click', clickEle, false)

                }





            function clickEle() {

                clearClass(2);

                for (var j = 0; j < firstEle.length; j++) {

                    if (this == firstEle[j]) {

                        break

                    }

                }


                this.className = 'show';

                allEle.getElementsByClassName('address')[j].className += ' show';


            }

            function clearClass(num) {

                for (var i = 0; i < num; i++) {

                    allEle.getElementsByClassName('show')[0].className = allEle.getElementsByClassName('show')[0].className.replace('show', '');

                }

            }

        }

        //异步加载数据 thisNum 为areaid变化数值 returnNum为1初始化 addressNum是每个address是第几个
        function xhr (xDetails,thisNum,returnNum,addressNum) {

            var api = xDetails.api || 0;

            var type = xDetails.type || 'get';

            //传入前半部分url
            var thisUrl = xDetails.yourUrl || 'http://118.242.19.26:188';

            //接口地址 thisNum为id
            var addressUrl = thisUrl+'/jf_market_jd_server/api/address/getArea?areaId='+ thisNum;




            //请求数据
            var xhr = function () {

                if (window.XMLHttpRequest) {

                    return new XMLHttpRequest();

                }
                else {

                    return new ActiveObject('Micrsorf.XMLHttp');

                }
            }();

            xhr.onreadystatechange = function () {
                switch (xhr.readyState) {
                    case 0 :
                        // console.log(0, '未初始化....');
                        break;
                    case 1 :
                        /*console.log(1, '请求参数已准备，尚未发送请求...');*/
                        break;
                    case 2 :
                        /*console.log(2, '已经发送请求,尚未接收响应');*/
                        break;
                    case 3 :
                        /*console.log(3, '正在接受部分响应.....');*/
                        break;
                    case 4 :
                        /*console.log(4, '响应全部接受完毕');*/
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {


                            var addressEles = document.getElementById('jd_address_select').getElementsByClassName('address');

                            //如果为1的时候用这个方法
                            if(returnNum==1){

                                //第一次 渲染【0】dom对象
                                fn(xhr.responseText,xDetails);

                                //如果有初始化在执行
                                if(isChoosen){

                                    addAddressShow(addressNum)

                                }




                            }
                            //如果为2的时候用这个方法
                            else if(returnNum==2){

                                var data=JSON.parse(xhr.responseText).data;

                                if(data){

                                    addLi(addressEles[addressNum+1],data);

                                    addAddressShow(addressNum+1)

                                }

                            }
                            //每一次点击渲染对象
                            else {

                                var data=JSON.parse(xhr.responseText).data;

                                if(data){

                                    addLi(addressEles[addressNum+1],data);

                                }

                                changeNewTab(addressNum,data);


                            }

                            //为address添加show
                            function addAddressShow(addressNum) {

                                //每一个address下的p元素
                                var pEles = addressEles[addressNum].getElementsByTagName('p');

                                //遍历一下p元素
                                for(var i=0;i<pEles.length;i++){

                                    //是否对应areaId
                                    if(thisStartId[addressNum]==pEles[i].getAttribute('areaId')){

                                        //找到就不用再找了
                                        break

                                    }

                                }

                                //得到需要的那个p给他加上p_show
                                pEles[i].className = 'p_show';

                            }

                        }

                        else {

                            console.log('读取失败');

                        }
                        break;
                }
            };

            xhr.open(type, addressUrl);

            xhr.send(null);

        }

        //在address中生成列表 faEle-哪个address allData-加载的数据
        function addLi(faEle, allData) {

            var thisDomH = '<p areaId="';

            var thisDomM = '">';

            var thisDomB = '</p>';

            var writeDom = '';

            for (var i = 0; i < allData.length; i++) {

                //代入areaId
                writeDom += thisDomH +  allData[i].areaId + thisDomM + allData[i].name + thisDomB

            }

            faEle.innerHTML = writeDom;

            var allP = faEle.getElementsByTagName('p');

            for (var j = 0; j < allP.length; j++) {

                allP[j].addEventListener('click', clickFn, false)

            }

            /*每个元素点击事件*/
            function clickFn() {


                thisPointCity=this.innerHTML;//保存现在点击的城市

                thisId =this.getAttribute('areaid');//保存现在点击的城市的id

                //console.log('p '+thisPointCity);

                //console.log(this);


                if (this.parentNode.getElementsByClassName('p_show')[0]) {

                    this.parentNode.getElementsByClassName('p_show')[0].removeAttribute('class');

                }

                this.className = 'p_show'

            }

        }

        //顶部tab页切换 在数据加载之后执行
        function changeNewTab(j,data) {

            var tabCity = document.getElementById('jd_address_select').getElementsByClassName('top_address')[0].getElementsByTagName('div');

            var allTab = document.getElementById('jd_address_select').getElementsByClassName('address');

            thisCityAll[j] = thisPointCity;

            thisCityId[j] = thisId;

            //console.log('tab '+thisPointCity);

            thisCityAll=thisCityAll.slice(0,j+1);

            thisCityId=thisCityId.slice(0,j+1);

            tabCity[j].innerHTML = thisPointCity;

            tabCity[j].setAttribute('areaId',thisId);

            tabCity[j].removeAttribute('class');


            if (data) {

                document.getElementById('jd_address_select').getElementsByClassName('show')[0].className='address';

                tabCity[j + 1].innerHTML = '请选择';

                tabCity[j + 1].className = 'show';

                allTab[j + 1].className += ' show';


            }

            else {


                var thisInnerHtml='';

                //最后一个tab模块添加show
                tabCity[j].className = 'show';

                for (var x = 0; x < thisCityAll.length; x++) {

                    thisInnerHtml += thisCityAll[x];

                    if(x!=thisCityAll.length-1) {

                        thisInnerHtml += '，'

                    }

                }

                thisWrightHtml.innerHTML=thisInnerHtml;

                _this.addressCity = thisCityAll;

                _this.addressCityId = thisCityId;


                //console.log(thisCityId);

                setTimeout(function () {

                    thisFn();

                },300)



            }
            //切换tab

        }

        //渲染数据
        function fn(thisJson,details) {

            thisWrightHtml = details.targetDom;

            thisFn = details.fn;

            var ele = document.getElementById('jd_address_select');

            var data = JSON.parse(thisJson).data;

            addLi(ele.getElementsByClassName('address')[0], data);

            var allTab = ele.getElementsByClassName('address');


            if(_this.i) {

                for (var i = 0; i < allTab.length; i++) {

                    allTab[i].addEventListener('click', fatherEleClick)

                }

                _this.i=0

            }

            /*每个父切换元素*/
            function fatherEleClick(evt) {

                if (this.className.indexOf('show') > -1) {

                    for (var j = 0; j < allTab.length; j++) {

                        if (this == allTab[j]) {

                            break

                        }

                    }


                        /*渲染下一个列表*/

                        var thisNum = evt.target.getAttribute('areaId');


                        //如果areaId有数值
                        if (thisNum) {

                            xhr(details, thisNum, 0, j);

                        }

                }

            }

        }



        //导入tab的数据
        (function(){


            //判断id和name有没有值鹅且两个长度相等

            //z==1的时候执行 方法最后赋值为0 只执行一次

            if(_this.z && isChoosen){

                var fatEle = document.getElementById('jd_address_select');

                var tabEles = fatEle.getElementsByClassName('top_address')[0].getElementsByTagName('div');

                var addressEles = fatEle.getElementsByClassName('address');

                //tab部分去掉第一个show 给最后一个加上show
                tabEles[0].className = '';

                tabEles[thisStartName.length-1].className = 'show';

                //address部分去掉第一个show 给最后一个加上show
                addressEles[0].className = 'address';

                addressEles[thisStartName.length-1].className += ' show';

                //遍历传入id的长度
                for(var i=0;i<thisStartName.length;i++){

                    //将name赋值到tab中
                    tabEles[i].innerHTML = thisStartName[i];
                    //给每个tab加上areaid
                    tabEles[i].setAttribute('areaId',thisStartId[i]);
                    //异步加载每个数据
                    xhr(details, thisStartId[i], 2, i);
                }

                _this.z = 0;

            }

        })();

    }

};
/**
 * Created by Administrator on 2017/6/1.
 */

var jfShowPop = function (details) {

    if(!details){

        details ={}

    }

    this.details = details;

    var thisEle = document.getElementById(this.details.ele);

    //var thisfatherEle = this.details.fatherId || 0;

    var thishasScrollEle = this.details.scrollClassname || 0;


    thisEle.getElementsByClassName('pop_cancel')[0].addEventListener('click', clickEven.bind(this), false);

    thisEle.getElementsByClassName('jf_pop_up_bg')[0].addEventListener('click', clickEven.bind(this), false);


    if(thishasScrollEle){

        clickThought(thishasScrollEle);

    }


    function clickThought(thishasScrollEle) {


        var thisScrollEle = thisEle.getElementsByClassName(thishasScrollEle)[0];

        var thisVolum = thisEle.getElementsByClassName('sku_volume_purchased')[0];

        var popTop = thisEle.getElementsByClassName('pop_top')[0];

        var thisAddress = thisEle.getElementsByClassName('top_address')[0];

        var startY, endY, distance;//开始距离、移动距离

        thisScrollEle.addEventListener('touchstart', touchStartEle, false);

        thisScrollEle.addEventListener('touchmove', reachEdge, false);


        //如果有这个元素 就绑定禁止事件
         if(thisVolum){

             thisVolum.addEventListener('touchmove',windowBanEvent.Canceling,false);
         }

        if(thisAddress){

            thisAddress.addEventListener('touchmove',windowBanEvent.Canceling,false);

        }

        popTop.addEventListener('touchmove',windowBanEvent.Canceling,false);

        //thisScrollEle.addEventListener('touchmove', reachEdge, false);


        function touchStartEle(e) {

            //touchstart 获取位置startY

            startY = e.touches[0].pageY;

        }


        function reachEdge(event) {

            var _this = this;

            var eleScrollHeight = _this.scrollTop;//获取滚动条的位置 206

            var eleHeight = _this.scrollHeight;//元素实际高度 506

            var containerHeight = _this.offsetHeight;//容器高度 300

            var eleClientHeight = _this.clientHeight ;//可视区域的高度 243

            //console.log(eleClientHeight);

            //touchmove 获取位置 endY

            endY = event.touches[0].pageY;

            //两者之减的距离用来判断是向上活动还是向下滑动
            distance = startY - endY;

            //此时touchmove的值等于touchstart的值 循环
            endY = startY;

            //如果滚动条不存在  禁止事件

            if(Math.abs(parseFloat(eleHeight)- parseFloat(eleClientHeight) )<3){

                event.preventDefault()

            }

            //滚动条到达底部

            if (Math.abs(parseFloat(eleHeight) - parseFloat(eleScrollHeight + containerHeight)) <= 2) {


                //如果距离为正数 则向上滑动是 禁止浏览器事件

                if (distance > 0) {

                    event.preventDefault();


                }

            }

            else if (Math.abs(parseFloat(eleScrollHeight)) == 0) {

                //如果距离为负数 则向下滑动

                if (distance < 0) {

                    event.preventDefault();

                }


            }



        }


}

    function clickEven() {

        this.hide();

    }

    /*this.ban=function (e) {

        window.event? window.event.cancelBubble = true : e.stopPropagation();//阻止冒泡

    };*/

    if(thisEle.getElementsByClassName('jf_pop_up_bg')[0]) {

       if(browser.os.android){

           thisEle.getElementsByClassName('jf_pop_up_bg')[0].addEventListener('touchmove',windowBanEvent.Canceling,false);



       }
      else {

            addEvent(thisEle.getElementsByClassName('jf_pop_up_bg')[0]);
       }



    }

     // if(thisEle.getElementsByClassName('pop_top')[0]) {
     //
     //     addEvent(thisEle.getElementsByClassName('pop_top')[0]);
     //
     // }


    function addEvent(ele) {

        var allEvent=['touchstart','touchmove','touchend'];

         for(var i=0;i<allEvent.length;i++) {

           ele.addEventListener(allEvent[i],eventBan,false)

         }

     }

     function eventBan(e) {

            // window.event? window.event.cancelBubble = true : e.stopPropagation();

             window.event ? window.event.returnValue = false : e.preventDefault();


     }

};

jfShowPop.prototype.show = function (details) {


    if(details){

        details.fn();

    }


   /* this.ban();*/

    /*document.body.addEventListener('touchmove', this.ban, true);*/

    var thisEle = document.getElementById(this.details.ele);


    thisEle.style.display = 'block';

    /*document.getElementsByTagName("body")[0].className = "ovfHiden";//页面禁止滚动

    document.getElementsByTagName("html")[0].className = "ovfHiden";//页面禁止滚动*/

    setTimeout(function () {

        if (thisEle.className.indexOf('show') == -1) {

            thisEle.className += ' show'

        }

    }, 1);

    document.getElementsByClassName('jf_pop_up_bg')[0].addEventListener('touchmove',windowBanEvent.Canceling,false);//给阴影绑定冒泡事件


};

jfShowPop.prototype.hide = function () {

    var thisEle = document.getElementById(this.details.ele);

     /*document.body.removeEventListener('touchmove', this.ban, true);*/


    if (thisEle.className.indexOf('show') > -1) {


        transitionMove(thisEle);

        thisEle.className = thisEle.className.replace(' show', '')

    }

    windowBanEvent.unbundling();//解绑页面禁止事件

    /*document.getElementsByTagName("body")[0].className = "";//页面禁止滚动

    document.getElementsByTagName("html")[0].className = "";//页面禁止滚动*/



    function transitionMove(ele) {

        // Safari 3.1 到 6.0 代码
        ele.addEventListener("webkitTransitionEnd", MFunction);
        // 标准语法
        ele.addEventListener("transitionend", MFunction);

        function MFunction() {

            ele.style.display = 'none';
            // Safari 3.1 到 6.0 代码
            ele.removeEventListener("webkitTransitionEnd", MFunction);
            // 标准语法
            ele.removeEventListener("transitionend", MFunction);


        }


    }


};
var jfAutoPlay = {

    jfAutoPlayInit: function () {

        var XPosition = 0;                                                                                             //存储第一个手指x轴位置，需刷新

        var isChange = 0;                                                                                              //判断是否往哪里移动，1后退，2前进，其他值不动，需刷新

        var setInterMove1000 = 0;                                                                                      //存储循环

        var timer = 5000;                                                                                              //平滑过渡间隔时间

        var ifPosition = 0;                                                                                            //储存两张图片的左右状态

        var lastStance = 0;                                                                                            //上次触摸的位置

        var isThreeEle = true;                                                                                           //是否是三个或者以上元素

        var isTwoEle = false;                                                                                           //是否两个元素

        var isAndroidVersion4 = false                                                                                    //是不是安卓四及其以下系统

        /*增加点点*/
        var thisFatherEle = document.getElementsByClassName('jf_homepage_autoplay')[0].getElementsByClassName('jf_autoplay_images')[0];//父元素，主要移动该元素

        var thisAllTagA = thisFatherEle.getElementsByTagName('a');                                                  //包含img的a

        var thisPaginationEle = document.getElementsByClassName('jf_homepage_autoplay')[0].getElementsByClassName('jf_pagination')[0];//光标

        thisFatherEle.className = 'jf_autoplay_images';//预设 防止闪屏

        isAndroidVersion4 = !browser.supplier.wechat && browser.androidVersion && browser.androidVersion < 5;                  //安卓系统

        if (isAndroidVersion4) {                                                                  //安卓4.4以下 ，

            var allImages = thisFatherEle.getElementsByTagName('img');

            for (var i = 0; i < allImages.length; i++) {//固定图片高度

                var screenWidth = document.body.clientWidth;                                                               //屏幕宽度

                allImages[i].style.width = screenWidth + 'px';

                allImages[i].style.height = (screenWidth / 750 * 348) + 'px'
            }

            if (thisAllTagA.length == 2) {//两张图片时显示错位

                thisFatherEle.style.whiteSpace = 'nowrap';

                thisAllTagA[1].style.marginLeft = '-3px'

            }

        }

        if (thisAllTagA.length == 2) {//预设是几个元素，默认为三个以上

            isThreeEle = false;
            isTwoEle = true;

        }
        else if (thisAllTagA.length == 1) {

            isThreeEle = false;
            isTwoEle = false;

        }

        if (isTwoEle || isThreeEle) {//两个以上的图片再加点

            thisPaginationEle.innerHTML = '';

            for (var i = 0; i < thisAllTagA.length; i++) {

                var newSpan = document.createElement('span');                                                           //新建一个span元素

                thisPaginationEle.appendChild(newSpan);                                                                 //多少个图片 添加多少个span

            }

            paginationChange(0);                                                                             //默认选中第一个点点

        }

        /*预设图片的显示模式*/

        thisAllTagA[0].className = 'show delay';                                                                          //第一张为显示

        /*增加监听*/

        if (isThreeEle) {                                                                              //三张以及以上，此方法通过移动三个子元素

            thisAllTagA[1].className = 'after delay';                                                                         //第二张为后面一张

            thisAllTagA[thisAllTagA.length - 1].className = 'before delay';                                                   //最后一张为前一张

            setInterMove1000 = setInterval(jfAutoPlayRight, timer);//页面读取后开始轮播

            document.getElementsByClassName('jf_homepage_autoplay')[0].addEventListener('touchstart', jfAutoStart, false);//添加touchstrat事件

            jfAddEvent();                                                                                    //添加move 和 end 事件

        }

        else if (isTwoEle) {                                                                          //两张，此方法通过移动父元素

            var screenWidth = document.body.clientWidth;                                                               //屏幕宽度

            for (var i = 0; i < thisAllTagA.length; i++) {

                thisFatherEle.getElementsByTagName('a')[i].getElementsByTagName('img')[0].style.width = screenWidth + 'px';  //每个img的宽度 = 屏幕宽度

                thisAllTagA[i].style.width = screenWidth + 'px';                                                             //每个img的宽度 = 屏幕宽度

            }

            thisFatherEle.style.width = (screenWidth * (thisAllTagA.length)) + 'px';                                    //该元素的总宽度 = 图片数量 * 屏幕宽度

            thisAllTagA[1].className = 'show';                                                                          //第二张为显示

            document.getElementsByClassName('jf_homepage_autoplay')[0].addEventListener('touchstart', jfAutoStart, false);//添加touchstrat事件

            jfAddEvent();                                                                                    //添加move 和 end 事件

            setInterMove1000 = setInterval(jfAutoPlayTwoAll, timer);//页面读取后开始轮播

        }
        else {//默认一张不动

        }


        /*添加move和end事件*/
        function jfAddEvent() {                                                                                       //添加move 和 end 事件

            var thisEle = document.getElementsByClassName('jf_homepage_autoplay')[0];

            thisEle.addEventListener('touchmove', jfAutoMove, false);

            thisEle.addEventListener('touchend', jfAutoEnd, false);

        }


        //卸载move 和 end 事件
        function jfRemoveEvent() {

            var thisEle = document.getElementsByClassName('jf_homepage_autoplay')[0];

            thisEle.removeEventListener('touchmove', jfAutoMove, false);

            thisEle.removeEventListener('touchend', jfAutoEnd, false);

        }


        /*触摸开始事件*/
        //当图片上触摸事件开始时，停止轮播
        function jfAutoStart(event) {

            var thisFatherEle = document.getElementsByClassName('jf_homepage_autoplay')[0].getElementsByClassName('jf_autoplay_images')[0];//父元素，主要移动该元素

            //event.preventDefault();                                                                                     //禁止页面滚动

            clearInterval(setInterMove1000);                                                      //触摸开始时，停下循环轮播

            XPosition = lastStance = event.touches[0].clientX;              //预设第一次触摸点和最后一次触摸点

            var thisShowEle = thisFatherEle.getElementsByClassName('show')[0];

            if (thisShowEle.className.indexOf('delay') < 0 && isThreeEle) {  //触摸时没有delay样式的话&&三个元素以上的情况，添加该样式

                thisShowEle.className += ' delay';                                                                        //消除平滑过渡的效果

                thisFatherEle.getElementsByClassName('after')[0].className += ' delay';

                thisFatherEle.getElementsByClassName('before')[0].className += ' delay';


                //ios bug 关于多个应用开启后异步操作停止的问题
                iosStopInterVal();

            }
            else {//两个元素

                thisFatherEle.style.transition = 'transform 0s';

                thisFatherEle.style.webkitTransition = '-webkit-transform 0s';

            }


            //ios bug 关于多个应用开启后异步操作停止的问题
            function iosStopInterVal() {

                var thisFatherEle = document.getElementsByClassName('jf_homepage_autoplay')[0].getElementsByClassName('jf_autoplay_images')[0];//父元素，主要移动该元素

                var thisShowEle = thisFatherEle.getElementsByClassName('show')[0];


                if (browser.os.iOS && thisShowEle.className.indexOf('delay') > -1 && thisShowEle.className.indexOf('move') > -1 && thisShowEle.getAttribute('style').indexOf('translate3d') > -1) {

                    var thisShowIndex = 0;

                    var thisAllEle = thisFatherEle.getElementsByTagName('a');

                    for (var i = 0; i < thisAllEle.length; i++) {

                        if (thisAllEle[i].className && thisAllEle[i].getBoundingClientRect().left == 0) {

                            thisShowIndex = i;

                        }

                    }

                    thisAllEle[thisShowIndex].className = 'show delay';

                    if (thisShowIndex == 0) {

                        thisAllEle[thisAllEle.length - 1].className = 'before delay';

                        thisAllEle[thisShowIndex + 1].className = 'after delay';

                    }

                    else if (thisShowIndex == thisAllEle.length - 1) {

                        thisAllEle[0].className = 'after delay';

                        thisAllEle[thisShowIndex - 1].className = 'before delay';

                    }

                    else {

                        thisAllEle[thisShowIndex + 1].className = 'after delay';

                        thisAllEle[thisShowIndex - 1].className = 'before delay';

                    }


                    for (var i = 0; i < thisAllEle.length; i++) {

                        thisAllEle[i].removeAttribute('style');

                    }


                    thisShowEle.style.opacity = 0.1;

                    thisShowEle.className = thisShowEle.className.replace('delay', '')

                    setTimeout(function () {

                        thisShowEle.style.opacity = '';

                    }, 1);

                }

            }

        }


        /*触摸中事件*/
        function jfAutoMove(event) {      //当图片上触摸事件开始时，停止轮播

            var screenWidth = document.body.clientWidth;                                                               //屏幕宽度

            // event.preventDefault();                                                                                     //禁止页面滚动

            windowBanEvent.bundling();                                                                                  //触摸时禁止其他页面事件

            var XThisPosition = event.touches[0].clientX;                                                               //此时触摸的x值

            if (XThisPosition - XPosition > screenWidth / 3 || XThisPosition - lastStance > 6) {//移动距离大于三分之一或者移动速度大于6

                isChange = 1;                                                                     //后退

            }

            else if (XThisPosition - XPosition < -screenWidth / 3 || XThisPosition - lastStance < -6) {//移动距离大于三分之一或者移动速度大于6

                isChange = 2;                                                                     //前进

            }

            else {

                isChange = 0;                                                                     //恢复原位，停止不动

            }

            var thisFatherEle = document.getElementsByClassName('jf_homepage_autoplay')[0].getElementsByClassName('jf_autoplay_images')[0];//父元素，主要移动该元素

            if (isThreeEle) {//三个元素以上的情况,移动

                /*thisFatherEle.getElementsByClassName('show')[0].style.transform = 'translate3d(' + (XThisPosition - XPosition) + 'px,0,0)'; //此时的元素

                 thisFatherEle.getElementsByClassName('show')[0].style.webkitTransform = 'translate3d(' + (XThisPosition - XPosition) + 'px,0,0)';

                 thisFatherEle.getElementsByClassName('after')[0].style.transform = 'translate3d(' + (XThisPosition - XPosition) + 'px,0,0)';//下一个元素

                 thisFatherEle.getElementsByClassName('after')[0].style.webkitTransform = 'translate3d(' + (XThisPosition - XPosition) + 'px,0,0)';

                 thisFatherEle.getElementsByClassName('before')[0].style.transform = 'translate3d(' + (XThisPosition - XPosition) + 'px,0,0)';//上一个元素

                 thisFatherEle.getElementsByClassName('before')[0].style.webkitTransform = 'translate3d(' + (XThisPosition - XPosition) + 'px,0,0)';*/

                setTransform(thisFatherEle.getElementsByClassName('show')[0],(XThisPosition - XPosition) + 'px');

                setTransform(thisFatherEle.getElementsByClassName('after')[0],(XThisPosition - XPosition) + 'px');

                setTransform(thisFatherEle.getElementsByClassName('before')[0],(XThisPosition - XPosition) + 'px');

            }
            else {//两种情况，移动，需要当心边缘抵抗

                var thisPosition = XThisPosition - XPosition;

                if (!ifPosition) {

                    if (thisPosition <= 0) {

                        setTransform(thisFatherEle,thisPosition + 'px');

                        /*thisFatherEle.style.transform = 'translate3d(' + thisPosition + 'px,0,0)';
                         thisFatherEle.style.webkitTransform = 'translate3d(' + thisPosition + 'px,0,0)'*/

                    }
                    else {

                        setTransform(thisFatherEle,thisPosition / 4 + 'px');

                        /* thisFatherEle.style.transform = 'translate3d(' + thisPosition / 4 + 'px,0,0)';//边缘抵抗为移动的四分之一

                         thisFatherEle.style.webkitTransform = 'translate3d(' + thisPosition / 4 + 'px,0,0)'*/
                    }
                }
                else {

                    if (thisPosition >= 0) {

                        setTransform(thisFatherEle,(thisPosition - screenWidth) + 'px');

                        /*thisFatherEle.style.transform = 'translate3d(' + (thisPosition - screenWidth) + 'px,0,0)';

                         thisFatherEle.style.webkitTransform = 'translate3d(' + (thisPosition - screenWidth) + 'px,0,0)'*/

                    }

                    else {

                        setTransform(thisFatherEle,(thisPosition / 4 - screenWidth) + 'px');

                        /*thisFatherEle.style.transform = 'translate3d(' + (thisPosition / 4 - screenWidth) + 'px,0,0)';

                         thisFatherEle.style.webkitTransform = 'translate3d(' + (thisPosition / 4 - screenWidth) + 'px,0,0)'*/

                    }
                }
            }

            lastStance = XThisPosition;                                                           //存储这次触摸位置，供下次使用

        }


        /*触摸结束事件*/
        function jfAutoEnd(event) {        //当图片上触摸事件结束时，继续轮播

            // event.preventDefault();                                                                                     //禁止浏览器事件

            var thisFatherEle = document.getElementsByClassName('jf_homepage_autoplay')[0].getElementsByClassName('jf_autoplay_images')[0];//父元素，主要移动该元素

            var thisShowEle = thisFatherEle.getElementsByClassName('show')[0];

            var thisAfterEle = thisFatherEle.getElementsByClassName('after')[0];


            if (isThreeEle) {//三个元素以上的情况

                var thisBeforeEle = thisFatherEle.getElementsByClassName('before')[0];

                thisShowEle.className = thisShowEle.className.replace(' delay', '');                                         //消除平滑过渡的效果

                thisAfterEle.className = thisAfterEle.className.replace(' delay', '');

                thisBeforeEle.className = thisBeforeEle.className.replace(' delay', '');

            }

            if (isChange == 2 && isThreeEle) {//三个元素以上的情况 向右

                jfAutoPlayRight();

            }

            else if (isChange == 2) {//两个元素的情况 向右

                jfAutoPlayTwoRight();

            }
            else if (isChange == 1 && isThreeEle) {//三个元素以上的情况 向左

                jfAutoPlayLeft();

            }
            else if (isChange == 1) {//两个元素的情况 向左

                jfAutoPlayTwoLeft();

            }

            else {

                if (isThreeEle) {

                    setTransform(thisShowEle,0);
                    setTransform(thisAfterEle,0);
                    setTransform(thisBeforeEle,0);

                    /* thisShowEle.style.transform = '';
                     thisShowEle.style.webkitTransform = ''; //此时的元素

                     thisAfterEle.style.transform = '';
                     thisAfterEle.style.webkitTransform = '';  //下一个元素

                     thisBeforeEle.style.transform = '';

                     thisBeforeEle.style.webkitTransform = '';      //上一个元素*/

                }
                else {

                    thisFatherEle.style.transition = '';
                    thisFatherEle.style.webkitTransition = '';

                    if (!ifPosition) {

                        setTransform(thisFatherEle,0);
                        /*thisFatherEle.style.transform = '';
                         thisFatherEle.style.webkitTransform = ''*/

                    }
                    else {

                        var screenWidth = document.body.clientWidth;

                        setTransform(thisFatherEle,'-' + screenWidth + 'px');
                        /*
                         thisFatherEle.style.transform = 'translate3d(-' + screenWidth + 'px,0,0)';

                         thisFatherEle.style.webkitTransform = 'translate3d(-' + screenWidth + 'px,0,0)';
                         */

                    }


                }

                /*thisShowEle.addEventListener('transitionend', transitionMoveEndFn, false);                              //绑定平滑过渡后的方法

                 thisShowEle.addEventListener('webkitTransitionEnd', transitionMoveEndFn, false);

                 thisFatherEle.addEventListener('transitionend', transitionMoveEndFn, false);                              //绑定平滑过渡后的方法

                 thisFatherEle.addEventListener('webkitTransitionEnd', transitionMoveEndFn, false);*/

                addTransition(thisShowEle,transitionMoveEndFn);

                addTransition(thisFatherEle,transitionMoveEndFn);

                function transitionMoveEndFn() {

                    windowBanEvent.unbundling();                                                                        //解绑

                    /*thisShowEle.removeEventListener('transitionend', transitionMoveEndFn, false);                       //绑定平滑过渡后的方法

                     thisShowEle.removeEventListener('webkitTransitionEnd', transitionMoveEndFn, false);

                     thisFatherEle.removeEventListener('transitionend', transitionMoveEndFn, false);                       //绑定平滑过渡后的方法

                     thisFatherEle.removeEventListener('webkitTransitionEnd', transitionMoveEndFn, false);*/

                    removeTransition(thisShowEle,transitionMoveEndFn);

                    removeTransition(thisFatherEle,transitionMoveEndFn);

                }

            }

            if (isThreeEle) {//三个元素以上的情况

                setInterMove1000 = setInterval(jfAutoPlayRight, timer);//加轮播循环

            }
            else {//三个元素以下的情况
                setInterMove1000 = setInterval(jfAutoPlayTwoAll, timer);//开始轮播
            }

            isChange = XPosition = lastStance = 0;    //初始化动态值

            windowBanEvent.unbundling();                                                                                 //解绑

        }


        function jfAutoPlayTwoAll() {

            if (!ifPosition) {

                jfAutoPlayTwoRight();

            }
            else {

                jfAutoPlayTwoLeft();

            }

        }


        function jfAutoPlayTwoRight() {

            var thisFatherEle = document.getElementsByClassName('jf_homepage_autoplay')[0].getElementsByClassName('jf_autoplay_images')[0];//父元素，主要移动该元素

            var screenWidth = document.body.clientWidth;                                                               //屏幕宽度

            thisFatherEle.style.transition = '';

            thisFatherEle.style.webkitTransition = '';


            setTransform(thisFatherEle,'-' + screenWidth + 'px');
            /*thisFatherEle.style.transform = 'translate3d(-' + screenWidth + 'px,0,0)';

             thisFatherEle.style.webkitTransform = 'translate3d(-' + screenWidth + 'px,0,0)';*/

            ifPosition = 1;

            paginationChange(1);

        }

        function jfAutoPlayTwoLeft() {

            var thisFatherEle = document.getElementsByClassName('jf_homepage_autoplay')[0].getElementsByClassName('jf_autoplay_images')[0];//父元素，主要移动该元素

            thisFatherEle.style.transition = '';
            thisFatherEle.style.webkitTransition = '';

            setTransform(thisFatherEle,0);
            /*thisFatherEle.style.transform = '';
             thisFatherEle.style.webkitTransform = '';*/

            ifPosition = 0;

            paginationChange(0);

        }

        function jfAutoPlayRight() {//向右移动

            jfRemoveEvent();

            var thisFatherEle = document.getElementsByClassName('jf_homepage_autoplay')[0].getElementsByClassName('jf_autoplay_images')[0];//父元素，主要移动该元素

            var thisAllTagA = thisFatherEle.getElementsByTagName('a');                                                      //包含img的a

            var thisBeforeEle = thisFatherEle.getElementsByClassName('before')[0];                                         //前一个元素

            var thisShowEle = thisFatherEle.getElementsByClassName('show')[0];                                              //此时的元素

            var thisAfterEle = thisFatherEle.getElementsByClassName('after')[0];                                            //下一个元素

            if (!isAndroidVersion4) {//非安卓4.4以下系统

                thisShowEle.className = thisShowEle.className.replace(' delay', ' move');                                       //此时的元素向后平滑过渡

                setTransform(thisShowEle,'-100%');
                /*thisShowEle.style.transform = 'translate3d(-100%, 0, 0)';
                 thisShowEle.style.webkitTransform = 'translate3d(-100%, 0, 0)';*/

                thisAfterEle.className = thisAfterEle.className.replace(' delay', ' move');                                     //下个元素向后平滑过渡

                setTransform(thisAfterEle,'-100%');
                /*thisAfterEle.style.transform = 'translate3d(-100%, 0, 0)';
                 thisAfterEle.style.webkitTransform = 'translate3d(-100%, 0, 0)';*/

                /*thisShowEle.addEventListener('transitionend', transitionEndFn, false);                                          //绑定平滑过渡后的方法

                 thisShowEle.addEventListener('webkitTransitionEnd', transitionEndFn, false);*/

                addTransition(thisShowEle, transitionEndFn);

                function transitionEndFn() {

                    thisShowEle.className += ' delay';                                                                          //消除平滑过渡的效果

                    thisAfterEle.className += ' delay';

                    setTimeout(function () {

                        thisBeforeEle.className = '';                                                                             //前一个元素隐藏

                        thisShowEle.className = 'before delay';                                                                  //将此时这个元素变成上一个元素

                        setTransform(thisShowEle,0);
                        /*thisShowEle.style.transform = '';
                         thisShowEle.style.webkitTransform = '';*/

                        thisAfterEle.className = 'show delay ';                                                                  //此时下一个元素变成这个元素

                        setTransform(thisAfterEle,0);
                        /*thisAfterEle.style.transform = '';
                         thisAfterEle.style.webkitTransform = '';*/

                        for (var i = 0, switchI = 0; i < thisAllTagA.length; i++) {                                         //遍历寻找下一个元素

                            if (thisAllTagA[i] == thisAfterEle) {                                                           //找到那个元素

                                switchI = 1;

                                paginationChange(i);                                                             //小圆点跳到那个点

                            }
                            else if (switchI && thisAllTagA[i].tagName == 'A') {

                                break;                                                                                       //获取i的值

                            }

                        }

                        if (i != thisAllTagA.length) {                                                                         //如果没有找到，说明下一个元素在第一个

                            thisAllTagA[i].className = 'after delay';

                        }
                        else {

                            thisAllTagA[0].className = 'after delay';                                                      //如果找到，说明下一个元素就是i的位置

                        }

                        /* thisShowEle.removeEventListener('transitionend', transitionEndFn);                                  //移除平滑过渡

                         thisShowEle.removeEventListener('webkitTransitionEnd', transitionEndFn);*/

                        removeTransition(thisShowEle,transitionEndFn)

                        for (var i = 0; i < thisAllTagA.length; i++) {

                            /*thisAllTagA[i].style.transform = '';

                             thisAllTagA[i].style.webkitTransform = '';//清空style值*/

                            setTransform(thisAllTagA[i],0);

                        }

                        jfAddEvent();                                                                            //再加监听

                    }, 1)

                }

            }

            else {//安卓4.4以下系统，取消平滑过渡效果
                thisBeforeEle.className = '';                                                                             //前一个元素隐藏

                thisShowEle.className = 'before delay';                                                                  //将此时这个元素变成上一个元素

                /*thisShowEle.style.transform = '';
                 thisShowEle.style.webkitTransform = '';*/
                setTransform(thisShowEle,0);

                thisAfterEle.className = 'show delay ';                                                                  //此时下一个元素变成这个元素

                setTransform(thisAfterEle,0);
                /*thisAfterEle.style.transform = '';
                 thisAfterEle.style.webkitTransform = '';*/

                for (var i = 0, switchI = 0; i < thisAllTagA.length; i++) {                                         //遍历寻找下一个元素

                    if (thisAllTagA[i].style) {
                        thisAllTagA[i].removeAttribute('style');
                    }
                    if (thisAllTagA[i] == thisAfterEle) {                                                           //找到那个元素

                        switchI = 1;

                        paginationChange(i);                                                             //小圆点跳到那个点
                    }
                    else if (switchI && thisAllTagA[i].tagName == 'A') {

                        break;                                                                                       //获取i的值

                    }
                }

                if (i != thisAllTagA.length) {                                                                         //如果没有找到，说明下一个元素在第一个

                    thisAllTagA[i].className = 'after delay';

                }

                else {

                    thisAllTagA[0].className = 'after delay ';                                                      //如果找到，说明下一个元素就是i的位置

                }

                jfAddEvent();                                                                            //再加监听

            }

        }

        function jfAutoPlayLeft() {//向左移动

            jfRemoveEvent();

            var thisFatherEle = document.getElementsByClassName('jf_homepage_autoplay')[0].getElementsByClassName('jf_autoplay_images')[0];//父元素，主要移动该元素

            var thisAllTagA = thisFatherEle.getElementsByTagName('a');                                                      //包含img的a

            var thisBeforeEle = thisFatherEle.getElementsByClassName('before')[0];                                         //前一个元素

            var thisShowEle = thisFatherEle.getElementsByClassName('show')[0];                                              //此时的元素

            var thisAfterEle = thisFatherEle.getElementsByClassName('after')[0];                                            //下一个元素

            if (!isAndroidVersion4) {//非安卓4.4以下系统

                thisShowEle.className = thisShowEle.className.replace(' delay', ' move_left');                                        //此时的元素向后平滑过渡

                setTransform(thisShowEle,'100%');
                /*thisShowEle.style.transform = 'translate3d(100%, 0, 0)';

                 thisShowEle.style.webkitTransform = 'translate3d(100%, 0, 0)';*/

                thisBeforeEle.className = thisBeforeEle.className.replace(' delay', ' move_left');                                   //下个元素向后平滑过渡

                setTransform(thisBeforeEle,'100%');
                /*thisBeforeEle.style.transform = 'translate3d(100%, 0, 0)';
                 thisBeforeEle.style.webkitTransform = 'translate3d(100%, 0, 0)';*/

                /*thisShowEle.addEventListener('transitionend', transitionEndFn, false);                                          //绑定平滑过渡后的方法

                 thisShowEle.addEventListener('webkitTransitionEnd', transitionEndFn, false);
                 */

                addTransition(thisShowEle,transitionEndFn);

                function transitionEndFn() {

                    thisShowEle.className += ' delay';                                                                          //消除平滑过渡的效果

                    thisBeforeEle.className += ' delay';

                    setTimeout(function () {

                        thisAfterEle.className = '';                                                                             //前一个元素隐藏

                        thisShowEle.className = 'after delay';                                                                  //将此时这个元素变成上一个元素

                        setTransform(thisShowEle,0);
                        /*thisShowEle.style.transform = '';
                         thisShowEle.style.webkitTransform = '';*/

                        thisBeforeEle.className = 'show delay';                                                                  //此时下一个元素变成这个元素

                        setTransform(thisBeforeEle,0);
                        /*thisBeforeEle.style.transform = '';
                         thisBeforeEle.style.webkitTransform = '';*/


                        for (var i = thisAllTagA.length - 1, switchI = 0; i >= 0; i--) {                                         //遍历寻找下一个元素

                            if (thisAllTagA[i] == thisBeforeEle) {

                                switchI = 1;

                                paginationChange(i);

                            }
                            else if (switchI && thisAllTagA[i].tagName == 'A') {

                                break;                                                                                       //获取i的值

                            }

                        }

                        if (i != -1) {                                                                                        //如果没有找到，说明下一个元素在第一个

                            thisAllTagA[i].className = 'before delay';

                        }
                        else {

                            thisAllTagA[thisAllTagA.length - 1].className = 'before delay';                                   //如果找到，说明下一个元素就是i的位置

                        }

                        /*thisShowEle.removeEventListener('transitionend', transitionEndFn);                                  //移除平滑过渡

                         thisShowEle.removeEventListener('webkitTransitionEnd', transitionEndFn);*/

                        removeTransition(thisShowEle,transitionEndFn);

                        for (var i = 0; i < thisAllTagA.length; i++) {

                            /* thisAllTagA[i].style.transform = '';
                             thisAllTagA[i].style.webkitTransform = '';*/
                            setTransform(thisAllTagA[i],0);

                        }

                        jfAddEvent();                                                                            //加监听


                    }, 1)


                }
            }

            else {//安卓4.4以下系统，取消平滑过渡效果
                thisAfterEle.className = '';                                                                             //前一个元素隐藏

                thisShowEle.className = 'after delay';                                                                  //将此时这个元素变成上一个元素

                setTransform(thisShowEle,0);
                // thisShowEle.style.transform = '';
                // thisShowEle.style.webkitTransform = '';

                thisBeforeEle.className = 'show delay';                                                                  //此时下一个元素变成这个元素

                setTransform(thisBeforeEle,0);

                /*thisBeforeEle.style.transform = '';
                 thisBeforeEle.style.webkitTransform = '';*/

                for (var i = thisAllTagA.length - 1, switchI = 0; i >= 0; i--) {                                         //遍历寻找下一个元素

                    if (thisAllTagA[i].style) {
                        thisAllTagA[i].removeAttribute('style');
                    }
                    if (thisAllTagA[i] == thisBeforeEle) {                                                           //找到那个元素

                        switchI = 1;

                        paginationChange(i);                                                             //小圆点跳到那个点
                    }
                    else if (switchI && thisAllTagA[i].tagName == 'A') {

                        break;                                                                                       //获取i的值

                    }
                }

                if (i != -1) {                                                                                        //如果没有找到，说明下一个元素在第一个

                    thisAllTagA[i].className = 'before delay';

                }
                else {

                    thisAllTagA[thisAllTagA.length - 1].className = 'before delay';                                   //如果找到，说明下一个元素就是i的位置

                }

                jfAddEvent();                                                                            //再加监听

            }

        }

        function paginationChange(thisChangeI) {

            var thisPaginationEle = document.getElementsByClassName('jf_homepage_autoplay')[0].getElementsByClassName('jf_pagination')[0];//光标

            var thisPaginationSpan = thisPaginationEle.getElementsByTagName('span');                                        //所有的小点点

            for (var i = 0; i < thisPaginationSpan.length; i++) {

                thisPaginationSpan[i].removeAttribute('class');                                                         //清除所有点点的样式，以便重新写

            }

            var activePag;                                                                                             //增加点点选中时的样式

            if (thisChangeI >= thisPaginationSpan.length) {                                                             //翻动时（最后一张到最后一张）的debug

                activePag = 0;

            }

            else {

                activePag = thisChangeI;                                                                                //到哪张，就移动哪张

            }

            thisPaginationSpan[activePag].className = 'active';                                                         //此时这点点被选中
        }



        /*清空transform属性*/


        function setTransform(ele,num) {

            if(num) {

                ele.style.transform = 'translate3d(' + num + ',0,0)'; //此时的元素

                ele.style.webkitTransform = 'translate3d(' + num + ',0,0)';

            }

            else {

                ele.style.transform = ''; //此时的元素

                ele.style.webkitTransform = '';

            }

        }

        function removeTransition(ele,fn) {

            ele.removeEventListener('transitionend', fn);                                  //移除平滑过渡

            ele.removeEventListener('webkitTransitionEnd', fn);

        }


        function addTransition(ele,fn) {

            ele.addEventListener('transitionend', fn);                                  //移除平滑过渡

            ele.addEventListener('webkitTransitionEnd', fn);

        }

    },


    jfCarouselInit: function () {                                                                                   //初始化

        //window.addEventListener('load', function () {

        jfAutoPlay.jfAutoPlayInit();

        //});

    }

};