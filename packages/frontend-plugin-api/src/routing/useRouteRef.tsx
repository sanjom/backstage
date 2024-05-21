/*
 * Copyright 2020 The Backstage Authors
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

import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AnyRouteRefParams } from './types';
import { RouteRef } from './RouteRef';
import { SubRouteRef } from './SubRouteRef';
import { ExternalRouteRef } from './ExternalRouteRef';
import { RouteFunc, routeResolutionApiRef, useApi } from '../apis';

/**
 * Returns a function that can be used to resolve a route ref to a URL.
 * @public
 */
export function useRouteRefResolver<TParams extends AnyRouteRefParams>() {
  const { pathname } = useLocation();
  const routeResolutionApi = useApi(routeResolutionApiRef);

  return useCallback(
    (
      routeRef?:
        | RouteRef<TParams>
        | SubRouteRef<TParams>
        | ExternalRouteRef<TParams, any>,
    ): RouteFunc<TParams> | undefined => {
      if (!routeRef) return undefined;

      const routeFunc = routeResolutionApi.resolve(routeRef, {
        sourcePath: pathname,
      });

      const isOptional = 'optional' in routeRef && routeRef.optional;

      if (!routeFunc && !isOptional) {
        throw new Error(`No path for ${routeRef}`);
      }

      return routeFunc;
    },
    [routeResolutionApi, pathname],
  );
}

/**
 * React hook for constructing URLs to routes.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}
 *
 * @param routeRef - The ref to route that should be converted to URL.
 * @returns A function that will in turn return the concrete URL of the `routeRef`.
 * @public
 */
export function useRouteRef<
  TOptional extends boolean,
  TParams extends AnyRouteRefParams,
>(
  routeRef: ExternalRouteRef<TParams, TOptional>,
): TOptional extends true ? RouteFunc<TParams> | undefined : RouteFunc<TParams>;

/**
 * React hook for constructing URLs to routes.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}
 *
 * @param routeRef - The ref to route that should be converted to URL.
 * @returns A function that will in turn return the concrete URL of the `routeRef`.
 * @public
 */
export function useRouteRef<TParams extends AnyRouteRefParams>(
  routeRef: RouteRef<TParams> | SubRouteRef<TParams>,
): RouteFunc<TParams>;

/**
 * React hook for constructing URLs to routes.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}
 *
 * @param routeRef - The ref to route that should be converted to URL.
 * @returns A function that will in turn return the concrete URL of the `routeRef`.
 * @public
 */
export function useRouteRef<TParams extends AnyRouteRefParams>(
  routeRef:
    | RouteRef<TParams>
    | SubRouteRef<TParams>
    | ExternalRouteRef<TParams, any>,
): RouteFunc<TParams> | undefined {
  const resolveRouteRef = useRouteRefResolver<TParams>();
  return resolveRouteRef(routeRef);
}
