---
title: 小技巧：for of中获取index
date: 2022-01-17
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 小技巧：for of中获取index

日常开发中在遍历数据时经常使用`for...of`,`forEach`

前者使用时能够配合`async await`,`continue`,`break`等等

```ts
const data = [
  { name: 'xm1', age: 1 },
  { name: 'xm2', age: 4 },
  { name: 'xm3', age: 5 },
  { name: 'xm4', age: 9 }
]

function sleep(s){
  const end = s * 1000 + Date.now()
  while(Date.now() < end){}
}
async function fn(){
  for (const people of data) {
    if (people.age === 9) {
      break
    }
    if (people.age % 2 !== 0) {
      continue
    }
    await sleep(people.age)
    console.log(people.name);
  }
} 
fn() // xm2
```

但有时候想获取元素的`idx`，有哪些简单的方式呢

## 1-Array.prototype.map
```ts
function MapWithIdx(arr){
    return arr.map((v, idx) => ([idx, v]))
}

for (const [idx, v] of MapWithIdx(data)) {
  console.log(idx, v);
}
```

## 2-Array.prototype.entries
这个方法是ES6新增的API
```ts
for (const [idx, v] of data.entries()) {
  console.log(idx, v);
}
```

## 3-Array.prototype.keys
这个方法也是ES6新增的API
```ts
for (const idx of data.keys()) {
    const v = data[idx]
    console.log(idx, v);
}
```

