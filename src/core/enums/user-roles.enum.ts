export enum UserRoles {
    ADMIN = 'Admin',
    USER = 'User',


}


/* less priority number means higher priority */
const getRolePriority = (role: UserRoles): number | undefined => {
    switch (role) {
        case UserRoles.ADMIN:
            return 1;
        default:
            return undefined;
    }
}

export const isRoleAllowed = (userRole: UserRoles, role: UserRoles): boolean => {
    

    const userRolePriority = getRolePriority(userRole);
    const rolePriority = getRolePriority(role);

    if (rolePriority === undefined) return true;
    if (userRolePriority === undefined) return false;

    return userRolePriority <= rolePriority;

}