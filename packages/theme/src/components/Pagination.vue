<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  layout: {
    type: String,
    default: 'prev, pager, next, jumper',
  },
  background: {
    type: Boolean,
    default: false,
  },
  small: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:current-page', 'currentChange'])

const innerCurrentPage = ref(props.currentPage)

watch(() => props.currentPage, (val) => {
  innerCurrentPage.value = val
})

const pageCount = computed(() => {
  const count = Math.ceil(props.total / props.pageSize)
  return count > 0 ? count : 1
})

const pagers = computed(() => {
  const count = pageCount.value
  const current = innerCurrentPage.value
  const pagerCount = 7 // Default Element Plus pager count

  const showPrevMore = false
  const showNextMore = false

  if (count <= pagerCount) {
    const array = []
    for (let i = 1; i <= count; i++) {
      array.push(i)
    }
    return array
  }

  // Logic for large number of pages
  // Simplified logic for now, Element Plus logic is complex
  // If we want exact replica, we need more logic.
  // For now, let's implement a simpler version that shows current +/- 2 and first/last

  const array: (number | string)[] = []

  if (current <= 4) {
    for (let i = 1; i <= 6; i++) {
      array.push(i)
    }
    array.push('more-next') // ...
    array.push(count)
  }
  else if (current >= count - 3) {
    array.push(1)
    array.push('more-prev') // ...
    for (let i = count - 5; i <= count; i++) {
      array.push(i)
    }
  }
  else {
    array.push(1)
    array.push('more-prev') // ...
    for (let i = current - 2; i <= current + 2; i++) {
      array.push(i)
    }
    array.push('more-next') // ...
    array.push(count)
  }

  return array
})

function handleCurrentChange(val: number) {
  if (val < 1)
    val = 1
  if (val > pageCount.value)
    val = pageCount.value

  if (innerCurrentPage.value !== val) {
    innerCurrentPage.value = val
    emit('update:current-page', val)
    emit('currentChange', val)
  }
}

function prev() {
  handleCurrentChange(innerCurrentPage.value - 1)
}

function next() {
  handleCurrentChange(innerCurrentPage.value + 1)
}

function onPagerClick(page: number | string) {
  if (typeof page === 'number') {
    handleCurrentChange(page)
  }
  else {
    const pagerCountOffset = 5
    let newPage = innerCurrentPage.value
    if (page === 'more-prev') {
      newPage -= pagerCountOffset
    }
    else if (page === 'more-next') {
      newPage += pagerCountOffset
    }
    handleCurrentChange(newPage)
  }
}

// Jumper
function handleJumperChange(evt: Event) {
  const target = evt.target as HTMLInputElement
  const val = parseInt(target.value)
  if (!isNaN(val)) {
    handleCurrentChange(val)
    target.value = '' // Clear or keep? Element Plus keeps it until blur/enter
  }
}
</script>

<template>
  <div class="sugar-pagination" :class="{ 'is-background': background, 'sugar-pagination--small': small }">
    <!-- Prev -->
    <button
      type="button"
      class="btn-prev"
      :disabled="innerCurrentPage <= 1"
      @click="prev"
    >
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="currentColor" d="M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z" /></svg>
    </button>

    <!-- Pager -->
    <ul class="sugar-pager">
      <li
        v-for="(page, index) in pagers"
        :key="index"
        :class="{ 'is-active': innerCurrentPage === page, 'more': typeof page === 'string' }"
        class="number"
        @click="onPagerClick(page)"
      >
        <template v-if="typeof page === 'number'">
          {{ page }}
        </template>
        <template v-else>
          <svg v-if="page === 'more-prev'" class="icon-more" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="currentColor" d="M529.408 149.376a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L259.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L197.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224zm256 0a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L515.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L453.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224z" /></svg>
          <svg v-else-if="page === 'more-next'" class="icon-more" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em"><path fill="currentColor" d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L764.736 512 452.864 192a30.592 30.592 0 0 1 0-42.688m-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L508.736 512 196.864 192a30.592 30.592 0 0 1 0-42.688z" /></svg>
          <svg class="icon-more-text" viewBox="0 0 1024 1024" width="1em" height="1em"><path fill="currentColor" d="M176 416a112 112 0 1 1 0 224 112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224 112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224 112 112 0 0 1 0-224" /></svg>
        </template>
      </li>
    </ul>

    <!-- Next -->
    <button
      type="button"
      class="btn-next"
      :disabled="innerCurrentPage >= pageCount"
      @click="next"
    >
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="currentColor" d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z" /></svg>
    </button>

    <!-- Jumper -->
    <span v-if="layout.includes('jumper')" class="sugar-pagination__jump">
      <span style="margin-right: 4px;white-space: nowrap;">Go to</span>
      <div class="sugar-input sugar-pagination__editor is-in-pagination">
        <div class="sugar-input__wrapper">
          <input
            class="sugar-input__inner"
            type="number"
            :min="1"
            :max="pageCount"
            :value="innerCurrentPage"
            @change="handleJumperChange"
          >
        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>
