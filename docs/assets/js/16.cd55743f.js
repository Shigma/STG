(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{160:function(v,t,_){"use strict";_.r(t);var e=_(4),a=Object(e.a)({},function(){var v=this,t=v.$createElement,_=v._self._c||t;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("h1",{attrs:{id:"起步"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#起步","aria-hidden":"true"}},[v._v("#")]),v._v(" 起步")]),v._v(" "),_("p",[v._v("让我们从一个最简单的弹幕效果开始:")]),v._v(" "),_("stg-demo",{attrs:{src:"demo-2",height:480,width:320,"auto-run":""}}),v._v(" "),_("p",[v._v("让我们来看看它是怎么做的:")]),v._v(" "),_("ul",[_("li",[_("code",[v._v("mounted")]),v._v(": 当弹幕被挂载在屏幕上时调用的钩子函数.")]),v._v(" "),_("li",[_("code",[v._v("setInterval")]),v._v(": 设定一个计时任务, 每隔 3 帧执行一次回调.")]),v._v(" "),_("li",[_("code",[v._v("emitBullets")]),v._v(": 发射 8 枚子弹, 子弹的详细配置在下面给出:\n"),_("ul",[_("li",[_("code",[v._v("display: 'scaly'")]),v._v(": 设定子弹的样式为鳞弹.")]),v._v(" "),_("li",[_("code",[v._v("origin: 'center'")]),v._v(": 设定子弹的发射源为中央.")]),v._v(" "),_("li",[_("code",[v._v("state")]),v._v(": 设定子弹的初始状态:\n"),_("ul",[_("li",[_("code",[v._v("rho: 12")]),v._v(": 子弹距离发射源的初始距离为 12.")]),v._v(" "),_("li",[_("code",[v._v("face: tick / 20 + index / 4")]),v._v(": 8 枚子弹等距排列, 发射源每 20 帧转过一个平角.")])])]),v._v(" "),_("li",[_("code",[v._v("mutate")]),v._v(": 子弹运行中每一帧调用的钩子函数.")]),v._v(" "),_("li",[_("code",[v._v("rho += 3 + tick / 60")]),v._v(": 子弹的速度为 3, 加速度为 1/60.")]),v._v(" "),_("li",[_("code",[v._v("polarLocate")]),v._v(": 将极坐标切回直角坐标.")])])])]),v._v(" "),_("p",[v._v("很简单吧? 下面就让我来简单介绍一些 web-stg 设计的基本概念.")]),v._v(" "),_("h2",{attrs:{id:"一些基本概念"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#一些基本概念","aria-hidden":"true"}},[v._v("#")]),v._v(" 一些基本概念")]),v._v(" "),_("h3",{attrs:{id:"钩子函数"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#钩子函数","aria-hidden":"true"}},[v._v("#")]),v._v(" 钩子函数")]),v._v(" "),_("p",[v._v("无论是子弹, 掉落物, 自机, 敌机还是整个弹幕系统, 都有着自己的生命周期. 如果我们想要制定它们的行为, 最简单的办法就是提供相应的"),_("strong",[v._v("钩子函数")]),v._v(". 基本的钩子函数有:")]),v._v(" "),_("ul",[_("li",[_("code",[v._v("mounted")]),v._v(": 当一个实例被挂载在屏幕上时调用. 你可以在这里进行一些初始化工作.")]),v._v(" "),_("li",[_("code",[v._v("mutate")]),v._v(": 在一个实例正常生命周期的每一帧调用, 可以带一个参数 "),_("code",[v._v("tick")]),v._v(", 表示当前的帧数.")]),v._v(" "),_("li",[_("code",[v._v("display")]),v._v(": 在一个实例绘制时调用, 可以带一个参数 "),_("code",[v._v("tick")]),v._v(", 表示当前的 display 帧数.")])]),v._v(" "),_("p",[v._v("此外, 有些对象还会提供其特有的钩子函数, 将在后面详细介绍.")]),v._v(" "),_("h3",{attrs:{id:"物理帧与逻辑帧"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#物理帧与逻辑帧","aria-hidden":"true"}},[v._v("#")]),v._v(" 物理帧与逻辑帧")]),v._v(" "),_("p",[v._v('上文中我们屡次提到了"帧"的概念. 虽然大家可能对它并不陌生, 但"帧"却是一个有误导性的词语. 事实上, 我们会有内外两层两层循环维护游戏的运转. 外循环负责显示, 调用绘制有关的函数并处理与显示器的垂直同步; 内循环则根据两次渲染之间的时间差规划每个实例的更新. 外循环执行的帧率称为'),_("strong",[v._v("物理帧(frame)")]),v._v(", 决定了用户看到的图案的刷新率; 内循环执行的帧率称为"),_("strong",[v._v("逻辑帧(tick)")]),v._v(", 决定了游戏实际运行的速率. 这种体系能够确保画面在低性能下保持精美, 同时也为 replay 的实现提供了保证.")]),v._v(" "),_("p",[v._v('由于不同设备的性能不同, 同一个游戏在不同设备上运行的物理帧数往往千差万别. 为了确保体验一致, 一切的计算应该基于逻辑帧数而非物理帧数. 因此, 我们使用当前的逻辑帧数作为钩子函数中传入的参数. 今后如果不加说明, 我们所说的"帧"均指代逻辑帧.')])],1)},[],!1,null,null,null);t.default=a.exports}}]);