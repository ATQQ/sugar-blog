# 单链表转置
```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
```
## 迭代
```js
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    let p, q;
    p = null
    q = head
    while (q) {
        let k = q.next
        q.next = p
        p = q
        q = k
    }
    return p
};
```

## 递归
```js
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    const fn = (p, q) => {
        if (!q) {
            return p
        }
        let k = fn(q, q.next)
        q.next = p
        return k
    }
    return fn(null, head)
};
```

<comment/>
<tongji/>