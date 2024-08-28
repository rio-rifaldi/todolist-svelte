import { fail, redirect, type Actions } from '@sveltejs/kit';

import { generateIdFromEntropySize } from 'lucia';
import { turso } from '../../api/turso.server';
import { lucia } from '$lib/server/auth';
import { hash } from '@node-rs/argon2';

export const actions = {
	default: async ({ request, cookies }) => {
		const { username, password } = Object.fromEntries(await request.formData());

		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		const userId = generateIdFromEntropySize(16);
		try {
			const passwordHash = await hash(password, {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			const isUserAvaliable = await turso.execute({
				sql: 'SELECT username FROM user WHERE username = ?',
				args: [username]
			});
			if (isUserAvaliable.rows[0]?.username === username) {
				return fail(400, {
					message: 'User already exists'
				});
			}

			const insertUser = await turso.execute({
				sql: 'INSERT INTO user VALUES (?,?,?)',
				args: [userId, username, passwordHash]
			});

			if (insertUser.rowsAffected >= 1) {
				const session = await lucia.createSession(userId, {});
				const sessionCookie = lucia.createSessionCookie(session.id);
				cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
			}
		} catch (error: any) {
			return fail(400, {
				message: error.message
			});
		}
		redirect(302, '/');
	}
} satisfies Actions;
