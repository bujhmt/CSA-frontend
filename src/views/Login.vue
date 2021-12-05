<template>
    <TemplateRoot class="view-root">
        <Card class="card">
            <h1>Особистий кабінет</h1>
            <span>Введіть дані, щоб увійти в свій обліковий запис</span>
            <TextInput
                :validators="validationSchema.login.validators"
                type="email"
                placeholder="Логін"
                class="input"
                input-key="login"
                @value="handleInput"
            />
            <TextInput
                :validators="validationSchema.password.validators"
                type="password"
                placeholder="Пароль"
                class="input"
                input-key="password"
                @value="handleInput"
            />
            <Btn
                @click="handleSubmit"
                label="Увійти"
                class="button"
            />
        </Card>
    </TemplateRoot>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import Card from '@/components/block/card.vue';
import Btn from '@/components/block/btn.vue';
import TemplateRoot from '@/components/common/template-root.vue';
import TextInput from '@/components/block/text-input.vue';
import {ValidationInput} from '@/interfaces/validation-input';

export default defineComponent({
    name: 'LoginView',
    components: {
        TextInput, TemplateRoot, Btn, Card,
    },
    data() {
        return {
            validationSchema: {
                login: {
                    value: '',
                    validators: [
                        (value) => value.length > 2,
                    ],
                },
                password: {
                    value: '',
                    validators: [
                        (value) => value.length > 2,
                    ],
                },
            } as Record<string, ValidationInput<string>>,
        };
    },
    methods: {
        handleInput(valueSchema: Record<string, string>): void {
            if (valueSchema) {
                const [key, value] = Object.entries(valueSchema)[0];
                this.validationSchema[key].value = value;
            }
        },
        handleSubmit(): void {
            console.log(this.validationSchema);
        },
    },
});

</script>

<style lang="scss" scoped>

.view-root {
    display         : flex;
    justify-content : center;

    .card {
        margin         : 60px 0;
        align-items    : center;
        flex-direction : column;

        h1 {
            margin-bottom : 30px;
            text-align    : center;
        }

        .button {
            width     : 100%;
            max-width : 300px;
        }

        span {
            margin-bottom : 40px;
            text-align    : center;
        }

        .input {
            width         : 100%;
            max-width     : 400px;
            margin-bottom : 40px;
        }
    }
}

</style>
