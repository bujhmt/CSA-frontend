<template>
    <TemplateRoot>
        <Breadcrumbs :links="breadcrumbs"/>
        <FormGroup>
            <TextInput
                placeholder="ПIБ"
                input-key="name"
                :validators="validationSchema.name.validators"
                @value="handleInput"
            />
            <TextInput
                placeholder="Запис №"
                input-key="record"
                :validators="validationSchema.record.validators"
                @value="handleInput"
            />
            <TextInput
                placeholder="ІПН"
                input-key="taxpayerIdentificationNumber"
                :validators="validationSchema.taxpayerIdentificationNumber.validators"
                @value="handleInput"
            />
            <TextInput
                placeholder="Документ №"
                input-key="document"
                :validators="validationSchema.document.validators"
                @value="handleInput"
            />
        </FormGroup>
        <FormGroup class="files-form-group">
            <FilesInput label="Документи, що підтверджують родинні стосунки" @files="addFiles"/>
            <FilesInput label="Довіреності на дітей" @files="addFiles"/>
            <FilesInput label="Документи, що підтверджують сімейні стосунки" @files="addFiles"/>
            <FilesInput label="Відомості про кадастрові номери земельної ділянки спадкодавця та
суміжної земельної ділянки" @files="addFiles"/>
            <FilesInput label="Договори особистого страхування життя" @files="addFiles"/>
            <FilesInput label="Документи,
            що підтверджують право на спадкування або спадкові договори" @files="addFiles"/>
            <FilesInput label="Відповідні договори або інші документи, що згідно із законодавством
підтверджують наявність заборгованості померлої особи" @files="addFiles"/>
        </FormGroup>
        <Btn
            label="Додати"
            class="button"
            :disabled="!files.length"
            @click="handleSubmit"
        />
    </TemplateRoot>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import TemplateRoot from '@/components/common/template-root.vue';
import Breadcrumbs from '@/components/common/breadcrumbs.vue';
import {BreadcrumbLink} from '@/interfaces/breadcrumbs-link';
import FormGroup from '@/components/block/form-group.vue';
import TextInput from '@/components/forms/text-input.vue';
import FilesInput from '@/components/forms/files-input.vue';
import Btn from '@/components/block/btn.vue';
import {ValidationInput} from '@/interfaces/validation-input';
import axios, {$post} from '@/plugins/axios';
import {Answer} from '@/interfaces/answer';
import {IssuedDocument} from '@/interfaces/models/issued-document';

export default defineComponent({
    name: 'ProfileView',
    components: {
        FilesInput,
        TextInput,
        FormGroup,
        Breadcrumbs,
        TemplateRoot,
        Btn,
    },
    data() {
        const breadcrumbs: BreadcrumbLink[] = [
            {
                text: 'Головна',
                url: '/',
            },
            {
                text: 'Профіль',
                url: this.$route.path,
            },
        ];

        return {
            breadcrumbs,
            files: [] as File[],
            validationSchema: {
                name: {
                    value: '',
                    validators: [
                        (value) => value.length > 7,
                        (value) => value.split(' ').length === 3,
                    ],
                },
                record: {
                    value: '',
                    validators: [
                        (value) => value.length === 14,
                        (value) => value.includes('-') && value.indexOf('-') === 8,
                        (value) => value.match(/^[0-9]*-?[0-9]*$/),
                    ],
                },
                document: {
                    value: '',
                    validators: [
                        (value) => value.length === 9,
                        (value) => value.match(/^[0-9]*$/),
                    ],
                },
                taxpayerIdentificationNumber: {
                    value: '',
                    validators: [
                        (value) => value.length === 10,
                        (value) => value.match(/^[0-9]*$/),
                    ],
                },
            } as Record<string, ValidationInput<string>>,
        };
    },
    methods: {
        addFiles(files: FileList) {
            // eslint-disable-next-line no-restricted-syntax
            for (const file of files) {
                if (!this.files.find(({name}) => file.name === name)) {
                    this.files.push(file);
                }
            }
        },
        handleInput(valueSchema: Record<string, string>): void {
            if (valueSchema) {
                const [key, value] = Object.entries(valueSchema)[0];
                this.validationSchema[key].value = value;
            }
        },
        handleSubmit(): void {
            const userData = Object.entries(this.validationSchema)
                .reduce<Record<string, string>>((acc, [key, field]) => {
                    acc[key] = field.value;
                    return acc;
                }, {});
            const formData = new FormData();
            this.files.forEach((file) => formData.append('files', file));
            fetch('http://localhost:3000/user/addDocs/files', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${this.$store.getters['auth/userToken']}`,
                },
            }).then((res) => {
                console.log(res.json());
            });
            axios.post<{id: TemplateStringsArray}>('/user/addDocs/info', userData, {
                headers: {
                    Authorization: `Bearer ${this.$store.getters['auth/userToken']}`,
                },
            }).then((answer) => {
                if (answer.data?.id) {
                    this.$router.push({path: '/'});
                }
            });
        },
    },
});

</script>

<style scoped lang="scss">

::v-deep .files-form-group {
    margin-top : 30px;
}

.button {
    width     : 100%;
    max-width : 300px;
    margin    : 40px auto;
}

</style>
