//判断浏览器和设备
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
//判断结束


//禁用默认浏览器事件
/*//禁止所有事件
var windowBanEvent = {

    bundling: function () {
        var _self = this;
        $(window).bind('click touchstart touchmove touchend ', _self.Canceling);//绑定禁止事件
    },

    unbundling: function () {
        var _self = this;
        $(window).unbind('click touchstart touchmove touchend ', _self.Canceling);//解除绑定事件

    },

    Canceling: function (evt) {

        var evt = evt || window.event; //阻止事件
        if (evt.preventDefault) {
            evt.preventDefault();
            evt.stopPropagation();
        } else {
            evt.returnValue = false;
            evt.cancelBubble = true;
        }
    },

};*/

var pageChange={

    'm':0,//缓存当前锚点位置

    init:function () {

        var _this=this;

        setTimeout(function (){

            window.addEventListener('hashchange',function (e) {

                _this.sectionChange();

            },false);
        },50);


    },

    sectionChange:function () {

        var _this=this;

        var thisNextHash= window.location.hash.substr(1);//下一个跳转页面的锚点

        var thisCurrentPage=document.getElementsByClassName('section_show')[0];

        var thisCurrentHash=thisCurrentPage.getAttribute('data-href');//当前页面的锚点

        if(!thisNextHash){

            thisNextHash=0;
        }

        var j= _this.getRightIndex(thisNextHash);//获取锚点对应的元素的位置

        var thisChangeSection=document.getElementsByClassName('section_container');

        if(parseFloat(thisNextHash)>parseFloat(thisCurrentHash)){//页面前进

            thisChangeSection[j].style.display='block';

            thisChangeSection[j].style.width=window.innerWidth;

            thisChangeSection[j].style.height=window.innerHeight;

             setTimeout(function () {

                    thisChangeSection[j].className=thisChangeSection[j].className+' section_show';

                    _this.transitionendFn(thisChangeSection[j],thisCurrentPage);

                },10);


        }else {//页面后退

            thisChangeSection[j].style.display='block';

            if(thisChangeSection[j].className.indexOf('section_show')<0){

                thisChangeSection[j].className=thisChangeSection[j].className+'section_show';
            }

            thisCurrentPage.className=thisCurrentPage.className.replace('section_show','');

            document.activeElement.blur();

            setTimeout(function () {

                thisCurrentPage.style.display='none';

            },300)

        }

    },

    sectionBack:function () {//页面后退(可用于页面按钮返回)

        var _this=this;

        var thisNum=window.location.hash.substr(1);//去掉#，获取后面带的参数

        var j=_this.getRightIndex(thisNum);//获取当前锚点所对应的元素的位置

        window.history.go(-1);

        var sectionEle=document.getElementsByClassName('section_container');

        setTimeout(function () {

            var thisNewNum=window.location.hash.substr(1);//去掉#，获取后面带的参数

            var n=_this.getRightIndex(thisNewNum);//获取当前返回后锚点所对应的元素的位置

            if(!n){
                n=0;
            }

            sectionEle[n].style.display='block';

            document.activeElement.blur();

            setTimeout(function () {

                if(sectionEle[n].className.indexOf('section_show')<0){

                    sectionEle[n].className=sectionEle[n].className+'section_show';
                }

                sectionEle[j].className=sectionEle[j].className.replace('section_show','');
            },10)

            setTimeout(function () {

                sectionEle[j].style.display='none';

            },300)

        },10)




    },

    transitionendFn:function (ele,lastEle) {//动画过度事件

        if(!browser.supplier.wechat && browser.androidVersion && browser.androidVersion < 5){//安卓4.4以下

            lastEle.style.display='none';

            lastEle.className=lastEle.className.replace('section_show','')

        }else {

            ele.addEventListener('webkitTransitionEnd', pageHide, false);//绑定过渡事件

            ele.addEventListener('transitionend', pageHide, false);
        }



        function pageHide() {

            lastEle.style.display='none';

            lastEle.className=lastEle.className.replace('section_show','');

            ele.removeEventListener('webkitTransitionEnd', pageHide, false);

            ele.removeEventListener('transitionend', pageHide, false); //解除过渡事件
        }

    },

    getRightIndex:function (num) {//参数为新指定页面的锚点值，获取指定页面的序号

        var thisChangeSection=document.getElementsByClassName('section_container');

        for(var i =0;i<thisChangeSection.length;i++){

            var thisDataHref=thisChangeSection[i].getAttribute('data-href');

            if(num==thisDataHref){

                return i
            }

        }
    }

}


function couponChoose() {

    var allTickets = document.getElementsByClassName('coupons_main')[0];

    allTickets.addEventListener('click', function (e) {

        var evt = e || window.event;

        var thisTargetEle = evt.srcElement || evt.target;

        var allChooseTickets = document.getElementsByClassName('choosed');

        if (thisTargetEle.className.indexOf('no_use') > -1) {//点击不使用优惠券，且当前已经有优惠券被选中

            thisTargetEle.className='no_use cancle_choosed';

            if(allChooseTickets.length>0){

                var allLength=allChooseTickets.length;

                for (var j = 0; j <allLength; j++) {

                    allChooseTickets[0].className = allChooseTickets[0].className.replace('choosed', '')
                }


            }




        } else {//点击优惠券

            allTickets.getElementsByClassName('no_use')[0].className='no_use';

            var thisClickEle = thisTargetEle.parentNode;

            for (var i = 0; i < 50; i++) {

                if (thisClickEle.className) {

                    if (thisClickEle.className.indexOf('coupons_list') > -1) {

                        if (thisClickEle.className.indexOf('choosed') > -1) {//如果当前优惠券已经被选中

                            thisClickEle.className = thisClickEle.className.replace('choosed', '');
                        }
                        else {
                            thisClickEle.className = thisClickEle.className + ' choosed';
                        }

                        break
                    } else {

                        thisClickEle = thisClickEle.parentNode
                    }

                }
            }

        }


    }, false)
}