<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info',
    validator: (val: string) => ['success', 'warning', 'info', 'error', 'primary'].includes(val),
  },
  description: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: true,
  },
  center: {
    type: Boolean,
    default: false,
  },
  closeText: {
    type: String,
    default: '',
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const visible = ref(true)

function close() {
  visible.value = false
  emit('close')
}

const typeClass = computed(() => `sugar-alert--${props.type}`)
const isBigIcon = computed(() => props.description || !!props.title)
const isBoldTitle = computed(() => props.description || !!props.title)
</script>

<template>
  <transition name="sugar-alert-fade">
    <div v-show="visible" class="sugar-alert" :class="[typeClass, center ? 'is-center' : '']" role="alert">
      <div v-if="showIcon" class="sugar-alert__icon" :class="[isBigIcon ? 'is-big' : '']">
        <svg
          v-if="type === 'success'" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em"
          height="1em"
        >
          <path
            fill="currentColor"
            d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"
          />
        </svg>
        <svg
          v-else-if="type === 'warning'" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em"
          height="1em"
        >
          <path
            fill="currentColor"
            d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"
          />
        </svg>
        <svg
          v-else-if="type === 'error'" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em"
          height="1em"
        >
          <path
            fill="currentColor"
            d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z"
          />
        </svg>
        <svg
          v-else-if="type === 'primary'" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em"
          height="1em"
        >
          <path
            fill="currentColor"
            d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 832a384 384 0 1 0 0-768 384 384 0 0 0 0 768m48-176a48 48 0 1 1-96 0 48 48 0 0 1 96 0m-48-464a32 32 0 0 1 32 32v288a32 32 0 0 1-64 0V256a32 32 0 0 1 32-32"
          />
        </svg>
        <svg v-else viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em">
          <path
            fill="currentColor"
            d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 832a384 384 0 1 0 0-768 384 384 0 0 0 0 768m48-176a48 48 0 1 1-96 0 48 48 0 0 1 96 0m-48-464a32 32 0 0 1 32 32v288a32 32 0 0 1-64 0V256a32 32 0 0 1 32-32"
          />
        </svg>
      </div>
      <div class="sugar-alert__content">
        <span v-if="title || $slots.title" class="sugar-alert__title" :class="[isBoldTitle ? 'is-bold' : '']">
          <slot name="title">{{ title }}</slot>
        </span>
        <p v-if="$slots.default || description" class="sugar-alert__description">
          <slot>
            {{ description }}
          </slot>
        </p>
        <div v-if="closable" class="sugar-alert__close-btn" :class="{ 'is-customed': closeText !== '' }" @click="close">
          <template v-if="closeText">
            {{ closeText }}
          </template>
          <svg v-else viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em">
            <path
              fill="currentColor"
              d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
            />
          </svg>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
html.dark .sugar-alert {
  background-color: transparent;
}

.sugar-alert {
  width: 100%;
  padding: 8px 16px;
  margin: 0;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  opacity: 1;

  display: flex;
  align-items: center;
  transition: opacity .2s;

  &.is-center {
    justify-content: center;

    .sugar-alert__content {
      text-align: center;
    }
  }

  &--success {
    background-color: #f0f9eb;
    color: #67c23a;

    .sugar-alert__description {
      color: #67c23a;
    }

  }

  &--info {
    background-color: #f4f4f5;
    color: #909399;

    .sugar-alert__description {
      color: #909399;
    }

  }

  &--warning {
    background-color: #fdf6ec;
    color: #e6a23c;

    .sugar-alert__description {
      color: #e6a23c;
    }

  }

  &--error {
    background-color: #fef0f0;
    color: #f56c6c;

    .sugar-alert__description {
      color: #f56c6c;
    }

  }

  &--primary {
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);

    .sugar-alert__description {
      color: var(--vp-c-brand-1);
    }
  }

  &__content {
    display: table-cell;
    padding: 0 8px;
    width: 100%; // Ensure content takes available space
  }

  &__icon {
    font-size: 16px;
    width: 16px;
    display: table-cell;
    color: inherit;
    vertical-align: middle;

    &.is-big {
      font-size: 28px;
      width: 28px;
    }
  }

  &__title {
    font-size: 13px;
    line-height: 18px;
    vertical-align: text-top;

    &.is-bold {
      font-weight: 700;
    }
  }

  &__description {
    font-size: 12px;
    margin: 5px 0 0 0;
    line-height: 1.5;
  }

  &__close-btn {
    font-size: 12px;
    opacity: 1;
    position: absolute;
    top: 12px;
    right: 15px;
    cursor: pointer;
    color: var(--vp-c-text-2); // Use element colors if light

    &.is-customed {
      font-style: normal;
      font-size: 11px;
      line-height: 18px;
    }

    &:hover {
      opacity: 0.7;
    }
  }
}

.sugar-alert-fade-enter-from,
.sugar-alert-fade-leave-to {
  opacity: 0;
}

html.dark {
  .sugar-alert {
    &--success {
      background-color: #1c2518;
      color: #67c23a;

      .sugar-alert__description {
        color: #67c23a;
      }
    }

    &--info {
      background-color: #202121;
      color: #909399;

      .sugar-alert__description {
        color: #909399;
      }
    }

    &--warning {
      background-color: #292218;
      color: #e6a23c;

      .sugar-alert__description {
        color: #e6a23c;
      }
    }

    &--error {
      background-color: #2b1d1d;
      color: #f56c6c;

      .sugar-alert__description {
        color: #f56c6c;
      }
    }

    &--primary {
      background-color: var(--vp-c-brand-soft);
      color: var(--vp-c-brand-1);

      .sugar-alert__description {
        color: var(--vp-c-brand-1);
      }
    }
  }
}
</style>
