<template>
    <div class="border-t border-surface-200 dark:border-surface-800">
        <div class="max-w-[102rem] mx-auto px-4">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12">
                <ul class="flex flex-col gap-2 mx-auto">
                    <li class="font-bold">General</li>
                    <li>
                        <NuxtLink to="/overview"><span class="text-muted-color hover:text-color transition-colors duration-200">Overview</span></NuxtLink>
                    </li>
                    <li><a href="https://github.com/openvi-foundation/openvue-examples" target="_blank" rel="noopener noreferrer" class="text-muted-color hover:text-color transition-colors duration-200">Examples</a></li>
                    <li><a href="https://github.com/openvi-foundation/openvue/tree/master/apps/volt/volt" target="_blank" rel="noopener noreferrer" class="text-muted-color hover:text-color transition-colors duration-200">Source Code</a></li>
                </ul>
                <ul class="flex flex-col gap-2 mx-auto">
                    <li class="font-bold">Community</li>
                    <li><a href="https://github.com/openvi-foundation/discussions" target="_blank" rel="noopener noreferrer" class="text-muted-color hover:text-color transition-colors duration-200">Discussions</a></li>
                    <li><a href="https://discord.gg/gzKFYnpmCY" target="_blank" rel="noopener noreferrer" class="text-muted-color hover:text-color transition-colors duration-200">Discord</a></li>
                </ul>
                <ul class="flex flex-col gap-2 mx-auto">
                    <li class="font-bold">Resources</li>
                    <li><a href="https://openvue.dev/team" target="_blank" rel="noopener noreferrer" class="text-muted-color hover:text-color transition-colors duration-200">About Us</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>
