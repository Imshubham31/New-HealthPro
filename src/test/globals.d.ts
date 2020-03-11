declare namespace NodeJS {
    interface Global {
        configureTestSuite: (
            configureAction?: (() => void) | undefined,
        ) => void;
    }
}

declare const configureTestSuite: (
    configureAction?: (() => void) | undefined,
) => void;
