import ToastEventBus from 'openvue/toasteventbus';
import { PrimeVueToastSymbol } from 'openvue/usetoast';

var messageIdx = 0;

export default {
    install: (app) => {
        const ToastService = {
            add: (message) => {
                if (message.id == null) {
                    message.id = messageIdx++;
                }

                ToastEventBus.emit('add', message);

                return message.id;
            },
            remove: (message) => {
                ToastEventBus.emit('remove', message);
            },
            removeGroup: (group) => {
                ToastEventBus.emit('remove-group', group);
            },
            removeAllGroups: () => {
                ToastEventBus.emit('remove-all-groups');
            }
        };

        app.config.globalProperties.$toast = ToastService;
        app.provide(PrimeVueToastSymbol, ToastService);
    }
};
