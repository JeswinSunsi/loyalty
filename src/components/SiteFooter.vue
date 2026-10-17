<script setup lang="ts">
import { RouterLink } from 'vue-router';
import BrandMark from './BrandMark.vue';
// The same footer as the main M Souq site; its links lead back there.
const year = new Date().getFullYear();
const mainSite = 'https://msouqllc.netlify.app/';
const whatsapp = 'https://wa.me/+96891515555';
const groups = [
  { title: 'Company', links: [{ text: 'About Us', href: `${mainSite}#about` }, { text: 'Careers', href: mainSite }, { text: 'Locations', href: `${mainSite}#locations` }] },
  { title: 'Legal', links: [{ text: 'Privacy Policy', href: mainSite }, { text: 'Terms of Service', href: mainSite }, { text: 'Warranty Info', href: mainSite }] },
];
</script>
<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <a :href="mainSite" class="footer-name"><BrandMark :size="22" /> M SOUQ LLC</a>
        <p class="footer-tagline">Real. Reasonable. Responsible.</p>
      </div>

      <div class="footer-groups">
        <nav v-for="group in groups" :key="group.title" class="footer-group" :aria-label="group.title">
          <h2>{{ group.title }}</h2>
          <a v-for="link in group.links" :key="link.text" :href="link.href">{{ link.text }}</a>
        </nav>
        <nav class="footer-group" aria-label="Rewards">
          <h2>Rewards</h2>
          <RouterLink :to="{ path: '/', hash: '#how-it-works' }">How it works</RouterLink>
          <RouterLink :to="{ path: '/', hash: '#questions' }">Questions</RouterLink>
          <RouterLink to="/staff/">Staff checkout</RouterLink>
        </nav>
        <div class="footer-group">
          <h2>Social</h2>
          <div class="footer-social">
            <a href="https://instagram.com/msouq_om" target="_blank" rel="noopener" aria-label="M Souq on Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg>
            </a>
            <a href="https://facebook.com/msouqglobal" target="_blank" rel="noopener" aria-label="M Souq on Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a :href="whatsapp" target="_blank" rel="noopener" aria-label="Message M Souq on WhatsApp">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4.5 4.5 0 0 1-2.2-2.2l.8-1-1-2z" /></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ year }} M Souq LLC. All rights reserved.</p>
        <p class="footer-made">
          Designed with love in Muscat.
          <a :href="whatsapp" target="_blank" rel="noopener" class="footer-wa" aria-label="Message M Souq on WhatsApp">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4.5 4.5 0 0 1-2.2-2.2l.8-1-1-2z" /></svg>
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>
