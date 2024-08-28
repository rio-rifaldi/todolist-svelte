import { BetterSqlite3Adapter, LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import { Lucia } from 'lucia';
import { turso } from '../../routes/api/turso.server';
import { dev } from '$app/environment';

const adapter = new LibSQLAdapter(turso, {
	user: 'user',
	session: 'session'
});
export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

// IMPORTANT!
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
interface DatabaseUserAttributes {
	username: string;
}
/* 
SQL command


CREATE TABLE user (
    id TEXT NOT NULL PRIMARY KEY
    username VARCHAR (100) NOT NULL 
    password_hash TEXT NOT NULL 
)

CREATE TABLE session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
)



*/
