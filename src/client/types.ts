import {
    CrawlJobInventoryListResponse,
    Response,
    SearchRequest,
    SearchResponse,
} from '../domain';

export type ClientConfigurations = {
    url: string;
};

export interface DriflyteClient {
    listJobInventory(): Promise<Response<CrawlJobInventoryListResponse>>;
    search(request: SearchRequest): Promise<Response<SearchResponse>>;
}
