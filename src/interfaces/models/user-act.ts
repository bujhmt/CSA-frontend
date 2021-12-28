export interface UserAct {
    isActive: boolean;
    actType: {typeName: string};
    data: Record<string, string>;
}
