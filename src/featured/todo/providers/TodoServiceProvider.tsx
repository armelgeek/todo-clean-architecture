"use client";
import { createContext, useContext } from 'react';
import { CreateTodoService } from '@/core/application/services/todo/create-todo.service';
import { GetTodosService } from '@/core/application/services/todo/get-todos.service';
import { UpdateTodoService } from '@/core/application/services/todo/update-todo.service';
import { DeleteTodoService } from '@/core/application/services/todo/delete-todo.service';

interface TodoServices {
	createTodoService: CreateTodoService;
	getTodosService: GetTodosService;
	updateTodoService: UpdateTodoService;
	deleteTodoService: DeleteTodoService;
}

const TodoServiceContext = createContext<TodoServices | null>(null);

export const TodoServiceProvider = ({ children }: { children: React.ReactNode }) => {
	const services: TodoServices = {
		createTodoService: new CreateTodoService(),
		getTodosService: new GetTodosService(),
		updateTodoService: new UpdateTodoService(),
		deleteTodoService: new DeleteTodoService()
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
