module.exports = class RegCodeDto {
    email;
    expiresIn;
    isConfirmed;

    static fromModel(model) {
        const dto = new RegCodeDto();
        dto.email = model.email;
        dto.expiresIn = model.expiresIn;
        dto.isConfirmed = model.isConfirmed;

        return dto;
    }

    static fromArray(array) {
        const { email, expiresIn, isConfirmed } = array[0];
        const dto = new RegCodeDto();
        dto.email = email;
        dto.expiresIn = expiresIn;
        dto.isConfirmed = isConfirmed;

        return dto;
    }
}