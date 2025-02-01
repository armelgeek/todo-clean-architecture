import { TodoController } from '../controllers/todo.controller';

export type ServiceType = {
	todo: TodoController;
};

export class ServiceRegistry {
	private static instances = new Map<keyof ServiceType, any>();
	private static factories = new Map<keyof ServiceType, () => any>();

	static initialize() {
		this.factories.set('todo', () => new TodoController());

	}

	static get<K extends keyof ServiceType>(key: K): ServiceType[K] {
		if (!this.instances.has(key)) {
			const factory = this.factories.get(key);
			if (!factory) {
				throw new Error(`No factory registered for service: ${String(key)}`);
			}
			this.instances.set(key, factory());
		}
		return this.instances.get(key);
	}

	static reset() {
		this.instances.clear();
	}
}
