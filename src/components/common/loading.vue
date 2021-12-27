<template>
    <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'Loading',
});
</script>

<style scoped lang="scss">
@import 'src/assets/colors';

.lds-ring {
    position : relative;
    display  : inline-block;
    width    : 80px;
    height   : 80px;

    div {
        position      : absolute;
        display       : block;
        box-sizing    : border-box;
        width         : 64px;
        height        : 64px;
        margin        : 8px;
        border-radius : 50%;
        animation     : lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

        &:nth-child(1) {
            animation-delay : -0.45s;
        }

        &:nth-child(2) {
            animation-delay : -0.3s;
        }

        &:nth-child(3) {
            animation-delay : -0.15s;
        }
    }

    &.primary div {
        border       : 8px solid $primary;
        border-color : $primary transparent transparent transparent;
    }
}

@keyframes lds-ring {
    0% {
        transform : rotate(0deg);
    }
    100% {
        transform : rotate(360deg);
    }
}
</style>
