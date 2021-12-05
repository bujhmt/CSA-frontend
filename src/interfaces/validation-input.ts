import {Validator} from '@/interfaces/types/validator';

export interface ValidationInput<T> {
    value: T,
    validators: Validator<T>[],
}
