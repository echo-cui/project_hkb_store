
//------购物车加减按钮

var hkbProductDetails = {

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

}

