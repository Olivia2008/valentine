var qx=function(){
    /*//设备配置
    var confi={
        keepZoomRatio:false,
        layer:{
            "width":"100%",
            "height":"100%",
            "top":0,
            "left":0
        }
    };
    if(confi.keepZoomRatio){
        var proportionY=900/1440;
        var screenHeight=$(document).height();
        var zooomHeight=screenHeight*proportionY;
        var zooomTop=(screenHeight-zooomHeight)/2;
        confi.layer.height=zooomHeight;
        confi.layer.top=zooomTop;
    }*/

    /*设备自适应，字体自适应*/
    /*var config={
        fullscreen:!0,
        layer:{width:"800",top:0,left:0}
    };

    proportion=.625;
    if(config.fullscreen){
        var width=document.documentElement.clientWidth;
        config.layer.width=width;
        config.layer.height=width*proportion;
    }else {
        config.layer.height=config.layer.width*proportion;
    }

    !function(e,t){
        var n=e.documentElement;
        r="orientationchange"in window?"orientationchange":"resize";
        i=function(){
            var e=config.layer.width||n.clientWidth;
            if(e){
                n.style.fontSize=20*(e/320)+"px";
                var t=.625;
                if(config.fullscreen){
                    var r=document.documentElement.clientWidth;
                    config.layer.width=r;
                    config.layer.height=r*t;
                }else {
                    config.layer.height=config.layer.width*t;
                }
                document.body.style.height=.625*e+"px";
                document.body.clientWidth=e;
                document.body.clientHeight=.625*e;
            }
        };
        e.addEventListener &&(t.addEventListener(r,i,!1),
        e.addEventListener("DOMContentLoaded",i,!1))
    }(document,window);*/
    /////音乐///////

    //音乐配置
    var audioConfig={
        enable:true,//是否开启音乐
        playURL:'audio/happy.wav',//正常播放地址
        cycleURL:'audio/circulation.wav'
    };
    //音乐背景
    function Html5Audio(url,isloop){
        var audio=new Audio(url);//创建一个新对象audio
        audio.autoPlay=true;//自动播放
        audio.loop=isloop||false;//循环播放
        audio.play();
        return {
            end:function(callback){
                //监听播放结束
                audio.addEventListener('ended',function(){
                    callback();
                },false);
            }
        };
    }
    
    // 动画结束事件
    var animationEnd = (function() {
       var explorer = navigator.userAgent;
       if (~explorer.indexOf('WebKit')) {
           return 'webkitAnimationEnd';
       }
       return 'animationend';
    })();

    // 太阳公转
    $("#sun").addClass('rotation');
    //飘云
    $(".cloud:first").addClass('cloud1Anim');
    $(".cloud:last").addClass('cloud2Anim');


    //灯动画 
    var lamp={
        elem:$(".b_background"),
        bright:function(){
            this.elem.addClass('lamp-bright');
        },
        dark:function(){
            this.elem.removeClass('lamp-bright');
        }
    };

    /////////右边飞鸟 ///////////
    var bird={
        elem:$(".bird"),
        fly:function(){
            this.elem.addClass('birdFly'),
            this.elem.transition({
                right:visualWidth
            },15000,'linear')
        }
    };


    var container = $("#content");
    var swipe = Swipe(container);
    visualWidth = container.width();
    visualHeight = container.height();

    //小女孩
    var girl={
        elem:$('.girl'),
        getHeight:function(){
            return this.elem.height();
        },
        // 转身动作
        rotate:function(){
            this.elem.addClass('girl-rotate');
        },
        setOffset:function(){
            this.elem.css({
                left: visualWidth/2,
                top:bridgeY-this.getHeight()
            });
        },
        getOffset:function(){
            return this.elem.offset();
        },
        getWidth:function(){
            return this.elem.width();
        },
        setPosition:function(){
            this.elem.css({
                left: visualWidth/2,
                top: bridgeY-this.getHeight()
            });
        },
        getPosition:function(){
            return this.elem.position();
        }
    };

    ///////////
    //loge动画 //
    ///////////
    var logo={
        elem:$('.logo'),
        run:function(){
            this.elem.addClass('logolightSpeedIn').on(animationEnd,function(){
                $(this).addClass('logoshake').off();
            });
        }
    };


    ////////运行整个画面///////
    var boy=boyWalk();

    function startWalk(){
         //播放音乐
        var audio1=Html5Audio(audioConfig.playURL);
        audio1.end(function(){
            Html5Audio(audioConfig.cycleURL,false);
        });
        // 在第三幅画面第一次走路到桥底边left,top
         boy.walkTo(6000,0.6)
            .then(function(){
                 // 第一次走路完成
                // 开始页面滚动，6.5s第一个页面滚动完成
                scrollTo(6500,1);
            }).then(function(){
                //6.5s走到第二个页面50%位置
                return boy.walkTo(6500,0.5);

            }).then(function(){
                //走到第二个页面50%位置后，小鸟开始飞
                bird.fly();
            }).then(function(){
                //暂停走路
                boy.stopWalk();
                
            }).then(function(){
                //开门
                return openDoor();
            }).then(function(){
                //走进商店
                return boy.toShop(1500);
            }).then(function(){
                //开灯
                lamp.bright();
            }).then(function(){
                //取花
                return boy.takeFlower();
            }).then(function() {
                //出商店
                return boy.outShop(1500);
            }).then(function(){
                //关门
                return closeDoor();
            }).then(function() {
                //灯暗
                lamp.dark();
            }).then(function(){
                
                girl.setPosition();
                scrollTo(6500,2);
                return boy.walkTo(6500,0.15);
            }).then(function(){
               // 第二次走路到桥上left,top
                return boy.walkTo(2000,0.25,girl.getPosition().top/visualHeight); 
            }).then(function(){
                // 实际走路的比例
                var proportionX=(girl.getPosition().left-boy.getWidth()-instanceX+girl.getWidth()/5)/visualWidth;
                // 第三次桥上直走到小女孩面前
                return boy.walkTo(2000,proportionX);
            }).then(function(){
                // 图片还原原地停止状态
                boy.resetOriginal();
            }).then(function() {
                // 增加转身动作 
                setTimeout(function() {
                    girl.rotate();
                    boy.rotate(function() {
                        // 开始logo动画
                        logo.run();
                        snowflake();
                    });
                    
                }, 850);
            });      
    }
    startWalk();

    ////花瓣///////////
    var snowflakeUrl=[
            'imgs/snowflake/snowflake1.png',
            'imgs/snowflake/snowflake2.png',
            'imgs/snowflake/snowflake3.png',
            'imgs/snowflake/snowflake4.png',
            'imgs/snowflake/snowflake5.png',
            'imgs/snowflake/snowflake6.png',
        ];

        /////////飘雪花 /////////
    function snowflake(){
         // 雪花容器
        var $flakeContainer=$('#snowflake');
        // 六张图中随机的一张
        function getImgsName(){
           return snowflakeUrl[[Math.floor(Math.random()*6)]];
        }
        // 创建一个花瓣元素
        function createAFlower(){
            var url=getImgsName();
            return $('<div class="flowerBox">').css({
                'width':41,
                'height':41,
                'position':'absolute',
                'backgroundSize':'cover',
                'zIndex':100000,
                'top':'-41px',
                'backgroundImage':'url('+url+')'
            }).addClass('snowRoll');
        }
        //定时器实现飘花
        setInterval(function(){
            //运动轨迹
            var startPositionLeft=Math.random()*visualWidth-100;
                startOpacity=1;
                endPositionLeft=startPositionLeft-100+Math.random()*500;
                endPostionTop=visualHeight-40;
                duration=visualHeight*10+Math.random()*5000;
            //随机透明度，不小于0.5 Math.random()=0.7
            /*var randomStart=Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;*/
            var randomStart=Math.random()<0.5?startOpacity:Math.random();
            //创建一个花瓣
            var $flake=createAFlower();
            //设计起点位置
            $flake.css({
                left: startPositionLeft,
                opacity:randomStart
            });
            //加入到容器中
            $flakeContainer.append($flake);

            //设计结束时的动画
            $flake.transition({
                top:endPostionTop,
                left:endPositionLeft,
                opacity:0.7
            },duration,'ease-out',function(){
                $(this).remove();
            });
        },200);

    }

   

   


    // 页面滚动到指定的位置
    function scrollTo(time, proportionX) {
        var distX = visualWidth * proportionX;
        swipe.scrollTo(distX, time);
    }

    // 获取数据
    var getValue = function(className) {
        var $elem = $('' + className + '');
        // 走路的路线坐标
        return {
            height: $elem.height(),
            top: $elem.position().top
        };
    };

    // 桥的Y轴 function(){}();没有()小女孩站在桥下一点的位置
        
    var bridgeY = function() {
        var data = getValue('.c_background_middle');
        return data.top;
    }();

    function doorAction(left,right,time){
        var $door=$('.door');
        var doorLeft=$('.door-left');
        var doorRight=$('.door-right');
        var defer=$.Deferred();
        var count=2;
        // 等待开门完成
        var complete=function(){
            if(count==1){
                defer.resolve();
                return;
            }
            count--;
        };
        doorLeft.transition({
            'left':left
        },time,complete);
        doorRight.transition({
            'left':right
        },time,complete);
        return defer;
    }

    // 开门
    function openDoor() {
        return doorAction('-50%', '100%', 800);
    }

    // 关门
    function closeDoor() {
        return doorAction('0%', '50%', 500);
    }


     var instanceX;
     var instanceY;
    /**
     * 小孩走路
     * @param {[type]} container [description]
     */
    function boyWalk() {
        var container = $("#content");
       
         // 页面可视区域
        visualWidth = container.width();
        visualHeight = container.height();
        var swipe=Swipe(container);    

        var $boy = $("#boy");
        /*// 设置一下缩放比例与基点位置
        var proportion=$(document).width()/1440;
        // 设置元素缩放
        $boy.css({
            transform: 'scale(' + proportion + ')'
        });*/

        

        // 获取数据
        var getValue = function(className) {
            var $elem = $('' + className + '');
                // 走路的路线坐标
            return {
                height: $elem.height(),
                top: $elem.position().top
            };
        };

        //// 路的中间到顶部的距离
        var pathY = function() {
            var data = getValue('.a_background_middle');
            return data.top + data.height / 2;
        }();

        /*// 获取人物元素布局尺寸
        var boyWidth = $boy.width();
        var boyHeight = $boy.height();
        // 计算下缩放后的元素与实际尺寸的一个距离
        var boyInsideLeft = (boyWidth - (boyWidth*proportion))/2;
        var boyInsideTop = (boyHeight - (boyHeight*proportion))/2;
        
        // 修正小男孩的正确位置
        // 中间路的垂直距离 - 人物原始的垂直距离 - 人物缩放后的垂直距离
        $boy.css({
            top: pathY - (boyHeight*proportion) -boyInsideTop
        });*/
        var boyWidth = $boy.width();
        var boyHeight = $boy.height();
        // 修正小男孩的正确位置
        $boy.css({
            top: pathY - boyHeight +13
        });

        // 暂停走路
        function pauseWalk() {
            $boy.addClass('pauseWalk');
        }

        // 恢复走路
        function restoreWalk() {
            $boy.removeClass('pauseWalk');
        }

        // css3的动作变化
        function slowWalk() {
            $boy.addClass('slowWalk');
        }

        // 用transition做运动
        function startRun(options, runTime) {
            var dfdPlay = $.Deferred();
            // 恢复走路
            restoreWalk();
            // 运动的属性
            $boy.transition(
                options,
                runTime,
                'linear',
                function() {
                    dfdPlay.resolve(); // 动画完成
                });
            return dfdPlay;
        }

        // 开始走路
        function walkRun(time, dist, disY) {
            time = time || 3000;
            // 脚动作
            slowWalk();
            // 开始走路
            var d1 = startRun({
                'left': dist + 'px',
                'top': disY ? disY : undefined
            }, time);
            return d1;
        }

        //走进商店 
        /*function walkToShop(runTime){
            var defer=$.Deferred();

            // 门的坐标
            var offsetDoor=$('.door').offset();
            var doorOffsetLeft=offsetDoor.left;
            var doorOffsetTop=offsetDoor.top;
            //小孩当前的坐标
            var offsetBoy=$boy.offset();
            var boyOffsetLeft=offsetBoy.left;
            var posBoy=$boy.position();
            var boyPosLeft=posBoy.left;
            var boyPosTop=posBoy.top;

            //中间的位置 
            var boyMiddle=$boy.width()/2;
            var doorMiddle=$('.door').width()/2;
            var doorTopMiddle=$('.door').height()/2;


            //// 当前需要移动的坐标
             // instanceX=(doorOffsetLeft+$('.door').width()/2)-(boyOffsetLeft+$boy.width()/2);
            //将原来的boy的offset改为position()
            instanceX=(doorOffsetLeft+doorMiddle)-(boyPosLeft+boyMiddle);

            // Y的坐标
            // top = 人物底部的top - 门中间的top值
            instanceY=boyPosTop+boyHeight-doorOffsetTop+(doorTopMiddle);
            // // 开始走路,男孩正好移动到相对于文档中门中间的位置 
            var walkPlay=startRun({
                transform:'translate('+instanceX+'px,-'+instanceY+'px),scale(0.5,0.5)',
                opacity:0.1
            },2000);
           

            //走路完毕,男孩隐藏  
            walkPlay.done(function(){
                $boy.css({opacity:0});
                defer.resolve();
            });
            return defer;

        }*/  
        //走进商店 
        function walkToShop(doorObj,runTime){
            var defer=$.Deferred();
            // 门的坐标
            var doorObj=$(".door");
            var offsetDoor=doorObj.offset();
            var doorOffsetLeft=offsetDoor.left;
            //小孩当前的坐标
            var offsetBoy=$boy.offset();
            var boyOffetLeft=offsetBoy.left;
            // 当前需要移动的坐标
            instanceX=(doorOffsetLeft+doorObj.width()/2)-(boyOffetLeft+$boy.width()/2);
            
            // 开始走路,男孩正好移动到相对于文档中门中间的位置 
            var walkPlay=startRun({
                transform:"translateX("+instanceX+"px),scale(0.3,0.3)",
                opacity:0.1
            },2000);
            //走路完毕,男孩隐藏  
            walkPlay.done(function(){
                $boy.css({opacity:0});
                defer.resolve();
            });
            return defer;
        }

        //取花
        function takeFlower(){
            // // 增加延时等待效果
            var defer=$.Deferred();
            setTimeout(function(){
                $boy.addClass('slowFlowerWalk');
                defer.resolve();
            },800);
            return defer;
        }
            
        // 走出店
        function walkOutShop(runTime) {
            var defer=$.Deferred();
            restoreWalk();
            //开始走路
            var walkPlay=startRun({
                transform:'translate('+instanceX+'px),scale(1,1)',
                opacity:1
            },runTime);
           /* var walkPlay = startRun({
                  transform: 'translateX(' + instanceX + 'px),translateY(0),scale(1,1)',
                  opacity: 1
              }, runTime);*/
            //走路完毕
            walkPlay.done(function(){
                defer.resolve();
            });
            return defer;
        }

        
        // 计算移动距离
        function calculateDist(direction, proportion) {
            return (direction == "x" ?
                visualWidth : visualHeight) * proportion;
        }

        return {
            // 开始走路
            walkTo: function(time, proportionX, proportionY) {
                var distX = calculateDist('x', proportionX);
                var distY = calculateDist('y', proportionY);
                return walkRun(time, distX, distY);
            },
            // 走进商店
            toShop: function() {
                return walkToShop.apply(null, arguments);
            },
            // 走出商店
            outShop: function() {
                return walkOutShop.apply(null, arguments);
            }, 
            // 停止走路
            stopWalk: function() {
                pauseWalk();
            },
            setColor:function(value){
                $boy.css('background-color',value);
            },
            //取花
            takeFlower:function(){
                return takeFlower();
            },
            // 获取男孩的宽度
            getWidth:function(){
                return $boy.width();
            },
            // 复位初始状态
            resetOriginal:function(){
                this.stopWalk();
                // 恢复图片
                $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
            },
            //转身动作
            rotate: function(callback) {
               restoreWalk();
               $boy.addClass('boy-rotate');
               // 监听转身完毕
               if (callback) {
                   $boy.on(animationEnd, function() {
                       callback();
                       $(this).off();
                   });
               }
           }
        };
    }   

};


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
$(document).ready(function(){
    $('.play .music').click(function(event) {
    $(function(){qx();});
    $('div.play').remove();
});
})
