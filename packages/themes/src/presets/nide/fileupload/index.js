import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/fileupload';

export default definePreset(aura, {
    css: `
.p-fileupload-file-info {
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.p-fileupload-file-size {
    color: dt('text.muted.color');
}
`
});
