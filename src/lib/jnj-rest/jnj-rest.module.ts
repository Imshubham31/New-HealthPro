import { NgModule, InjectionToken, Injector } from '@angular/core';
interface JnJRestConfigOptionals {
    modificationHeader?: string;
}

export interface JnJRestConfig extends JnJRestConfigOptionals {
    baseUrl: string;
}

export const ConfigService = new InjectionToken<JnJRestConfig>(
    'ConfigService (JnJRestConfig)',
);
@NgModule()
export class JnJRestModule {
    public static injector: Injector;
    constructor(injector: Injector) {
        JnJRestModule.injector = injector;
    }
    static init(config: JnJRestConfig) {
        return {
            ngModule: JnJRestModule,
            providers: [
                {
                    provide: ConfigService,
                    useValue: Object.assign<
                        JnJRestConfigOptionals,
                        JnJRestConfig
                    >(
                        {
                            modificationHeader: 'GxP-Modification-Reason',
                        },
                        config,
                    ),
                },
            ],
        };
    }
}
