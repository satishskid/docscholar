import { auth } from '@/lib/firebase';

/**
 * Retrieves the current user's Firebase ID Token.
 * This token is used to authenticate requests to the backend.
 */
export async function getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    // forceRefresh: true can be used if needed, but default false is usually fine.
    return user.getIdToken();
}
