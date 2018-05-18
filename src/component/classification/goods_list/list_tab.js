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