<template>
    <div>
        <DocSeo title="Changelog - OpenVue" description="Every OpenVue release since the fork from PrimeVue 4.5.5: new features, fixes and breaking changes, plus what is merged and waiting for the next release." />

        <div class="doc">
            <div class="doc-main">
                <div class="doc-intro">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div class="flex-1">
                            <h1>Changelog</h1>
                            <p class="!mb-4">Every OpenVue release since the fork from PrimeVue 4.5.5, newest first. All packages ship together under one version.</p>
                            <p>
                                Releases from before the fork are in the
                                <a href="https://github.com/openvi-foundation/openvue/blob/master/CHANGELOG_PRIMEVUE.md" target="_blank" rel="noopener noreferrer">PrimeVue changelog</a> on GitHub.
                            </p>
                        </div>
                        <DocCopyMarkdown docType="page" class="flex-shrink-0" />
                    </div>
                </div>
                <DocSections :docs="docs" />
            </div>
            <DocSectionNav :docs="docs" />
        </div>
    </div>
</template>

<script>
import DocCopyMarkdown from '@/components/doc/DocCopyMarkdown.vue';
import { parseChangelog } from '@/doc/changelog/parseChangelog.js';
import ReleaseDoc from '@/doc/changelog/ReleaseDoc.vue';
import changelogSource from '@/../../CHANGELOG.md?raw';

const releases = parseChangelog(changelogSource);
const latest = releases.find((release) => !release.unreleased);

export default {
    components: { DocCopyMarkdown },
    data() {
        return {
            docs: releases.map((release) => ({
                id: release.unreleased ? 'unreleased' : release.version,
                label: release.unreleased ? 'Unreleased' : release.version,
                badge: release === latest ? { value: 'Latest', severity: 'success' } : null,
                component: ReleaseDoc,
                data: release
            }))
        };
    }
};
</script>
