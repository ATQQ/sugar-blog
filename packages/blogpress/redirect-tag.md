---
publish: false
---

<script setup lang="ts">
import { useRouter } from 'vitepress'
const router = useRouter()

if (typeof window !== 'undefined') {
  const url = new URL(window.location.href)
  const tag = url.searchParams.get('tag')
  if (tag) {
    router.go(
      `${window.location.origin}/?tag=${tag}`
    )
  }
}
</script>
