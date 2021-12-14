<template>
    <transition name="fade" appear>
        <div v-if="isError" class="popup">
            <slot></slot>
        </div>
    </transition>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'ErrorPopup',
    props: {
        show: {
            required: false,
            type: Boolean,
            default: false,
        },
    },
});

</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.popup {
    position: absolute;
    top: 90vh;
    left: 10vh;
    padding: 20px;
    border-radius : 10px;
    background: $red;
    opacity: 0.8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