.sugar-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 5px;
  color: var(--vp-c-text-1);
  font-size: 12px;
}
.sugar-pagination--small .btn-prev, .sugar-pagination--small .btn-next, .sugar-pagination--small .sugar-pager li {
  height: 24px;
  line-height: 24px;
  min-width: 24px;
  font-size: 12px;
}
.sugar-pagination button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 0 6px;
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  color: var(--vp-c-text-1);
}
.sugar-pagination button:disabled {
  color: var(--vp-c-text-3);
  cursor: not-allowed;
}
.sugar-pagination button:hover:not(:disabled) {
  color: var(--vp-c-brand-2);
}
.sugar-pagination .sugar-pager {
  user-select: none;
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}
.sugar-pagination .sugar-pager li {
  padding: 0 4px;
  background: transparent;
  vertical-align: top;
  display: inline-block;
  font-size: 12px;
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
  box-sizing: border-box;
  text-align: center;
  margin: 0 4px;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sugar-pagination .sugar-pager li.is-active {
  color: var(--vp-c-brand-2);
  cursor: default;
  font-weight: normal;
}
.sugar-pagination .sugar-pager li:hover:not(.is-active):not(.more) {
  color: var(--vp-c-brand-2);
}
.sugar-pagination .sugar-pager li.more {
  cursor: pointer;
}
.sugar-pagination .sugar-pager li.more .icon-more {
  display: none;
}
.sugar-pagination .sugar-pager li.more .icon-more-text {
  display: block;
}
.sugar-pagination .sugar-pager li.more:hover {
  color: var(--vp-c-brand-2);
}
.sugar-pagination .sugar-pager li.more:hover .icon-more {
  display: inline-block;
}
.sugar-pagination .sugar-pager li.more:hover .icon-more-text {
  display: none;
}
.sugar-pagination.is-background .btn-prev, .sugar-pagination.is-background .btn-next, .sugar-pagination.is-background .sugar-pager li {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  margin: 0 3px;
  border-radius: 2px;
  font-weight: normal;
}
.sugar-pagination.is-background .btn-prev:disabled, .sugar-pagination.is-background .btn-next:disabled {
  color: var(--vp-c-text-3);
  background-color: var(--vp-c-bg-alt);
}
.sugar-pagination.is-background .sugar-pager li:not(.disabled).is-active {
  background-color: var(--vp-c-brand-2);
  color: #fff;
}
.sugar-pagination.is-background .sugar-pager li:not(.disabled):hover:not(.is-active):not(.more) {
  color: var(--vp-c-brand-2);
}
.sugar-pagination__jump {
  display: flex;
  align-items: center;
  margin-left: 24px;
  font-weight: normal;
  color: var(--vp-c-text-2);
}
.sugar-pagination__editor {
  margin: 0 8px;
  width: 50px;
}

.sugar-input {
  display: inline-flex;
  position: relative;
  font-size: 12px;
  line-height: 24px;
  box-sizing: border-box;
  width: 100%;
}

.sugar-input__wrapper {
  display: inline-flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 1px 11px;
  background-color: var(--vp-c-bg);
  background-image: none;
  border-radius: 4px;
  transition: box-shadow 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.sugar-input__wrapper:focus-within {
  box-shadow: 0 0 0 1px var(--vp-c-brand-2) inset;
}

.sugar-input__inner {
  width: 100%;
  flex-grow: 1;
  -webkit-appearance: none;
  color: var(--vp-c-text-1);
  font-size: inherit;
  height: 24px;
  line-height: 24px;
  padding: 0;
  outline: none;
  border: none;
  background: none;
  box-sizing: border-box;
  text-align: center;
  /* Chrome, Safari, Edge, Opera */
  /* Firefox */
}
.sugar-input__inner::-webkit-outer-spin-button, .sugar-input__inner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.sugar-input__inner[type=number] {
  -moz-appearance: textfield;
}
</style>
