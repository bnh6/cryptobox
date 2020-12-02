class PasswordServiceError extends Error {
    constructor(m: string) {
        super(m);
        this.name = "PasswordServiceError";
    }
}
export default PasswordServiceError;