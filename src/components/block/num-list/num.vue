<template>
    <div class="num">{{ index }}</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'Num',
    props: {
        index: {
            required: true,
            type: Number,
        },
    },
});

</script>

<style scoped lang="scss">
@import 'src/assets/colors';

.num {
    display         : flex;
    width           : 35px;
    height          : 35px;
    flex            : 0 0 35px;
    justify-content : center;
    align-items     : center;
    border-radius   : 50%;
    border          : 1px solid $black;
    font-weight     : 600;
    font-size       : 24px;
    line-height     : 30px;
}
</style>
