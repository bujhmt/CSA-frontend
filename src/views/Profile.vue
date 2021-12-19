<template>
    <TemplateRoot>
        <Breadcrumbs :links="breadcrumbs"/>
        <FormGroup class="text-form-group">
            <TextInput placeholder="ПIБ"/>
            <TextInput placeholder="Номер та серія паспорта"/>
            <TextInput placeholder="ІПН"/>
        </FormGroup>
        <FormGroup class="file-form-group">
            <FilesInput label="Документи, що підтверджують родинні стосунки"/>
        </FormGroup>
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

export default defineComponent({
    name: 'ProfileView',
    components: {
        FilesInput,
        TextInput,
        FormGroup,
        Breadcrumbs,
        TemplateRoot,
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
        };
    },
});

</script>

<style scoped lang="scss">
.text-form-group {
    margin-top : 20px;
}

.file-form-group {
    margin-top : 50px;
}

</style>
