<template>
    <div class="breadcrumbs-wrapper">
        <div
            v-for="(link, index) in links"
            :key="`link-${link.url}-${index}`"
            class="link-wrapper"
        >
            <MaybeLink
                :to="index < links.length - 1 ? link.url : null"
                tag="span"
            >
                {{ link.text }}
            </MaybeLink>
            <Arrow v-if="index < links.length - 1" direction="right" class="arrow"/>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {BreadcrumbLink} from '@/interfaces/breadcrumbs-link';
import MaybeLink from '@/components/common/maybe-link.vue';
import Arrow from '@/components/common/arrow.vue';

export default defineComponent({
    name: 'Breadcrumbs',
    components: {Arrow, MaybeLink},
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
    align-items : center;

    .link-wrapper {
        display     : flex;
        align-items : center;

        .arrow {
            margin-left : 10px;
        }

        &:not(:last-of-type) {
            margin-right : 10px;
        }

        > * {
            font-weight : 500;
            font-size   : 16px;
            line-height : 20px;
        }

        span {
            color : $grey;
        }

        a {
            color      : $black;
            transition : color 0.3s ease;

            &:hover {
                color : $primary;
            }
        }
    }
}
</style>
