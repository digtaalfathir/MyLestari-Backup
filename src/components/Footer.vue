<template>
  <section :class="[isMobile ? 'container' : 'w-full', 'py-10 text-center bg-primary']">
    <!-- Logo and tagline -->
    <div v-if="isMobile" class="flex flex-col items-start ml-4">
      <img class="h-8 w-auto" :src="logo" alt="My Lestari" />
      <p class="pt-2 text-left text-white">Solusi inovatif untuk melakukan kontrol dan memantau data secara real time dan efisien</p>
    </div>
    <div v-else class="flex flex-col items-start ml-4">
      <img class="h-12 w-auto" :src="logo" alt="My Lestari" />
      <p class="pt-2 text-left text-white text-lg">Solusi inovatif untuk melakukan kontrol dan memantau data secara real time dan efisien</p>
    </div>

    <!-- Social Media Links -->
    <div v-if="isMobile" class="mt-4 mb-5 mx-5">
      <ul class="flex gap-4 pt-2">
        <li v-for="(link, index) in socialLinks" :key="index">
          <a :href="link.href"><img class="h-8 w-auto" :src="link.img" alt="My Lestari" /></a>
        </li>
      </ul>
    </div>
    <div v-else class="mt-4 mb-5 mx-5">
      <ul class="flex gap-16 pt-2">
        <li v-for="(link, index) in socialLinks" :key="index">
          <a :href="link.href"><img class="h-8 w-auto" :src="link.img" alt="My Lestari" /></a>
        </li>
      </ul>
    </div>

    <!-- Solutions, Support, Company, and Legal -->
    <div v-if="isMobile" class="mt-4 mb-5 mx-5 grid grid-cols-2 gap-4 text-left">
      <div>
        <h3 class="text-white">SOLUTIONS</h3>
        <ul class="gap-4 text-white">
          <li v-for="(item, index) in solutions" :key="index">
            <a :href="item.href">{{ item.title }}</a>
          </li>
        </ul>
        <h3 class="mt-5 text-white">SUPPORT</h3>
        <ul class="gap-4 text-white">
          <li v-for="(item, index) in support" :key="index">
            <a :href="item.href">{{ item.title }}</a>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="text-white">COMPANY</h3>
        <ul class="gap-4 text-white">
          <li v-for="(item, index) in company" :key="index">
            <a :href="item.href">{{ item.title }}</a>
          </li>
        </ul>
        <h3 class="text-white">LEGAL</h3>
        <ul class="gap-4 text-white">
          <li v-for="(item, index) in legal" :key="index">
            <a :href="item.href">{{ item.title }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="mt-4 mb-5 mx-5 grid grid-cols-2 gap-4 text-left">
      <!-- Solutions and Support -->
      <div>
        <h3 class="text-lg text-white font-medium">SOLUTIONS</h3>
        <ul class="gap-4 text-white py-2">
          <li v-for="(item, index) in solutions" :key="index">
            <a :href="item.href">{{ item.title }}</a>
          </li>
        </ul>
        <h3 class="mt-5 text-lg text-white font-medium">SUPPORT</h3>
        <ul class="gap-4 text-white py-2">
          <li v-for="(item, index) in support" :key="index">
            <a :href="item.href">{{ item.title }}</a>
          </li>
        </ul>
      </div>

      <!-- Company and Legal -->
      <div>
        <h3 class="text-lg text-white font-medium">COMPANY</h3>
        <ul class="gap-4 text-white py-2">
          <li v-for="(item, index) in company" :key="index">
            <a :href="item.href">{{ item.title }}</a>
          </li>
        </ul>
        <h3 class="mt-5 text-lg text-white font-medium">LEGAL</h3>
        <ul class="gap-4 text-white py-2">
          <li v-for="(item, index) in legal" :key="index">
            <a :href="item.href">{{ item.title }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Footer copyright -->
    <div v-if="isMobile" class="mt-10 mb-5 mx-5 text-center">
      <p class="text-white">© 2024 My Lestari, Inc. All rights reserved.</p>
    </div>
    <div v-else class="mt-10 mb-5 mx-5 text-center text-lg">
      <p class="text-white">© 2024 My Lestari, Inc. All rights reserved.</p>
    </div>
  </section>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Footer",
  setup() {
    const logo = "./assets/logo-footer.svg",
      isMobile = ref(window.innerWidth <= 768);

    const company = ref([
        { title: "About", href: "#" },
        { title: "Blog", href: "#" },
        { title: "Jobs", href: "#" },
        { title: "Press", href: "#" },
        { title: "Partners", href: "#" },
      ]),
      solutions = ref([
        { title: "Marketing", href: "#" },
        { title: "Analytics", href: "#" },
        { title: "Commerce", href: "#" },
        { title: "Insights", href: "#" },
      ]),
      support = ref([
        { title: "Pricing", href: "#" },
        { title: "Documentation", href: "#" },
        { title: "Guides", href: "#" },
        { title: "API Status", href: "#" },
      ]),
      legal = ref([
        { title: "Claim", href: "#" },
        { title: "Privacy", href: "#" },
        { title: "Terms", href: "#" },
      ]),
      socialLinks = ref([
        {
          href: "#",
          img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA/lJREFUaEPtWe1VFUEMTTqQDqACpQKlAqUCpQKlArECoQKhArECsQKxArEC6SDufSfzTl42szOzb+dx8DB/OMDuTD5ubu5kmR754kduPz058NAZbMqAiOwT0Rsiek5EL4jomTqAv89Zd/oSft4T0Y9h32tmTn8v7lnlgIi8IqKPRISfu1i3RHTBzJelwyYdEBFEGIZ/KG3U6f/nRPSJmZGdcGUdUOO/K1Sil5HmlPrsAQXHEvQQKEAyWsjGUc6JKQc+B5G/QUSGOridisrcbIgI6uut1pnd5pyZT6N9QwdE5B0RfXEvnDIzUtp9iQggiwDahSwggBsr58BPl9LuxgOyNquBEzfMfFR0QKnyt3kwfHGpNOh5yDYYDjV1zMzAPYkIatAy3z4z/7FnjzIQeI4Nr5cy2O8jIjAekE3rnpn31AEYDyfSGiEhcuCrLSJmruoVgWFgmMQyMGoV1eC5jfP0/3uAkzLhX/PO5ZCBk1IGbNrANoe10deGl1gkdel1ZNFliejKFmOQcXTi4/SSiADOKRAje6IM2Beq8K+RAhRAgzULHRYNaiUZlPXg+K/h9zNXzDagd8x8UMpAkwNahDikVQ/BeFDjpO4REQuxKgdkCnPW+wnjwdeIZsI9nEOEvZMw/nCqKQ5nIFt4d7V8TUYQanFgxCBEdJJjLYUKtJV1ZAPzQZH3cUAL1lJcLSRgPBqlLfKwy2p9dHPARx+RL8pfNQrFDmynNaJHw0LdHAA/pyiOiqtERa7LrpvXTiAkIpC+gEFaoMSzktGOACAM35u/jWRCNwgF+K+Gj4GGV7xhHXRhof/BATCJVay4vzZdO0UEkAOlpoV+MNJLXTKg2LRFXCU5XA3Yjr/bIo6KS3V8lewObnwPQqNeq+NiDxiUtA3g57XT7huZZsFreRgPSg0bml7a0QBtF85GvxuNGiqEIegHkUi70isiHk+TPD8YK8qPOUVsi+vbwAyTGn8HcrrvfUDTjAyAFteyt9CVUexofsWBmJMcVfcBO1Jp0jja4NBhXzucwx8YO7pSluSHiFh7RnQd3Qc21N8wZF1dsEsHBSLMTq8RiOqJs+sX9n4ygnTNWCVLca1OtT6vrGVld9VYxcuE5i7bamju+WCwdeAzmRst+olY99FiAEFIbTuLDUc8OQd8l8X+O3NCRLzxOD+U7FPjdX/hwCaYNkB5VmmeFijpbAmFH30JyqrdbT5wQPomdprFMEq16OZ2DOn9nveBQxsUNkeDsle/lsBu++wFzp/1iclxMZoTnMh9BtrWUP/+6ktQ9EHDP9g0eTafWV9q+pOIax0rJjsS9ABFQAXTvOU/sy4d3iX3a8rAkgcvtdeTA0tFcu4+/wCisk5Pt62dxAAAAABJRU5ErkJggg==",
        },
        {
          href: "#",
          img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABINJREFUaEPVWo1RFkEMTSpQOpAKlAqUCpQKlAqECoQKhAqECsAKxArUCvysQDqI95jdm1wu2Z+7wxl2hsHx27svL3l5yWZheuKLn7j9tAkAEXlORK+I6C0RvUj/xv/hJ68dEeHnJxF9J6I7Zr5f68BVAETkDRG9H4x6Z4xtteuOiK6Z+ar1AbtvEYBk+KfBiwCwxUJkzpcA6QIgIqDHlwbDM10yRTKdQLPSwnOHzIzfTasZQPL6TUAVGHo9cP8WHC9xO70HQD6mfPEMPWPm8xYETQBEBHQ5c14IDiP0+N29KlS8YObT2kurAALj4XEYflH7gpbPReQDEcFJoKheV8x8XHpHEUBgPGTwqIenjSBg/OekaPqRYiRCACm838yXg+cnW+h3BEpEQFVEQ6/TKNougKQ2MF6H9JaZj1q8uXZPAOKAmRH9yYoAQCrBy7wga3jB6srZCm5wIoobimReULeDKoDk/d9m477HedVC0FIlKlAJteOHYcGMSrMIiAiooyss1GYmoSICLcfe3O+4+1o97u1z8vCemff03gkAx/s7Zt63Lw9yBPRCpDalmeNQKCAK5sOyACz3j73+RETsvvw+d//GUUAXexgBAPe18ux5HhURuy+/b/LyNYbrZ50ojHaNEUicRtLk9XWQLbTJszUUOCkYh2ZsUWtRSGhbG8ZIawCQTVCjSocKgP9Bo8uBGSeTHBgkEX0NOsS83MKBDwsUcpN+LZWSXP/12KEjMJHPoZ0ttRleue/u5XuAGaeNjooAzPTWJBW0X3sEHz9qq2ESebRPA0AC5xNTlQpBv7J5AmfHWSXKDFkDwCv1j0ajFgA6B4oUUl6x7QQ+QseISDxmRXYpZLs/t4jZxBMRyBkOInoVDz3pBIYGsHmcIiLIudx3jZ2pppBVlmY+B/kAOqEmTIraYAikOh9Fm8YprTKKqoupQ15d3WUAAu+Cl/GunVPt83cVgYhIaJuOgJXG7r6mAAKGIhLIGT1utIx0i6fTPI7ssN2oPQuE1bjQtyAncKYtGRo9Psu7RB80j/l9E4m3AGxCjj1HZ9VERws61iZxk8T3jowp4XWPNhm1WABAqdFCChGF5lGfqdjRvMf6A98DWswO7U7fNTneekdKq0bdueBILY6oAPPaGV4hN6BWMyc5c6nZoMsDYKMAva5O8FoplpRI67lb8ALFmg0XPADgr55KrI5AKzhV4WGDnUu5+egBsAebcCrWa1jL/mBgEM6lPABQD32U7JbSFkO9PYVpRygkHgDdc1Tb6qXGOokOp0Eubf2YjFHsc1ZGoRZ6oDtmvbnIy4Ov1VPqyq1P9XxtAVgJRdMFlYDB0X0YhkxIsK5JhLog1DPY7OCwLtQiYFuJHoboK1QUpKzrMEbfkb1MNSFqNcK64BlTauZ6jN9i76JbHw3AtqzWKHjm4YI6nbqw37sW6gUDwy9xRlhyitMA7LxzvFEv3aonLkdtQgQGRiN3cONTvNWsecOOVX4l72JE0n2mTeVf/6nBM2XAn/ynBl7TVjM0+nyzHmepAWufe/IA/gEB+E5PP60/EwAAAABJRU5ErkJggg==",
        },
        {
          href: "#",
          img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAwCAYAAACITIOYAAAAAXNSR0IArs4c6QAAAolJREFUaEPtmOFV40AMhDUdcB1wFQAdQAdcBUAFQAVABdABXAUHFRAquCsBKoCrQHh43rzFzyspDlnHvOyf/Iiz/jweSbOBTGhhQqyygV3V21qpsqq6LyKPBfg7ACeLPNiYsA8ADqcC+wbgx1RgyXkAYBYFHtMGZJwBOJgKLDl/AbiPAI+tLBnfWjv884DXATYBnwO4s4DXBTYxEvYKwHMf9LrBJkZagl3iv4jcAKBVVpsNnAnmWTR9v91MupcNbC7Xd1KWvtwSkW3HD19jA1VNN+MNWQSc9/N+qarHInJbSl2s/Oa7SxE5MoCHw7aApyJCkK4qn2KfB5sioqpyH8ZJQvMzX4vDtpAXjXpnhgqDYDs+59vazSzCPeOtq31yhmjPX0vDLjXBVJVPSVA+sbfGg11A0fm4zI8qUc96CqTvzXGrqlS0a3hr73GUdVTJgTnDU/B4AcBW9LGqKauqf9uqLCnJwHySKrXvoiqwbVERtrQY4+YKli6qBcteel2AeAbwM1IUtWD/iEjpTM9Xbyb6qp51usBePv8thWspa7Ws+az2rFAL1rJB+I8JVbW8HyrSXJDeodCElhsRYbLqW+GbOHbiaZb3Ca8SrJVDmYDo294TaFZcLFC+odIKez9tUIJlaHk1bkRQ2qEXOJApwu3PtUE7Kr1cQFAm/fs0xbJgTq9aKS3c/qKwjIbWFMv3SQp7eZe/Md+KZWAvdVmFFi6MzoWDVOUe7j8yA2Ki9RDhTtK3SQSW3qN/aYtl1u+mINllBi8XNmtFy1hi4Z46SNn8R+0/LExjUZUZzOlRsydHpQ4r24EmLF/pTnZsTpVOsKfmJMwjzpdAmkMh+qS1rxukbG3IjbKrVvwdDgFIQC5nhC0AAAAASUVORK5CYII=",
        },
        {
          href: "#",
          img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAwCAYAAAC4wJK5AAAAAXNSR0IArs4c6QAAAe5JREFUaEPtmf1RwkAQxd/rwBKwArUD6UArUCpwqEDpgA6kA7UCsQLtQKxAO1h5zIU54iWEuSF34N0Mf3FJ9nf79TYhjmDxCBhQIHLxYqMnzGwA4BHAZS7GAlgAmJGc+Da1QXwuLxBIjmtEclYZFoQwM53+a47WO5teSF4dOsSc5LBALJN9DuDN5cxNgrCL9sSQpCBWy1Ux5U+fRSAKYkpyXD/5BIUgCmLDCz6MmX0DOOkptKIgrkk+hww1M+sJQI+JgmgKp1vX3fviiIKQkWOSUy+xzwE8HVJiV7Z/ANBPFSmFtor2RF8h0/acbCCkSNVvvpy1ZwAUml36TRSEZPAo0Cfqib2hMr38UQWT8fp/3TBrpVr3ut8CkxRC8l69RiCNq4MKSAox2Abgea1tHEgHsWtFMLOmwSw9hJlJniiJ0ZQbTlyqH90F4NNCLOWJkvbBM0z5cUHyp0PBqLakg2hRuxOSPlgl85vyIilEp/CoSZr3rMLJzDQ8hWTKguRpIJzU+JTc9ZXUEwXCc0fxRKx2KuFUwsk7gRJOpU9strtSYqU0/6hN9+bPf/vXdZ9/vk3TXmjmjvLErnPNvvb/HwhNXSEJvK+T3fW+2z3hRsPD/vDoIHL8BKyCoSlw/S54Nafv6scc9xeIXLxyFJ74BStXDE85XsgIAAAAAElFTkSuQmCC",
        },
        {
          href: "#",
          img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAwCAYAAABOiRchAAAAAXNSR0IArs4c6QAAAoVJREFUaEPtmuFRwzAMhaUNYANGYAS6AUwAnQA6ATABZQLKBIxAN4ANYAQ2EH05p9e6SWzFdmr37LseP4gd6ct7tqOYqTbiyoAqBIigKsEXgoicEdE9Ed0R0QURfZvfMzP/5mQpEUGMt0R0ZeJaE9E7M6/64nQqQUSQ9KdJvmucBTMvjw3CPKiPneTtkFbMPO+KcxCCB4B2TFAGjL9jwBARPPW3gQfVhrVk5oUdowvCAxG9eCYGW8ymtoeIwKYaJZ7bD8sFATZoveXJolGEJijfcfeu85B/37hze35wQfjxkFjXzZLaQyH/rtgmg4CbJ7HHCPnbICaF0N48ij0C5J8FBAQRZI9A+WcDYbQ9Isg/Kwgqexj5Y+2/HrV89Hc6ypygXj1E5JKIsPvDbjV2ywZCrz0SyD+6HbAtxstUzNasHgnlHx1CO2BsGFg9sDNNIf9kEDBwbBAx1TU0VvQ5oUQQ0SG0isDf2HNFKmUkgZBqnigSAoJGKUv76h2SLOyIn2ZCTaoEJDMzAaEQk9oeAI5yGXaVGvDpITDzWlGWG6sCFHif0FlEtIWfaSC0mW02QKgwofwVq6FGgSSggqZlD8EEiRJ4DHs08rdrmEVAMCBcZXuXUrbyty8sBkKAPQ7kXzwEpT0g/xvXt4zilLCjCJc9vOuSxUIYsIdT/idhh44ksHo8mg+8mP1Vn/KKV8KOIs60yRe1T3CtfaH/PxklhICoEErZNoc8ZZ++VQlVCdO9RaIUjkNQvg0nVbavub6dQq4bYYeDGF2HNLC9/VJUiXKH8LrZj+AI0l7zPb2GEha+D7pKZrlCwHYcx/iaapQaQohUS+nrVEIpiYTEWSH4HusNoVxC338rw71AaUuyggAAAABJRU5ErkJggg==",
        },
      ]);

    return {
      logo,
      legal,
      company,
      support,
      isMobile,
      solutions,
      socialLinks,
    };
  },
};
</script>
