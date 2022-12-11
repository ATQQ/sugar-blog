---
title: 工具方法汇总
date: 2021-04-19
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 工具方法汇总
>部分内容来源于搜索引擎

近段时间业务开发用到了许多不错的工具方法,给大家分享一波

## 导出Excell

```js
/**
 * 导出表格数据为xls
 * @param headers 头部
 * @param body 主体部分数据
 */
function tableToExcel(headers, body, filename = "res.xls") {
  // 列标题
  let str = `<tr>${headers.map((v) => `<th>${v}</th>`).join("")}</tr>`;
  // 循环遍历，每行加入tr标签，每个单元格加td标签
  for (const row of body) {
    str += "<tr>";
    for (const cell of row) {
      // 增加\t为了不让表格显示科学计数法或者其他格式
      str += `<td>${`${cell}\t`}</td>`;
    }
    str += "</tr>";
  }

  // Worksheet名
  const worksheet = "sheet1";
  const uri = "data:application/vnd.ms-excel;base64,";

  // 下载的表格模板数据
  const template =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" \n' +
    '      xmlns:x="urn:schemas-microsoft-com:office:excel" \n' +
    '      xmlns="http://www.w3.org/TR/REC-html40">\n' +
    "      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>\n" +
    `        <x:Name>${worksheet}</x:Name>\n` +
    "        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>\n" +
    "        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->\n" +
    `        </head><body><table>${str}</table></body></html>\n`;
  // 下载模板
  const tempA = document.createElement("a");
  tempA.href = uri + base64(template);
  tempA.download = filename;
  document.body.appendChild(tempA);
  tempA.click();
  document.body.removeChild(tempA);
}

function base64(s) {
  return window.btoa(unescape(encodeURIComponent(s)));
}
```

<codepen title="export-excell" src="https://codepen.io/sugarInSoup/embed/xxgaggK?height=265&theme-id=dark&default-tab=js,result"></codepen>


## 日期格式化
```js
function formatDate(d, fmt = 'yyyy-MM-dd hh:mm:ss') {
  const o = {
    'M+': d.getMonth() + 1, // 月份
    'd+': d.getDate(), // 日
    'h+': d.getHours(), // 小时
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
    S: d.getMilliseconds(), // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (`${d.getFullYear()}`).substr(4 - RegExp.$1.length)) }
  for (const k in o) { if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length))) }
  return fmt
}
```

<codepen src="https://codepen.io/sugarInSoup/embed/jOyvwRd?height=265&theme-id=dark&default-tab=js,result"></codepen>

## 文件大小格式化
```js
formatSize(size, pointLength, units) {
  let unit
  units = units || ['B', 'K', 'M', 'G', 'TB']
  // eslint-disable-next-line no-cond-assign
  while ((unit = units.shift()) && size > 1024) {
    size /= 1024
  }
  return (unit === 'B' ? size : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit
}
```

<codepen src="https://codepen.io/sugarInSoup/embed/YzNOxKr?height=265&theme-id=dark&default-tab=js,result"></codepen>

## 内容写入剪贴板
```js
/**
* 将结果写入的剪贴板
* @param {String} text
*/
export function copyRes(text) {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.setAttribute('value', text)
  input.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
  }
  document.body.removeChild(input)
}
```

<codepen src="https://codepen.io/sugarInSoup/embed/rNjZzLx?height=265&theme-id=dark&default-tab=js,result"></codepen>

