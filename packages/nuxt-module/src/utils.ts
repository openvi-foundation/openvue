import { createStyleAsString } from '@openuxkit/utils/dom';
import { isFunction } from '@openuxkit/utils/object';
import type { MetaType } from '@openvue/metadata';
import type { ConstructsType, ResolvePathOptions } from './types';

export const Utils = {
    object: {
        getName(item: MetaType, options: ConstructsType) {
            return isFunction(options?.name) ? options.name(item) : `${options.prefix}${item.name}`;
        },
        getPath(fn: any, options: ResolvePathOptions) {
            return isFunction(fn) ? fn(options) : options.from;
        },
        createStyleAsString(css: string, options = { name: '' }) {
            const { name, ...rest } = options;

            return createStyleAsString(css, { 'data-primevue-style-id': name, ...rest });
        }
    }
};
