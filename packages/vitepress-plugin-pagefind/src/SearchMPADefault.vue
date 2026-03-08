<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
</script>

<template>
  <div class="blog-search" data-pagefind-ignore="all" :data-base="site.base">
    <div class="nav-search-btn-wait">
      <span class="svg-icon">
        <svg width="14" height="14" viewBox="0 0 20 20">
          <path
            d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
            stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"
          />
        </svg>
      </span>
      <span class="search-tip">Search</span>
    </div>
    <div class="search-dialog-mask" style="display: none;">
      <div class="search-dialog">
        <div id="pagefind-search" class="pagefind-search"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-search {
  flex: 1;
  display: flex;
  padding-left: 32px;
}
.nav-search-btn-wait {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px 0 12px;
  height: 40px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid transparent;
  border-radius: 8px;
  transition: .2s border;
}
.nav-search-btn-wait:hover {
  border: 1px solid var(--vp-c-brand-1);
}
.nav-search-btn-wait .search-tip {
  color: #909399;
  font-size: 12px;
  padding-left: 8px;
  padding-right: 16px;
}
.svg-icon {
  display: flex;
  align-items: center;
}

@media screen and (max-width: 759px) {
  .blog-search {
    flex: 0;
    padding-left: 0;
  }
  .nav-search-btn-wait {
    background-color: transparent;
    padding: 0 4px;
  }
  .search-tip {
    display: none;
  }
}

.search-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh;
}
.search-dialog {
  background-color: var(--vp-c-bg);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  border-radius: 8px;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Pagefind UI overrides to match VitePress theme */
:deep(.pagefind-ui__search-input) {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}
:deep(.pagefind-ui__result-title) {
  color: var(--vp-c-brand-1);
}
:deep(.pagefind-ui__result-excerpt) {
  color: var(--vp-c-text-2);
}
</style>

<style lang="css">
@import './assets/scss/search.css';
</style>

<script client>
  const container = document.querySelector('.blog-search');
  const btn = container?.querySelector('.nav-search-btn-wait');
  const mask = container?.querySelector('.search-dialog-mask');
  const dialog = container?.querySelector('.search-dialog');
  
  if (container && btn && mask && dialog) {
    const base = container.dataset.base || '/';
    
    // Helper to load script/css
    const loadResource = (type, url) => {
      return new Promise((resolve, reject) => {
        const element = document.createElement(type === 'script' ? 'script' : 'link');
        if (type === 'script') {
          element.src = url;
          element.onload = resolve;
          element.onerror = reject;
        } else {
          element.rel = 'stylesheet';
          element.href = url;
          element.onload = resolve;
          element.onerror = reject;
        }
        document.head.appendChild(element);
      });
    };

    const initPagefind = async () => {
      try {
        if (!window.PagefindUI) {
          // Join paths safely-ish
          const cssUrl = `${base}pagefind/pagefind-ui.css`.replace(/\/+/g, '/');
          const jsUrl = `${base}pagefind/pagefind-ui.js`.replace(/\/+/g, '/');
          
          await Promise.all([
            loadResource('css', cssUrl),
            loadResource('script', jsUrl)
          ]);
        }
        
        new window.PagefindUI({
          element: "#pagefind-search",
          showSubResults: true,
          showImages: false,
          translations: {
            placeholder: "Search Docs"
          }
        });
      } catch (e) {
        console.error('Failed to load Pagefind UI:', e);
        const searchContainer = document.getElementById('pagefind-search');
        if (searchContainer) {
           searchContainer.innerHTML = '<p style="color:var(--vp-c-danger); text-align:center; padding: 20px;">Search index not found. Please build the site first.</p>';
        }
      }
    };

    btn.addEventListener('click', () => {
      mask.style.display = 'flex';
      if (!window.pagefindInitialized) {
         initPagefind();
         window.pagefindInitialized = true;
      }
    });

    mask.addEventListener('click', (e) => {
      if (e.target === mask) {
        mask.style.display = 'none';
      }
    });
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mask.style.display === 'flex') {
        mask.style.display = 'none';
      }
    });
  }
</script>
