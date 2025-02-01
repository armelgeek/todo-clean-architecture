import { Todo } from '@/core/domain/entities/todo.entity';
import { TodoRepositoryInterface } from '../../repositories/todo.repository.interface';

export interface DeleteTodoUseCase {
	execute(params: DeleteTodoUseCase.Params): Promise<DeleteTodoUseCase.Result>;
}

export namespace DeleteTodoUseCase {
	export type Params = Todo.DeleteTodoDto;
	export type Result = Todo.DeleteTodoResponse;
}

export class DeleteTodo implements DeleteTodoUseCase {
	constructor(private readonly todoRepository: TodoRepositoryInterface) { }

	async execute(params: DeleteTodoUseCase.Params): Promise<DeleteTodoUseCase.Result> {
		return this.todoRepository.deleteTodo(params);
	}
}
