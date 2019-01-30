# 更新日志

## v0.2.1

### 重大变化

- **core:** 移除 Bullet 构造函数的 `rel` 属性, 改为 `origin`, 同时支持传入 Point 类型.
- **utils:** 新增库 `utils.color`, 用于处理颜色.
- **utils:** 将库 `random` 更改为 `random`.

### 新特性

- **core:** 加入了默认的自机判定点颜色和大小.
- **core:** 当调用 scene.setBarrage 方法时会自动清屏.

## v0.2

### 新特性

- **core:** 将 Updater 的私有属性改为使用不可枚举属性 `__updater__` 管理.
- **core:** 支持无自机模式 (观赏模式). 当不涉及自机时, 子弹会跳过碰撞判定.
- **core:** 自机新增属性 `control`, 用来决定是鼠标操控还是键盘操控.
- **core:** 类 Field 的大部分功能由新类 Scene 完成, 前者保留对外层 DOM 的控制.
- **utils:** 将 math 和 memorize 相关函数转移到 @stg/utils 下.

### 修复和其他

- **core:** 修复了 point.$coord 不及时更新的问题.
- **bundle:** 生成了源代码的 source map.

