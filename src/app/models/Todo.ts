export interface Todo {
    todoId?: number;
    todoText: string;
    isComplete?: boolean;
    category: {
        categoryId?: number;
        categoryName?: string;
        colorCode?: string;
        todoCount?: number;
    }
}