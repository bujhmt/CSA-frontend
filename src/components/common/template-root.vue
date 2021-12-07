<template>
    <div class="breadcrumbs-wrapper">
        <div class="link" v-for="(link, i) of links" :key="link.url">
            <div v-if="i !== links.length - 1">
                <router-link :to="link.url" class="link">
                    {{ link.text }}
                </router-link>
                <div class="separator">&#62;</div>
            </div>
            <div v-else>{{ link.text }}</div>
        </div>
    </div>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {BreadcrumbLink} from '@/interfaces/breadcrumbs-link';

export default defineComponent({
    name: 'Breadcrumbs',
    props: {
        links: {
            type: Array as () => BreadcrumbLink[],
            required: true,
        },
    },
});

</script>

<style scoped lang="scss">
@import 'src/assets/colors';

.breadcrumbs-wrapper {
    display     : flex;
    flex-wrap   : wrap;
    align-items : center;

    div, .link {
        font-weight : 500;
        font-size   : 14px;
        line-height : 20px;
    }

    div {
        display     : flex;
        align-items : center;
        color       : colors.$black;
        cursor      : default;

        &.separator {
            margin : 0 5px;
            color  : colors.$black;
        }
    }

    .link {
        &:hover {
            color : colors.$secondary;
        }
    }
}

</style>
