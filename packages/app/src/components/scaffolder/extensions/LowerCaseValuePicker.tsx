/*
 * Copyright 2023 The Backstage Authors
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
import {
  createScaffolderFieldExtension,
  FieldExtensionComponentProps,
} from '@backstage/plugin-scaffolder-react';
import { TextField } from '@material-ui/core';
import type { FieldValidation } from '@rjsf/utils';

export const LowerCaseValuePicker = createScaffolderFieldExtension({
  name: 'LowerCaseValuePicker',
  component: (props: FieldExtensionComponentProps<string>) => {
    const {
      onChange,
      required,
      schema: { title, description },
      rawErrors,
      formData,
      uiSchema: { 'ui:autofocus': autoFocus },
      idSchema,
      placeholder,
    } = props;

    return (
      <TextField
        id={idSchema?.$id}
        label={title}
        placeholder={placeholder}
        helperText={description}
        required={required}
        value={formData ?? ''}
        onChange={({ target: { value } }) => onChange(value)}
        margin="normal"
        error={rawErrors?.length > 0 && !formData}
        inputProps={{ autoFocus }}
      />
    );
  },
  validation: (value: string, validation: FieldValidation) => {
    if (value.toLocaleLowerCase('en-US') !== value) {
      validation.addError('Only lowercase values are allowed.');
    }
  },
});
