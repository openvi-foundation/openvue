<template>
    <DocSectionText v-bind="$attrs">
        <p>If you run PrimeVue 4 today, you have three realistic paths.</p>
        <div class="doc-tablewrapper">
            <table class="doc-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Stay on PrimeVue 4.5.5</th>
                        <th>Upgrade to PrimeVue 5</th>
                        <th>Switch to OpenVue</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><b>License</b></td>
                        <td>MIT</td>
                        <td>PrimeUI license</td>
                        <td>MIT</td>
                    </tr>
                    <tr>
                        <td><b>Cost</b></td>
                        <td>Free</td>
                        <td>Paid per developer, free Community tier for eligible small organizations</td>
                        <td>Free</td>
                    </tr>
                    <tr>
                        <td><b>Updates</b></td>
                        <td>Security fixes only</td>
                        <td>Active, by PrimeTek</td>
                        <td>Active, by the community</td>
                    </tr>
                    <tr>
                        <td><b>Effort</b></td>
                        <td>None</td>
                        <td>A major version upgrade</td>
                        <td>One command</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="mb-0">
            PrimeVue 5 is a good fit if you want vendor support and the PrimeUI license works for your organization. Check
            <a href="https://primeui.dev/nextchapter" target="_blank" rel="noopener noreferrer">primeui.dev</a> for current terms. Staying on 4.5.5 works for apps that are finished, but bugs you hit there will stay unfixed. OpenVue is for teams that
            want to keep their code, keep MIT and keep getting fixes.
        </p>
    </DocSectionText>
</template>
