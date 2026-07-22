import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ComponentsData, createPrimeMcpServer } from '@primeuix/mcp';
import { z } from 'zod';
import ComponentJson from '../data/components.json';
import pkg from '../package.json';

// Vue-specific composables data
const composables = [
    {
        name: 'useToast',
        description: 'Programmatically display toast messages',
        related_component: 'Toast',
        usage: `import { useToast } from 'openvue/usetoast';\nconst toast = useToast();`,
        example: `toast.add({ severity: 'success', summary: 'Success', detail: 'Message', life: 3000 });`
    },
    {
        name: 'useConfirm',
        description: 'Programmatically display confirmation dialogs',
        related_component: 'ConfirmDialog',
        usage: `import { useConfirm } from 'openvue/useconfirm';\nconst confirm = useConfirm();`,
        example: `confirm.require({ message: 'Are you sure?', header: 'Confirm', accept: () => {} });`
    },
    {
        name: 'useDialog',
        description: 'Programmatically create dynamic dialogs',
        related_component: 'DynamicDialog',
        usage: `import { useDialog } from 'openvue/usedialog';\nconst dialog = useDialog();`,
        example: `dialog.open(MyComponent, { props: { header: 'Dialog' } });`
    },
    {
        name: 'useStyle',
        description: 'Inject custom styles',
        related_component: null,
        usage: `import { useStyle } from 'openvue/usestyle';\nuseStyle(css, { name: 'my-styles' });`,
        example: `useStyle('.my-class { color: red; }', { name: 'custom' });`
    },
    {
        name: 'usePrimeVue',
        description: 'Access PrimeVue configuration',
        related_component: null,
        usage: `import { usePrimeVue } from 'openvue/config';\nconst primevue = usePrimeVue();`,
        example: `primevue.config.ripple = true;`
    }
];

async function run() {
    const server = await createPrimeMcpServer({
        name: '@openvue/mcp',
        version: pkg.version,
        baseUrl: 'https://primevue.org',
        frameworkName: 'PrimeVue',
        slotKey: 'slots',
        codeLanguage: 'javascript',
        compatibility: 'Vue 3.x',
        loadComponentsData: async () => ComponentJson as ComponentsData
    });

    server.registerTool('list_composables', { description: 'List all available PrimeVue composables with their descriptions' }, async () => ({
        content: [
            {
                type: 'text' as const,
                text: JSON.stringify(
                    {
                        total: composables.length,
                        composables: composables.map((composable) => ({
                            name: composable.name,
                            description: composable.description,
                            related_component: composable.related_component
                        }))
                    },
                    null,
                    2
                )
            }
        ]
    }));

    server.registerTool(
        'get_composable',
        {
            description: 'Get detailed information about a specific PrimeVue composable',
            inputSchema: { name: z.string().describe("Composable name (e.g., 'useToast', 'useConfirm')") }
        },
        async ({ name }) => {
            const composable = composables.find((item) => item.name.toLowerCase() === name.toLowerCase());

            return {
                content: [
                    {
                        type: 'text' as const,
                        text: composable ? JSON.stringify(composable, null, 2) : `Composable "${name}" not found. Available: ${composables.map((item) => item.name).join(', ')}`
                    }
                ],
                isError: !composable
            };
        }
    );

    await server.connect(new StdioServerTransport());
    console.error('OpenVue MCP Server running on stdio');
}

run().catch((error) => {
    console.error('Failed to start OpenVue MCP Server:', error);
    process.exit(1);
});
