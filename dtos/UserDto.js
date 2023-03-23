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
        dto.displayName = model.displayName;
        dto.location = model.location;
        dto.notifyAboutProductUpdates = model.notifyAboutProductUpdates;
        dto.notifyAboutMarketNewsletter = model.notifyAboutMarketNewsletter;
        dto.notifyAboutComments = model.notifyAboutComments;
        dto.notifyAboutPurchases = model.notifyAboutPurchases;
        dto.originalImagePath = model.imagePath;
        dto.imagePath = process.env.API_URL + model.imagePath;

        return dto;
    }

    static fromArray(array) {
        const {
            id,
            email,
            role,
            isActivated,
            displayName,
            location,
            notifyAboutProductUpdates,
            notifyAboutMarketNewsletter,
            notifyAboutComments,
            notifyAboutPurchases,
            imagePath
        } = array[0];

        const dto = new UserDto();
        dto.id = id;
        dto.email = email;
        dto.role = role;
        dto.isActivated = isActivated;
        dto.displayName = displayName;
        dto.location = location;
        dto.notifyAboutProductUpdates = notifyAboutProductUpdates;
        dto.notifyAboutMarketNewsletter = notifyAboutMarketNewsletter;
        dto.notifyAboutComments = notifyAboutComments;
        dto.notifyAboutPurchases = notifyAboutPurchases;
        dto.originalImagePath = imagePath;
        dto.imagePath = process.env.API_URL + imagePath;

        return dto;
    }
}