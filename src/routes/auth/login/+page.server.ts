import { fail, redirect, type Actions } from '@sveltejs/kit';
import { turso } from '../../api/turso.server';
import { lucia } from '$lib/server/auth';
import { verify } from '@node-rs/argon2';
import toast from 'svelte-french-toast';

type User = {
	id: string;
	username: string;
	password_hash: string;
};

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

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

		try {
			const userFromDB = await turso.execute({
				sql: 'SELECT * FROM user WHERE username = ?',
				args: [username.toLowerCase()]
			});
			const existingUser = userFromDB.rows as unknown as User[] | [];
			const isUserExist = existingUser[0]?.username === username.toLowerCase();
			if (!isUserExist) {
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}

			const validPassword = await verify(existingUser[0]?.password_hash, password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			if (!validPassword) {
				toast.error('incorent username');
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}

			const session = await lucia.createSession(existingUser[0]?.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (error: any) {
			return fail(400, {
				message: error.message
			});
		}

		redirect(302, '/');
	}
} satisfies Actions;
