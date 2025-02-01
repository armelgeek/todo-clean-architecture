import { Todo } from '@/core/domain/entities/todo.entity';
import { TodoRepositoryInterface } from '../../repositories/todo.repository.interface';

export interface UpdateTodoUseCase {
	execute(params: UpdateTodoUseCase.Params): Promise<UpdateTodoUseCase.Result>;
}

export namespace UpdateTodoUseCase {
	export type Params = Todo.UpdateTodoDto;
	export type Result = Todo.UpdateTodoResponse;
}

export class UpdateTodo implements UpdateTodoUseCase {
	constructor(private readonly todoRepository: TodoRepositoryInterface) { }

	async execute(params: UpdateTodoUseCase.Params): Promise<UpdateTodoUseCase.Result> {
		return this.todoRepository.updateTodo(params);
	}
}
