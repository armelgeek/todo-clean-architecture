import { mockTodoApi } from './mocks/todo.mock';
import { TodoRepository } from '../repository/todo.repository';
import { Todo } from '../../domain/entities/todo.entity';
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';

describe('TodoRepository', () => {
	let todoRepository: TodoRepository;

	beforeEach(() => {
		todoRepository = new TodoRepository();
	});

	afterEach(() => {
		mockTodoApi.cleanUp();
	});

	describe('createTodo', () => {
		it('should create a todo successfully', async () => {
			const createTodoDto: Todo.CreateTodoDto = {
				title: 'Test Todo',
				description: 'Test Description'
			};
			const mockScope = mockTodoApi.mockCreateTodo();
			const result = await todoRepository.createTodo(createTodoDto);
			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();
			const todoEntity = Todo.toEntity(result.data as unknown as Todo.ApiResponse);
			expect(todoEntity).toEqual(
				expect.objectContaining({
					title: createTodoDto.title,
					description: createTodoDto.description
				})
			);
			expect(mockScope.isDone()).toBe(true);
		});

		it('should handle creation error', async () => {
			const createTodoDto: Todo.CreateTodoDto = {
				title: 'Test Todo',
				description: 'Test Description'
			};
			const mockScope = mockTodoApi.mockCreateTodoError();
			const result = await todoRepository.createTodo(createTodoDto);
			expect(result.success).toBe(false);
			expect(result.error).toBe('Invalid todo data');
			expect(result.data).toBeNull();
			expect(mockScope.isDone()).toBe(true);
		});
	});
});
