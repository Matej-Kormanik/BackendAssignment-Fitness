// eslint-disable-next-line
export enum EXERCISE_DIFFICULTY {
	EASY = 'EASY',
	MEDIUM = 'MEDIUM',
	HARD = 'HARD'
}

export enum USER_ROLE {
	ADMIN = 'ADMIN',
    USER = 'USER'
}

export enum MESSAGE {
	EXERCISE_LIST = 'exercise_list',
	EXERCISE_CREATED = 'exercise_created',
	EXERCISE_UPDATED = 'exercise_updated',
	EXERCISE_DELETED = 'exercise_deleted',
	EXERCISE_NOT_FOUND = 'exercise_not_found',
	EXERCISE_COMPLETED = "exercise_completed",

	USER_NOT_FOUND= "user_not_found",
	INVALID_PWD= "incorrect_password",
	USER_LOGGED= "user_logged_in",
	USER_CREATED = "user_created",
	USER_UPDATED = "user_updated",
	USER_LIST = "user_list",
}
