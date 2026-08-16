/**
 *
 * [Live Demo](https://openvue.dev/toast/)
 *
 * @module toastservice-usetoast
 * @todo 'use' is not a valid name for a module. Next release will change.
 */
import type { ToastMessageOptions } from 'openvue/toast';
import { Plugin } from 'vue';

declare const plugin: Plugin;
export default plugin;

/**
 * Toast Service methods.
 *
 * @group Model
 *
 */
export interface ToastServiceMethods {
    /**
     * Displays the message in a suitable Toast component and returns the id of the message, generated when the message
     * does not define an `id` of its own. Keep the id around to remove that particular message later on with `remove`.
     * @param {ToastMessageOptions} message - Message instance.
     * @returns {string | number} Id of the message.
     */
    add(message: ToastMessageOptions): string | number;
    /**
     * Clears the message with the matching `id`, e.g. `remove({ id: myId })` where `myId` is the id returned by `add`.
     * @param {ToastMessageOptions} message - Message instance.
     */
    remove(message: ToastMessageOptions): void;
    /**
     * Clears the messages that belongs to the group.
     * @param {string} group - Name of the message group.
     */
    removeGroup(group: string): void;
    /**
     * Clears all the messages.
     */
    removeAllGroups(): void;
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $toast: ToastServiceMethods;
    }
}
