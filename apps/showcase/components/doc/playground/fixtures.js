/*
 * Sample data shared by the playgrounds. A playground generates code that has to run on its own the
 * moment it is pasted, so the data is a literal here rather than a call to the country service: no
 * network, no second file to copy alongside the snippet.
 *
 * They live together so the components that show a list all show the same one, which makes the
 * generated snippets comparable when you read two component pages back to back.
 */

/** A plain string list, for the components that take primitive options. */
export const COUNTRIES = [
    'Argentina',
    'Australia',
    'Austria',
    'Belgium',
    'Brazil',
    'Canada',
    'Chile',
    'Croatia',
    'Denmark',
    'Egypt',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'Iceland',
    'India',
    'Ireland',
    'Italy',
    'Japan',
    'Kenya',
    'Mexico',
    'Morocco',
    'Netherlands',
    'New Zealand',
    'Norway',
    'Peru',
    'Poland',
    'Portugal',
    'Singapore',
    'South Africa',
    'Spain',
    'Sweden',
    'Switzerland',
    'Thailand',
    'Turkey',
    'Ukraine',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Vietnam'
];

/** Objects, for the components demonstrated with `optionLabel` and `optionValue`. */
export const CITIES = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
    { name: 'Berlin', code: 'BER' },
    { name: 'Tokyo', code: 'TKO' },
    { name: 'Madrid', code: 'MAD' }
];

/** A short list for the components that show every option at once, where forty would not fit. */
export const MODES = ['Off', 'On', 'Auto'];

/*
 * MenuModel items for the components that hang a menu off a button. No `command` handlers: the
 * playground is about the properties, and a generated snippet that fires toasts would need a
 * ToastService registered before it ran anywhere else.
 */
export const ACTIONS = [{ label: 'Update', icon: 'pi pi-refresh' }, { label: 'Delete', icon: 'pi pi-trash' }, { label: 'Upload', icon: 'pi pi-upload' }, { separator: true }, { label: 'Website', icon: 'pi pi-external-link' }];

/** Nested to the depth CascadeSelect needs: a group of groups of options. */
export const REGIONS = [
    {
        name: 'Europe',
        countries: [
            {
                name: 'France',
                cities: [
                    { cname: 'Paris', code: 'FR-PR' },
                    { cname: 'Lyon', code: 'FR-LY' }
                ]
            },
            {
                name: 'Spain',
                cities: [
                    { cname: 'Madrid', code: 'ES-MD' },
                    { cname: 'Bilbao', code: 'ES-BL' }
                ]
            }
        ]
    },
    {
        name: 'Americas',
        countries: [
            {
                name: 'Canada',
                cities: [
                    { cname: 'Montreal', code: 'CA-MO' },
                    { cname: 'Toronto', code: 'CA-TO' }
                ]
            },
            {
                name: 'Brazil',
                cities: [
                    { cname: 'Sao Paulo', code: 'BR-SP' },
                    { cname: 'Recife', code: 'BR-RE' }
                ]
            }
        ]
    },
    {
        name: 'Asia',
        countries: [
            {
                name: 'Japan',
                cities: [
                    { cname: 'Tokyo', code: 'JP-TK' },
                    { cname: 'Osaka', code: 'JP-OS' }
                ]
            },
            {
                name: 'India',
                cities: [
                    { cname: 'Mumbai', code: 'IN-MU' },
                    { cname: 'Delhi', code: 'IN-DL' }
                ]
            }
        ]
    }
];

/*
 * Body copy for the container components, whose playgrounds are about what encloses the content
 * rather than the content itself. Three distinct paragraphs rather than one repeated, so a panel
 * that opens the wrong section is obvious at a glance instead of looking like it worked.
 */
export const PROSE = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.'
];

/** The `key`/`label`/`children` shape TreeSelect reads, kept shallow so the whole tree opens on screen. */
export const NODES = [
    {
        key: '0',
        label: 'Documents',
        children: [
            {
                key: '0-0',
                label: 'Work',
                children: [
                    { key: '0-0-0', label: 'Expenses.doc' },
                    { key: '0-0-1', label: 'Resume.doc' }
                ]
            },
            { key: '0-1', label: 'Home', children: [{ key: '0-1-0', label: 'Invoices.txt' }] }
        ]
    },
    {
        key: '1',
        label: 'Events',
        children: [
            { key: '1-0', label: 'Meeting' },
            { key: '1-1', label: 'Product Launch' },
            { key: '1-2', label: 'Report Review' }
        ]
    },
    {
        key: '2',
        label: 'Movies',
        children: [
            { key: '2-0', label: 'Al Pacino', children: [{ key: '2-0-0', label: 'Scarface' }] },
            { key: '2-1', label: 'Robert De Niro', children: [{ key: '2-1-0', label: 'Goodfellas' }] }
        ]
    }
];
