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
::v-deep.form-group {
    display         : flex;
    flex-wrap       : wrap;
    align-items     : center;
    justify-content : space-between;

    > * {
        flex : 0 0 calc(33.333333% - 30px);
    }
}
</style>
