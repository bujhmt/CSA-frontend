export type Validator<T> = (value: T) => boolean | RegExpMatchArray | null;
