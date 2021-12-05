<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'Card',
});

</script>

<style lang="scss" scoped>
@import "src/assets/colors";

.card {
    display         : flex;
    padding         : 50px;
    border-radius   : 20px;
    background      : $primary-lighten;
}
</style>
