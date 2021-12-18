<template>
    <ol class="num-list">
        <li
            v-for="(item, index) in items"
            :key="`${item}-${index}`"
            class="list-item"
        >
            <Num :index="index + 1"/>
            <span class="text">{{ item }}</span>
        </li>
    </ol>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Num from '@/components/block/num-list/num.vue';

export default defineComponent({
    name: 'NumList',
    components: {Num},
    props: {
        items: {
            required: true,
            type: Array as () => string[],
        },
    },
});

</script>

<style scoped lang="scss">
@import 'src/assets/colors';

.num-list {
    list-style     : none;
    display        : flex;
    flex-direction : column;

    .list-item {
        display     : flex;
        align-items : center;
        margin-top  : 20px;

        .text {
            margin-left : 10px;
            font-weight : 600;
            font-size   : 16px;
            color       : rgba($black, 0.8);
        }
    }
}

</style>
