<script lang="ts" setup>
defineProps({
  type: { type: String, default: 'primary' },
  closable: { type: Boolean, default: false }
})

defineEmits(['close', 'click'])
</script>

<template>
  <span class="blog-tag" :class="[`blog-tag--${type || 'primary'}`]" @click="$emit('click', $event)">
    <slot />
    <span v-if="closable" class="close" @click.stop="$emit('close', $event)">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em">
        <path
          fill="currentColor"
          d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
        />
      </svg>
    </span>
  </span>
</template>

<style lang="scss">
.blog-tag {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  padding: 0 9px;
  font-size: 12px;
  line-height: 1;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  vertical-align: middle;
  color: #fff;

  >.close {
    margin-left: 6px;
    font-size: 12px;
    cursor: pointer;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    transition: all 0.3s;
  }
}

/* Primary */
.blog-tag--primary {
  background-color: #409eff;
  border-color: #409eff;

  .close:hover {
    background-color: #79bbff;
  }
}

/* Success */
.blog-tag--success {
  background-color: #67c23a;
  border-color: #67c23a;

  .close:hover {
    background-color: #95d475;
  }
}

/* Info */
.blog-tag--info {
  background-color: #909399;
  border-color: #909399;

  .close:hover {
    background-color: #b1b3b8;
  }
}

/* Warning */
.blog-tag--warning {
  background-color: #e6a23c;
  border-color: #e6a23c;

  .close:hover {
    background-color: #eebe77;
  }
}

/* Danger */
.blog-tag--danger {
  background-color: #f56c6c;
  border-color: #f56c6c;

  .close:hover {
    background-color: #f89898;
  }
}
</style>

<style lang="scss">
html.dark {
  .blog-tag--primary {
    background-color: #18222c;
    border-color: #1d3043;
    color: #409eff;

    .close:hover {
      background-color: #409eff;
      color: #fff;
    }
  }

  .blog-tag--success {
    background-color: #1c2518;
    border-color: #25371c;
    color: #67c23a;

    .close:hover {
      background-color: #95d475;
      color: #fff;
    }
  }

  .blog-tag--info {
    background-color: #202121;
    border-color: #2d2d2f;
    color: #909399;

    .close:hover {
      background-color: #909399;
      color: #fff;
    }
  }

  .blog-tag--warning {
    background-color: #292218;
    border-color: #3e301c;
    color: #e6a23c;

    .close:hover {
      background-color: #e6a23c;
      color: #fff;
    }
  }

  .blog-tag--danger {
    background-color: #2b1d1d;
    border-color: #412626;
    color: #f56c6c;

    .close:hover {
      background-color: #f56c6c;
      color: #fff;
    }
  }
}
</style>
