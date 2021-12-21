<template>
    <div class="form-group">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'FormGroup',
});

</script>

<style scoped lang="scss">
@import 'src/assets/breakpoints';

::v-deep.form-group {
    display         : flex;
    flex-wrap       : wrap;
    align-items     : center;
    justify-content : space-between;

    > * {
        flex       : 0 0 calc(50% - 15px);
        margin-top : 20px;
    }
}

@media (max-width : $md) {
    ::v-deep.form-group {
        flex-wrap      : nowrap;
        flex-direction : column;

        > * {
            max-width : none;
        }
    }
}
</style>
