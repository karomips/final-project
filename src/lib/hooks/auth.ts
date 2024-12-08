// src/lib/hooks/auth.ts
import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (
                    credentials?.username === 'test' &&
                    credentials?.password === 'password'
                ) {
                    return { id: '1', email: 'test@gmail.com', name: 'Name Test' };
                } else {
                    return null;
                }
            },
        }),
    ],
    secret: "random12309909ao090a90d"
});