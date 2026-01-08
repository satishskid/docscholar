"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    googleAccessToken: string | null;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    googleAccessToken: null,
    signInWithGoogle: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('google_access_token');
        if (storedToken) setGoogleAccessToken(storedToken);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            if (token) {
                setGoogleAccessToken(token);
                localStorage.setItem('google_access_token', token);
            }
        } catch (error: any) {
            console.error("Error signing in with Google", error);
            // Alert the user so they see it
            alert(`Sign-in failed: ${error.message}`);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setGoogleAccessToken(null);
            localStorage.removeItem('google_access_token');
        } catch (error) {
            console.error("Error signing out", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, googleAccessToken, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
