# 快速排序
* 平均时间复杂度:O(N*logN)
* 最坏情况下:O(N²)
```js
function quickSort(array) {
    const _quickSort = (arr, left, right) => {
        if (left > right) {
            return
        }
        let i = left, j = right
        let o = left
        while (left !== right) {
            while (arr[right] >= arr[o] && right > left) {
                right--
            }

            while (arr[left] <= arr[o] && left < right) {
                left++
            }

            if (left < right) {
                swap(arr, left, right)
            }
        }
        swap(arr, o, left)
        _quickSort(arr, i, left - 1)
        _quickSort(arr, left + 1, j)
    }
    _quickSort(array, 0, array.length - 1)
}
```

<tongji/>