module.exports = class UserDto {
    id;
    email;
    isActivated;
    role;

    static fromModel(model) {
        const dto = new UserDto();
        dto.id = model.id;
        dto.email = model.email;
        dto.role = model.role;
        dto.isActivated = model.isActivated;

        return dto;
    }

    static fromArray(array) {
        const { id, email, role, isActivated } = array[0];
        const dto = new UserDto();
        dto.id = id;
        dto.email = email;
        dto.role = role;
        dto.isActivated = isActivated;

        return dto;
    }
}