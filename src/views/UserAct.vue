<template>
    <TemplateRoot>
        <Breadcrumbs :links="breadcrumbs"/>
        <div class="cards-wrapper" v-if="act">
            <Card class="info-card">
                <span class="block">Акт цивільного стану</span>
                <span>Тип акту</span>
                <strong>{{ nameLocale[act.actType.typeName] }}</strong>
                <span>Дата</span>
                <strong>{{ act.createdAt }}</strong>
                <span>Дійсний</span>
                <strong>{{ act.isActive?'Так':'Ні' }}</strong>
                <span v-if="act.data">Відомості акту</span>
                <strong>{{ act.data }}</strong>
            </Card>
            <Card class="buttons-card">
                <Btn
                    :disabled="reason.length < 6"
                    :label="act.isActive ? 'Деактивувати' : 'Активувати'"
                    class="button"
                    :accent="act.isActive ? 'danger' : 'default'"
                    @click="handleChangeStatus"
                />
                <TextInput
                    :placeholder="act.isActive ? 'Причина дективації' : 'Причина активації'"
                    :validators="reasonValidators"
                    @value="handleReasonInput"
                    textarea
                />
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
import {CivilStatusAct} from '@/interfaces/models/civil-status-act';
import TextInput from '@/components/forms/text-input.vue';
import {Validator} from '@/interfaces/types/validator';
import {$get, $post} from '@/plugins/axios';

export default defineComponent({
    name: 'UserAct',
    components: {
        TextInput,
        Btn,
        Card,
        Breadcrumbs,
        TemplateRoot,
    },
    data() {
        const reasonValidators: Validator<string>[] = [
            (value) => value.length > 5,
        ];
        const nameLocale: Record<string, string> = {
            nameChange: 'Зміна імені',
            marriage: 'Одруження',
            death: 'Смерть',
        };

        return {
            reasonValidators,
            reason: '',
            act: null as CivilStatusAct | null,
            nameLocale,
        };
    },
    computed: {
        authToken(): string {
            return this.$store.getters['auth/userToken'];
        },
        actId(): string {
            return this.$route.params.id as string;
        },
        breadcrumbs(): BreadcrumbLink[] {
            return [
                {
                    url: '/registrator',
                    text: 'Головна',
                },
                {
                    url: '/user-status-list',
                    text: 'Список Користувачів',
                },
                {
                    url: '/user-acts',
                    text: 'Акти користувача',
                },
                {
                    url: '/user-act',
                    text: 'Акт',
                },
            ];
        },
    },
    methods: {
        async fetchAct(): Promise<void> {
            $get<CivilStatusAct>('/civil-act/act/', this.authToken, {
                params: {
                    actId: this.actId,
                },
            })
                .then((response) => {
                    if (response?.success && response.data) {
                        this.act = response.data;
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        handleReasonInput(reason: string) {
            this.reason = reason;
        },
        handleChangeStatus() {
            $post(
                this.act?.isActive ? '/civil-act/deactivate' : '/civil-act/activate',
                {
                    auth: this.$store.getters['auth/userToken'],
                    body: {
                        civilActId: this.actId,
                    },
                },
            ).then((response) => {
                if (response?.success) {
                    this.fetchAct();
                }
            });
        },
    },
    created() {
        if (!this.act) {
            this.fetchAct();
        }
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
        flex        : 0 0 62%;
        display     : flex;
        flex-wrap   : wrap;
        align-items : stretch;

        span, strong {
            display       : block;
            flex          : 0 0 50%;
            margin-bottom : 15px;
        }

        div {
            flex           : 0 0 100%;
            display        : flex;
            flex-direction : column;

            > * {
                margin-top : 15px;
            }
        }

        .block {
            font-weight : 600;
            font-size   : 22px;
            flex        : 0 0 100%;

            &:not(:first-of-type) {
                margin-top : 20px;
            }
        }

        strong {
            font-weight : 600;
        }
    }

    .buttons-card {
        flex           : 0 0 28%;
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
