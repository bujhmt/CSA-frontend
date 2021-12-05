export default function getEnv<T>(variable: string): T | undefined {
    return process.env?.[variable];
}
