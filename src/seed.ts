import { models, sequelize } from './db/index'
import {EXERCISE_DIFFICULTY, USER_ROLE} from './utils/enums'

const {Exercise, Program, User} = models


const seedDB = async () => {
	await sequelize.sync({ force: true })

	await Program.bulkCreate([{
		name: 'Program 1'
	}, {
		name: 'Program 2'
	}, {
		name: 'Program 3'
	}] as any[], { returning: true })

	await Exercise.bulkCreate([{
		name: 'Exercise 1',
		difficulty: EXERCISE_DIFFICULTY.EASY,
		programID: 1
	}, {
		name: 'Exercise 2',
		difficulty: EXERCISE_DIFFICULTY.EASY,
		programID: 2
	}, {
		name: 'Exercise 3',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		programID: 1
	}, {
		name: 'Exercise 4',
		difficulty: EXERCISE_DIFFICULTY.MEDIUM,
		programID: 2
	}, {
		name: 'Exercise 5',
		difficulty: EXERCISE_DIFFICULTY.HARD,
		programID: 1
	}, {
		name: 'Exercise 6',
		difficulty: EXERCISE_DIFFICULTY.HARD,
		programID: 2
	}])

	await User.bulkCreate([{
		name: 'Matej',
		surname: 'Kormanik',
        nickName: 'kormamat',
        email: 'kormamat@example.com',
        age: 30,
        role: USER_ROLE.ADMIN,
		password: '$2a$12$B7PYexaNIHOpZig7yV6VY.nFPupKulBuMzPJaQuvTFlDoyi0PvYFi' // pesmacka
	}, {
		name: 'Ferko',
		surname: 'Mrkvicka',
		nickName: 'mrkva',
		email: 'mrkva@example.com',
		age: 28,
		role: USER_ROLE.USER,
		password: '$2a$12$B7PYexaNIHOpZig7yV6VY.nFPupKulBuMzPJaQuvTFlDoyi0PvYFi' // pesmacka
	}])
}

seedDB().then(() => {
	console.log('DB seed done')
	process.exit(0)
}).catch((err) => {
	console.error('error in seed, check your data and model \n \n', err)
	process.exit(1)
})
