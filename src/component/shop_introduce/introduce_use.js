

/*图片手动轮播*/
var productInfoPlay={

    "figer":{

        "ischange":true,

        "ismove":true //true表示左右移动，执行轮播的JS，false表示上下移动，不执行轮播的JS

    },
    /*初始化,没有动画弹出*/
    init:function(details){

        var _this=this;

        if(!details){//如果details未输入，则防止报错
            details={};
        }

        _this.moveEle = details.moveEle || 'allimg';//当前显示的banner图片的整个div,class选择器

        _this.moveEleParent=details.moveEleParent||'demo1';//当前显示的整个框架

        _this.scaleEleParent=details.scaleEleParent||'jdshow_center_center';

        _this.allShowEle=details.allShowEle||false;//整个弹出的元素框架,class选择器，默认没有

        _this.fn=details.fn||0;

        _this.thisPosition = 0;//初始化现在在第几个页面

        _this.moveDistanceX = 0;//x方向移动的距离(一根手指)

        _this.moveDistanceY=0;//y方向移動的距離

        setTimeout(function () {

            //当前页面Banner部分绑定事件
            _this.initPointEle(_this.moveEleParent);//初始化点点（参数一当前移动元素的父元素）

        },100);


        _this.moveEvent();//元素绑定事件（参数一当前移动元素）


        if( _this.allShowEle){//如果存在弹出的页面

            //  _this.initPointEle( _this.allShowEle);//初始化点点（参数一当前移动元素的父元素）

            document.getElementsByClassName( _this.allShowEle)[0].getElementsByClassName( _this.moveEle)[0].innerHTML=document.getElementsByClassName( _this.moveEle)[0].innerHTML;//获取所有的图片=主体内容图片部分

            document.getElementsByClassName('img_content')[0].addEventListener('touchmove',function(e){e.preventDefault()},false);//禁止阴影部分滑动

            var BannerEle=document.getElementsByClassName( _this.moveEle)[0].getElementsByClassName(_this.scaleEleParent);

            for(var i=0;i<BannerEle.length;i++){

                BannerEle[i].getElementsByTagName('div')[0].className=""
            }

            var hideBannerEle=document.getElementsByClassName('delete_banner')[0];//关闭弹出层元素；

            hideBannerEle.addEventListener('click',function(){

                var thisScaleEle=document.getElementsByClassName('jd_banner_touch');

                for(var i=0;i<thisScaleEle.length;i++){

                    thisScaleEle[i].style.transform="scale3d(1,1,1) translate3d(0,0,0)";
                }

                document.getElementsByClassName( _this.allShowEle)[0].style.display='none';

                document.getElementsByTagName("body")[0].style.overflow="";//页面可以滚动

                document.getElementsByTagName("html")[0].style.overflow="";//页面可以滚动

                document.getElementsByTagName("body")[0].style.height="100%";

                document.getElementsByTagName("html")[0].style.height="100%";


            },false);


        }


    },


    /*元素绑定事件*/
    moveEvent:function(){//参数一为移动元素的class值，参数二是点点的父元素

        var _this=this;

        var moveEle=document.getElementsByClassName(_this.moveEle);//banner轮播图

        var thisNum = moveEle[0].getElementsByClassName(_this.scaleEleParent).length - 1;

        var thisWindowWidth = window.innerWidth;//屏幕可视窗口宽度

        var firstTouchesClientX; //初次点击的位置X坐标

        var firstTouchesClientY;//初次点击的位置Y坐标

        var moveTouchesClientX;//移动一段距离后，停止点的位置(X)

        var moveTouchesClientY;//移动一段距离后，停止点的位置(Y)

        var lastDis=0;//前一次距离

        var newDis=0;//最新的距离

        var lastDistanceSpeed=0;//最后一次速度


        moveEle[0].addEventListener('touchstart',function(event){

            var evt = event ? event : window.event;

            if(evt.touches.length==1){

                _this.moveDistanceX=0;

                _this.moveDistanceY=0;

                _this.figer.ischange=true;//初始化可移动

                getFirstPosition(event);

                if(this.className=""+_this.moveEle+" contentchange"){

                    this.className=""+_this.moveEle+""
                }
            }




        },false);//获取初始位置

        moveEle[0].addEventListener('touchmove',function(event){

            var evt = event ? event : window.event;

            if(evt.touches.length==1){

                lastDistanceSpeed=getLastPosition(event);

                if(_this.figer.ischange){

                    if(Math.abs(_this.moveDistanceY)>Math.abs(_this.moveDistanceX)){//如果在Y軸方向移動的距離大於X軸方向，則不轮播

                        _this.figer.ismove=false
                    }else {

                        _this.figer.ismove=true
                    }

                    _this.figer.ischange=false;//进行锁定一次，
                }

                if( _this.figer.ismove){//判断为左右移动时，即可运行相应的JS

                    evt.preventDefault();//阻止浏览器的默认行为

                    evt.stopPropagation();

                    if(((_this.thisPosition==0)&&_this.moveDistanceX>0)||((_this.thisPosition==-thisNum) &&_this.moveDistanceX<0)){//第一页，滑动会产生一个阻力
                        _this.moveDistanceX=_this.moveDistanceX/3;
                    }

                    _this.changeTranslate(parseFloat(_this.thisPosition*thisWindowWidth)+parseFloat(_this.moveDistanceX) + 'px');//移动中
                }

            }



        },false);

        moveEle[0].addEventListener('touchend',function(event){

            var evt = event ? event : window.event;

            if(evt.changedTouches.length==1){

                if(_this.figer.ismove){

                    this.className= ""+_this.moveEle+" contentchange";//添加class,带有Transition的属性

                    if(this.parentElement==document.getElementsByClassName(_this.moveEleParent)[0]){//如果在banner轮播，

                        if(((_this.thisPosition==-thisNum) &&_this.moveDistanceX<0)&&(Math.abs(_this.moveDistanceX)>55)){

                            if(_this.fn){//当前处于第4页，并且继续滑动，执行相应的脚本

                                _this.fn()
                            }
                        }
                    }


                    if(Math.abs(_this.moveDistanceX)>(thisWindowWidth/3)||lastDistanceSpeed>6){//当手指的移动距离大于屏幕的1/3时，变化

                        _this.movePosition(_this.moveDistanceX);

                    }else {

                        _this.changeTranslate(parseFloat(_this.thisPosition*thisWindowWidth) + 'px');//变化到指定位置

                    }

                    _this.transitionFn(transitionMoveEndFn);//平滑过渡事件

                }





            }



        },false);

        //弹出层
        moveEle[0].addEventListener('click',function(){_this.showNewBanner();},false);



        //初始移送的位置
        function getFirstPosition(event) {

            var evt = event ? event : window.event;

            firstTouchesClientX = parseFloat(evt.touches[0].clientX);//当前点击事件距离屏幕左边的距离(初始位置-X);

            firstTouchesClientY=parseFloat(evt.touches[0].clientY);//当前点击事件距离屏幕左边的距离(初始位置-X);

            lastDis=newDis=firstTouchesClientX;

        }

        //手指即将离开的位置
        function getLastPosition(event) {

            var evt = event ? event : window.event;

            moveTouchesClientX = parseFloat(evt.changedTouches[0].clientX);//末尾位置(X);

            moveTouchesClientY = parseFloat(evt.changedTouches[0].clientY);//末尾位置(Y);

            lastDis=newDis;

            newDis=moveTouchesClientX;

            _this.moveDistanceX = moveTouchesClientX - firstTouchesClientX;//x軸方向最终移动的距离（第一根手指）

            _this.moveDistanceY = moveTouchesClientY - firstTouchesClientY;//Y軸方向最终移动的距离（第一根手指）

            return Math.abs(newDis-lastDis);

        }

        //绑定平滑过渡后的方法
        function transitionMoveEndFn(){

            for( var i=0;i<moveEle.length;i++){

                moveEle[i].className=""+_this.moveEle+"";//移除class,带有Transition的属性

                moveEle[i].removeEventListener('transitionend', transitionMoveEndFn, false);

                moveEle[i].removeEventListener('transitionend', transitionMoveEndFn, false);
            }

        }

    },

    /*元素移动*/
    movePosition:function(position){//参数一当前移动的位置方向
        var _this=this;

        var thisWindowWidth = window.innerWidth;//屏幕可视窗口宽度

        var moveEle=document.getElementsByClassName(_this.moveEle);//包裹所有主体中的banner图片的父级元素

        var thisNum = moveEle[0].getElementsByClassName(_this.scaleEleParent).length - 1;

        var PointParent=document.getElementsByClassName('allpoint');//点点的父元素

        var BannerPoint= PointParent[0].getElementsByTagName('span');//banner中的点点

        var newBannerPonit=PointParent[PointParent.length-1].getElementsByTagName('span');//弹出来的点点


        //如果向右滚动，则不能超过最大图片个数
        if (parseFloat(position) < 0) {

            _this.thisPosition > -thisNum ? _this.thisPosition-- : _this.thisPosition = -thisNum;

        }

        //如果向左边滚动，不能超过最左边
        else if (parseFloat(position) > 0) {

            _this.thisPosition < 0 ? _this.thisPosition++ : _this.thisPosition = 0;
        }

        _this.changeTranslate(thisWindowWidth * this.thisPosition + 'px');//变化到指定位置




        if(BannerPoint){
            //变化点点的位置

            for(var i=0;i<PointParent.length;i++){

                PointParent[i].getElementsByClassName('showpoint')[0].className="";
            }

            BannerPoint[-this.thisPosition].className="showpoint";

            newBannerPonit[-this.thisPosition].className="showpoint"

        }


    },

    /*添加元素*/
    initPointEle:function(pointParentEle){//参数是点点以及banner的父元素,以及点点父元素的class值

        var _this = this;

        var AllBannerImg=document.getElementsByClassName( _this.moveEle)[0].getElementsByClassName(_this.scaleEleParent);//显示的banner图片

        var pointEle="";//点点元素

        for(var i=0;i<AllBannerImg.length;i++){


            if (i == 0) {

                pointEle += '<span class="showpoint"></span>';
            }

            else {

                pointEle += '<span></span>';

            }

        }

        addnode("div",pointEle,'allpoint');

        function addnode(tag, innerHtml, className){

            var obj = document.createElement(tag);

            if (className) {

                obj.className = className
            }

            obj.innerHTML = innerHtml;

            document.getElementsByClassName(pointParentEle)[0].appendChild(obj);
        }

    },

    //元素位置变化的方法
    changeTranslate:function(num1){

        var _this=this;

        var moveEle=document.getElementsByClassName(_this.moveEle);

        for( var i=0;i<moveEle.length;i++){

            moveEle[i].style.transform = 'translateX(' + num1 + ')';

            moveEle[i].style.webkitTransform = 'translateX(' + num1 + ')';

        }

    },

    //元素平滑过渡的方法
    transitionFn:function(myFn){

        var _this=this;

        var moveEle=document.getElementsByClassName(_this.moveEle);

        for( var i=0;i<moveEle.length;i++){

            moveEle[i].addEventListener("TransitionEnd",myFn,false);

            moveEle[i].addEventListener("webkitTransitionEnd",myFn,false);

        }

    },

    //判断有没有弹出层
    showNewBanner:function(){

        var _this=this;

        var thisWindowHeight=window.innerHeight;

        if(_this.moveDistanceX==0&&_this.moveDistanceY==0&&_this.allShowEle){//当没有任何移动，即点击，出现弹出图片

            document.getElementsByClassName( _this.allShowEle)[0].style.display='block';//弹出元素显示

            document.getElementsByTagName("body")[0].style.height=""+thisWindowHeight+"px";
            document.getElementsByTagName("html")[0].style.height=""+thisWindowHeight+"px";

            document.getElementsByTagName("body")[0].style.overflow="hidden";//页面禁止滚动
            document.getElementsByTagName("html")[0].style.overflow="hidden";//页面禁止滚动

        };


    }

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


    //------ 多个sku点击
    skuBoxChange: function () {

        var skuBox = document.getElementById('main_sku').getElementsByClassName('sku_contain');

        for (var i = 0; i < skuBox.length; i++) {

            jfProductDetails.clickTabChange(skuBox[i], 'choose_tab', 'sku_box');
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


    //------点击滚动条到固定位置

    scrollEle: function (ele, distance) {


        var eleScrollTop = ele.getBoundingClientRect().top + getScrollTop() - distance;

        var scrollTopMove = setInterval(interValScroll, 5);                                                             //循环

        var iChage = 0;                                                                                                 //循环计数

        var elasticity = 1;                                                                                             //变化的计量

        var thisScrollTop;

        var changeDistanceScrollTop = eleScrollTop - getScrollTop();                                           //真实的相差距离

        function interValScroll() {

            elasticity = (25 - iChage) / 25 * .9 + 1;                                                                   //变化的计量=(25-此时的计数)/25*.9+1; 用于乘法的计量，大概变化过程：1.5 -> 1 -> 0.5 ，模拟平滑过渡

            thisScrollTop = getScrollTop() + changeDistanceScrollTop / 50 * elasticity;                        //计算此时的距离

            //console.log('页面滚动距离'+getScrollTop());

            window.scrollTo(0, thisScrollTop);

            iChage++;                                                                                                   //计数

            if (iChage == 50) {

                window.scrollTo(0, eleScrollTop);


                clearInterval(scrollTopMove);                                                                           //如果到50，则结束循环

                //console.log('最后滚动为止：'+eleScrollTop)


            }




        }

        //兼容性修正
        function getScrollTop(){

            var scrollTop=0;

            if(document.documentElement&&document.documentElement.scrollTop){

                scrollTop=document.documentElement.scrollTop;

            }else if(document.body){

                scrollTop=document.body.scrollTop;
            }
            return scrollTop;
        }

    },


    //------购物车加减按钮

    volumeChange: function (isProduct) {  //如果是详情页的话为true，不是的话为false

        var volumeBox = document.getElementsByClassName('volume_btn');

        var lastScrollTop;

        for (var i = 0; i < volumeBox.length; i++) {   //找到当前的父元素

            volumeBox[i].getElementsByClassName('reduce')[0].addEventListener('touchstart', reduceEle, false);          //对 加&减

            volumeBox[i].getElementsByClassName('add')[0].addEventListener('touchstart', reduceEle, false);

            volumeBox[i].getElementsByClassName('volume_input')[0].addEventListener('blur', valueOne, false);          //对 加&减

            if (browser.os.iOS && isProduct) {

                var inputEle = volumeBox[i].getElementsByClassName('volume_input')[0];

                inputEle.addEventListener('focus', focusScrollPosition, false);

                inputEle.addEventListener('blur', blurScrollPosition, false);
            }
            /*            else {

                            var inputEle = volumeBox[i].getElementsByClassName('volume_input')[0];

                            inputEle.addEventListener('focus', focusAndroidTab, false);

                            inputEle.addEventListener('blur', blurAndroidTab, false);



                        }*/

        }

        function focusAndroidTab() {

            document.getElementById('settlementTab').style.display = 'none';

            document.getElementById('deleteTab').style.display = 'none';

            document.getElementsByClassName('bottom_tabbar')[0].style.display = 'none'



        }

        function blurAndroidTab() {

            document.getElementById('settlementTab').style.display = '';

            document.getElementById('deleteTab').style.display = '';

            document.getElementsByClassName('bottom_tabbar')[0].style.display = ''

        }

        function reduceEle() {


            var eleInput = this.parentNode.getElementsByClassName('volume_input')[0];

            var thisValue = parseInt(eleInput.value);

            if (this.className.indexOf('reduce') > -1) {


                eleInput.value = changeValue(thisValue - 1);


            }
            else {

                eleInput.value = changeValue(thisValue + 1);

            }


        }

        function changeValue(num) { //循环 小于等于1的时候永远为1，反之为他本身的值


            if (num <= 1 || !num) {

                return 1;
            }
            else {

                return num;
            }

        }

        function blurScrollPosition() {

            window.scrollTo(0, lastScrollTop);

            valueOne();


        }

        function valueOne() {

            this.value = changeValue(this.value); //如果输入的内容为0或者空时,value为1

        }

        function focusScrollPosition() {

            lastScrollTop = document.body.scrollTop;

            setTimeout(function () {

                window.scrollTo(0, document.body.scrollHeight);

            }, 300)

        }


    },




};



