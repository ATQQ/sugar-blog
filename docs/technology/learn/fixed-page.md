---
title: 移动端阻止页面/元素被滑动的常见方法介绍
date: 2022-01-22
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 移动端阻止页面/元素被滑动的常见方法介绍

TODO:待完善

在做H5开发时，很多场景下都需要弹窗

当出现弹窗时，大部分场景下是期望弹窗下层页面不能被滑动的

当然也不期望弹窗被滑动

近期肝页面又碰到了这个问题

下面介绍几种最常用的方式，以及一些边界情况与应对策略

## overflow:hidden
流传最广的方式就是 给body设置 `overflow:hidden`

## prevent touchmove
紧接着就是阻止触摸滑动事件

## position:fixed


## 使用class代替style
这个也是碰巧发现的，在`iOS`低端机将上诉方式都尝试后

仍发现一个问题，现象如下：
* 下层页面不会被滑动了
* 遮罩和弹窗整体还能被下拉

## 实操
[demo地址](https://stackblitz.com/edit/vitejs-vite-xgqbt6?file=src%2Fmain.ts&terminal=dev)

### 简单实现弹窗
在实操之前，咱先用js做一个弹窗，方便实验

弹窗结构如下
```tsx
<DialogWrapper>
    <Mask />
    <Content />
</DialogWrapper>
```
由 1 个容器元素与 2 个子元素构成
* DialogWrapper：容器
* Mask：遮罩
* Content：窗体内容

实现如下
```ts
interface Ops {
  dialog: HTMLElement;
  mask: HTMLElement;
  content: HTMLElement;
}

type VisibleCallback = (ops: Ops) => void;

export default class Dialog {
  private dialogWrapper: HTMLElement;
  private mask: HTMLElement;
  private content: HTMLElement;
  private onShow: VisibleCallback | undefined;
  private onHide: VisibleCallback | undefined;

  constructor() {
    this.dialogWrapper = document.createElement('div');
    this.mask = document.createElement('div');
    this.content = document.createElement('div');

    this.dialogWrapper.classList.add('dialogWrapper');
    this.mask.classList.add('mask');
    this.content.classList.add('content');

    this.dialogWrapper.append(this.mask);
    this.dialogWrapper.append(this.content);

    document.body.append(this.dialogWrapper);

    // 点击内容关闭弹窗
    this.content.addEventListener('click', () => {
      this.hide();
    });
  }

  public show(
    msg: string = 'Hello World',
    ops?: { onShow?: VisibleCallback; onHide?: VisibleCallback }
  ) {
    const { onShow, onHide } = ops || {};
    this.onShow = onShow;
    this.onHide = onHide;

    this.visibleCallback(this.onShow);

    this.content.innerHTML = `<p>${msg}</p>`;
    this.dialogWrapper.style.display = 'block';
  }

  public hide() {
    this.visibleCallback(this.onHide);
    this.dialogWrapper.style.display = 'none';
  }

  private visibleCallback(callback?: VisibleCallback) {
    if (typeof callback === 'function') {
      callback({
        dialog: this.dialogWrapper,
        mask: this.mask,
        content: this.content,
      });
    }
  }
}
```
```css
.dialogWrapper {
  position: fixed;
  display: none;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000000;
  opacity: 0.5;
}

.content {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 60%;
  padding: 10px;
  background-color: #fff;
  transform: translate(-50%, -50%);
  text-align: center;
}
```

<comment/>
<tongji/>