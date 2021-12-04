<template>
  <div>
    <table>
      <thead>
        <tr>
          <th
            v-for="(t, idx) in th"
            :key="idx"
          >
            {{ t }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(t, idx) in td"
          :key="idx"
        >
          <td
            v-for="(tt, idx2) in t"
            :key="idx2"
            v-html="parseTd(tt)"
          ></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      name: '',
      th: [],
      td: [],
    };
  },
  methods: {
    parseTd(td) {
      if (typeof td === 'string') {
        return td;
      }
      if (Array.isArray(td)) {
        const lis = td.map((t) => {
          return `<li>${this.parseTd(t)}</li>`;
        }).join('');
        return `<ul style="margin:0;">${lis}</ul>`;
      }
      const {
        name = '-',
        href = '',
        src = ''
      } = td;
      if(href){
        return `<a href="${href}" target="blank">${name}</a>`;
      }
      if(src){
        return `<img src="${src}"/>`;
      }
    },
  },
  async mounted() {
    const module = await import(
      `./${this.src}.js`
    );
    const {
      name,
      th,
      td,
    } = module.default;
    this.name = name;
    this.th = th;
    this.td = td;
  },
};
</script>

<style scoped>

</style>
