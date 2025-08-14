export interface Response<R> {
    response?: R | undefined;
    error?:
        | {
              type: string;
              message: string;
          }
        | undefined;
}

export interface CrawlJobInventory {
    topics: string[];
    urls: string[];
}

export interface CrawlJobInventoryListResponse {
    jobInventory: CrawlJobInventory;
}

export interface SearchedDocument {
    content: string;
    metadata: Record<string, any>;
    score: number;
    id?: string;
}

export interface SearchResponse {
    documents: SearchedDocument[];
}
