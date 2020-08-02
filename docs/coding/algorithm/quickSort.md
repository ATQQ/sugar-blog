# 快速排序

<company value="这个频率比较高。。。对于前端来说，算基础考点"></company>

<leetcode href="https://leetcode-cn.com/problems/sort-an-array/">912：排序树组</leetcode>

给你一个整数数组 nums，请你将该数组升序排列。

## 填坑法
```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function (nums) {
    const swap = (arr, i, j) => {
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }

    const _quickSort = (arr, left, right) => {
        if (left >= right) {
            return
        }
        let o = left
        let i = left, j = right
        while (left !== right) {
            // 先从右往左动
            while (arr[right] >= arr[o] && left < right) {
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
    _quickSort(nums, 0, nums.length - 1)
    return nums
};
```

