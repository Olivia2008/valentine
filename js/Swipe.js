/////////
//页面滑动 //
/////////

function Swipe(container) {
    var container = $("#content");
    // 获取第一个子节点ul
    var element = container.find(":first");
    var swipe = {};

    // li页面数量 find(">")=children()
    // find("li")布满整个页面，find(">")规则排列
    //var slides = element.find("li");
    //var slides = element.find(">");
    var slides = element.children();
    // 获取容器尺寸
    var width = container.width();
    var height = container.height();

    // 设置li页面总宽度
    element.css({
        width: (slides.length * width) + 'px',
        height: height + 'px'
    });

    // 设置每一个页面li的宽度
    $.each(slides, function(index) {
        var slide = slides.eq(index); //获取到每一个li元素    
        slide.css({
            width: width + 'px',
            height: height + 'px'
        });
    });

    // 监控完成与移动
    swipe.scrollTo = function(x, speed) {
        // 执行动画移动
        element.css({
            'transition-timing-function' : 'linear',
            'transition-duration'        : speed + 'ms',
            'transform'                  : 'translate3d(-' + x + 'px,0px,0px)'
        });
        return this;
    };

    return swipe;
}
