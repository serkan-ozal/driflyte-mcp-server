import {
    CrawlJobInventoryListResponse,
    Response,
    SearchRequest,
    SearchResponse,
} from '../domain';
import { ClientConfigurations, DriflyteClient } from './types';

import axios, { AxiosResponse } from 'axios';

export class DriflyteHttpClient implements DriflyteClient {
    private readonly url: string;

    constructor(clientConfigurations: ClientConfigurations) {
        this.url = clientConfigurations.url;
    }

    private async _get<R>(path: string, params?: any): Promise<R> {
        const response: AxiosResponse = await axios.get(`${this.url}/${path}`, {
            params,
            headers: {},
        });
        if (response.status != 200) {
            throw new Error(
                `Request failed with status code ${response.status}`
            );
        }
        return response.data as R;
    }

    private async _post<R>(path: string, body: any): Promise<R> {
        const response: AxiosResponse = await axios.post(
            `${this.url}/${path}`,
            body,
            {
                headers: {},
            }
        );
        if (response.status != 200) {
            throw new Error(
                `Request failed with status code ${response.status}`
            );
        }
        return response.data as R;
    }

    private _handleError<R>(err: any): R {
        throw err;
    }

    async listJobInventory(): Promise<Response<CrawlJobInventoryListResponse>> {
        try {
            const httpResponse: any = await this._get('/api/jobs/inventory');
            return httpResponse as Response<CrawlJobInventoryListResponse>;
        } catch (err: any) {
            return this._handleError(err);
        }
    }

    async search(request: SearchRequest): Promise<Response<SearchResponse>> {
        try {
            const httpResponse: any = await this._post('/api/search', request);
            return httpResponse as Response<SearchResponse>;
        } catch (err: any) {
            return this._handleError(err);
        }
    }
}
