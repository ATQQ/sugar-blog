---
sidebar:
 title: 中等-async/await实现
 step: 11
title: 实现async/await
date: 2021-03-10
tags:
 - 手撕代码
 - javascript
categories:
 - 手撕代码
---
# 实现async/await

## 简介
async，await大家在平时工作中用得非常的多，大部分同志也知道是Generator的语法糖

开发中，目前也只有在使用dva的时候才会直接接触到Generator编写

本文就带着学习的目的，和大家分享一下具体的实现细节

### async/await
* [async](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
* [await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)

利用async和await可以很简单的利用Promise将异步行为改成同步

```js
async function fn(){
  await promise1()
  await promise2()
  await promise3()
}
fn()
```

是Generator+Promise的语法糖

async函数默认返回一个Promis

### Generator
>又叫生成器,返回一个可迭代的对象
* [Generator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
const obj = gen()
for(const o of obj){
  console.log(o) // 1 2 3
}
```

### Symbol.iterator
>可迭代协议，对象只有实现了`Symbol.iterator`方法才可被迭代

* [Symbol.iterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)

```js
const obj = {
  0:'000',
  1:'777',
  2:'666',
  length:3,
  [Symbol.iterator]:[][Symbol.iterator]
}
for(const o of obj){
  console.log(o) // 000 777 666 
}
```
定义对象为类数组的形式，然后直接使用Array的`Symbol.iterator`

## 模拟实现
### 第一阶段
1. async返回值为Promise
2. 自动执行generator

```js
const testGen1 = function* () {
  const a = yield Promise.resolve(1);
  console.time('temp')
  const b = yield new Promise((res) => {
    setTimeout(() => {
      res(2);
    }, 2000);
  });
  const c = yield Promise.resolve(3);
  console.log(a, b, c);
  console.timeEnd('temp')
};

function myAsync1(generator) {
  return new Promise(
    (resolve, reject) => {
      // 获得迭代器对象
      const gen = generator();

      function _next(doneValue) {
        const {
          done,
          value,
        } = doneValue;

        if (done) {
          resolve();
          return;
        }

        // 执行完这一个后执行下一个
        value.then(() => {
          _next(gen.next());
        });
      }

      _next(gen.next());
    }
  );
}

myAsync1(testGen1)
// 输出结果
undefined undefined undefined
temp: 2.007s
```

### 第二阶段
1. await左边的变量能正常接受值
2. await右侧非promise自动包装为promise
3. 能正确处理async返回值
```js
const testGen2 = function* () {
  const a = yield 1;
  console.time('temp')
  const b = yield new Promise((res) => {
    setTimeout(() => {
      res(2);
    }, 2000);
  });
  const c = yield 3;
  console.log(a, b, c);
  console.timeEnd('temp')
  return [a, b, c];
};
function myAsync2(generator) {
  return new Promise(
    (resolve, reject) => {
      // 获得迭代器对象
      const gen = generator();

      function _next(doneValue) {
        const {
          done,
          value,
        } = doneValue;

        if (done) {
          // 正确处理async的返回值
          resolve(value);
          return;
        }

        // 执行完这一个后执行下一个
        // 非promise自动包装为promise
        Promise.resolve(value).then(
          (data) => {
            // 将Promise resolve的内容赋值给await 左侧的变量
            _next(gen.next(data));
          }
        );
      }

      _next(gen.next());
    }
  );
}

myAsync2(testGen2).then(console.log);
// 运行结果
1 2 3
temp: 2.005s
[ 1, 2, 3 ]
```

### 第三阶段
1. 能正确的抛出Promise的reject错误
```js
const testGen3 = function* () {
  console.time('temp');
  const b = yield new Promise(
    (res, rej) => {
      setTimeout(() => {
        res(2);
      }, 2000);
    }
  );
  console.log(b);
  try {
    const d = yield Promise.reject(4);
  } catch (error) {
    console.log(error);
  }
  console.timeEnd('temp');
};

function myAsync3(generator) {
  return new Promise(
    (resolve, reject) => {
      // 获得迭代器对象
      const gen = generator();

      function _next(doneValue) {
        const {
          done,
          value,
        } = doneValue;

        if (done) {
          // 正确处理async的返回值
          resolve(value);
          return;
        }

        // 执行完这一个后执行下一个
        // 非promise自动包装为promise
        Promise.resolve(value)
          .then((data) => {
            // 将Promise resolve的内容赋值给await 左侧的变量
            _next(gen.next(data));
          })
          .catch((err) => {
            // 捕获异常则向生成器抛出一个错误
            // 并恢复生成器的执行，返回带有 done 及 value 两个属性的对象。
            _next(gen.throw(err));
          });
      }

      _next(gen.next());
    }
  );
}

myAsync3(testGen3);
// 运行结果
2
4
temp: 2.009s
```

### 第四阶段
1. async能够捕获运行时非await表达式抛出的错误
```js
const testGen4 = function* () {
  console.time('temp');
  const b = yield new Promise(
    (res, rej) => {
      setTimeout(() => {
        res(2);
      }, 2000);
    }
  );
  console.log(b);
  console.timeEnd('temp');
  b = 'err';
};

function myAsync4(generator) {
  return new Promise(
    (resolve, reject) => {
      // 获得迭代器对象
      const gen = generator();

      function _next(doneValue) {
        const {
          done,
          value,
        } = doneValue;

        if (done) {
          // 正确处理async的返回值
          resolve(value);
          return;
        }

        // 执行完这一个后执行下一个
        // 非promise自动包装为promise
        Promise.resolve(value)
          .then((data) => {
            // 捕获生成器内部非yield表达式抛出的错误
            try {
              // 将Promise resolve的内容赋值给await 左侧的变量
              _next(gen.next(data));
            } catch (err) {
              reject(err);
            }
          })
          .catch((err) => {
            // 捕获异常则向生成器抛出一个错误
            // 并恢复生成器的执行，返回带有 done 及 value 两个属性的对象。
            _next(gen.throw(err));
          });
      }

      // 捕获生成器内部非yield表达式抛出的错误
      try {
        _next(gen.next());
      } catch (err) {
        reject(err);
      }
    }
  );
}

myAsync4(testGen4).catch((err) => {
  console.log('catch err');
  console.log(err);
});
// 运行结果
2
temp: 2.008s
catch err
TypeError: Assignment to constant variable.
```

### 最终

对上述的myAsync的冗余代码进行一些优化
```js
function myAsync(generator) {
  return new Promise(
    (resolve, reject) => {
      // 获得迭代器对象
      const gen = generator();

      function _next(doneValue) {
        const { done, value } =
          doneValue || {};

        if (done) {
          // 正确处理async的返回值
          resolve(value);
          return;
        }

        // 执行完这一个后执行下一个
        // 非promise自动包装为promise
        Promise.resolve(value)
          .then((data) => {
            // 捕获生成器内部非yield表达式抛出的错误
            try {
              // 将Promise resolve的内容赋值给await 左侧的变量
              _next(gen.next(data));
            } catch (err) {
              reject(err);
            }
          })
          .catch((err) => {
            // 捕获异常则向生成器抛出一个错误
            // 并恢复生成器的执行，返回带有 done 及 value 两个属性的对象。
            _next(gen.throw(err));
          });
      }

      _next();
    }
  );
}
```
## 测试
### 例1
async/await
```js
async function demo1() {
  const a = await 1;
  const b = await new Promise(
    (res, rej) => {
      setTimeout(() => {
        res(2);
      }, 2000);
    }
  );
  const c = await Promise.resolve(3);
  console.log(a, b, c);

  try {
    const d = await Promise.reject(4);
  } catch (error) {
    console.log(error);
  }
  return [a, b, c];
}
demo1().then(console.log).catch(err=>{
    console.log('catch err');
    console.log(err);
})

// 输出结果
1 2 3
4
[ 1, 2, 3 ]
```

myAsync实现测试
```js
myAsync(function* () {
  const a = yield 1;
  const b = yield new Promise(
    (res, rej) => {
      setTimeout(() => {
        res(2);
      }, 2000);
    }
  );
  const c = yield Promise.resolve(3);
  console.log(a, b, c);

  try {
    const d = yield Promise.reject(4);
  } catch (error) {
    console.log(error);
  }

  return [a, b, c];
})
  .then(console.log)
  .catch((err) => {
    console.log('catch err');
    console.log(err);
  });
// 输出结果
1 2 3
4
[ 1, 2, 3 ]
```

### 例2
await/async
```js
async function demo2() {
  const a = await 'hello';
  const b = await 'world';
  console.log(a, b);

  b = 'err';

  return a + b;
}
demo2()
  .then(console.log)
  .catch((err) => {
    console.log('catch err');
    console.log(err);
  });
// 输出结果
hello world
catch err
TypeError: Assignment to constant variable.
```

myAsync测试
```js
myAsync(function* () {
  const a = yield 'hello';
  const b = yield 'world';
  console.log(a, b);

  b = 'err';

  return a + b;
})
  .then(console.log)
  .catch((err) => {
    console.log('catch err');
    console.log(err);
  });
// 输出结果
hello world
catch err
TypeError: Assignment to constant variable.
```

