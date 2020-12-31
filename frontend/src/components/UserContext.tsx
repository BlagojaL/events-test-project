import React, { createContext } from 'react';

type UserContextType = {
    token: string;
    userId: string;
    logout: () => void;
    login: (token: string | null, userId: string | null) => void;
}

export const UserContext = createContext<UserContextType>({
    token: '',
    userId: '',
    login: () => {},
    logout: () => {},
});