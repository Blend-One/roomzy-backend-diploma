import { Injectable } from '@nestjs/common';
import { NCA_NODE_ROUTES } from '../routes/nca-node.routes';

@Injectable()
export class NcaNodeService {
    private COMMON_PROPS = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };

    public async verifyCms(cms: string, data: string) {
        return fetch(`${NCA_NODE_ROUTES.DEFAULT}${NCA_NODE_ROUTES.VERIFY}`, {
            ...this.COMMON_PROPS,
            body: JSON.stringify({ revocationCheck: ['OCSP'], cms, data }),
        });
    }

    public async extractCms(cms: string) {
        return fetch(`${NCA_NODE_ROUTES.DEFAULT}${NCA_NODE_ROUTES.EXTRACT}`, {
            ...this.COMMON_PROPS,
            body: JSON.stringify({ cms }),
        });
    }
}
