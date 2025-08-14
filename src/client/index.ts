import { DriflyteHttpClient } from './driflyte-http-client';
import { ClientConfigurations, DriflyteClient } from './types';

export { DriflyteClient };

export function createClient(
    clientConfigurations: ClientConfigurations
): DriflyteClient {
    return new DriflyteHttpClient(clientConfigurations);
}
