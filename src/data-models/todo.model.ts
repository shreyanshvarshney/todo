export interface Todo {
    id: string;
    title: string;
    content: string;
    dateCreated: Date;
    dateUpdated: Date;
    updated: boolean;
    imagePath: string;
    userId: string;
}