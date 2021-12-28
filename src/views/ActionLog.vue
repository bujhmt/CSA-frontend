<template>
    <TemplateRoot>
        <Breadcrumbs :links="breadcrumbs"/>
        <div class="cards-wrapper" v-if="actionLog">
            <Card class="info-card">
                <span class="block">Загальні дані</span>
                <span>Дія</span>
                <strong>{{ actionLog.type }}</strong>
                <span>Дата</span>
                <strong>{{ actionLog.date }}</strong>
                <span class="block">Користувач</span>
                <span>Логін</span>
                <strong>{{ actionLog.user.login }}</strong>
                <span v-if="actionLog.user.name">ФІО</span>
                <strong v-if="actionLog.user.name">{{ actionLog.user.name }}</strong>
                <span>Статус</span>
                <strong>{{ userStatus ? 'Активний' : 'Заблокований' }}</strong>
                <span v-if="oldSnapshot" class="block">Дані до змін:</span>
                <template
                    v-for="(item, index) in Object.entries(oldSnapshot || {})"
                    :key="`${item[0]}-${index}`"
                >
                    <span>{{item[0]}}</span>
                    <strong>{{item[1]}}</strong>
                </template>
                <span v-if="newSnapshot" class="block">Дані після змін:</span>
                <template
                    v-for="(item, index) in Object.entries(newSnapshot || {})"
                    :key="`${index}-${item[0]}`"
                >
                    <span>{{item[0]}}</span>
                    <strong>{{item[1]}}</strong>
                </template>
            </Card>
            <Card class="buttons-card">
                <Btn
                    :disabled="reason.length < 6"
                    :label="userStatus ? 'Заблокувати' : 'Розблокувати'"
                    class="button"
                    :accent="userStatus ? 'danger' : 'default'"
                    @click="handleChangeStatus"
                />
                <TextInput
                    :placeholder="userStatus ? 'Причина блокування' : 'Причина розблокування'"
                    :label="userStatus ? 'Причина блокування' : 'Причина розблокування'"
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
import {ActionLog} from '@/interfaces/models/action-log';
import TextInput from '@/components/forms/text-input.vue';
import {Validator} from '@/interfaces/types/validator';
import {$post} from '@/plugins/axios';

export default defineComponent({
    name: 'ActionLog',
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

        return {
            reasonValidators,
            reason: '',
        };
    },
    computed: {
        actionLogId(): string {
            return this.$route.params.id as string;
        },
        actionLog(): Partial<ActionLog> | undefined {
            return this.$store.getters['action-logs/getById'](this.actionLogId);
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
        userStatus(): boolean {
            return !!this.actionLog?.user?.isActive;
        },
        oldSnapshot(): Record<string, any> | null {
            if (Object.entries(this.actionLog?.oldSnapshot || {}).length) {
                return this.actionLog?.oldSnapshot || {};
            }

            return null;
        },
        newSnapshot(): Record<string, any> | null {
            if (Object.entries(this.actionLog?.newSnapshot || {}).length) {
                return this.actionLog?.newSnapshot || {};
            }

            return null;
        },
    },
    methods: {
        fetchActionLog(): Promise<void> {
            return this.$store.dispatch('action-logs/fetchById', {
                id: this.actionLogId,
                authToken: this.$store.getters['auth/userToken'],
            });
        },
        handleReasonInput(reason: string) {
            this.reason = reason;
        },
        handleChangeStatus() {
            $post(
                this.userStatus ? '/user/deactivate' : '/user/activate',
                {
                    auth: this.$store.getters['auth/userToken'],
                    body: {
                        login: this.actionLog?.user?.login,
                        reason: this.reason,
                    },
                },
            ).then((response) => {
                if (response?.success) {
                    this.fetchActionLog();
                }
            });
        },
    },
    created() {
        if (!this.actionLog) {
            this.fetchActionLog();
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
