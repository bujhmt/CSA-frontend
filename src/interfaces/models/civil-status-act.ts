export interface CivilStatusAct {
    isActive: boolean;
    actType: {
        typeName: string;
    };
    data?: Record<string, string>;
}
