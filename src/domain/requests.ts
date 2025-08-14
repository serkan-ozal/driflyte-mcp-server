export interface SearchRequest {
    topics: string[];
    question: string;
    topK?: number | undefined;
}
