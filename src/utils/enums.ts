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
	PROGRAM_LIST = "program_list",

	USER_NOT_FOUND= "user_not_found",
	USER_LOGGED= "user_logged_in",
	USER_CREATED = "user_created",
	USER_UPDATED = "user_updated",
	USER_LIST = "user_list",
	ALREADY_EXIST = "email_already_exists",

	INVALID_PWD= "incorrect_password",
	INVALID_INPUT = "invalid_input",

	SMTH_WENT_WRONG = "smth_wrong",
	NOT_AUTHENTICATED = "not_authenticated",
	NOT_AUTHORIZED = "not_authorized"
}
