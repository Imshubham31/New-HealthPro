export interface EnvVars {
    production: boolean;
    baseUrl: string;
    hcpClientId: string;
    serviceWorkerEnabled: boolean;
    canRefresh?: boolean;
}
