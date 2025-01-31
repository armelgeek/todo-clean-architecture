"use client";
import { createContext, useContext } from 'react';
import { CreateTodoService } from '@/core/application/services/todo/create-todo.service';

interface Services {
    createTodoService: CreateTodoService;
}

const TodoServiceContext = createContext<Services | null>(null);

export const TodoServiceProvider = ({ children }: { children: React.ReactNode }) => {
    const services: Services = {
        createTodoService: new CreateTodoService(),
    };

    return (
        <TodoServiceContext.Provider value={services}>
            {children}
        </TodoServiceContext.Provider>
    );
};

export const useTodoService = () => {
    const context = useContext(TodoServiceContext);
    if (!context) {
        throw new Error('useTodoService must be used within TodoServiceProvider');
    }
    return context;
};
