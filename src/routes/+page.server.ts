// import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '$env/static/private';
// import { createClient } from '@libsql/client';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { turso } from './api/turso.server.js';
import { randomId } from '$lib/utils/RandomId.js';

let todos = [
	{
		createdAt: new Date(Date.now()),
		id: '3944969628572214',
		isChecked: 0,
		todo: 'jhjh',
		updatedAt: new Date(Date.now())
	},
	{
		createdAt: new Date(Date.now()),
		id: '3944769728572214',
		isChecked: 0,
		todo: 'jhj1',
		updatedAt: new Date(Date.now())
	},
	{
		createdAt: new Date(Date.now()),
		id: '3944969798572214',
		isChecked: 0,
		todo: 'jhj2',
		updatedAt: new Date(Date.now())
	},
	{
		createdAt: new Date(Date.now()),
		id: '3944269728572214',
		isChecked: 0,
		todo: 'jhj3',
		updatedAt: new Date(Date.now())
	}
];

export const load: PageServerLoad = async () => {
	try {
		const res = await turso.execute('SELECT * FROM todo_list');
		if (res.rows) {
			return {
				todos: res.rows
			};
		}
	} catch (error) {
		console.log(error);
	}
	console.count('running ');
	return;
};

export const actions = {
	create: async ({ request, locals, platform }) => {
		const data = await request.formData();
		const input = String(data.get('todo'));
		const dateNow = new Date(Date.now());

		if (input === '') {
			return fail(422, {
				description: data.get('todo'),
				error: 'input must be provided'
			});
		}
		try {
			await turso.execute(
				'CREATE TABLE IF NOT EXISTS todo_list(id VARCHAR(100), todo VARCHAR(255), isChecked BOOLEAN, createdAt DATE, updatedAt DATE )'
			);
			await turso.execute({
				sql: 'INSERT INTO todo_list VALUES(?,?,?,?,?)',
				args: [randomId(), input, false, dateNow, dateNow]
			});
			// todos.push({
			// 	createdAt: dateNow,
			// 	updatedAt: dateNow,
			// 	todo: input,
			// 	isChecked: 0,
			// 	id: Math.random().toString().substring(2)
			// });
		} catch (error: any) {
			return fail(422, {
				description: data.get('todo'),
				error: error.message
			});
		}
	},
	delete: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		const input = String(data.id);
		try {
			await turso.execute({
				sql: 'DELETE FROM todo_list WHERE id=?',
				args: [input]
			});
		} catch (error: any) {
			return fail(422, {
				error: error.message
			});
		}
	},
	deleteAll: async () => {
		try {
			await turso.execute('DELETE FROM todo_list;');
		} catch (error: any) {
			return fail(422, {
				error: error.message
			});
		}
	},
	check: async ({ request }) => {
		const res = await request.formData();
		const input = res.get('checkId');

		try {
			const result = await turso.execute({
				sql: 'UPDATE todo_list SET isChecked = NOT isChecked WHERE id = ?;',
				args: [String(input)]
			});
		} catch (error: any) {
			return fail(422, {
				error: error.message
			});
		}
	},
	update: async ({ request }) => {
		const res = await request.formData();
		const input = String(res.get('todo-edit'));
		const id = String(res.get('todo-id'));
		const dateNow = new Date(Date.now());

		try {
			const result = await turso.execute({
				sql: 'UPDATE todo_list SET todo = ?, updatedAt = ? WHERE id = ?;',
				args: [input, dateNow, id]
			});
		} catch (error: any) {
			return fail(422, {
				error: error.message
			});
		}
	}
};
