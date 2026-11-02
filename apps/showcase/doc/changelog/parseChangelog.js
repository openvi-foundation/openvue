// Parses the repository CHANGELOG.md (Keep a Changelog format) so the changelog page renders from the same file the release process maintains.
const REPO_BLOB = 'https://github.com/openvi-foundation/openvue/blob/master/';

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const resolveUrl = (url) => (/^(https?:|mailto:|#)/.test(url) ? url : REPO_BLOB + url);

// Inline markdown subset used by the changelog: `code`, **bold** and [text](url). Code renders as <i>, the showcase's inline code mark.
export const renderInline = (text) => {
    const codes = [];
    let html = escapeHtml(text).replace(/`([^`]+)`/g, (_, code) => `\uE000${codes.push(code) - 1}\uE000`);

    html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => `<a href="${resolveUrl(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`);

    return html.replace(/\uE000(\d+)\uE000/g, (_, index) => `<i>${codes[index]}</i>`);
};

// Groups consecutive non-empty lines into paragraphs and list items.
const toBlocks = (lines) => {
    const blocks = [];
    let current = null;

    for (const line of lines) {
        if (!line.trim()) {
            current = null;
        } else if (line.startsWith('- ')) {
            if (current?.type !== 'list') {
                current = { type: 'list', items: [] };
                blocks.push(current);
            }

            current.items.push(line.slice(2).trim());
        } else if (current?.type === 'list') {
            current.items[current.items.length - 1] += ' ' + line.trim();
        } else if (current?.type === 'paragraph') {
            current.text += ' ' + line.trim();
        } else {
            current = { type: 'paragraph', text: line.trim() };
            blocks.push(current);
        }
    }

    return blocks;
};

const paragraphsOf = (lines) =>
    toBlocks(lines)
        .filter((block) => block.type === 'paragraph')
        .map((block) => renderInline(block.text));

export const parseChangelog = (markdown) => {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const references = {};
    const content = [];

    for (const line of lines) {
        const reference = line.match(/^\[([^\]]+)\]:\s*(\S+)\s*$/);

        if (reference) {
            references[reference[1].toLowerCase()] = reference[2];
        } else {
            content.push(line);
        }
    }

    // Text before the first release heading describes the file itself, so the page writes its own intro instead.
    const releases = [];
    let release = null;
    let group = null;

    for (const line of content) {
        const releaseHeading = line.match(/^## \[([^\]]+)\](?:\s+-\s+(\d{4}-\d{2}-\d{2}))?/);
        const groupHeading = line.match(/^### (.+)/);

        if (releaseHeading) {
            const version = releaseHeading[1];

            release = { version, date: releaseHeading[2] ?? null, compareUrl: references[version.toLowerCase()] ?? null, intro: [], groups: [] };
            group = null;
            releases.push(release);
        } else if (groupHeading && release) {
            group = { title: groupHeading[1].trim(), lines: [] };
            release.groups.push(group);
        } else if (group) {
            group.lines.push(line);
        } else if (release) {
            release.intro.push(line);
        }
    }

    return releases.map(({ intro, groups, ...rest }) => ({
        ...rest,
        unreleased: rest.version.toLowerCase() === 'unreleased',
        intro: paragraphsOf(intro),
        groups: groups.map(({ title, lines: groupLines }) => ({
            title,
            items: toBlocks(groupLines)
                .flatMap((block) => (block.type === 'list' ? block.items : [block.text]))
                .map(renderInline)
        }))
    }));
};
