class VolumeServiceError extends Error {
    constructor(m: string) {
        super(m);
        this.name = "VolumeServiceError";
    }
}
export default VolumeServiceError;