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
