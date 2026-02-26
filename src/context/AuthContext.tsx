import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';


//types
interface Usuario {
    id: number;
    email: string;
    nome: string;
    tipo: 'admin' | 'cliente';
    empresaId?: number;
}

interface AuthContextType {
    user: Usuario | null;
    login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    loading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

// creating context

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(false);


    //Recuperar usuario do localStorage ao iniciar

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []); // ← Array vazio = roda UMA vez

    async function login(email: string, senha: string) {
        setLoading(true);
        try {
            // 1. Busca TODOS os usuários (sem filtro)
            const response = await api.get('/usuarios');

            console.log('Todos usuários do banco:', response.data);

            // 2. Filtra manualmente no JavaScript
            const usuario = response.data.find(
                (u: any) => u.email === email && u.senha === senha
            );

            console.log('Usuário encontrado:', usuario);

            if (usuario) {
                const token = `fake-token-${usuario.id}`;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(usuario));
                setUser(usuario);
                return { success: true };
            } else {
                return { success: false, error: 'Email ou senha inválidos' };
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            return { success: false, error: 'Erro ao fazer login' };
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

//hook personalizado

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
}