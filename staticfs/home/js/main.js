/**
 * Created by lijiang on 16/6/7.
 */
$(window).on('load',function () {
    var _init = new init();
    $('.navtitle').find('.fa-bars').on('click',_init.toggleMenu);
    // document.on('mouse',function () {
    //     $('.menu').css('display','none');
    // });
    $('.pannel').find('.like').on('click',_init.onlike);

});
var init = function (options) {
    this.defaults = {
    };
    this.defaults = $.extend(true,{},this.defaults,typeof  options == 'object' & options);
};
init.prototype = {
    toggleMenu:function () {
        $('.menu').toggle();
    },
    onlike:function () {
        $('.pannel').find('.like a').addClass('onlike').find('i').removeClass('fa-heart-o').addClass('fa-heart');
    }
}