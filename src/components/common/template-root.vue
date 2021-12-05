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
    min-height : 100vh;
    padding    : 80px 20px;
}

</style>
