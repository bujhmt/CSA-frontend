<template>
    <TemplateRoot>
        <Breadcrumbs :links="breadcrumbs"/>
        <div class="cards-wrapper">
            <Card class="info-card">

            </Card>
            <Card class="buttons-card">
                <Btn label="Заблокувати" class="button" accent="danger"/>
            </Card>
        </div>
    </TemplateRoot>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {BreadcrumbLink} from '@/interfaces/breadcrumbs-link';
import TemplateRoot from '@/components/common/template-root.vue';
import Breadcrumbs from '@/components/common/breadcrumbs.vue';
import Card from '@/components/block/card.vue';
import Btn from '@/components/block/btn.vue';

export default defineComponent({
    name: 'ActionLog',
    components: {
        Btn, Card, Breadcrumbs, TemplateRoot,
    },
    computed: {
        actionLogId(): string {
            return this.$route.params.id as string;
        },
        breadcrumbs(): BreadcrumbLink[] {
            return [
                {
                    url: '/admin',
                    text: 'Головна',
                },
                {
                    url: '/history',
                    text: 'Історія',
                },
                {
                    url: `/history/${this.actionLogId}`,
                    text: `Дія ${this.actionLogId}`,
                },
            ];
        },
    },
});

</script>

<style scoped lang="scss">
@import 'src/assets/colors';

.cards-wrapper {
    position        : relative;
    display         : flex;
    justify-content : space-between;
    margin-top      : 20px;

    .info-card {
    }

    .buttons-card {
        flex           : 0 0 20%;
        display        : flex;
        flex-direction : column;
        margin-left    : 20px;
        padding        : 20px 10px;

        .button {
            width         : 100%;
            margin-bottom : 20px;
            margin-top    : 20px;
        }
    }
}

</style>
