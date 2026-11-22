<template>
    <DocSectionText v-bind="$attrs">
        <p>If you run PrimeVue 4 today, you have three realistic paths.</p>

        <div class="alt-options">
            <section class="alt-option" aria-labelledby="alt-option-stay">
                <h3 id="alt-option-stay" class="alt-option-title">Stay on PrimeVue 4.5.5</h3>
                <dl class="alt-option-facts">
                    <div>
                        <dt>License</dt>
                        <dd>MIT</dd>
                    </div>
                    <div>
                        <dt>Cost</dt>
                        <dd>Free</dd>
                    </div>
                    <div>
                        <dt>Updates</dt>
                        <dd class="is-weak">Security fixes only</dd>
                    </div>
                    <div>
                        <dt>Effort</dt>
                        <dd>None</dd>
                    </div>
                </dl>
            </section>

            <section class="alt-option" aria-labelledby="alt-option-upgrade">
                <h3 id="alt-option-upgrade" class="alt-option-title">Upgrade to PrimeVue 5</h3>
                <dl class="alt-option-facts">
                    <div>
                        <dt>License</dt>
                        <dd class="is-weak">PrimeUI license</dd>
                    </div>
                    <div>
                        <dt>Cost</dt>
                        <dd class="is-weak">Paid per developer, free Community tier for eligible small organizations</dd>
                    </div>
                    <div>
                        <dt>Updates</dt>
                        <dd>Active, by PrimeTek</dd>
                    </div>
                    <div>
                        <dt>Effort</dt>
                        <dd class="is-weak">A major version upgrade</dd>
                    </div>
                </dl>
            </section>

            <section class="alt-option is-openvue" aria-labelledby="alt-option-openvue">
                <h3 id="alt-option-openvue" class="alt-option-title">Switch to OpenVue</h3>
                <dl class="alt-option-facts">
                    <div>
                        <dt>License</dt>
                        <dd>MIT</dd>
                    </div>
                    <div>
                        <dt>Cost</dt>
                        <dd>Free</dd>
                    </div>
                    <div>
                        <dt>Updates</dt>
                        <dd>Active, by the community</dd>
                    </div>
                    <div>
                        <dt>Effort</dt>
                        <dd>One command</dd>
                    </div>
                </dl>
                <OpenVueNuxtLink to="/migrate" class="alt-option-link">
                    <span>Read the migration guide</span>
                    <span class="pi pi-arrow-right" aria-hidden="true"></span>
                </OpenVueNuxtLink>
            </section>
        </div>

        <p class="alt-after">
            PrimeVue 5 is a good fit if you want vendor support and the PrimeUI license works for your organization. Check
            <a href="https://primeui.dev/nextchapter" target="_blank" rel="noopener noreferrer" class="doc-link">primeui.dev</a> for current terms. Staying on 4.5.5 works for apps that are finished, but bugs you hit there will stay unfixed. OpenVue
            is for teams that want to keep their code, keep MIT and keep getting fixes.
        </p>
    </DocSectionText>
</template>

<script>
export default {
    inheritAttrs: false
};
</script>
