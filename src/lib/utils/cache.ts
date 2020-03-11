export class Cache {
    private expiresIn = 0;

    constructor(private expirationTime = 60 * 1000) {}

    get isExpired() {
        return this.expiresIn < Date.now();
    }

    updated() {
        this.expiresIn = Date.now() + this.expirationTime;
    }
}
