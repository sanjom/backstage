/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { JWK, JWT } from 'jose';
import { Config } from '@backstage/config';
import { TokenManager } from './types';
import { IdentityClient } from '../identity';
import { PluginEndpointDiscovery } from '../discovery';

// TODO: (b2b-auth) rename this class
export class AuthIdentityTokenManager implements TokenManager {
  private identityClient: IdentityClient;
  private key?: JWK.OctKey;

  constructor(discovery: PluginEndpointDiscovery, config: Config) {
    this.identityClient = new IdentityClient({
      discovery: discovery,
      issuer: 'auth-identity-token-manager',
    });

    const secret = config.getOptionalString('backend.auth.secret');
    if (secret) {
      this.key = JWK.asKey({ kty: 'oct', k: secret });
    }
  }

  async getServerToken(): Promise<{ token: string }> {
    if (!this.key) {
      throw new Error('No server token defined in config');
    }

    const jwt = JWT.sign({ sub: 'backstage-server' }, this.key, {
      algorithm: 'HS256',
    });
    return { token: jwt };
  }

  // TODO: (b2b-auth) authenticate returns a Backstage Identity
  // need to figure out what to return after validating a server token
  async validateToken(token: string): Promise<void> {
    let maybeUser;
    let maybeServer;
    try {
      maybeUser = await this.identityClient.authenticate(token);
    } catch (error) {
      // invalid token
    }

    try {
      if (!this.key) {
        throw new Error('No server token defined in config');
      }
      maybeServer = JWT.verify(token, this.key);
    } catch (error) {
      // invalid token
    }

    if (!maybeUser && !maybeServer) {
      throw new Error(`Invalid token`);
    }
    return;
  }
}
