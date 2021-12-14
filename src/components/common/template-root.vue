<template>
    <section class="template-root">
        <slot></slot>
    </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'TemplateRoot',
});
</script>

<style scoped lang="scss">
.template-root {
    flex       : 1;
    margin-top : 80px;
    min-height : calc(100vh - 120px);
    padding    : 40px 30px;
}
</style>
