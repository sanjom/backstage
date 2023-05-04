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

import React from 'react';
import { EmptyState } from './EmptyState';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import Button from '@mui/material/Button';

describe('<EmptyState />', () => {
  it('render EmptyState component with type annotation is missing', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <EmptyState
          missing="field"
          title="Your plugin is missing an annotation"
          action={<Button aria-label="button">DOCS</Button>}
        />,
      ),
    );
    expect(
      rendered.getByText('Your plugin is missing an annotation'),
    ).toBeInTheDocument();
    expect(rendered.getByLabelText('button')).toBeInTheDocument();
    expect(rendered.getByAltText('annotation is missing')).toBeInTheDocument();
  });

  it('renders custom image if one is provided', async () => {
    const { getByText } = await renderWithEffects(
      wrapInTestApp(
        <EmptyState
          title="Some empty state text"
          missing={{ customImage: <div>Custom Image</div> }}
        />,
      ),
    );

    expect(getByText('Some empty state text')).toBeInTheDocument();
    expect(getByText('Custom Image')).toBeInTheDocument();
  });
});
