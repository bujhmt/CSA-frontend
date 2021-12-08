<template>
    <TemplateRoot>
        <Card class="card">
            <h1>Особистий кабінет</h1>
            <span class="sub-title">Введіть дані, щоб увійти в свій обліковий запис</span>
            <TextInput
                :validators="validationSchema.login.validators"
                type="email"
                placeholder="Логін"
                class="input"
                input-key="login"
                @value="handleInput"
                @valid-change="handleValidityChange"
            />
            <TextInput
                :validators="validationSchema.password.validators"
                type="password"
                placeholder="Пароль"
                class="input"
                input-key="password"
                @value="handleInput"
                @valid-change="handleValidityChange"
            />
            <Btn
                @click="handleSubmit"
                :disabled="!isValidForm"
                label="Увійти"
                class="button"
            />
            <div class="text-block">
                <span>Не маєте акаунт?</span>
                <router-link to="/register" class="link">Створити обліковий запис</router-link>
            </div>
        </Card>
        <ErrorPopup :isError="isError" @click="isError=false">
            {{errorText}}
        </ErrorPopup>
    </TemplateRoot>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import Card from '@/components/block/card.vue';
import Btn from '@/components/block/btn.vue';
import TemplateRoot from '@/components/common/template-root.vue';
import TextInput from '@/components/block/text-input.vue';
import {ValidationInput} from '@/interfaces/validation-input';
import ErrorPopup from '@/components/block/error-popup.vue';

export default defineComponent({
    name: 'LoginView',
    components: {
        TextInput, TemplateRoot, Btn, Card, ErrorPopup,
    },
    data() {
        return {
            validationSchema: {
                login: {
                    value: '',
                    validators: [
                        (value) => value.length > 5,
                    ],
                },
                password: {
                    value: '',
                    validators: [
                        (value) => value.length > 8,
                    ],
                },
            } as Record<string, ValidationInput<string>>,
            isValidForm: false,
            isError: false,
            errorText: '',
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
            this.$store.dispatch('auth/login', {
                login: this.$data.validationSchema.login.value,
                password: this.$data.validationSchema.password.value,
            }).then((success) => {
                if (success) {
                    this.$router.push({path: '/'});
                } else {
                    this.$data.isError = true;
                    this.$data.errorText = 'Некоректні дані користувача';
                }
            }).catch(() => {
                this.$data.isError = true;
                this.$data.errorText = 'Проблеми з сервером, спробуйте пізніше';
            });
        },
        handleValidityChange(newValidity: boolean) {
            this.$data.isValidForm = newValidity;
        },
    },
});

</script>

<style lang="scss" scoped>
@import "src/assets/colors";

.card {
    max-width      : 730px;
    margin         : 60px auto;
    align-items    : center;
    flex-direction : column;

    h1 {
        margin-bottom : 30px;
        text-align    : center;
    }

    .button {
        width         : 100%;
        max-width     : 300px;
        margin-bottom : 40px;
    }

    .sub-title {
        margin-bottom : 40px;
        text-align    : center;
    }

    .input {
        width         : 100%;
        max-width     : 400px;
        margin-bottom : 30px;
    }

    .text-block {
        display         : flex;
        justify-content : center;
        flex-wrap       : wrap;
        margin          : 0 -10px;

        * {
            padding     : 0 5px;
            font-weight : 500;
            font-size   : 18px;
            line-height : 30px;
            text-align  : center;
        }

        .link {
            color : $primary;

            &:hover {
                color : $primary-darken;
            }
        }
    }
}

</style>
