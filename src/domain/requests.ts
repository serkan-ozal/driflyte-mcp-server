export interface SearchRequest {
    topics: string[];
    query: string;
    topK?: number | undefined;
}
