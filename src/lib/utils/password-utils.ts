export class PasswordUtils {
    static checkComplexity(password: string) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasNonalphas = /\W/.test(password);
        const complexityLevel = [
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasNonalphas,
        ].filter(n => n === true);
        return password.length < 8 || complexityLevel.length < 2;
    }
}
