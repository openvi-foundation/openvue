const wrappers = import.meta.glob('./volt/*.vue', { eager: true });

export const voltWrapperCount = Object.keys(wrappers).length;
