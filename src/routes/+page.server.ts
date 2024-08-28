import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { turso } from './api/turso.server.js';
import { randomId } from '$lib/utils/RandomId.js';
import { lucia } from '$lib/server/auth.js';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.session?.userId;
	if (!userId) {
		return {
			todos: []
		};
	}
	try {
		const res = await turso.execute({
			sql: 'SELECT * FROM todo_list WHERE owner = ?',
			args: [userId]
		});
		if (res.rows) {
			return {
				todos: res.rows
			};
		}
	} catch (error) {
		console.log(error);
	}

	return;
};

export const actions = {
	create: async ({ request, locals, platform }) => {
		const data = await request.formData();
		const input = String(data.get('todo'));
		const dateNow = new Date(Date.now());
		const userId = locals.session?.userId;
		if (!userId) {
			return fail(422, {
				error: 'un authorized'
			});
		}

		if (input === '') {
			return fail(422, {
				description: data.get('todo'),
				error: 'input must be provided'
			});
		}
		try {
			await turso.execute(
				'CREATE TABLE IF NOT EXISTS todo_list(id VARCHAR(100) NOT NULL, todo VARCHAR(255) NOT NULL, isChecked BOOLEAN NOT NULL, createdAt DATE NOT NULL, updatedAt DATE NOT NULL, owner TEXT NOT NULL, FOREIGN KEY (owner) REFERENCES user (id) )'
			);
			await turso.execute({
				sql: 'INSERT INTO todo_list VALUES(?,?,?,?,?,?)',
				args: [randomId(), input, false, dateNow, dateNow, userId]
			});
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
	},
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/');
	}
};
