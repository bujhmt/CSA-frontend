<template>
    <div class="icon">
        <img :src="src" alt="icon">
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'Icon',
    props: {
        src: {
            required: true,
            type: String,
        },
    },
});
</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.icon {
    display         : flex;
    justify-content : center;
    align-items     : center;
    padding         : 10px;
    background      : $primary-darken;
    border-radius   : 10px;

    img {
        flex : 0 0 25px;
    }
}

</style>
