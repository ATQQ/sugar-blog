# 数据状态更新时的差异 diff 及 patch 机制

## diff
diff 算法是通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，所以时间复杂度只有 O(n)

<comment/>
<tongji/>